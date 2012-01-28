var parser = require('blindparser')
    , feed = 'http://www.amazon.com/gp/rss/bestsellers/electronics/ref=zg_bs_electronics_rsslink'
    ;

module.exports = {
    create: function(hub) {
        hub.on('product:get', function(callback) {
            parser.parseURL(feed, {}, function(err, out) {
                if (err) {
                    callback(err);
                } else if (out.items.length) {
                    callback(null, out.items);
                } else {
                    callback('Cannot get item list');
                }
            });
        });
    }
};
