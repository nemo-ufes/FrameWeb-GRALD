/*!
 * riskmlcore 0.1.0
 *
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 */

/**
 * Construct a new riskml object.
 * This is the basic riskml class.
 * this object contains the main functionalities for creating riskml models
 *
 * @return A new riskml object
 * @class riskml
 */
var riskml = function () {

    var _createDefaultGraph = function () {
        return new joint.dia.Graph();
    };
    var _createDefaultPaper = function (graph) {
        return new joint.dia.Paper({
            el: $('#diagram'),
            width: 1700,
            height: 1300,
            model: graph,
            gridSize: 1,
            //async: true,
            //linkConnectionPoint: joint.util.shapePerimeterConnectionPoint, //connects links to the nodes' shape, rather than their bounding box. Big toll on performance
        });
    };
    var _createBasicPrototypeFunctions = function () {
        joint.dia.Element.prototype.changeNodeContent = _changeNodeContent;
        joint.dia.Cell.prototype.isDependum = function () {
            return this.get('isDependum');
        };
    };
    var _changeNodeContent = function (content, options) {
        "use strict";
        /* this function is meant to be added to a prototype */
        //default values for the options
        options = _.defaults(options || {}, {
            'breakLine': true,
            'breakWidth': 90
        });
        this.prop('name', content);
        //add the line breaks automatically
        if (options.breakLine && content) {
            content = joint.util.breakText(content, {width: options.breakWidth});
        }
        ui.hideSelection();//workaround for jointjs bug: changing the path of a highlight when changing an attribute of a CellView
        this.attr('text/text', content);
        ui.showSelection();//workaround for jointjs bug: changing the path of a highlight when changing an attribute of a CellView
        return this;
    };
    var _embedNode = function (node) {
        "use strict";
        if (node !== null) {
            this.embed(node);
            //_updateCategoryBoundary(this);
        }

        return node;
    };
    var _collapse = function () {
        "use strict";
        var actor = this;//stores 'this' in a named variable so that it can be read by the anonymous function
        if (!this.prop('collapsed')) {
            this.attr('rect/display', 'none');//hide the actor's boundary
            _.each(this.getEmbeddedCells(), function (innerElement) {
                innerElement.attr('./display', 'none');//hide the actor's inner elements

                //update the dependency links
                var connectedLinks = riskml.graph.getConnectedLinks(innerElement);
                if (connectedLinks) {
                    _.each(connectedLinks, function (connectedLink) {
                        if (connectedLink.attributes.type === (riskml.linkTypes.dependency.name)) {

                            if (connectedLink.get('source').id === innerElement.id) {
                                connectedLink.prop('elementSource', innerElement.id);
                                connectedLink.set('source', {id: actor.id, selector: 'circle'});
                            }
                            else if (connectedLink.get('target').id === innerElement.id) {
                                connectedLink.prop('elementTarget', innerElement.id);
                                connectedLink.set('target', {id: actor.id, selector: 'circle'});
                            }
                            _updateLinkLabelRotation(connectedLink);
                        }
                    });
                }
            });
            this.prop('collapsed', true);
        }
    };
    var _uncollapse = function () {
        "use strict";
        var actor = this;//stores 'this' in a named variable so that it can be read by the anonymous function
        if (this.prop('collapsed')) {
            this.attr('rect/display', 'visible');//display the actor's boundary
            _.each(this.getEmbeddedCells(), function (innerElement) {
                innerElement.attr('./display', 'visible');//display the actor's inner elements

                //update the dependency links
                var connectedLinks = riskml.graph.getConnectedLinks(actor);
                if (connectedLinks) {
                    _.each(connectedLinks, function (connectedLink) {
                        if (connectedLink.attributes.type === (riskml.linkTypes.dependency.name)) {

                            if (connectedLink.get('source').id === actor.id) {
                                if (connectedLink.prop('elementSource')) {
                                    connectedLink.set('source', {
                                        id: riskml.graph.getCell(connectedLink.prop('elementSource')).id,
                                        selector: 'text'
                                    });
                                }
                            }
                            else if (connectedLink.get('target').id === actor.id) {
                                if (connectedLink.prop('elementTarget')) {
                                    connectedLink.set('target', {
                                        id: riskml.graph.getCell(connectedLink.prop('elementTarget')).id,
                                        selector: 'text'
                                    });
                                }
                            }
                            _updateLinkLabelRotation(connectedLink);
                        }
                    });
                }
            });
            this.prop('collapsed', false);
        }
    };
    var _toggleCollapse = function () {
        "use strict";
        if (this.prop('collapsed')) {
            this.uncollapse();
        }
        else {
            this.collapse();
        }
    };
    var _getNodeLinkLabel = function () {
        "use strict";
        return this.label(0).attrs.text.text;
    };
    _setNodeLinkLabel = function (value) {
        "use strict";
        this.label(0, {attrs: {text: {text: '' + value + ''}}});
        return this;//TODO
    };
    setNodeLinkLabel = function (link, value) {
        "use strict";
        link.label(0, {attrs: {text: {text: '' + value + ''}}});
        return link;
    };
    var _updateLinkLabelRotation = function (link) {
        "use strict";
        var source = riskml.graph.getCell(link.attributes.source.id);
        var target = riskml.graph.getCell(link.attributes.target.id);

        //calculates a new angle for the label, based on the x and y position of the elements
        var deltaX = (target.attributes.position.x - source.attributes.position.x);
        var deltaY = (target.attributes.position.y - source.attributes.position.y);
        var angle = (Math.atan2(deltaY, deltaX) * 180 / Math.PI);
        if (link.isCategoryLink()) {
            if (angle > 90 || angle < -90) angle -= 180;//adjust the angle to prevent the text from being upside down
        }

        var xOffset = link.attributes.labelRectOffset || 0;
        var yOffset = -8;
        if (link.attributes.type === V.sanitizeText(riskml.linkTypes.dependency.name)) {
            yOffset = -11;
        }


        //apply the new angle
        link.attr({
            'text': {transform: 'rotate(' + angle + ') translate(0,' + yOffset + ')'},
            //'text': {transform: 'rotate('+ angle + ') translate(0,' + yOffset + ')' },
            // 'text': {transform: 'rotate('+ angle + ') translate(0,-8)' },
            'rect': {transform: 'rotate(' + angle + ') translate(' + xOffset + ',' + yOffset + ')'},
        });
    };


    return {
        PREFIX_ADD: 'add', /*prefix to identify functions that add an element. Ex: addTask(...)*/
        PREFIX_IS: 'is', /*prefix to identify functions that check if an element is of an certain kind. Ex: isTask(...)*/
        types: {},
        rotateLabel: _updateLinkLabelRotation,
        setupModel: function (graph) {
            "use strict";
            this.graph = graph ? graph : _createDefaultGraph();
            _createBasicPrototypeFunctions();
        },
        setupDiagram: function (paper) {
            "use strict";
            this.paper = paper ? paper : _createDefaultPaper(this.graph);

            this.setupAutomaticContainerResizing();
        },
        setupLabelRotation: function (expressionWithRotatableLinksNames) {

            //updates the rotation of labels when an element is moved
            this.paper.on('cell:pointerup', function (cellView, evt, x, y) {
                var connectedLinks = riskml.graph.getConnectedLinks(cellView.model);
                if (connectedLinks) {
                    _.each(connectedLinks, function (connectedLink) {
                        if (connectedLink.attributes.type.match(expressionWithRotatableLinksNames)) {
                            _updateLinkLabelRotation(connectedLink);
                        }
                    });
                }

            });
        },
        setupAutomaticContainerResizing: function () {
            //updates the size of an actor's boundary when its internal elements are moved
            //based on JointJS' tutorial: http://jointjs.com/tutorial/hierarchy
            this.graph.on('change:position', function (cell, newPosition, opt) {

                if (opt.skipParentHandler) return;

                if (cell.get('embeds') && cell.get('embeds').length) {
                    // If we're manipulating a parent element, let's store
                    // it's original position to a special property so that
                    // we can shrink the parent element back while manipulating
                    // its children.
                    cell.set('originalPosition', cell.get('position'));
                }
            });
        },
        /**
         * Returns true if the model is empty (i.e. it does not contain any element).
         * @returns {boolean} isEmpty
         * @example
         *   if (riskml.isEmpty()) {...}
         */
        isEmpty: function () {
            "use strict";
            return (_.size(riskml.graph.getCells()) < 1);
        },

        /**
         * Returns the number of cells in the model (i.e. the number of elements plus the number of links).
         * @returns {number} number of cells (elements + links)
         * @example
         *   riskml.getNumberOfCells();
         */
        getNumberOfCells: function () {
            "use strict";
            return _.size(riskml.graph.getCells());
        },

        /**
         * Returns the number of elements (nodes) in the model. For instance, actors and tasks are elements
         * @returns {number} number of elements (nodes)
         * @example
         *   riskml.getNumberOfElements();
         */
        getNumberOfElements: function () {
            "use strict";
            //note: the dependum also counts as an element
            return _.size(riskml.graph.getElements());
        },

        /**
         * Returns the number of links (connections) in the model. For instance, refinements and contributions are links.
         * Please note that each depency has 2 links: one from the depender to the dependum, and other from the dependum
         * to the dependee.
         * @returns {number} number of links (connections)
         * @example
         *   riskml.getNumberOfLinks();
         */
        getNumberOfLinks: function () {
            "use strict";
            //note: each dependency counts as two links: one from the depender to the dependum, and another from the dependum to the dependee
            return _.size(riskml.graph.getLinks());
        },
        /**
         * Adds a new node to the model.
         * Instead of calling this function directly, this function is expected to be called
         * from a specialized 'add' function, such as addActor or addTask.<br />
         * Options object:<br />
         * breakLine: if true, breaks the line of the content automatically at breakWidth. <i>Default value: true</i>.<br />
         * breakWidth: width limit used for breaking lines. <i>Default value: 90</i>.
         * @returns the new node
         * @param {string} shape shape of the node to be created
         * @param {number} x    x position of the new node
         * @param {number} y    y position of the new node
         * @param [content]       content of the node
         * @param [options]       options of the new node
         */
        addNode: function (typeName, shape, x, y, content, options) {
            "use strict";
            if (!shape) {
                shape = joint.shapes.basic.Rect;//safeguard in case the library is being used without a visual representation
            }
            //options for addNode:

            //default values for the options
            options = _.defaults(options || {}, {
                'breakLine': true,
                'breakWidth': 90
            });
            var clearTypeName = typeName.substring(typeName.lastIndexOf('.') + 1);
            content = content || clearTypeName;//if the content is empty, use the type name as the name of the element
            var originalContent = content;
            if (options.breakLine && content) {
                //add the line breaks automatically
                content = joint.util.breakText(content, {width: options.breakWidth});
            }
            //create the node and add it to the graph
            var node;
            if (options.id) {
                node = new shape({
                    id: options.id,
                    position: {x: x, y: y},
                });
            }
            else {
                node = new shape({
                    position: {x: x, y: y},
                });
            }
            node.prop('name', originalContent);
            node.attr('text/text', content);
            node.prop('type', typeName);
            riskml.graph.addCell(node);
            return node;
        },

        addLinkBetweenNodes: function (linkName, shape, source, target, value) {
            "use strict";

            if (!shape) {
                shape = joint.dia.Link;//safeguard in case the library is being used without a visual representation
            }

            //prevent repeated links
            var currentLinksFromSource = riskml.graph.getConnectedLinks(source);
            var isDuplicated = false;
            _.each(currentLinksFromSource, function (link) {
                isDuplicated = isDuplicated || link.getSourceElement() === target || link.getTargetElement() === target;
            });
            if (!isDuplicated) {
                var link = new shape({'source': {id: source.id}, 'target': {id: target.id}});
                if (value) setNodeLinkLabel(link, value);
                // if (value) link.setContributionType(value);
                riskml.graph.addCell(link);
                //embeds the link on the (parent) actor of its source element, to facilitate collapse/uncollapse
                if (source.get('parent')) {
                    riskml.graph.getCell(source.get('parent')).embed(link);
                }

                link.prop('type', linkName);
                return link;
            }
        },
        clearModel: function () {
            riskml.graph.clear();
        },
        createContainerFunctions: function (prototype) {
            prototype.collapse = _collapse;
            prototype.uncollapse = _uncollapse;
            prototype.toggleCollapse = _toggleCollapse;
            prototype.embedNode = _embedNode;
        },
        createLabeledNodeLinkFunctions: function (prototype) {
            prototype.getContributionType = _getNodeLinkLabel;
            prototype.setContributionType = _setNodeLinkLabel;
        },

        createAddLinkBetweenNodes: function (linkPrefixedName, linkName, shape) {
            this['add' + linkName] = function (source, target, label) {
                if (riskml.types[linkName].isValid(source, target)) {
                    return riskml.addLinkBetweenNodes(linkPrefixedName, shape, source, target, label);
                }
            };
        },
        embedNode: function (child, parent) {
            parent.embed(child);
        },
        getElements: function () {
            return this.graph.getElements();
        },
        getCells: function () {
            return this.graph.getCells();
        },
        getLinks: function () {
            return this.graph.getLinks();
        }

    };
}();
