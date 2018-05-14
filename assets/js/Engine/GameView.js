/************************************************************************************
* Projet : Carom
* Cours  : B63 Programmation Web Avancée 
* Auteur : Kevin Mwanangwa
* Fichier: GameView.js 
************************************************************************************/
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

	/*******************************************************************************
    * Initialise la scene de base
    *******************************************************************************/
	buildScene(){	
		// Creer une scene vide
		this.scene = new THREE.Scene();				
		let sceneWidth = document.getElementById("carom-container").offsetWidth;
		let sceneHeight = document.getElementById("carom-container").offsetHeight-document.getElementById("footer").offsetHeight-2;				
		document.getElementById("carom-container").style.position="relative";
		
		// Init le renderer 
		this.renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true	});	
		this.renderer.setClearColor("#fff", 0);
		this.renderer.setSize(sceneWidth, sceneHeight);	
		this.renderer.shadowMap.enabled = true;	
		this.renderer.domElement.className = "grabbable"
		document.getElementById("carom-container").appendChild( this.renderer.domElement );

		//Init Camera et lumieres
		this.initCamera();
		this.initLights();		
	}

	/*******************************************************************************
    * Initialises les modeles 3D du modele
    *******************************************************************************/
	initGameObjets(){
		let modele = this.controller.modele;
		//Init les objets
		this.scene.add(modele.table.model);
		this.scene.add(modele.environment.model)
		this.scene.add(modele.board.model)
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

	/*******************************************************************************
    * Initialise la camera
    *******************************************************************************/
	initCamera(){
		//Camera
		this.camera = new THREE.PerspectiveCamera( 75, screen.width / screen.height  , 0.5, 400 );    
		this.camera.position.x = 0;
		this.camera.position.y = 15;
		this.camera.position.z = 55;			
		this.camera.lookAt(this.scene.position);  		
		
		//Controles
		this.cameraControls = new OrbitControls( this.camera, this.renderer.domElement );
		//Empeche d'aller trop bas
		this.cameraControls.maxPolarAngle = Math.PI/2.8;

		//Empeche de zoom top pres et trop loin
		this.cameraControls.minDistance = 25;
		this.cameraControls.maxDistance = 70;		

		this.cameraControls.autoRotate = true;
		this.cameraControls.autoRotateSpeed = 1.5;
		this.cameraControls.enableZoom = true;
		this.cameraControls.enablePan = false;		
	}

	/*******************************************************************************
    * Initialise les lumieres
    *******************************************************************************/
	initLights(){
		//Lumiere ambiante
		this.scene.add(new THREE.AmbientLight( 0xFFFFFF, 0.75));

		//Lumieres en haut de la table
		this.spotLight = new THREE.SpotLight( 0xffffff, 1.75 );
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

		//Lumiere qui pointe vers le joueur actuel
		this.spotLight2 = new THREE.SpotLight( 0xFFFFFF, 2 );
			this.spotLight2.position.set( 0, 70, 0);
			this.spotLight2.angle = Math.PI/3;
			this.spotLight2.penumbra = 0.2;
			this.spotLight2.decay = 0.1;
			this.spotLight2.distance = 280;
			this.spotLight2.castShadow = true;
			this.spotLight2.shadow.mapSize.width = 2048;
			this.spotLight2.shadow.mapSize.height = 2048;
			this.spotLight2.shadow.camera.near = 10;
			this.spotLight2.shadow.camera.far = 200;
			this.target = new THREE.Object3D()	
			this.target.position.set(0,0,-220);	
			this.scene.add(this.target);		
			this.spotLight2.target = this.target;				
		this.scene.add( this.spotLight2 );								
	}

	/*******************************************************************************
    * Transition LERP vers la cible en parametre
    *******************************************************************************/
	changeCameraFocus(obj){
		this.cameraControls.autoRotate = false;		
		let currentFocus = this.cameraControls.target.clone();		
		let targetFocus = obj.model.position.clone();
		let cameraPos = this.camera.position.clone();
		let cameraTarget = cameraPos.sub(targetFocus);		
		cameraTarget.x *= 0.65;
		cameraTarget.y = 0; //Orbit control va limiter le zoom
		cameraTarget.z *= 0.65;
		
		
					
		let tick = 0;
		let animation = setInterval(()=>{		
			tick+=1;

			//Interpoler le focus actuel en direction du focus cible
			currentFocus.lerp(targetFocus, 0.05);			
			this.cameraControls.target = currentFocus;			
			
			//Zoom in
			this.camera.position.lerp(cameraTarget,0.05);

			if(tick ==80){
				this.cameraControls.target = obj.model.position;
				window.clearInterval(animation);
			}
		},17)		
	}

	/*******************************************************************************
    * Reset la camera, centre au millieu de la scene
    *******************************************************************************/
	resetCameraFocus(){
		this.cameraControls.autoRotate = true;
		let currentFocus = this.cameraControls.target.clone();		
		let targetFocus = this.scene.position;
		let cameraTarget = this.camera.position.clone();
		cameraTarget.x *= 2;
		cameraTarget.y *= 8;
		cameraTarget.z *= 2;
				
		let tick = 0;
		let animation = setInterval(()=>{		
			tick+=1;

			// Interpolate currentFocus towards targetFocus
			currentFocus.lerp(targetFocus, 0.05);			
			this.cameraControls.target = currentFocus;

			//Zoom out
			this.camera.position.lerp(cameraTarget,0.005);
					
			if(tick ==80){
				this.cameraControls.target = this.scene.position;
				window.clearInterval(animation);
			}
		},17)		
	}

	/*******************************************************************************
    * Sequence lorsque le joueur actuel vient de faire un carom
    *******************************************************************************/
	hasScored(){
		this.spotLight2.color.set(0x00FF00)
		this.spotLight2.intensity = 4;
		setTimeout(()=>{
			this.spotLight2.color.set(0xFFFFFF)
			this.spotLight2.intensity = 2;
		},2000)
	}

	/*******************************************************************************
    * Sequence lorsque le joueur actuel a raté son tour
    *******************************************************************************/
	hasNotScored(){
		this.spotLight2.color.set(0xFF0000)
		this.spotLight2.intensity = 4;
		setTimeout(()=>{
			this.spotLight2.color.set(0xFFFFFF)
			this.spotLight2.intensity = 2;
		},2000)
	}

	/*******************************************************************************
    * Sequence qui change l'eclairage du joueur actuel
    *******************************************************************************/
	rotateSpotLight(){
		let delta = (this.target.position.z)/100
		let tick = 0;
		let animation = setInterval(()=>{			
			tick+=1;
			this.target.translateZ(-delta*4);			
			if(tick == 50){
				window.clearInterval(animation);
			}
		},25)	
	}
	
	/*******************************************************************************
    * Boucle de rendering
    *******************************************************************************/
	renderScene(){		
		this.cameraControls.update();		
		this.renderer.render( this.scene, this.camera);
	}	
}