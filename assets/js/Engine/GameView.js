import * as THREE from 'three';
let OrbitControls = require('three-orbit-controls')(THREE);

export default class GameView{
	constructor(controller){
		this.controller = controller;
		this.scene = null; 
		this.camera = null; 
		this.renderer = null; 
		this.table = null;

		this.buildScene();			
	}

/********************************************************************************* 
*   Init WebGL Scene
*************************************************************************************/
	buildScene(){	
		// Creer une scene vide
		this.scene = new THREE.Scene();				
		let sceneWidth = document.getElementById("carom-container").offsetWidth;
		let sceneHeight = document.getElementById("carom-container").offsetHeight;		
		
		// Init le renderer 
		this.renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true	});	
		this.renderer.setClearColor("#fff", 0);
		this.renderer.setSize(sceneWidth, sceneHeight);	
		this.renderer.shadowMap.enabled = true;	
		document.getElementById("carom-container").appendChild( this.renderer.domElement );

		//Init Camera et lumieres
		this.initCamera();
		this.initLights();		
	}

	initGameObjets(){
		let modele = this.controller.modele;
		//Init les objets
		this.scene.add(modele.table.model);
		this.scene.add(modele.environment.model)
		for (let i = 0; i < modele.boules.length; i++) {
			const element = modele.boules[i].model;
			this.scene.add(element);			
		}	
		for (let i = 0; i < modele.joueurs.length; i++) {
			const element = modele.joueurs[i];
			this.scene.add(element.model);
			this.scene.add(element.queue.pivot);			
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
		//Empeche d'aller trop bas
		this.cameraControls.maxPolarAngle = Math.PI/2.8;

		//Empeche de zoom top pres et trop loin
		this.cameraControls.minDistance = 25;
		this.cameraControls.maxDistance = 70;

		this.cameraControls.autoRotate = true;
		this.cameraControls.autoRotateSpeed = 2;
		this.cameraControls.enableZoom = true;
		this.cameraControls.enablePan = false;		
	}

	initLights(){
		//Lumiere ambiante
		this.scene.add(new THREE.AmbientLight( 0xFFFFFF, 1.25));

		//Lumieres en haut de la table
		this.spotLight = new THREE.SpotLight( 0xffffff, 0.5 );
				this.spotLight.position.set( 0, 50, 0 );
				this.spotLight.angle = Math.PI/4.2;
				this.spotLight.penumbra = 0.2;
				this.spotLight.decay = 0.7;
				this.spotLight.distance = 80;
				this.spotLight.castShadow = true;
				this.spotLight.shadow.mapSize.width = 2048;
				this.spotLight.shadow.mapSize.height = 2048;
				this.spotLight.shadow.camera.near = 10;
				this.spotLight.shadow.camera.far = 100;			
		this.scene.add( this.spotLight );	

		this.spotLight2 = new THREE.SpotLight( 0xFFFFFF, 10 );
				this.spotLight2.position.set( 0, 50, 0);
				this.spotLight2.angle = Math.PI/4.6;
				this.spotLight2.penumbra = 0.2;
				this.spotLight2.decay = 0.1;
				this.spotLight2.distance = 200;
				this.spotLight2.castShadow = true;
				this.spotLight2.shadow.mapSize.width = 2048;
				this.spotLight2.shadow.mapSize.height = 2048;
				this.spotLight2.shadow.camera.near = 10;
				this.spotLight2.shadow.camera.far = 200;
				let targetTMP = new THREE.Object3D()	
				targetTMP.position.set(0,0,-100);	
				this.scene.add(targetTMP);		
				this.spotLight2.target = targetTMP;
				console.log(this.spotLight2)
		this.scene.add( this.spotLight2 );								
	}

	changeCameraFocus(obj){
		//Maybe add smooth animation
		this.cameraControls.autoRotate = false;
		this.cameraControls.target=obj.position;		
	}

	resetCameraFocus(){
		this.cameraControls.autoRotate = true;
	}
	
	renderScene(){
		this.cameraControls.update();		
		this.renderer.render( this.scene, this.camera);
	}

	
}