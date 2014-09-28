require.config({
  baseUrl: 'scripts',
  paths: {
    'three': 'vendor/three',
    'OrbitControls': 'vendor/OrbitControls',
    'Stats': 'vendor/Stats',
    'underscore': 'vendor/underscore',
    'dat.gui.min': 'vendor/dat.gui.min'
  },
  shim: {
    'three': { exports: 'THREE' },
    'OrbitControls': { deps: [ 'three' ] },
    'dat.gui.min': { exports: 'dat.GUI' }
  }
});



/*
requirejs.config({
  baseUrl: 'scripts/vendor',
  paths: {
    app: '../scripts'
  }
});

requirejs(['Stats', 'Detector', 'OrbitControls', 'three'],
	function (stats, Detector, OrbitControls, three) {
	});
*/

// MAIN
//<div id="ThreeJS" style="position: absolute; left:0px; top:0px"></div>

var container, scene, camera, renderer, controls, stats;


// custom global variables
var sphere;
var parameters;
var gui;

init();
//animate();

// FUNCTIONS 		
function init() 
{
	// SCENE
	require(['three','OrbitControls','Stats','underscore'], function() 
	{
		var scene = new THREE.Scene();
		//scene = new THREE.Scene();
		// CAMERA
		var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
		var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
		camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		scene.add(camera);
		camera.position.set(0,150,400);
		camera.lookAt(scene.position);	
	// RENDERER
	//<div id="ThreeJS" style="position: absolute; left:0px; top:0px"></div>
		renderer = new THREE.WebGLRenderer( {antialias:true} );
		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		//container.domElement.position = 'absolute';
		//container.domElement.left = '0px';
		//container.domElement.top = '0px';
		container = document.getElementById( "ThreeJS" );
		container.appendChild( renderer.domElement ); //add a new child node
	// CONTROLS
		var controls = new THREE.OrbitControls( camera, renderer.domElement ); //entra objeto e dom.element
	// STATS
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '0px';
		stats.domElement.style.zIndex = 100;
		container.appendChild( stats.domElement );
	//Sphere
		var sphereGeometry = new THREE.SphereGeometry( 50, 50, 50 );
		var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
		sphere = new THREE.Mesh( sphereGeometry , sphereMaterial );
		scene.add(sphere);
	});
	
	require(['dat.gui.min'], function(GUI) 
	{
		gui = new dat.GUI();
	
		parameters = 
		{
			radius:50,
			x:aleatorio(-100, 100) , y:aleatorio(-100, 100), z:aleatorio(-100, 100),
			visible: false,	
			rand: function() { randSphere() },
			creat: function() { creatSphere() },
			reset: function() { resetAll() }
		};

		var sphereRadius = gui.add(parameters,'radius').min(0).max(300).step(1).listen();
		sphereRadius.onChange(function(value)
		{	sphere.radius = value;		});

		var sphereVisible = gui.add( parameters, 'visible' ).name('Visible?').listen();
		sphereVisible.onChange(function(value) 
		{   sphere.visible = value;  	});


		gui.add( parameters, 'rand' ).name("rand Sphere");

		gui.add( parameters, 'creat' ).name("creat Sphere");

		gui.add( parameters, 'reset' ).name("reset");
	
		gui.open();
		updateSphere();
	});

	function aleatorio(min, max) 
	{
		return Math.random() * (max - min) + min;
	}

	function randSphere()
	{
		parameters.x = aleatorio(-200, 200);
		parameters.y = aleatorio(-200, 200);
		parameters.z = aleatorio(-200, 200);
		updateSphere();
	}

	function creatSphere()
	{
		sphere_Geometry = new THREE.SphereGeometry( parameters.radius, 50, 50 );
		sphere_Material = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
		sphere_new = new THREE.Mesh( sphere_Geometry , sphere_Material );
		sphere_new.position.x = parameters.x;
		sphere_new.position.y = parameters.y;
		sphere_new.position.z = parameters.z;
		scene.add(sphere_new);
	}

	function resetAll()
	{
		var objsToRemove = _.rest(scene.children, 1);
	    _.each(objsToRemove, function( sphere, sphere_new ) {
    	      scene.remove(sphere, sphere_new);
    	});
	    var sphereGeometry = new THREE.SphereGeometry( 50, 50, 50 );
		var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
		sphere = new THREE.Mesh( sphereGeometry , sphereMaterial );
		scene.add(sphere);
	}

	function updateSphere()
	{
		//sphereGeometry = new THREE.SphereGeometry( parameters.radius, 50, 50 )
		sphere.position.x = parameters.x;
		sphere.position.y = parameters.y;
		sphere.position.z = parameters.z;
		sphere.visible = parameters.visible;
	}


	function animate() 
	{
   		requestAnimationFrame( animate );
		render();		
		update();
	}

	function update()
	{	
		controls.update();
		stats.update();
	}
	function render() 
	{
		renderer.render( scene, camera );
	}
}