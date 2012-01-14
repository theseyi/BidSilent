var connect = require('connect')
    , server = connect.createServer(
        connect.logger()
        , connect.static(__dirname + '/public')
    )
    , io = require('socket.io').listen(server)
    , port = 80
    ;

server.listen(port);
console.log('Listening on port ' + port);

