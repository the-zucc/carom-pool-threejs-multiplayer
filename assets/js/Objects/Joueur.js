import Boule from '../Objects/Boule';
import Queue from '../Objects/Queue';
import * as THREE from 'three'

export default class Joueur{
	constructor(nom,score,couleur,position,isActive,c){
		this.controlleur = c;
		this.nom = nom;
		this.score = score;
		this.isActive = isActive;
		this.bandesTouchees = [];
		this.boulesTouchees = [];	
		this.couleur = couleur;	
		this.boule = new Boule(position[0],position[1],this,this.couleur);
		this.queue = new Queue(-10 , 1.6 , 0 , this);
		this.createModel(position[1])		
	}

	createModel(pos){				
		let loader = new THREE.FontLoader();
		let material = new THREE.MeshPhongMaterial({ color:this.couleur ,  transparent: false,  opacity: 1  , shininess: 100});
		let geometry;
		this.model = new THREE.Object3D(0,0,0);
		loader.load( "https://threejs.org/examples/fonts/droid/droid_serif_regular.typeface.json", ( font )=> {
		 	geometry = new THREE.TextGeometry( this.nom, {
				font: font,
				size: 10,
				height: 1,
				curveSegments: 12				
			} );

			let name = new THREE.Mesh(geometry,material)
			name.position.set(-40,10,-60);
			name.castShadow = true;	
			this.model.add(name);	

			if(pos != 0){
				this.model.rotation.y = Math.PI;
			}			
		} );
	}

	update(){
		let cueAngle = this.controlleur.getCueAngle();	
		let barRotation = this.controlleur.getPowerBarAngle();
		let percentage = this.controlleur.getForceInput();
		let justShot = this.controlleur.justShot();
		this.queue.update(cueAngle,barRotation,percentage,justShot);
	}

	hasHitEdge(edge){
		let name = edge.model.name;
		//Si bord pas encore touche, inserer return false
		if (this.bandesTouchees.filter(function(e) { return e.name === name; }).length == 0) {	
			this.bandesTouchees.push(edge)
			return false;
		}
		else{
			return true;
		}
	}

	hasHitBall(ball){
		let name = ball.model.name;
		//Si bord pas encore touche, inserer return false
		if (this.boulesTouchees.filter(function(e) { return e.name === name; }).length == 0) {	
			this.boulesTouchees.push(ball)
			return false;
		}
		else{
			return true;
		}
	}
}