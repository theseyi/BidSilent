var uuid = require('node-uuid')
    ;

module.exports = {
    create: function(hub) {
        hub.on('session:start', function(callback) { 
            hub.emit('db:row', 'session', {}, function(result) {
                // this worked right??
                callback(result);
            });
        });

        hub.on('session:end', function(obj) {
            hub.emit('db:del', obj, function(result) {
            });
        });

        hub.on('session:get', function(session, callback) {
            hub.emit('db:find', 'session', { id: session }, function(result) {
		callback(result);
            });
        });


        hub.on('session:add', function(obj, callback) { 
            hub.emit('db:row', 'session', obj, function(result) {
                // this worked right??
                if (callback) {
                    callback(result);
                }
            });
        });
    }
};
