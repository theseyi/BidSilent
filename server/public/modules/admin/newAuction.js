YUI({
}).add('newAuction', function(Y) {

    var asin = Y.one('#asin');
    asin.focus();
    asin.on('blur', function(e) {
        var val = asin.get('value');
        if (val) {
            Y.Global.Hub.fire('amazon:getASIN', { asin: val }, function(err, asin) {
                if (err) {
                    Y.Global.Hub.fire('ui:error', { message: err } );
                } else {
                    var item = asin.Items.Item
                        , price = item.Offers.Offer.OfferListing.Price
                        , tokens = parseInt(price.Amount / 10000, 10)
                        , href = item.DetailPageURL
                    ;

                    Y.one('#itemName').set('innerHTML', '<a href="' + href + '" target="_blank">' + item.ItemAttributes.Title + ' ' + price.FormattedPrice + '</a>');
                    Y.one('#tokens').set('value', tokens);
                    console.log(asin);
                }
            });
        }
    });

    Y.CalendarBase.CONTENT_TEMPLATE = Y.CalendarBase.TWO_PANE_TEMPLATE;
    var calendar = new Y.Calendar({
        contentBox: "#newAuctionDates",
        width: "650px",
        showPrevMonth: true,
        showNextMonth: true,
        selectionMode: 'multiple'
    }).render();

    // Set a custom header renderer with a callback function,
    // which receives the current date and outputs a string.
    // use the Y.Datatype.Date format to format the date, and
    // the Datatype.Date math to add one month to the current
    // date, so both months can appear in the header (since 
    // this is a two-pane calendar).
    calendar.set("headerRenderer", function (curDate) {
        var ydate = Y.DataType.Date,
            output = ydate.format(curDate, {
            format: "%B %Y"
          }) + " &mdash; " + ydate.format(ydate.addMonths(curDate, 1), {
            format: "%B %Y"
          });
        return output;
    });

}, '1.0', { requires: [ 'calendar', 'datatype-date', 'datatype-date-math' ] } );
