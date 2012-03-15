var redis = require('redis').createClient()
    , eventHub = require('EventHub/clients/server/eventClient.js').getClientHub('http://localhost:5883?token=ehrox')
    , uuid    = require('node-uuid')
    ;

function create(hub) {

    hub.on('auction:create', function(obj, callback) {
        hub.emit('user:getProfile', { 'eventHub:session': obj['eventHub:session'] }, function(err, user) {
            if (err) {
                callback(err);
            } else {
                if (user.admin) {
                    hub.emit('amazon:getASIN', { asin: obj.asin }, function(err, asinObj) {
                        var end, id, start
                            , oneWeek = (1000 * 60 * 60 * 24 * 7)
                        ;

                        if (err) {
                            callback(err);
                        } else {
                            id = uuid();
                            if (!obj.dates || !obj.dates.length || !start || typeof(start) === 'NaN') {
                                obj.dates = [];
                                obj.dates[0] = new Date();  
                                obj.dates[1] = new Date(); // right now to 1 week later
                            }

                            end    = new Date(obj.dates[obj.dates.length - 1]).getTime();
                            start  = new Date(obj.dates[0]).getTime();
                            if (end === start) {
                                end += oneWeek;
                            }

                            obj.start = start;
                            obj.end = end;
                            obj.asin = JSON.stringify(asinObj.Items.Item);
                            delete obj['eventHub:session'];
                            delete obj.dates;
                            redis.hmset('auction:' + end + ':' + id, obj, callback);
                            redis.sadd('currentAuctions', 'auction:' + end + ':' + id);
                        }
                    });
                } else {
                    callback('Must be admin user');
                }
            }
        });
    }, {type: 'unicast'});

    hub.on('auction:getAll', function(obj, callback) {
        redis.smembers('currentAuctions', function(err, auctions) {
            var res = [], i;
            if (err) {
                callback(err);
            } else {
                for (i = 0; i < auctions.length; i++) {
                    (function(i) {
                        redis.hgetall(auctions[i], function(err, aucObj) {
                            if (err) {
                                callback(err);
                            } else {
                                res.push(aucObj);
                                if (i === auctions.length - 1) {
                                    callback(null, JSON.stringify(res));
                                }
                            }
                        });
                    }(i));
                }
            }
        });
    }, {type: 'unicast'});
}


// get ref to hub & then load server-side modules
eventHub.on('eventHubReady', function() {
    create(eventHub);
});

