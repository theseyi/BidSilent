YUI().add('login', function(Y) {
    Y.Global.Hub.on('login', function() {
        Y.log('LOGIN EVENT');
    });
}, '1.0', { requires: [ 'node', 'overlay' ] } );
