import * as THREE from 'three'

export default class Queue{
	constructor(x,y,z,prop,parent){
		this.x = x;
		this.y = y;
		this.z = z;
		this.parent = prop.boule.model;
		this.proprietaire = prop;
		this.force = 0.1;
		this.justHit = false;
		this.isCharging = false;
		
		this.createModel(prop.nom);		
	}	

	createModel(name){
		let geometry = new THREE.CylinderBufferGeometry(0.35,0.2,20, 10 , 10);
		let material = new THREE.MeshPhongMaterial({ color: 0x000000 ,  transparent: false,  opacity: 1  });
		let geometry2 = new THREE.CylinderBufferGeometry(0.2,0.2,0.75, 10 , 10);
		let material2 = new THREE.MeshPhongMaterial({ color: this.proprietaire.couleur ,  transparent: false,  opacity: 1  });
		this.model = new THREE.Mesh( geometry, material );
		let bout = new THREE.Mesh( geometry2, material2 );
		bout.position.set(0,-10.25,0);
		this.model.name = name;	
		this.model.castShadow = true;
		this.model.recieveShadow = true;
		this.model.add(bout)
		this.model.rotateZ(Math.PI/2)
		if(this.proprietaire.isActive){	
			this.parent.add(this.model);
			this.model.position.set(this.x-3,this.y,this.z);					
		}
	}

	update(vue,justHit,isholding){		
		// METHODE TEMPORAIRE POUR LA PHASE DE TEST
		let angle = vue.cameraControls.getAzimuthalAngle() + (Math.PI/2);
		if(isholding){
			if(this.force < 5){
				this.force += 0.1;
				this.model.translateY(0.1);
			}
		}
		if(!justHit ){
			vue.cameraControls.autoRotate = false;
			vue.cameraControls.target = this.parent.position
			this.parent.rotation.y = angle;
		}
		else{
			this.justHit = true;	
			vue.cameraControls.target = vue.scene.position;
			vue.cameraControls.autoRotate = true;	
			this.hitBall(angle);			
		}		
	}

	hitBall(angle){
		// METHODE TEMPORAIRE POUR LA PHASE DE TEST
		if(this.justHit){
			this.justHit = false;
			this.proprietaire.isActive = false;
			console.log("HITBALL")
			
			let tmpVect = new THREE.Vector3(this.force,0,0);
			tmpVect.applyAxisAngle(new THREE.Vector3(0,1,0),angle);

			this.model.translateY(this.force-0.1);
			setTimeout(()=>{
				this.parent.remove(this.model);							
			},38);

			let tick = 1;
			let animationUp = setInterval(()=>{			
				tick+=1;
				this.model.translateX(0.15)			
				if(tick == 300){
					window.clearInterval(animationUp);
				}
			})					

			this.proprietaire.boule.velocity = tmpVect;
			setTimeout(()=>{
				this.resetQueue();
			},5000);
		}		
	}

	resetQueue(){
		this.parent.add(this.model);
		this.force = 0.1;
		this.model.position.x = this.x-3;
		this.proprietaire.isActive = true;

		let tick = 1;
		let animationUp = setInterval(()=>{			
			tick+=1;
			this.model.translateX(-0.15)
			if(tick == 300){
				window.clearInterval(animationUp);
			}
		})		
	}
}