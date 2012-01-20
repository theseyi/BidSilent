var connect = require('connect')
    , server = connect.createServer(
        connect.logger()
        /*
        , connect.cookieParser()
        , connect.session({ secret: 'eventhub', cookie:  { path: '/', httpOnly: false, maxAge: 14400000 } })
        */
        , connect.static(__dirname + '/public')
    )
    , io = require('socket.io').listen(server)
    , port = 80
    , fs = require('fs')
    , path = require('path')
    , eventHub = require('EventHub/clients/server/eventClient.js').getClientHub('http://localhost:5883')
    ;

// get ref to hub & then load server-side modules
eventHub.on('eventHubReady', function() {
    var modules = fs.readdirSync('modules');
    modules.forEach(function(fname) {
        if (fname.match('.js$')) {
            require(path.join(__dirname, 'modules', fname)).create(eventHub);
            console.log('loaded: ' + fname);
        }
    });
});

server.listen(port);
console.log('Listening on port ' + port);


