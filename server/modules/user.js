var uuid = require('node-uuid')
    ;

module.exports = {
    create: function(hub) {
        hub.on('user:session', function(obj, callback) { 
            hub.emit('db:row', 'user', obj, function(result) {
                // this worked right??
                hub.emit('session:add', { id: obj.session, user: obj.id },
                    function(result) {
                        if (callback) {
                            callback(result);
                        }
                    }
                );
            });
        });
    }
};
