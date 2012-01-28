var redis = require('redis').createClient()
    ;

module.exports = {
    create: function(hub) {

        hub.on('session:end', function(obj, callback) {
            var session = obj['eventHub:session'];
            if (session) {
                redis.del('session:' + session);
            }
            if (callback) {
                callback();
            }
        });

        hub.on('session:get', function(obj, callback) {
            var session = obj['eventHub:session'];
            if (session) {
                redis.hgetall('session:' + session, callback);
            } else {
		        callback('No session');
            }
        });

        hub.on('session:add', function(obj, callback) { 
            var session = obj['eventHub:session'];
            if (session) {
                redis.hmset('session:' + session, obj, callback);
            } else {
                callback('No session');
            }
        }, {type: 'unicast'});

        hub.on('session:del', function(obj, callback) { 
            var session = obj['eventHub:session'];
            if (session) {
                delete obj['eventHub:session'];
                redis.hdel('session:' + session, obj.key);
            } 

            if (callback) {
                callback();
            }
        }, {type: 'unicast'});

    }
};
