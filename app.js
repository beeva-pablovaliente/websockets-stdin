var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = 8081
  , clients = []
  ;


// simple logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});
/*
app.get('/', function(req, res){
  res.send('Hello World');

});
*/

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(port);

var wss = new WebSocketServer({server: server, clientTracking : false});

//Broadcasting
wss.broadcast = function(data) {
    for(var i in clients)
        clients[i].send(data);
};

//Client connection
wss.on('connection', function(ws) {
    var _self = this;

    //Add the new client
    ws._id = clients.length;
    clients.push(ws);

    console.log('New client connected. Clients connected: %s', clients.length);

    ws.on('message', function(message) {
        console.log('Message Received: %s', message + '. From: '+ws._id);
    });

  	ws.on('close', function() {
        //Remove the client from the store
        var index = clients.indexOf(ws);
            if (index != -1) {
                clients.splice(index, 1);
            }
        console.log('Client ' +ws._id+ ' disconnected. Still connected: %s clients', clients.length);
  	});

});

process.stdin.on("data", function(data) {

  //Calling broadcast function
  wss.broadcast(data);

	//process.stdin.pause(); 
});

console.log("WebSocketServer started on port: " + port);
process.stdin.setEncoding("utf8");
process.stdin.resume();
