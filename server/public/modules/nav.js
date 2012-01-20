YUI().add('nav', function(Y) {
    var menu = Y.one("#nav");
    menu.plug(Y.Plugin.NodeMenuNav);
    menu.on("click", function (event) {
        console.log('fire: ' + event.target.get('id'));
        Y.Global.Hub.fire(event.target.get('id'));
    });
}, '1.0', { requires: [ 'node-menunav' ] } );
