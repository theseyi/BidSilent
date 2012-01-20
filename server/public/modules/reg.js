YUI().add('register', function(Y) {
    var overlay = new Y.Overlay({
        width:"400px"
        , height:"100px"
        , headerContent: "<center>Register</center>"
        , bodyContent: 'Username: <input type="text" id="username" /><br />Password: <input type="password" id="password" /><br /><button id="reg_submit">Submit</button>&nbsp;<button id="reg_close">Close</button>'
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

    Y.one('#reg_close').on('click', function() { overlayClose(); });
    Y.one('#reg_submit').on('click',
        function() {
            overlayClose();
            Y.Global.Hub.fire('db:find', 'user', {
                    id: Y.one('#username').get('value')
                }
                , function(resp) {
                    if (resp.id) {
                        Y.log('user: ' + resp.id + ' already exists!');
                    } else {
                        Y.Global.Hub.fire('db:row', 'user',
                            { 
                                id: Y.one('#username').get('value')
                                , password: Y.one('#password').get('value')
                            }
                            , function(resp) {
                                Y.log('successfully created user: ');
                                Y.log(resp);
                            }
                        );
                    }
                }
            );

        }
    );

    Y.Global.Hub.on('register', function() {
        bg.setStyle('display', 'block');
        overlay.show();
    });

}, '1.0', { requires: [ 'node', 'overlay' ] } );
