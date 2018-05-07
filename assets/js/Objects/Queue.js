import * as THREE from 'three'

export default class Queue{
	constructor(x,y,z,prop,parent){			
		this.proprietaire = prop;	
		this.pivot = new THREE.Object3D();
		this.pivot.position.copy(this.proprietaire.boule.model.position);
		
		//Si joueur non-actif, fadeUpCue;
		if(!this.proprietaire.isActive){
			this.fadeUp();
		}
			
		this.baseDistance = 11.65;	
		this.powerBarLength = 6;		
		this.force = 0.01; //Three JS doesn't like null lengths
		this.isCharging = false;		

		this.createModel(prop.nom);	

	}	

	createModel(name){
		this.model = new THREE.Object3D();
		this.pivot.add(this.model);
		this.model.name = name;	
		this.model.position.set(0,this.baseDistance,0);			
		this.pivot.rotateZ(Math.PI/2.1)

		//Corps principal
		let image = require('assets/images/textures/TEST2.jpg');	
		let texture = new THREE.TextureLoader().load( image);	
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
		let geometry3 = new THREE.CylinderBufferGeometry(0.35,0.35,4.5, 15 , 15);		
		let material3 = new THREE.MeshPhongMaterial({ color: 0x1a1a1a ,  transparent: false,  opacity: 1  });	
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

		this.baseThickness = 0.2;
		let geometry5 = new THREE.CylinderBufferGeometry(0.35,0.35,this.baseThickness, 15 , 15);	
		let materialBase = new THREE.MeshPhongMaterial({ color: 0x000000,  transparent: true,  opacity: 0.5  });
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

	update(cueAngle,barAngle,percentage,justShot){		
		//Update angles		
		this.pivot.rotation.y = cueAngle;
		this.powerBar.parent.rotation.z = barAngle;

		//Update powerBar
		this.powerBar.geometry.dispose();
		this.force = this.powerBarLength*percentage;
		let newGeo = new THREE.CylinderBufferGeometry(0.25,0.25,this.force, 15 , 15);
		this.powerBar.geometry = newGeo;
		this.powerBar.position.set(0,(this.force/2)+this.baseThickness/2,0);		
		
		//Update position
		this.model.position.y = this.baseDistance+(this.force*1.2)

		//Verify shot
		if(justShot)
			this.hitBall(cueAngle);		
	}

	hitBall(angle){					
		//Commence le tour actuel
		this.proprietaire.controlleur.startProccessingTurn();			
		console.log(this.force)
		//Vecteur a donner a la boule
		let tmpVect = new THREE.Vector3(this.force,0,0);
		//Appliquer la force sur l'axe
		tmpVect.applyAxisAngle(new THREE.Vector3(0,1,0),angle);	
		this.proprietaire.boule.velocity = tmpVect;	
		
		setTimeout(()=>{
			this.fadeUp();
		},500);
	}		
	

	fadeUp(){
		let tick = 0;
		let animationUp = setInterval(()=>{			
			tick+=1;
			this.pivot.position.y += 0.25;			
			if(tick == 300){
				window.clearInterval(animationUp);
			}
		})	
	}

	fadeDown(){				
		let tick = 0;
		let animationDown = setInterval(()=>{			
			tick+=1;
			this.pivot.position.y -= 0.25;
			if(tick == 2){
				window.clearInterval(animationDown);
			}
		})		
	}
}