#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var op = require('open');
var THREE = require('three');


var fileName1 = path.normalize(process.argv[2]),
    fileName2 = path.normalize(process.argv[3]),
    filePath1 = path.resolve(process.cwd(), fileName1),
    filePath2 = path.resolve(process.cwd(), fileName2);
   
console.log(filePath1, filePath2);
console.log(fileName1, fileName2);
console.log(__dirname);
//load json files. In future will modularize and include more formats.


function handleFile(err, data) {
  if (err) throw err;
  var model = JSON.parse(data);
  var geom = model.geometry;
 // var mesh = new THREE.Mesh(geom, new THREE.MeshNormalMaterial()); 
  //io.emit('mesh', JSON.parse(data));
  console.log(geom);
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
  var cube = new THREE.CubeGeometry( 1, 1, 1 );
  var geom = new THREE.Geometry();
  var v1 = new THREE.Vector3(0,0,0);
  var v2 = new THREE.Vector3(30,0,0);
  var v3 = new THREE.Vector3(30,30,0);

  geom.vertices.push(v1);
  geom.vertices.push(v2);
  geom.vertices.push(v3);

  geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
  geom.computeFaceNormals();
  var mesh = new THREE.Mesh(geom, new THREE.MeshNormalMaterial());
  socket.emit('mesh', mesh.toJSON());
//  fs.readFile(filePath1, handleFile);

});


var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

http.listen(port, ip_address, function(){
  console.log( "Listening on:");
  console.log('http://'+ ip_address  + ':' + port + '/');
  op('http://'+ ip_address  + ':' + port + '/');
});
