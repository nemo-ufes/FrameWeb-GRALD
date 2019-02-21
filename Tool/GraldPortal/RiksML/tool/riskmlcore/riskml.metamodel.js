/**
 * A class for representing the metamodel to be used.
 * @class
 */
var riskmlcoreMetamodel = {
    /** @type {string} */
    prefix: 'riskml',
    /** @type {Object} */
    shapesObject: joint.shapes.riskml,
    /**
     * describes the version of this metamodel
     * @example
     * version: '0.1'
     @type {string}
     */
    version: '0.1',

    //actor-like elements
    /** @type {Object[]} */
    containers: [
        {
            'name': 'Category',
        }
    ],
    //internal elements
    /** @type {Object[]} */
    nodes: [
        {
            'name': 'Goal',
        },
        {
            'name': 'Event',
        },
        {
            'name': 'Situation',
        }
    ],

    //links between internal elements
    /** @type {Object[]} */
    nodeLinks: [
		{
			'name': 'ExposeLink',
            'isValid': function (source, target) {
                //Situation->Event

                var result = false;
                result = source.isSituation() && target.isEvent();
                // result = result && (source.get('type') == target.get('type'));
                result = result && (source != target);
                return result;
            },
			 allowMultipleLinksBetweenTheSameElements: true
    },
    {
			'name': 'ProtectLink',
            'isValid': function (source, target) {
                //Situation->Event

                var result = false;
                result = source.isSituation() && target.isEvent();
                // result = result && (source.get('type') == target.get('type'));
                result = result && (source != target);
                return result;
            },
			 allowMultipleLinksBetweenTheSameElements: true
     },
     {
			'name': 'IncreaseLink',
            'isValid': function (source, target) {
                //Situation->Event

                var result = false;
                result = source.isSituation() && target.isEvent();
                // result = result && (source.get('type') == target.get('type'));
                result = result && (source != target);
                return result;
            },
			 allowMultipleLinksBetweenTheSameElements: true
      },
      {
			'name': 'ReduceLink',
            'isValid': function (source, target) {
                //Situation->Event

                var result = false;
                result = source.isSituation() && target.isEvent();
                // result = result && (source.get('type') == target.get('type'));
                result = result && (source != target);
                return result;
            },
			 allowMultipleLinksBetweenTheSameElements: true
      },
      {
			'name': 'ImpactLink',
            'isValid': function (source, target) {
                //Event->Goal

                var result = false;
                result = source.isEvent() && target.isGoal();
                // result = result && (source.get('type') == target.get('type'));
                result = result && (source != target);
                return result;
            },
			 allowMultipleLinksBetweenTheSameElements: true
      },
    ],
};
