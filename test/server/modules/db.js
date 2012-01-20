YUI({
    logInclude: { TestRunner: true },
}).use('test', function(Y) {

    var suite  = new Y.Test.Suite('db')
        , events    = require("events")
        , eventHubF = function() { events.EventEmitter.call(this); }
        , util      = require('util')
    ;

    util.inherits(eventHubF, events.EventEmitter);
    console.log('HELLO');
            var db = require('/home/trostler/BidSilent/server/modules/db.js', true); // 'true' here means do code coverage on it!
    console.log('goodby');

    suite.add(new Y.Test.Case({
        name: 'row',
        testRow: function() {
            var db = require('/home/trostler/BidSilent/server/modules/db.js', true) // 'true' here means do code coverage on it!
                , hub = eventHub = new eventHubF()
                , uuid
                , client = {
                    hmset : function(key, obj, func) {
                        uuid = obj.id;
                        Y.Assert.areEqual(obj.foo, 'bee');
                        Y.Assert.areEqual(key, 'test:' + obj.id);
                        func(null, 'OK');
                    }
                };

            db.setClient(client);
            db.create(hub);
            hub.emit('db:row'
                , 'test'
                , { foo: 'bee' }
                , function(back) { Y.Assert.areEqual(back.foo, 'bee'); Y.Assert.areEqual(back.id, uuid); });
        }
    }));

    Y.Test.Runner.add(suite);
    Y.Test.Runner.run();
});
