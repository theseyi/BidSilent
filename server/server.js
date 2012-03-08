var connect = require('connect')
    , server = connect.createServer(
        connect.logger()
        , connect.cookieParser()
        , function(req, res, next) {
            if (req.url !== '/admin') {
                next();
            } else {
                eventHub.emit('user:getProfile', { 'eventHub:session': req.cookies.eventhub }, function(err, profile) {
                    if (!err) {
                        if (profile.admin) {
                            console.log('ADMIN USER');
                            res.end('HELLO ADMIN USER');
                        } else {
                            // 404
                            res.statusCode = 404;
                            res.end('u no admin user');
                        }
                    } else {
                        // 404
                        res.statusCode = 404;
                        res.end('u no admin user: ' + err);
                    }
                });
            }
        }
        , connect.static(__dirname + '/public')
    )
    , io = require('socket.io').listen(server)
    , port = 80
    , fs = require('fs')
    , path = require('path')
    , eventHub = require('EventHub/clients/server/eventClient.js').getClientHub('http://localhost:5883?token=ehrox')
    ;

// get ref to hub & then load server-side modules
eventHub.on('eventHubReady', function() {
    var modules = fs.readdirSync(__dirname + '/modules');
    modules.forEach(function(fname) {
        if (fname.match('.js$')) {
            require(path.join(__dirname, 'modules', fname)).create(eventHub);
            console.log('loaded: ' + fname);
        }
    });
});

server.listen(port);
console.log('Listening on port ' + port);


