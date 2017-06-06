var scene, camera, renderer, replayContainer, replayContainerRect;
var mixer;
var goRigh, goLeft;

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

	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.shadowMap.enabled = true;
	renderer.setSize( replayContainerRect.width, replayContainerRect.height );
	replayContainer.innerHTML = "";
	replayContainer.appendChild( renderer.domElement );
	controls = new THREE.OrbitControls( camera, renderer.domElement );

	var box = new THREE.BoxGeometry( 1, 1, 1 );
	var stick = new THREE.BoxGeometry( 1, 1.5, 1 );
	var plane = new THREE.BoxGeometry( 1, 0.1, 1 );
	var ball = new THREE.SphereGeometry(0.5, 32, 32);
	var greenMaterial = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
	var blueMaterial = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
	var orangeMaterial = new THREE.MeshPhongMaterial( { color: 0xaa5522 } );

	robot = addObject(stick, blueMaterial, { x: 0, y: 0.20, z:0 });
	//head = addObject(ball, blueMaterial, { x: 0, y: 1, z:0 })
	tile1 = addObject(plane, greenMaterial, { x: 1.1, y: -0.5, z:0 });
	tile2 = addObject(plane, orangeMaterial, { x: -1.1, y: -0.5, z:0 });

	light = new THREE.PointLight( 0xF0FF00, 1, 400, 2 );
	ambientlight = new THREE.AmbientLight( 0x202020 );
	scene.add(light);
	light.position.set(-3,2,0);
	scene.add(ambientlight);

	camera.position.set(0, 0, 3);
	camera.lookAt(scene.position);

	clock = new THREE.Clock();

	goRight = new THREE.AnimationClip( null, 1, [ new THREE.NumberKeyframeTrack( ".position[x]", [ 0, 0.25, 0.5 ], [ 0, 0.5, 0 ] ) ] );
	goLeft = new THREE.AnimationClip( null, 1, [ new THREE.NumberKeyframeTrack( ".position[x]", [ 0, 0.25, 0.5 ], [ 0, -0.5, 0 ] ) ] );

	window.addEventListener( 'resize', onWindowResize, false );

	mixer = new THREE.AnimationMixer( robot );

	document.getElementById("btn1").addEventListener("click", function() { move("left"); });
	document.getElementById("btn2").addEventListener("click", function() { move("right"); });

	animate();
}

function addObject(shape, material, position, rotation) {
	if(position === undefined) {
		position = { x: 0, y: 0, z:0 };
	}
	if(rotation === undefined) {
		rotation = { x: 0, y: 0, z:0 };
	}

	var object = new THREE.Mesh( shape, material );

	scene.add(object);
	object.position.set(position.x, position.y, position.z);
	object.rotation.set(rotation.x, rotation.y, rotation.z);

	return object;
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	/* Animations go here
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;*/
	mixer.update( clock.getDelta() );

	renderer.render( scene, camera );
}

function move(param) {
	switch (param) {
		case "left":
			var action = mixer.clipAction( goLeft );
			action.reset();
			action.setLoop(THREE.LoopOnce);
			action.play();
			break;
		case "right":
			var action = mixer.clipAction( goRight );
			action.reset();
			action.setLoop(THREE.LoopOnce);
			action.play();
			break;
	}
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
