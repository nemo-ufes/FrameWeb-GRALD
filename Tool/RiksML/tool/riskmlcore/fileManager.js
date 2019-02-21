/*! This is open-source. Feel free to use, modify, redistribute, and so on.
 */
function saveSvg(paperId) {
    //access the SVG element and serialize it
    var originalWidth = riskml.paper.getArea().width;
    var originalHeight = riskml.paper.getArea().height;
    riskml.paper.fitToContent({padding: 20, allowNewOrigin: 'any'});
    $('svg').attr('width', riskml.paper.getArea().width);
    $('svg').attr('height', riskml.paper.getArea().height);
    var text = (new XMLSerializer()).serializeToString(document.getElementById(paperId).childNodes[2]);
    $('svg').attr('width', '100%');
    $('svg').attr('height', '100%');
    riskml.paper.setDimensions(originalWidth, originalHeight);

    return "data:image/svg+xml," + encodeURIComponent(text);
}

//Polyfill for when the browser does not support canvas.toBlob()
//From https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
            var canvas = this;
            setTimeout(function () {

                var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
                    len = binStr.length,
                    arr = new Uint8Array(len);

                for (var i = 0; i < len; i++) {
                    arr[i] = binStr.charCodeAt(i);
                }

                callback(new Blob([arr], {type: type || 'image/png'}));

            });
        }
    });
}

function savePng(paperId, callback) {
    var originalWidth = riskml.paper.getArea().width;
    var originalHeight = riskml.paper.getArea().height;
    riskml.paper.fitToContent({padding: 20, allowNewOrigin: 'any'});

    //create a canvas, which is used to convert the SVG to png
    var canvas = document.createElement('canvas');
    var canvasContext = canvas.getContext('2d');

    //create a img (DOM element) with the SVG content from our paper. This element will later be inserted in the canvas for converting to PNG
    var imageElement = new Image();
    $('svg').attr('width', riskml.paper.getArea().width);
    $('svg').attr('height', riskml.paper.getArea().height);
    var text = (new XMLSerializer()).serializeToString(document.getElementById(paperId).childNodes[2]);
    $('svg').attr('width', '100%');
    $('svg').attr('height', '100%');
    imageElement.src = "data:image/svg+xml," + encodeURIComponent(text);
    riskml.paper.setDimensions(originalWidth, originalHeight);

    imageElement.onload = function () {
        canvas.width = imageElement.width * 4; //multiply the width for better resolution
        canvas.height = imageElement.height * 4; //multiply the height for better resolution
        //fill the canvas with a color. To create an image with transparent background, you just need to remove the 'fillRect' line
        canvasContext.fillStyle = 'white';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        canvasContext.drawImage(imageElement, 0, 0, canvas.width, canvas.height);//insert the SVG image into the canvas. This does the actual rasterization of the image

        canvas.toBlob(function (blob) {
            var linkToDownload = URL.createObjectURL(blob);
            callback(linkToDownload);
        });

    };

}


function saveModel() {
    var diagram = {width: 1300, height: 1300};
    diagram.width = riskml.paper.getArea().width;
    diagram.height = riskml.paper.getArea().height;
    var date = new Date().toGMTString();

    var modelJSON = {
        'categories': [],
        'links': [],
        'display': {},
        'tool': 'riskml.1.0.1',
        'riskml': '1.0',
        'saveDate': date,
        'diagram': diagram
    };

    var toCollapse = [];
    var vertices = [];

    _.each(riskml.graph.getElements(), function (element) {

        if (element.isKindOfCategory()) {
            var categoryJSON = fileManager.elementToJSON(element);

            //it is necessary to expand collapsed categories in order
            //to get proper sources and targets for any dependency links
            if (element.prop('collapsed')) {
                toCollapse.push(element);//stores the actor in order to collapse it again afterwards
                element.uncollapse();
            }

            categoryJSON.nodes = fileManager.childrenToJSON(element);
            modelJSON.categories.push(categoryJSON);
        }
    });
    _.each(riskml.graph.getLinks(), function (link) {
        var linkJSON = fileManager.linkToJSON(link);

        var vertices = link.get('vertices');
        if (vertices) {
            modelJSON.display[link.id] = {vertices: vertices};//add the vertices to the save file
        }

        modelJSON.links.push(linkJSON);
    });

    _.each(toCollapse, function (actor) {
        modelJSON.display[actor.id] = {collapsed: true};//add the collapsing information to the save file
        actor.collapse();//collapses the actor, thus returning it to its original state
    });

    return fileManager.outputSavedModel(modelJSON);
}

