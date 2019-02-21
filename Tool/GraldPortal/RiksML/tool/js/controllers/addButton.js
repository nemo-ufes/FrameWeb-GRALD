window.uiC = window.uiC || {};  //prevents overriding the variable, while also preventing working with a null variable

uiC.createAddButtons = function() {
    //create the ADD buttons
    new uiC.AddButtonView({
        model: new uiC.AddButtonModel({
            label: 'Category',
            action: ui.STATE_ADD_CATEGORY,
            tooltip: 'Add Category',
            statusText: 'Now click on an empty space in the diagram to add a nodes'
        })
    }).render();

    new uiC.AddButtonView({
        model: new uiC.AddButtonModel({
            label: 'Goal',
            action: ui.STATE_ADD_NODE,
            name: 'Goal',
            tooltip: 'Add Goal',
            statusText: 'Goals relates to Event',
            precondition: function () {
                var valid = true;
                if (riskml.isEmpty()) {
                    alert('Sorry, you can only add goals on an risk envet.');
                    valid = false;
                }
                return valid;
            }
        })
    }).render();

    new uiC.AddButtonView({
        model: new uiC.AddButtonModel({
            label: 'Event',
            action: ui.STATE_ADD_NODE,
            name: 'Event',
            tooltip: 'Add Risk Event (Risk ML)',
            statusText: 'Event relates to Goal'
        })
    }).render();

    new uiC.AddButtonView({
        model: new uiC.AddButtonModel({
            label: 'Situation',
            action: ui.STATE_ADD_NODE,
            name: 'Situation',
            tooltip: 'Add Risk Situation (Risk ML)',
            statusText: 'Situation relates to Event'
        })
    }).render();


	new uiC.AddButtonView({
        model: new uiC.AddButtonModel({
            label: 'Impact',
            action: ui.STATE_ADD_LINK,
            name: 'ImpactLink',
            tooltip: 'Add Impact link',
            statusText: 'Impact link: click first on the child, and then on the parent. It can only be applied to Goal and Event.'
        })
    }).render();

    new uiC.AddButtonView({
        model: new uiC.AddButtonModel({
            label: 'Expose',
            action: ui.STATE_ADD_LINK,
            name: 'ExposeLink',
            tooltip: 'Add Expose link',
            statusText: 'ExposeLink link: click first on the child, and then on the parent. It can only be applied to Situation and Event.'
        })
    }).render();

    new uiC.AddButtonView({
        model: new uiC.AddButtonModel({
            label: 'Protect',
            action: ui.STATE_ADD_LINK,
            name: 'ProtectLink',
            tooltip: 'Add Protect link',
            statusText: 'ProtectLink link: click first on the child, and then on the parent. It can only be applied to Situation and Event.'
        })
    }).render();

    new uiC.AddButtonView({
        model: new uiC.AddButtonModel({
            label: 'Reduce',
            action: ui.STATE_ADD_LINK,
            name: 'ReduceLink',
            tooltip: 'Add Reduce link',
            statusText: 'ReduceLink link: click first on the child, and then on the parent. It can only be applied to Situation and Event.'
        })
    }).render();

    new uiC.AddButtonView({
        model: new uiC.AddButtonModel({
            label: 'Increase',
            action: ui.STATE_ADD_LINK,
            name: 'IncreaseLink',
            tooltip: 'Add Increase link',
            statusText: 'IncreaseLink link: click first on the child, and then on the parent. It can only be applied to Situation and Event.'
        })
    }).render();
}
