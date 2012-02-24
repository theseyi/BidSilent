YUI().add('login', function(Y) {

    Y.one('#loginPanel').setStyle('display', 'block');
    var panel = new Y.Panel({
        srcNode      : '#loginPanel',
        headerContent: 'Login',
        width        : 400,
        zIndex       : 5,
        centered     : true,
        modal        : true,
        visible      : false,
        render       : true,
        plugins      : [Y.Plugin.Drag]
    });

    panel.addButton({
        value  : 'Login',
        section: Y.WidgetStdMod.FOOTER,
        action : function (e) {
            e.preventDefault();
            login();
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

    function login() {
        var user = Y.one('#l_username').get('value')
            , pass = Y.one('#l_password').get('value')
            ;

        panel.hide();

        if (!user || !pass) { return; }

        Y.Global.Hub.fire('user:login', {
                id: user
                , password: pass
            }
            , function(err, userObj) {
                if (err) {
                    Y.Global.Hub.fire('ui:error', { message: err } );
                } else {
                    Y.Global.Hub.fire('ui:userLoggedIn', { user: user });
                }
            }
        );
    }

    Y.Global.Hub.on('ui:userLoggedIn', function(obj) {
        if (obj && obj.user) {
            Y.log('user: ' + obj.user + ' now logged in!');
            Y.one('#user_name').set('innerHTML', obj.user);
            Y.one('#user_tokens').set('innerHTML', '?');
            Y.one('#loggedIn').setStyle('display', 'block');
            Y.one('#loggedOut').setStyle('display', 'none');

            Y.Global.Hub.fire('user:getProfile', {}, function(err, profile) {
                if (err) {
                    Y.Global.Hub.fire('ui:error', { message: err } );
                } else {
                    Y.one('#user_tokens').set('innerHTML', profile.tokens);
                }
            });
        } else {
            Y.one('#loggedOut').setStyle('display', 'block');
            Y.one('#loggedIn').setStyle('display', 'none');
        }
    });

    Y.Global.Hub.on('login', function() {
        panel.show();
    });

    Y.Global.Hub.on('logout', function() {
        Y.Global.Hub.fire('user:logout', {}, function() { 
            Y.Global.Hub.fire('ui:userLoggedIn');
        });
    });

}, '1.0', { requires: [ 'node', 'panel', 'dd-plugin' ] } );
