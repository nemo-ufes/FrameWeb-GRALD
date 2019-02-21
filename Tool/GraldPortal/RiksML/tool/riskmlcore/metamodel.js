/*
    This function processes a given metamodel, stores the processed data on the riskml global variable,
        and creates additional functions based on the metamodel

    It creates 'add' functions for each element of the metamodel
        For instance, if there is a node type named 'Person', an 'addPerson' function is created
*/

riskml.validateMetamodel = function (metamodel) {
    //check if every kind of element and link has a name.
    //also check against names starting with 'node' or 'link', to prevent from overriding
    //methods of the riskml object.
    _.each(metamodel.containers, function (element) {
        if (!element.name) {
            throw new Error('Invalid container in the metamodel. Containers must have a "name".');
        }
        if (element.name.match(/^(node|link)/i)) {
            throw new Error('Invalid container name in the metamodel: ' + element.name +
                '. Container names cannot start with "node" nor "link".');
        }
    });
    _.each(metamodel.nodes, function (element) {
        if (!element.name) {
            throw new Error('Invalid node in the metamodel. Nodes must have a "name".');
        }
        if (element.name.match(/^(node|link)/i)) {
            throw new Error('Invalid node name in the metamodel: ' + element.name +
                '. Node names cannot start with "node" nor "link".');
        }
    });
    _.each(metamodel.containerLinks, function (element) {
        if (!element.name) {
            throw new Error('Invalid container link in the metamodel. Container links must have a "name".');
        }
        if (element.name.match(/^(node|link)/i)) {
            throw new Error('Invalid container link name in the metamodel: ' + element.name +
                '. Container link names cannot start with "node" nor "link".');
        }
    });
    _.each(metamodel.nodeLinks, function (element) {
        if (!element.name) {
            throw new Error('Invalid node link in the metamodel. Node links must have a "name".');
        }
        if (element.name.match(/^(node|link)/i)) {
            throw new Error('Invalid node link name in the metamodel: ' + element.name +
                '. Node link names cannot start with "node" nor "link".');
        }
    });
    //TODO find a way to prevent so much duplication on this validation

    //check if the metamodel contains at least one kind of element (node or container)
    //if it doesnt them a model couldnt be created
    if ((!metamodel.containers || metamodel.containers.length === 0) &&
        (!metamodel.nodes || metamodel.nodes.length === 0)) {
        throw new Error('Invalid metamodel. Metamodels must have at least one container or one node.');
    }
};

riskml._setupBasicType = function (nodeType, metamodel) {
    if (nodeType.name) {
        //add some useful attributes for the node type
        nodeType.prefixedName = metamodel.prefix + '.' + nodeType.name;//prefixedName acts as an unique id for this kind of node
        if ((!nodeType.shapeObject) && metamodel.shapesObject) {
            nodeType.shapeObject = metamodel.shapesObject[nodeType.name];//can be used to access the object that describes this node's shape
        }

        //creates an 'add' function that can be used to create instances of this type
        riskml['add' + nodeType.name] = function (x, y, content, options) {
            return riskml.addNode(nodeType.prefixedName, nodeType.shapeObject, x, y, content, options);
        };

        //creates an 'is' function that can be used to check if a given node is of this type
        joint.dia.Cell.prototype['is' + nodeType.name] = function () {
            return this.prop('type') === nodeType.prefixedName;
        };
    }
};
riskml._setupBasicLink = function (linkType, metamodel) {
    if (linkType.name) {
        //add some useful attributes for the node type
        linkType.prefixedName = metamodel.prefix + '.' + linkType.name;//prefixedName acts as an unique id for this kind of node
        if ((!linkType.shapeObject) && metamodel.shapesObject) {
            linkType.shapeObject = metamodel.shapesObject[linkType.name];//can be used to access the object that describes this node's shape
        }

        //creates an 'isValid' function that can be used to check if a pair of source and target are valid
        riskml.types[linkType.name] = {
            isValid: linkType.isValid
        };

        //creates an 'is' function that can be used to check if a given node is of this type
        joint.dia.Cell.prototype['is' + linkType.name] = function () {
            return this.prop('type') === linkType.prefixedName;
        };

        //TODO create a isValid function, if it doesn't exist
    }
};

riskml._setupLinkBetweenNodes = function (linkType, metamodel) {
    if (linkType.name) {
        //creates an 'add' function that can be used to create instances of this type
        riskml.createAddLinkBetweenNodes(linkType.prefixedName, linkType.name, linkType.shapeObject);
    }
};

riskml.setupMetamodel = function (metamodel) {
    console.log('Trying metamodel');
    riskml.validateMetamodel(metamodel);
    console.log('metamodel is valid');
    _.each(metamodel.nodes, function (node) {
        riskml._setupBasicType(node, metamodel);
    });
    _.each(metamodel.containers, function (node) {
        riskml._setupBasicType(node, metamodel);
    });
    _.each(metamodel.containers, function (containerType) {
        if (containerType.shapeObject) riskml.createContainerFunctions(containerType.shapeObject.prototype);
    });
    _.each(metamodel.containerLinks, function (node) {
        riskml._setupBasicLink(node, metamodel);
    });
    _.each(metamodel.nodeLinks, function (node) {
        riskml._setupBasicLink(node, metamodel);
    });
    _.each(metamodel.nodeLinks, function (node) {
        riskml._setupLinkBetweenNodes(node, metamodel);
    });

    joint.dia.Cell.prototype.isKindOfInnerElement = function () {
        return this.isGoal() || this.isEvent() || this.isSituation();
    };
    joint.dia.Cell.prototype.isKindOfCategory = function () {
        return this.isCategory();
    };
};
