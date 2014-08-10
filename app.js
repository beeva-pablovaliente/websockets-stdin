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

    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
    
    //var id = setInterval(function() {
    //	ws.send(JSON.stringify(process.memoryUsage()), function() { /* ignore errors */ });
  	//}, 100);
  	
	//clients[clients.length] = ws;

  	//console.log('started client interval');

  	//ws.on('close', function() {
    //	console.log('stopping client interval');
    //	clearInterval(id);
  	//});
});

process.stdin.on("data", function(data) {

	/*var index = 0;
	console.log("Client's " + clients.length);
	for (index = 0; index < clients.length; index++){
		console.log("Client: "+ clients[index]);
		clients[index].send(data, function(error){console.log('<<<<'+error);});
	}*/
  wss.broadcast(data);

	//process.stdin.pause(); 
});

console.log("WebServer started on port: " + port);
process.stdin.setEncoding("utf8");
process.stdin.resume();