var redis = require('redis').createClient()
    , eventHub = require('EventHub/clients/server/eventClient.js').getClientHub('http://localhost:5883?token=ehrox')
;

function create(hub) {

        function getUser(obj, callback) {
            if (obj.id && obj.password) {
                redis.hgetall('user:' + obj.id, callback);
            } else {
                callback("Missing user id or password");
            }
        }

        hub.on('user:register', function(obj, callback) { 
            getUser(obj, function(err, user) {
                if (err) {
                    callback(err);
                } else {
                    if (user && user.password) {
                        callback('User ' + obj.id + ' already exists');
                    } else {
                        obj.tokens = '0';
                        delete obj['eventHub:session'];
			hub.emit('log', { from: 'user', message: 'creating user ' + JSON.stringify(obj) });
                        redis.hmset('user:' + obj.id, obj, callback);
                    }
                }
            });
        }, {type: 'unicast'});

        hub.on('user:login', function(obj, callback) { 
            getUser(obj, function(err, user) {
                if (err || !user) {
                    callback(err || 'Bad password');
                } else if (user.password === obj.password) {
                    hub.emit('session:add', { user: user.id, 'eventHub:session': obj['eventHub:session'] }, callback);
                } else {
                    callback('Bad password');
                }
            });
        }, {type: 'unicast'});

        hub.on('user:logout', function(obj, callback) { 
            hub.emit('session:del', { 'eventHub:session': obj['eventHub:session'], key: 'user' }, callback);
        }, {type: 'unicast'});

        hub.on('user:setProfile', function(obj, callback) { 
            hub.emit('session:get', { 'eventHub:session': obj['eventHub:session'] }, function(err, session) {
                if (err) {
                    callback(err);
                } else {
                    delete obj['eventHub:session'];
                    Object.keys(obj).forEach(function(key) {
                        if (typeof(obj.key) !== 'string') {
                            delete obj.key;
                        }
                    });
                    redis.hmset('user:' + session.user, obj, callback);
                }
            });
        }, {type: 'unicast'});

        hub.on('user:getProfile', function(obj, callback) {
            hub.emit('session:get', { 'eventHub:session': obj['eventHub:session'] }, function(err, session) {
                if (err) {
                    callback(err);
                } else {
                    redis.hgetall('user:' + session.user, callback);
                }
            });
        }, {type: 'unicast'});

        hub.on('user:buyTokens', function(obj, callback) { 
            hub.emit('session:get', { 'eventHub:session': obj['eventHub:session'] }, function(err, session) {
                if (err) {
                    callback(err);
                } else {
                    redis.hincrby('user:' + session.user, 'tokens', obj.tokens, callback);
                }
            });
        }, {type: 'unicast'});

    }


// get ref to hub & then load server-side modules
eventHub.on('eventHubReady', function() {
    create(eventHub);
});

