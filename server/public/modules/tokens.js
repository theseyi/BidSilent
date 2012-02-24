YUI().add('tokens', function(Y) {

    Y.one('#buyTokensPanel').setStyle('display', 'block');
    var panel = new Y.Panel({
        srcNode      : '#buyTokensPanel',
        headerContent: 'Tokens',
        width        : 400,
        zIndex       : 5,
        centered     : true,
        modal        : true,
        visible      : false,
        render       : true,
        plugins      : [Y.Plugin.Drag]
    });

    panel.addButton({
        value  : 'Cancel',
        section: Y.WidgetStdMod.FOOTER,
        action : function (e) {
            e.preventDefault();
            panel.hide();
        }
    });

    panel.addButton({
        value  : 'Buy',
        section: Y.WidgetStdMod.FOOTER,
        action : function (e) {
            e.preventDefault();
            buyTokens();
        }
    });

    function buyTokens() {
        var tokens = Y.one('#tokens').get('value')
            , args = {}
        ;

        panel.hide();
/*
        Y.Global.Hub.fire(
            'user:setProfile'
            , args
            , function(err) {
                if (err) {
                    Y.Global.Hub.fire('ui:error', { message: err } );
                } 
            }
        );
*/
    }

    Y.Global.Hub.on('buy_tokens', function() {
    /*
        // start spinner
        Y.Global.Hub.fire('user:getProfile', {}, function(err, profile) {
            // stop spinner
            if (err) {
                Y.Global.Hub.fire('ui:error', { message: err } );
            } else {
                Y.one('#u_password').set('value', profile.password);
                if (profile.address) {
                    Y.one('#u_address').set('value', profile.address);
                }
            }
        });
        */
                panel.show();
    });

}, '1.0', { requires: [ 'node', 'panel', 'dd-plugin' ] } );
