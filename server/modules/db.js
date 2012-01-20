var client = require('redis').createClient()
    , uuid = require('node-uuid')
    ;

module.exports = {
    setClient: function(cl) { client = cl; }
    , create: function(hub) {

        hub.on('db:row', function(what, obj, callback) {
            if (!obj.id) {
               obj.id = uuid();
            }

            console.log('hmset: ' + what + ':' + obj.id);
            console.log(obj);
            client.hmset(what + ':' + obj.id, obj, function(err, response) {
                if (callback) {
                    callback(obj);
                }
            });
        });

        hub.on('db:del', function(obj, callback) {
            if (obj.key) {
                client.del(obj.key, function(err, response) {
                    if (callback) {
                        callback(obj);
                    }
                });
            } else {
                if (callback) {
                    callback(obj);
                }
            }
        });

        hub.on('db:find', function(what, obj, callback) {
            client.hgetall(what + ':' + obj.id, function(err, response) {
                var key;
                for (key in obj) {
                    // Everything (numbers & bools) gets stringified so do NOT use '!=='
                    //  use 1 & 0 for bools not true/false!
                    if (obj.key != response.key) {
                        response = {};
                    }
                }
                callback(response);
            });
        });

    }
};
