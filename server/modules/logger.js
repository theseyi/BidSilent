var eventHub = require('EventHub/clients/server/eventClient.js').getClientHub('http://localhost:5883?token=ehrox')
    , fs = require('fs')
    , logfile = '/tmp/bidsilent.log'
;

function create(hub) {
    hub.on('log', function(obj) {
	var message = '[' + new Date() + '] ';
	if (obj.severity) {
 	    message += '[' + obj.severity + '] ';
	}
	if (obj.from) {
 	    message += '[' + obj.from + '] ';
        }
	message += obj.message + "\n";
	fs.appendFileSync(logfile, message);
    });
}

// get ref to hub & then load server-side modules
eventHub.on('eventHubReady', function() {
    create(eventHub);
});

