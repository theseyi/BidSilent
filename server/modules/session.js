var redis = require('redis').createClient()
    , eventHub = require('EventHub/clients/server/eventClient.js').getClientHub('http://localhost:5883?token=ehrox')
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
        }, {type: 'unicast'});

        hub.on('session:get', function(obj, callback) {
            var session = obj['eventHub:session'];
            if (session) {
                redis.hgetall('session:' + session, callback);
            } else {
		callback('No session');
            }
        }, {type: 'unicast'});

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

// get ref to hub & then load server-side modules
eventHub.on('eventHubReady', function() {
    module.exports.create(eventHub);
});

