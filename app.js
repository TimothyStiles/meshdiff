#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var op = require('open');
var THREE = require('three');
var stl = require('./js/loaders/STLLoader.js');
var Buffer = require('buffer').Buffer;
var Iconv = require('iconv').Iconv;

var fileName1 = path.normalize(process.argv[2]),
    fileName2 = path.normalize(process.argv[3]),
    filePath1 = path.resolve(process.cwd(), fileName1),
    filePath2 = path.resolve(process.cwd(), fileName2);
   
//load json files. In future will modularize and include more formats.
var parseModel = new THREE.ObjectLoader();
var stlModel = new stl();


//should be moved to another file and imported.
function handleFile(err, data) {
  if (err) throw err;
  var model = parseModel.parse(JSON.parse(data));
//  var iconv = new Iconv('UTF-8', 'UTF-32');
//  var buf = iconv.convert(data);
//  var arrayBuffer = new Float32Array(buf).buffer;
//  var model = stlModel.parse(arrayBuffer); 
//  var mesh = new THREE.Mesh(model, new THREE.MeshNormalMaterial());
//  console.log(mesh); 
  io.emit('mesh', model.toJSON());
}


//serve client files

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/bundle.js', function(req, res){
  res.sendFile(__dirname + '/bundle.js');
});

app.get('/favicon.ico', function(req, res){
  res.sendFile(__dirname + '/favicon.ico');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  fs.readFile(filePath1, "utf-8", handleFile);
});


var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

http.listen(port, ip_address, function(){
  console.log( "Listening on:");
  console.log('http://'+ ip_address  + ':' + port + '/');
  op('http://'+ ip_address  + ':' + port + '/');
});
