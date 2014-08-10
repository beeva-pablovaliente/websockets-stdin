var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = 8081;
  //, clients = []
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

var wss = new WebSocketServer({server: server});

//Broadcasting
wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};

//Client connection
wss.on('connection', function(ws) {
    var _self = this;

    console.log('New client connected. Clients connected: %s', _self.clients.length);

    ws.on('message', function(message) {
        console.log('Message Received: %s', message);
    });

  	ws.on('close', function() {
      console.log('Client disconnected. Still connected: %s clients', _self.clients.length);
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