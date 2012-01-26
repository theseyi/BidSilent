YUI().add('register', function(Y) {
    var overlay = new Y.Overlay({
        width:"400px"
        , height:"150px"
        , headerContent: "Register"
        , bodyContent: '<label for="username">Username</label><input type="text" id="username" class="input" /><br /><label for="password">Password</label><input type="password" id="password" class="input" /><br /><label>&nbsp;</label><button class="button" style="margin-right: 20px" id="reg_submit">Submit</button>&nbsp;<button id="reg_close" class="button">Close</button>'
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
            var user = Y.one('#username').get('value')
                , pass = Y.one('#password').get('value')
                ;

            overlayClose();

            if (!user || !password) { return; }

            Y.Global.Hub.fire('user:register', {
                    id: user
                    , password: pass
                }
                , function(error) {
                    if (error) {
                        Y.log('error registering user: ' + user);
                        Y.log(error);
                    } else {
                        Y.log('successfully created user: ' + user);
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
