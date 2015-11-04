var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var op = require('open');

app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});

//app.get('/js/bundle.js', function(req, res){
  //  res.sendFile(__dirname + '/js/bundle.js');
//});

io.on('connection', function(socket) {
  console.log('a user connected');
});


var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';


http.listen(port, ip_address, function(){
    console.log( "Listening on " + ip_address + ", server_port " + port );
    console.log('http://'+ ip_address  + ':' + port + '/');
    op('http://'+ ip_address  + ':' + port + '/');
});
