YUI().add('error', function(Y) {

    Y.one('#errorPanel').setStyle('display', 'block');
    var panel = new Y.Panel({
        srcNode      : '#errorPanel',
        width        : 400,
        zIndex       : 5,
        centered     : true,
        modal        : true,
        visible      : false,
        render       : true,
        plugins      : [Y.Plugin.Drag],
        hideOn: [
            {
                eventName: 'clickoutside'
            }
        ]
    });

    panel.addButton({
        value  : 'Close',
        section: Y.WidgetStdMod.FOOTER,
        action : function (e) {
            e.preventDefault();
            panel.hide();
        }
    });

    Y.Global.Hub.on('ui:error', function(message) {
        panel.set('bodyContent', message);
        panel.show();
    });

}, '1.0', { requires: [ 'node', 'panel', 'dd-plugin' ] } );
