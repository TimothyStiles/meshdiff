var THREE = require('three'),
    ThreeBSP = require('three-js-csg')(THREE),
    OrbitControls = require('three-orbit-controls')(THREE),
    stl = require('./loaders/STLLoader.js'),
    socket = require('socket.io-client')('http://127.0.0.1:8080/');

var camera, cameraTarget, containers, scene, renderer, newMesh, OldMesh;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

  // scene
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x72645b, 2, 15 );

  // camera
	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
	camera.position.set( 3, 3, 3 );
	cameraTarget = new THREE.Vector3( 0, -0.25, 0 );

	// Lights
	scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
	addShadowedLight( 0.5, 1, -1, 0xffff99, 1 );

	// renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( scene.fog.color );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.cullFace = THREE.CullFaceBack;

	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablingDamping = true;
  controls.dampingFactor = 0.25;
  controls.noPan = false;
}

function addShadowedLight( x, y, z, color, intensity ) {

	var directionalLight = new THREE.DirectionalLight( color, intensity );
	directionalLight.position.set( x, y, z );
	scene.add( directionalLight );

	directionalLight.castShadow = true;
	// directionalLight.shadowCameraVisible = true;

	var d = 1;
	directionalLight.shadowCameraLeft = -d;
	directionalLight.shadowCameraRight = d;
	directionalLight.shadowCameraTop = d;
	directionalLight.shadowCameraBottom = -d;
	directionalLight.shadowCameraNear = 1;
	directionalLight.shadowCameraFar = 4;
	directionalLight.shadowMapWidth = 1024;
	directionalLight.shadowMapHeight = 1024;
	directionalLight.shadowBias = -0.005;

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

  controls.update();
	renderer.render( scene, camera );

}

socket.on('connect', function(){
  console.log('We have made contact...');
});

socket.on('mesh1', function(data){
  console.log(data);
  var stlLoader = new stl();
  stlLoader.load('http://127.0.0.1:8080' + data, function(obj) {
    var geom = new THREE.Geometry().fromBufferGeometry(obj);
    geom.normalize();
    geom.mergeVertices();
    newMesh = new ThreeBSP(geom);    
    socket.emit('newMesh', 'newMesher');
    var mesh = new THREE.Mesh(geom, new THREE.MeshNormalMaterial());
    mesh.position.set(-3, -0.25, 0);
    scene.add(mesh);
  });
});


socket.on('mesh2', function(data){
  console.log(data);
  var stlLoader = new stl();
  stlLoader.load('http://127.0.0.1:8080' + data, function(obj) {
    var geom = new THREE.Geometry().fromBufferGeometry(obj);
    geom.normalize();
    geom.mergeVertices();
    oldMesh = new ThreeBSP(geom);
    socket.emit('oldMesh', 'oldMesher');
    var mesh = new THREE.Mesh(geom, new THREE.MeshNormalMaterial());
    mesh.position.set(3, -0.25, 0);
    scene.add(mesh); 
   });
});

socket.on('oldMesher', function(){
  console.log('oldMesh');
  if ((newMesh !== undefined) && (oldMesh !== undefined)) {
    console.log('doing it new!');
    var sub = newMesh.subtract(oldMesh);
    var diffMesh = sub.toMesh();
    diffMesh.material = new THREE.MeshLambertMaterial({color: 0x00FF00,
                             transparent: true, side: THREE.DoubleSide, opacity: 0.4});
    diffMesh.position.set(0, -0.25, 0);
    scene.add(diffMesh);

    var sub2 = oldMesh.subtract(newMesh);
    var diffMesh2 = sub2.toMesh();
    diffMesh2.material = new THREE.MeshLambertMaterial({color: 0xFF0000,
                             transparent: true, side: THREE.DoubleSide, opacity: 0.4});
    diffMesh2.position.set(0, -0.25, 0);
    scene.add(diffMesh2);

    var intersection = oldMesh.intersect(newMesh);
    var intersectMesh = intersection.toMesh();
    intersectMesh.material = new THREE.MeshLambertMaterial({color: 0x0000FF,
                             transparent: false, side: THREE.DoubleSide, opacity: 0.2});
    intersectMesh.position.set(0,-0.25,0);
    scene.add(intersectMesh);

// This is supposed to show the holes made by the newMesh.
// Having a hard time getting this piece to work.
//    var temp1 = sub2.subtract(intersection);

//    var negative0 = oldMesh.subtract(sub2);
//    var negative1 = oldMesh.subtract(negative0);
//    var negative2 = negative1.subtract(intersectMesh);
//    var neg = negative2.toMesh();
//    neg.material = new THREE.MeshLambertMaterial({color: 0xFF0000,
//                             transparent: false, side: THREE.DoubleSide, opacity: 0.4});
//    neg.position.set(0, -0.25, 0);
//
//    scene.add(neg);
  }
});

socket.on('disconnect', function(){});
