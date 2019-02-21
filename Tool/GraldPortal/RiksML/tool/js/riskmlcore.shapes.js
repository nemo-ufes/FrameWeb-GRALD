/*! This is open-source. Feel free to use, modify, redistribute, and so on.
 */
joint.shapes.riskml = {};

joint.shapes.riskml.Category = joint.shapes.basic.Rect.extend({
    defaults: joint.util.deepSupplement({
        type: 'riskml.Category',
        size: {width: 600, height: 350},
        attrs: {
            rect: {
                fill: 'rgb(230,230,230)',
                stroke: 'black',
                'stroke-width': 2,
                width: 1200,
                height: 600,
                ry:'25',
                rx:'45',
                cy:'26',
                cx:'46',
            }
        }
    }, joint.shapes.basic.Rect.prototype.defaults)
});


joint.shapes.riskml.Goal = joint.shapes.basic.Rect.extend({
    defaults: joint.util.deepSupplement({
        type: 'riskml.Goal',
        size: {width: 150, height: 55},
        attrs: {
            rect: {
                fill: 'rgb(205,254,205)',
                stroke: 'black',
                'stroke-width': 2,
                width: 130,
                height: 30,
                rx: 20
            },
        }
    }, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.riskml.Event = joint.shapes.basic.Path.extend({
defaults: joint.util.deepSupplement({
    	type: 'riskml.Event',
    	size: {width: 80, height: 50},
    	attrs: {
    		'path': {
    			d: 'M 1 1 L 51 1 L 51 29.75 L 26 47 L 1 29.75 Z',
    			fill: 'rgb(205,254,205)',
    			stroke: 'black',
    			'stroke-width': 2,
    			transform:'rotate(180,51,39)',
    		},
    	}
    }, joint.shapes.basic.Path.prototype.defaults)
});


joint.shapes.riskml.Situation = joint.shapes.basic.Path.extend({
defaults: joint.util.deepSupplement({
    	type: 'riskml.Situation',
    	size: {width: 80, height: 50},
    	attrs: {
    		'path': {
    			d: 'M 1 1 L 51 1 L 51 38.88 Q 38.5 31.45 26 38.88 Q 13.5 46.3 1 38.88 L 1 5.13 Z',
    			fill: 'rgb(205,254,205)',
    			stroke: 'black',
    			'stroke-width': 2,
    		},
    	}
    }, joint.shapes.basic.Path.prototype.defaults)
});

joint.shapes.riskml.ImpactLink = joint.dia.Link.extend({
    defaults: joint.util.deepSupplement({
        type: 'riskml.ImpactLink',
        arrowheadMarkup: '<g />',//prevents the arrowhead from appearing in the saved image
		labels: [
            {
                position: 0.4,
                attrs: {
                    text: { text: 'Impact',
                        'font-weight': 'bold',
                        'font-size': 12,
                        'font-family': 'sans-serif',
                        fill: 'black',
                    },
                    rect: {
                       fill: 'rgb(230,230,230)',
                   }
                }
            }
        ],
        attrs: {
            '.marker-source': {d: '',}, //required in order to have correct fitToContent behavior
            '.marker-target': {
                d: 'M 15 0 L 5 5 L 15 10 z',

                fill: 'black',
                'stroke-width': 1
            },
            '.connection': {fill: 'none'},//necessary in order to prevent filling the curves when saving the image
            '.connection-wrap': {fill: 'none'}//necessary in order to prevent filling the curves when saving the image
        },
        smooth: false
    }, joint.dia.Link.prototype.defaults)
});

joint.shapes.riskml.ReduceLink = joint.dia.Link.extend({
    defaults: joint.util.deepSupplement({
        type: 'riskml.ReduceLink',
        arrowheadMarkup: '<g />',//prevents the arrowhead from appearing in the saved image
		labels: [
            {
                position: 0.4,
                attrs: {
                    text: { text: 'Reduce',
                        'font-weight': 'bold',
                        'font-size': 12,
                        'font-family': 'sans-serif',
                    },
                    rect: {
                        fill: 'rgb(230,230,230)',
                    }
                }
            }
        ],
        attrs: {
            '.marker-source': {d: '',}, //required in order to have correct fitToContent behavior
            '.marker-target': {
                d: 'M 15 0 L 5 5 L 15 10 z',

                fill: 'black',
                'stroke-width': 1
            },
            '.connection': {fill: 'none'},//necessary in order to prevent filling the curves when saving the image
            '.connection-wrap': {fill: 'none'}//necessary in order to prevent filling the curves when saving the image
        },
        smooth: false
    }, joint.dia.Link.prototype.defaults)
});

joint.shapes.riskml.ExposeLink = joint.dia.Link.extend({
    defaults: joint.util.deepSupplement({
        type: 'riskml.ExposeLink',
        arrowheadMarkup: '<g />',//prevents the arrowhead from appearing in the saved image
		labels: [
            {
                position: 0.4,
                attrs: {
                    text: { text: 'Expose',
                        'font-weight': 'bold',
                        'font-size': 12,
                        'font-family': 'sans-serif',
                    },
                    rect: {
                        fill: 'rgb(230,230,230)',
                    }
                }
            }
        ],
        attrs: {
            '.marker-source': {d: '',}, //required in order to have correct fitToContent behavior
            '.marker-target': {
                d: 'M 15 0 L 5 5 L 15 10 z',

                fill: 'black',
                'stroke-width': 1
            },
            '.connection': {fill: 'none'},//necessary in order to prevent filling the curves when saving the image
            '.connection-wrap': {fill: 'none'}//necessary in order to prevent filling the curves when saving the image
        },
        smooth: false
    }, joint.dia.Link.prototype.defaults)
});

joint.shapes.riskml.ProtectLink = joint.dia.Link.extend({
    defaults: joint.util.deepSupplement({
        type: 'riskml.ProtectLink',
        arrowheadMarkup: '<g />',//prevents the arrowhead from appearing in the saved image
		labels: [
            {
                position: 0.4,
                attrs: {
                    text: { text: 'Protect',
                        'font-weight': 'bold',
                        'font-size': 12,
                        'font-family': 'sans-serif',
                    },
                    rect: {
                        fill: 'rgb(230,230,230)',
                    }
                }
            }
        ],
        attrs: {
            '.marker-source': {d: '',}, //required in order to have correct fitToContent behavior
            '.marker-target': {
                d: 'M 15 0 L 5 5 L 15 10 z',

                fill: 'black',
                'stroke-width': 1
            },
            '.connection': {fill: 'none'},//necessary in order to prevent filling the curves when saving the image
            '.connection-wrap': {fill: 'none'}//necessary in order to prevent filling the curves when saving the image
        },
        smooth: false
    }, joint.dia.Link.prototype.defaults)
});


joint.shapes.riskml.IncreaseLink = joint.dia.Link.extend({
    defaults: joint.util.deepSupplement({
        type: 'riskml.IncreaseLink',
        arrowheadMarkup: '<g />',//prevents the arrowhead from appearing in the saved image
		labels: [
            {
                position: 0.4,
                attrs: {
                    text: { text: 'Increase',
                        'font-weight': 'bold',
                        'font-size': 12,
                        'font-family': 'sans-serif',
                    },
                    rect: {
                        fill: 'rgb(230,230,230)',
                    }
                }
            }
        ],
        attrs: {
            '.marker-source': {d: '',}, //required in order to have correct fitToContent behavior
            '.marker-target': {
                d: 'M 15 0 L 5 5 L 15 10 z',

                fill: 'black',
                'stroke-width': 1
            },
            '.connection': {fill: 'none'},//necessary in order to prevent filling the curves when saving the image
            '.connection-wrap': {fill: 'none'}//necessary in order to prevent filling the curves when saving the image
        },
        smooth: false
    }, joint.dia.Link.prototype.defaults)
});
