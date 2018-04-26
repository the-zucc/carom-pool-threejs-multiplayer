import * as THREE from 'three';
let OrbitControls = require('three-orbit-controls')(THREE);

export default class GameView{
	constructor(model){
		this.scene = null; //Change
		this.camera = null; //Change
		this.renderer = null; //Change
		this.table = null;
		this.buildScene(model);			
	}

/********************************************************************************* 
*   Init WebGL Scene
*************************************************************************************/
	buildScene(modele){	
		// Creer une scene vide
		this.scene = new THREE.Scene();		
		this.scene.add(new THREE.AxesHelper(500))
		let sceneWidth = document.getElementById("carom-container").offsetWidth;
		let sceneHeight = document.getElementById("carom-container").offsetHeight;		
		
		// Init le renderer 
		this.renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true	});	
		this.renderer.setClearColor("#fff", 0);
		this.renderer.setSize(sceneWidth, sceneHeight);		
		document.getElementById("carom-container").appendChild( this.renderer.domElement );

		//Init Camera et lumieres
		this.initCamera();
		this.initLights();

		//Init les objets
		this.scene.add(modele.table.model)	
		for (let i = 0; i < modele.boules.length; i++) {
			const element = modele.boules[i].model;
			this.scene.add(element);			
		}	
	}

	initCamera(){
		//Camera
		this.camera = new THREE.PerspectiveCamera( 75, screen.width / screen.height  , 1, 10000 );    
		this.camera.position.x = 0;
		this.camera.position.y = 50;
		this.camera.position.z = 0;			
		this.camera.lookAt(this.scene.position);  		
		
		//Controles
		this.cameraControls = new OrbitControls( this.camera, this.renderer.domElement );
		this.cameraControls.autoRotate = true;
		this.cameraControls.autoRotateSpeed = 0.25;
		this.cameraControls.enableZoom = true;
		this.cameraControls.enablePan = false;
	}

	initLights(){
		//Lumiere ambiante
		this.scene.add(new THREE.AmbientLight( 0xffffff));

		//Lumieres en haut de la table
		let spotLight = new THREE.SpotLight( 0xffffff, 1 );
				spotLight.position.set( 20, 60, 0 );
				spotLight.angle = Math.PI / 8;
				spotLight.penumbra = 0.4;
				spotLight.decay = 0.5;
				spotLight.distance = 80;
				spotLight.castShadow = true;
				spotLight.shadow.mapSize.width = 512;
				spotLight.shadow.mapSize.height = 512;
				spotLight.shadow.camera.near = 1;
				spotLight.shadow.camera.far = 200;

				//Target
				let target1 = new THREE.Object3D();
				target1.position.set(20,0,0)
				this.scene.add(target1);
				spotLight.target = target1;	

		let spotLight2 = new THREE.SpotLight( 0xffffff, 1 );
				//Params
				spotLight2.position.set( -20, 60, 0 );
				spotLight2.angle = Math.PI / 8;
				spotLight2.penumbra = 0.4;
				spotLight2.decay = 0.5;
				spotLight2.distance = 80;
				spotLight2.castShadow = true;
				spotLight2.shadow.mapSize.width = 512;
				spotLight2.shadow.mapSize.height = 512;
				spotLight2.shadow.camera.near = 1;
				spotLight2.shadow.camera.far = 200;
				
				//Target
				let target2 = new THREE.Object3D();
				target2.position.set(-20,0,0)
				this.scene.add(target2);
				spotLight2.target = target2;
				
		this.scene.add( spotLight );		
		this.scene.add( spotLight2 );
		


	}
	
	renderScene(){
		this.cameraControls.update();		
		this.renderer.render( this.scene, this.camera);
	}
}