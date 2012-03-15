YUI({
}).add('currentAuctions', function(Y) {

    var currentAuctions = Y.one('#currentauctions');
    Y.Global.Hub.fire('auction:getAll', function(err, auctions) {
        console.log(auctions);
        currentAuctions.set('innerHTML', auctions);
    });

}, '1.0', { requires: [ 'node', 'datatable' ] } );
