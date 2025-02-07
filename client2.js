var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
        
            console.log(JSON.parse(message.utf8Data));
        }
    });

        connection.sendUTF(JSON.stringify({
            message: 'bitedfds'
        }))



});


        client.connect('ws://192.168.1.13:8080/', 'echo-protocol');
