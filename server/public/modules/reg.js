YUI().add('register', function(Y) {

    Y.one('#regPanel').setStyle('display', 'block');
    var panel = new Y.Panel({
        srcNode      : '#regPanel',
        headerContent: 'Register',
        width        : 400,
        zIndex       : 5,
        centered     : true,
        modal        : true,
        visible      : false,
        render       : true,
        plugins      : [Y.Plugin.Drag]
    });

    panel.addButton({
        value  : 'Register',
        section: Y.WidgetStdMod.FOOTER,
        action : function (e) {
            e.preventDefault();
            register();
        }
    });

    panel.addButton({
        value  : 'Close',
        section: Y.WidgetStdMod.FOOTER,
        action : function (e) {
            e.preventDefault();
            panel.hide();
        }
    });

    function register() {
        var user = Y.one('#r_username').get('value')
            , pass = Y.one('#r_password').get('value')
            ;

        panel.hide();

        if (!user || !pass) { return; }

        Y.Global.Hub.fire('user:register', {
                id: user
                , password: pass
            }
            , function(error) {
                if (error) {
                    Y.log('error registering user: ' + user);
                    Y.log(error);
                    Y.Global.Hub.fire('ui:error', { message: error });
                } else {
                    Y.log('successfully created user: ' + user);
                }
            }
        );
    }

    Y.Global.Hub.on('register', function() {
        panel.show();
    });

}, '1.0', { requires: [ 'node', 'panel', 'dd-plugin' ] } );
