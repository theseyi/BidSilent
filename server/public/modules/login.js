YUI().add('login', function(Y) {
    var overlay = new Y.Overlay({
        width:"400px"
        , height:"150px"
        , headerContent: "Login"
        , bodyContent: '<label for="username">Username</label><input type="text" id="u_login" class="input" /><br /><label for="password">Password</label><input type="password" id="u_password" class="input" /><br /><label>&nbsp;</label><button class="button" style="margin-right: 20px" id="login_submit">Submit</button>&nbsp;<button id="login_close" class="button">Close</button>'
        , zIndex:2
        , centered: true
    })
    , bg = Y.one('#backgroundFilter')
    , overlayClose = function() {
          bg.setStyle('display', 'none');
          overlay.hide();
      }
    ;

    overlay.render();
    overlay.hide();

    Y.one('#login_close').on('click', function() { overlayClose(); });
    Y.one('#login_submit').on('click',
        function() {
            var user = Y.one('#u_login').get('value');

            overlayClose();
            Y.Global.Hub.fire('user:login', {
                    id: user
                    , password: Y.one('#u_password').get('value')
                }
                , function(err) {
                    if (err) {
                        Y.log('user: ' + user + ' does not exist or bad password!');
                    } else {
                        Y.log('user: ' + user + ' now logged in!');
                        Y.one('#nav_logout').setStyle('display', 'block');
                        Y.one('#nav_login').setStyle('display', 'none');
                        Y.one('#nav_register').setStyle('display', 'none');
                        // REPLACE nav with 'logout'
                    }
                }
            );
        }
    );

    Y.Global.Hub.on('login', function() {
        bg.setStyle('display', 'block');
        overlay.show();
    });

    Y.Global.Hub.on('logout', function() {
        Y.Global.Hub.fire('user:logout', {}, function() { 
            Y.one('#nav_logout').setStyle('display', 'none');
            Y.one('#nav_login').setStyle('display', 'block');
            Y.one('#nav_register').setStyle('display', 'block');
        });
    });



}, '1.0', { requires: [ 'node', 'overlay' ] } );
