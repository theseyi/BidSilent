var connect = require('connect')
    , docRoot = 'server/public'
    , fs = require('fs')
    , server = connect.createServer(
        connect.logger()
        , connect.cookieParser()
        , connect.favicon()
        , function(req, res, next) {
            var localFile = req.url;
            if (req.url.match("^/admin")) {
                eventHub.emit('user:getProfile', { 'eventHub:session': req.cookies.eventhub }, function(err, profile) {
                    if (!err) {
                        if (profile.admin) {
                            localFile = '/admin.html';
                        } else {
                            localFile = '/';
                        }
                    } else {
                        localFile = '/';
                    }
                    sendFile(res, localFile);
                });
            } else {
                sendFile(res, localFile);
            }
        }
    )
    , port = 80
    , fs = require('fs')
    , path = require('path')
    , eventHub = require('EventHub/clients/server/eventClient.js').getClientHub('http://localhost:5883?token=ehrox')
    , sendFile = function(res, file) {
        if (file === '/') {
            file = '/index.html';
        }
        fs.readFile(docRoot + file, 'utf8', function(err, data) {
            if (err) {
                res.responseCode = 404;
            }
            res.end(data);
        });
    }
    ;

server.listen(port);
console.log('Listening on port ' + port);