function loadModel(inputRaw) {
    if (inputRaw) {
        this.changedModel = true;

        ui.clearDiagram();
        try {
            var inputModel = $.parseJSON(inputRaw);
        } catch (e) {
            // if failed to parse, consider that the input already is a JSON object
            var inputModel = inputRaw;
        }

        if (inputModel.diagram) {
            if (inputModel.diagram.width && inputModel.diagram.height) {
                riskml.paper.setDimensions(inputModel.diagram.width, inputModel.diagram.height);
            }
        }

        var toCollapse = [];
        if (inputModel.categories) {
            //create categories and inner elements
            for (var i = 0; i < inputModel.categories.length; i++) {
                var actor = inputModel.categories[i];
                var parent = fileManager.addLoadedElement(actor);
                for (var j = 0; j < actor.nodes.length; j++) {
                    var child = fileManager.addLoadedElement(actor.nodes[j]);
                    if (child) parent.embedNode(child);
                }
                if (inputModel.display && inputModel.display[actor.id]) {
                    toCollapse.push(parent);
                }
            }

            //create links
             for (i = 0; i < inputModel.links.length; i++) {
                var linkJSON = inputModel.links[i];
                    var newLink = fileManager.addLoadedLink(linkJSON);
                    if (inputModel.display && inputModel.display[linkJSON.id] && inputModel.display[linkJSON.id].vertices) {
                        newLink.set('vertices', inputModel.display[linkJSON.id].vertices);
                    }
            }

            for (var i = 0; i < toCollapse.length; i++) {
                toCollapse[i].collapse();
            }
        }

		    }
    }


fileManager = {
    load: loadModel,
    addLoadedElement: function (element) {
		if (element.id && element.text && element.type && element.x && element.y) {
			var type = element.type.split('.')[1];
			if (riskml['add' + type]) {
				var newElement = riskml['add' + type](element.x, element.y, element.text, {id: element.id});//obs: the id MUST be passed during creation, can't be changed later

				if (element.customProperties) {
					newElement.prop('customProperties', element.customProperties);
				}
				return newElement;
			}
			else {
				var errorMessage = 'Unknown element type: ' + element.type + '.';
				console.log(errorMessage);
				alert(errorMessage);
			}
		}
    },


    addLoadedLink: function (linkJSON) {
 			if (linkJSON.id && linkJSON.type && linkJSON.source && linkJSON.target) {
 				var typeWithoutPrefix = linkJSON.type.split('.')[1];
 				if (riskml['add' + typeWithoutPrefix]) {
 					sourceObject = riskml.graph.getCell(linkJSON.source);
 					targetObject = riskml.graph.getCell(linkJSON.target);
 					var newLink = riskml['add' + typeWithoutPrefix](sourceObject, targetObject, linkJSON.label);

 					if (linkJSON.customProperties) {
 						newLink.prop('customProperties', linkJSON.customProperties);
 					}
 					if (typeWithoutPrefix === 'ContributionLink') {
 						newLink.on('change:vertices', ui._toggleSmoothness);
 					}
 					return newLink;
 				}
 				else {
 					var errorMessage = 'Unknown link type: ' + linkJSON.type + '.';
 					console.log(errorMessage);
 					alert(errorMessage);
 				}
 			}

     },



    elementToJSON: function (element) {
        var text = element.prop('name');
        var result = {
            'id': element.id,
            'text': text,
            'type': element.prop('type'),
            'x': element.prop('position/x'),
            'y': element.prop('position/y'),
        };

        var customPropertiesJSON = fileManager.getCustomPropertiesJSON(element);
        if (customPropertiesJSON) result.customProperties = customPropertiesJSON;

        return result;
    },
    getCustomPropertiesJSON: function (element) {
        return element.prop('customProperties');
    },
    childrenToJSON: function (element) {
        var result = [];

        _.each(element.getEmbeddedCells(), function (element) {
            if (element.isKindOfInnerElement()) {
                var node = fileManager.elementToJSON(element);
                result.push(node);
            }
        });

        return result;
    },
    linkToJSON: function (link) {
        return {
            id: link.id,
            type: link.prop('type'),
            source: link.attributes.source.id,
            target: link.attributes.target.id,
        };
    },
    outputSavedModel: function (modelJson, newTab) {
        var stringifiedModel = JSON.stringify(modelJson, null, 2);
        if (newTab) {
            window.open("data:text/json;charset=utf-8," + encodeURI(stringifiedModel));//this open the content of the file in a new tab
        }
        console.log(stringifiedModel);

        return stringifiedModel;
    }
};
