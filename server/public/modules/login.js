YUI().add('login', function(Y) {
    var overlay = new Y.Overlay({
        width:"400px"
        , height:"100px"
        , headerContent: "<center>Login</center>"
        , bodyContent: 'Username: <input type="text" id="u_login" /><br />Password: <input type="password" id="u_password" /><br /><button id="login_submit">Login</button>&nbsp;<button id="login_close">Close</button>'
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
            overlayClose();
            Y.Global.Hub.fire('db:find', 'user', {
                    id: Y.one('#u_login').get('value')
                    , password: Y.one('#u_password').get('value')
                }
                , function(resp) {
                    if (resp.id) {
                        Y.log('user: ' + resp.id + ' now logged in!');
                        Y.Global.Hub.fire('user:session', { id: resp.id, session: Y.Global.Hub.session });
                    } else {
                        Y.log('user: ' + resp.id + ' does not exist or bad password!');
                    }
                }
            );

        }
    );

    Y.Global.Hub.on('login', function() {
        bg.setStyle('display', 'block');
        overlay.show();
    });

}, '1.0', { requires: [ 'node', 'overlay' ] } );
