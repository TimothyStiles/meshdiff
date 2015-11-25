#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    op = require('open'),
    THREE = require('three');

var fileName1 = path.normalize(process.argv[2]),
    fileName2 = path.normalize(process.argv[3]),
    filePath1 = path.resolve(process.cwd(), fileName1),
    filePath2 = path.resolve(process.cwd(), fileName2),
    baseName1 = '/' + path.basename(fileName1),
    baseName2 = '/' + path.basename(fileName2); 

//serve client files
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


app.get('/bundle.js', function(req, res){
  res.sendFile(__dirname + '/bundle.js');
});

app.get(baseName1, function(req, res){
  res.sendFile(filePath1);
});

app.get(baseName2, function(req, res){
  res.sendFile(filePath2);
});

app.get('/favicon.ico', function(req, res){
  res.sendFile(__dirname + '/favicon.ico');
});

io.on('connection', function(socket) {
  console.log('We have made contact...');
  socket.emit('mesh1', baseName1);
  socket.emit('mesh2', baseName2);
});


var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

http.listen(port, ip_address, function(){
  console.log( "Listening on:");
  console.log('http://'+ ip_address  + ':' + port + '/');
  op('http://'+ ip_address  + ':' + port + '/');
});
