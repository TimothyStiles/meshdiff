#!/usr/bin/env node

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var op = require('open');
var path = require('path');
var THREE = require('three');
//var THREE.STLLoader() = require('')

var fileName1 = path.normalize(process.argv[2]),
    fileName2 = path.normalize(process.argv[3]),
    filePath1 = path.join(process.cwd(), fileName1),
    filePath2 = path.join(process.cwd(), fileName2);
   
//console.log(filePath1, filePath2);

//load stl files. In future will modularize and include more formats.


//serve client files

app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});

app.get('/bundle.js', function(req, res){
    res.sendFile(__dirname + '/bundle.js');
});

io.on('connection', function(socket) {
  console.log('a user connected');
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

http.listen(port, ip_address, function(){
    console.log( "Listening on:");
    console.log('http://'+ ip_address  + ':' + port + '/');
    op('http://'+ ip_address  + ':' + port + '/');
});
