YUI().add('user', function(Y) {

    Y.one('#userPanel').setStyle('display', 'block');
    var panel = new Y.Panel({
        srcNode      : '#userPanel',
        headerContent: 'Profile',
        width        : 400,
        zIndex       : 5,
        centered     : true,
        modal        : true,
        visible      : false,
        render       : true,
        plugins      : [Y.Plugin.Drag]
    });

    panel.addButton({
        value  : '&nbsp;Save',
        section: Y.WidgetStdMod.FOOTER,
        action : function (e) {
            e.preventDefault();
            updateProfile();
        },
        classNames: [ 'icon-ok' ] 
    });

    function updateProfile() {
        var pass = Y.one('#u_password').get('value')
            , address = Y.one('#u_address').get('value')
            , args = {}
        ;

        panel.hide();

        if (address) {
            args.address = address;
        }

        if (pass) {
            args.password = pass;
        }

        Y.Global.Hub.fire(
            'user:setProfile'
            , args
            , function(err) {
                if (err) {
                    Y.Global.Hub.fire('ui:error', { message: err } );
                } 
            }
        );
    }

    Y.Global.Hub.on('user_name', function() {
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
                panel.show();
            }
        });
    });

}, '1.0', { requires: [ 'node', 'panel', 'dd-plugin' ] } );
