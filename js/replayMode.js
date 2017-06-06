var scene, camera, renderer, replayContainer, replayContainerRect;

function webGLSupported() {
	try {
		var canvas = document.createElement( 'canvas' );
		return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
	} catch ( e ) {
		return false;
	}
}

function initializeReplayMode() {
	if (webGLSupported()) {
	    init();
	} else {
	    document.getElementById("replayModeContent").textContent("Your browser doesn't support WebGL. Please, update it to the later version.");
	}
}

function init() {
	replayContainer = document.getElementById("replayModeContent");
	replayContainerRect = replayContainer.getBoundingClientRect();

	//var canvas = document.createElement("canvas");

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, replayContainerRect.width / replayContainerRect.height, 0.1, 1000 );
	controls = new THREE.OrbitControls( camera );

	renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.setSize( replayContainerRect.width, replayContainerRect.height );
	replayContainer.innerHTML = "";
	replayContainer.appendChild( renderer.domElement );

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var greenMaterial = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
	var blueMaterial = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
	cube = new THREE.Mesh( geometry, blueMaterial );
	var box = new THREE.BoxGeometry( 20, 1, 20 );
	var map = new THREE.Mesh( box, greenMaterial );

	scene.add( cube );
	scene.add( map );
	map.position.y = -5;

	light = new THREE.PointLight( 0xF0FF00, 1, 200, 2 );
	ambientlight = new THREE.AmbientLight( 0x202020 );
	scene.add(light);
	light.position.set(-3,2,0);
	scene.add(ambientlight);

	camera.position.set(0, 0, 5);
	camera.lookAt(scene.position);

	window.addEventListener( 'resize', onWindowResize, false );

	animate();
}

function addObject(position, object, texture) {

}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	/* Animations go here
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;*/

	renderer.render( scene, camera );
}

function onWindowResize( event ) {

    camera.aspect = replayContainerRect.width / replayContainerRect.height;

    // adjust the FOV
    //camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( window.innerHeight / windowHeight ) );

    camera.updateProjectionMatrix();
    camera.lookAt( scene.position );

    renderer.setSize( replayContainerRect.width, replayContainerRect.height );
    renderer.render( scene, camera );

}
