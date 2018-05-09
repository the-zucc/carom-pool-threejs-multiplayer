/************************************************************************************
* Projet : Carom
* Cours  : B63 Programmation Web Avancée 
* Auteur : Kevin Mwanangwa
* Fichier: Queue.js 
************************************************************************************/
import * as THREE from 'three'

export default class Queue{
	constructor(x,y,z,prop,parent){			
		this.proprietaire = prop;	
		this.isActive = false;

		this.pivot = new THREE.Object3D();
		this.pivot.position.copy(this.proprietaire.boule.model.position);
		this.pivot.position.y+=81;

		this.rayCaster= new THREE.Raycaster();
		this.rayCaster.near = this.proprietaire.boule.radius * 1.1; //Pour eviter que le rayCaster return la boule actuelle
		this.rayCaster.far = 100;
		this.direction = new THREE.Vector3();		
			
		this.baseDistance = 11+(this.proprietaire.boule.radius);	
		this.powerBarLength = 8;		
		this.force = 0.001; //Three JS doesn't like null lengths
		this.maxForce = 5;	

		this.createModel(prop.nom);
		
		//Si joueur actif, descendre;
		if(this.proprietaire.isActive){
			this.fadeDown();
		}
	}	

	/*******************************************************************************
    * Creation du modele 3D
    *******************************************************************************/
	createModel(name){
		this.model = new THREE.Object3D();
		
		this.pivot.add(this.model);
		this.model.name = name;	
		this.model.position.set(0,this.baseDistance,0);			
		this.pivot.rotateZ(Math.PI/2.1)	

		//Corps principal		
		let texture = new THREE.TextureLoader().load( require('assets/images/textures/TEST2.jpg') );	
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		let geometry = new THREE.CylinderBufferGeometry(0.35,0.2,20, 15 , 15);
		let material = new THREE.MeshPhongMaterial( {map:texture});
		let cue = new THREE.Mesh( geometry, material );
		cue.castShadow = true;
		cue.recieveShadow = true;	
		cue.position.set(0,0,0)
		this.model.add(cue);
		
		//Embout avant
		let geometry2 = new THREE.CylinderBufferGeometry(0.2,0.2,0.75, 15 , 15);
		let material2 = new THREE.MeshPhongMaterial({ color: this.proprietaire.couleur ,  transparent: false,  opacity: 1  });		
		let bout = new THREE.Mesh( geometry2, material2 );
		bout.position.set(0,-10.25,0);
		bout.castShadow = true;
		bout.recieveShadow = true;	
		cue.add(bout)

		//Embout Arriere
		let manche = new THREE.TextureLoader().load( require('assets/images/textures/MancheQueue.png') );	
		manche.wrapS = THREE.RepeatWrapping;
		manche.wrapT = THREE.RepeatWrapping;	
		let geometry3 = new THREE.CylinderBufferGeometry(0.35,0.35,4.5, 15 , 15);		
		let material3 = new THREE.MeshPhongMaterial({map:manche});	
		let bout2 = new THREE.Mesh( geometry3, material3 );	
		bout2.position.set(0, 12.25 ,0);
		bout2.castShadow = true;
		bout2.recieveShadow = true;	
		cue.add(bout2);

		//Embout rond final
		let geometry4 = new THREE.SphereBufferGeometry(0.3, 30,30);		
		let material4 = new THREE.MeshPhongMaterial({ color: this.proprietaire.couleur,  transparent: false,  opacity: 1  });	
		let bout3 = new THREE.Mesh( geometry4, material4 );	
		bout3.position.set(0, 14.50 ,0);
		bout3.castShadow = true;
		bout3.recieveShadow = true;	
		cue.add(bout3);		

		//Jauge de force
		this.baseThickness = 0.2;
		let geometry5 = new THREE.CylinderBufferGeometry(0.35,0.35,this.baseThickness, 15 , 15);	
		let materialBase = new THREE.MeshPhongMaterial({ color: 0x000000,  transparent: true,  opacity: 0.6  });
		let base = new THREE.Mesh( geometry5, materialBase );	
		base.position.set(0, 2 ,1.5);		
		base.castShadow = true;
		this.pivot.add(base)	

		let baseTop = new THREE.Mesh( geometry5, materialBase );	
		baseTop.position.set(0, this.powerBarLength+0.1 ,0);		
		baseTop.castShadow = true;
		base.add(baseTop)		

		let geometry6 = new THREE.CylinderBufferGeometry(0.25,0.25,this.force, 15 , 15);	
		this.barMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000,  transparent: true,  opacity: 0.8  });
		this.powerBar = new THREE.Mesh( geometry6, this.barMaterial );	
		this.powerBar.position.set(0,(this.force/2)+this.baseThickness/2,0);		
		this.powerBar.castShadow = true;
		base.add(this.powerBar);		
	}

	/*******************************************************************************
    * Update la position de la queue
    *******************************************************************************/
	update(cueAngle,barAngle,percentage,justShot){		
		//Update les angles		
		this.pivot.rotation.y = cueAngle;
		this.powerBar.parent.rotation.z = barAngle;
		
		//Update la powerBar
		this.powerBar.geometry.dispose();
		let powerBarPercentage = this.powerBarLength*percentage;
		this.force = this.maxForce*percentage;
		let newGeo = new THREE.CylinderBufferGeometry(0.25,0.25,powerBarPercentage, 15 , 15);
		this.powerBar.geometry = newGeo;
		this.powerBar.position.set(0,(this.force/2)+this.baseThickness/2,0);		
		
		//Update le raycaster pour l'helper de direction
		this.direction.set(this.force,0,0);
		this.direction.applyAxisAngle(new THREE.Vector3(0,1,0),cueAngle);
		this.rayCaster.set(this.pivot.position, this.direction.clone().normalize())
		
		//Verifie quel objet est retourné par le rayCaster
		if(this.isActive){
			let intersectWith = this.rayCaster.intersectObjects(this.proprietaire.controlleur.modele.meshList)[0];			
			if(intersectWith != undefined){				
				let distIntersection = intersectWith.distance;
				this.helper.setLength(distIntersection)				
			}
		}
		//Update la position
		this.model.position.y = this.baseDistance+(this.force*1.2)

		//Verifie si le joueur a tiré et que la force n'est pas nulle
		if(justShot && percentage != 0.001 && this.isActive)
			this.hitBall();		
	}

	/*******************************************************************************
    * Frapper la boule
    *******************************************************************************/
	hitBall(){			
		console.log("HITBALL")		
		//Commence le tour actuel
		this.proprietaire.controlleur.startProccessingTurn();		
		//Appliquer la force sur l'axe
			
		this.proprietaire.boule.velocity = this.direction.clone();	

		//Reset
		this.force = 0.001;
		this.isActive = false;
		
		setTimeout(()=>{
			this.fadeUp();
		},100);
	}		
	
	/*******************************************************************************
    * Cacher la queue
    *******************************************************************************/
	fadeUp(){
		let tick = 0;		
		this.helper = new THREE.Object3D();
		let animationUp = setInterval(()=>{			
			tick+=1;
			this.pivot.position.y += 0.45;			
			if(tick == 180){				
				window.clearInterval(animationUp);				
			}
		},17)	
	}

	/*******************************************************************************
    * Afficher la queue
    *******************************************************************************/
	fadeDown(){				
		let tick = 0;
		let animationDown = setInterval(()=>{			
			tick+=1;			
			this.pivot.position.y -= 0.45;
			if(tick == 180){
				this.helper = new THREE.ArrowHelper(new THREE.Vector3(0,-1,0),new THREE.Vector3(0,0,0),20);				
				this.pivot.add(this.helper)
				this.helper.rotateZ(Math.PI/4)	
				console.log(this.helper)
				this.isActive = true;
				window.clearInterval(animationDown);
			}
		},17)		
	}
}