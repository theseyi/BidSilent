var redis = require('redis').createClient()
    ;

module.exports = {
    create: function(hub) {

        function getUser(obj, cb) {
            if (obj.id && obj.password) {
                redis.hgetall('user:' + obj.id, function(err, response) {
                    cb(err, response);
                });
            } else {
                callback("Missing user id or password");
            }
        }

        hub.on('user:register', function(obj, callback) { 
            getUser(obj, function(err, user) {
                if (err) {
                    callback(err);
                } else {
                    if (user.password) {
                        callback('User ' + obj.id + ' already exists');
                    } else {
                        redis.hmset('user:' + obj.id, obj, callback);
                    }
                }
            });
        });

        hub.on('user:login', function(obj, callback) { 
            getUser(obj, function(err, user) {
                if (err) {
                    callback(err);
                } else if (user.password === obj.password) {
                    hub.emit('session:add', { user: user.id, 'eventHub:session': obj['eventHub:session'] }, callback);
                } else {
                    callback('Bad password');
                }
            });
        });

        hub.on('user:logout', function(obj, callback) { 
            hub.emit('session:del', { 'eventHub:session': obj['eventHub:session'], key: 'user' }, callback);
        });

    }
};
