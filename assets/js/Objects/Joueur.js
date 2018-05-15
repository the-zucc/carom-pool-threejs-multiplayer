import Boule from '../Objects/Boule';
import Queue from '../Objects/Queue';
import * as THREE from 'three';

export default class Joueur{
	constructor(nom,score,couleur,position,isActive,c,txt){
		this.controlleur = c;
		this.nom = nom;		
		this.caroms = score;
		this.isActive = isActive;
		this.txt = txt;
		
		this.bandesTouchees = [];
		this.boulesTouchees = [];	
		this.couleur = couleur;	
		this.boule = new Boule(position[0],position[1],this,this.couleur);
		this.queue = new Queue(-10 , 1.6 , 0 , this);
		this.createModel(position[1])		
	}

	/*******************************************************************************
    * Initialisation du modele du joueur
    *******************************************************************************/
	createModel(pos){				
		let loader = new THREE.FontLoader();
		this.material = new THREE.MeshPhongMaterial({ color:this.couleur ,  transparent: false,  opacity: 1  , shininess: 100});
		let geometry,scoreText;
		this.model = new THREE.Object3D(0,0,0);
		loader.load( "https://threejs.org/examples/fonts/droid/droid_serif_regular.typeface.json", ( font )=> {
			this.font = font; 
			geometry = new THREE.TextGeometry( this.nom, {
				font: this.font,
				size: 10,
				height: 1,
				curveSegments: 12				
			} );

			scoreText = new THREE.TextGeometry( this.txt , {
				font: this.font,
				size: 5,
				height: 1,
				curveSegments: 12				
			} );

			this.nameModel = new THREE.Mesh(geometry,this.material)
			let score = new THREE.Mesh(scoreText,this.material)
			this.nameModel.position.set(-40,20,-60);
			score.position.set(0,15,0);
			score.castShadow = true;
			this.nameModel.castShadow = true;	
			this.nameModel.add(score)
			this.model.add(this.nameModel);	

			if(pos != 0){
				this.model.rotation.y = Math.PI;
			}	

			//QuiCK FIX pour afficher le scoreBoard
			if(pos == -4000){
				this.nameModel.position.set(-20,26,-120);
				this.model.rotation.y = Math.PI/2;
				
			}
			
			//Appel initial
			this.updateScoreModel();
		} );
	}

	/*******************************************************************************
    * Update le modele 3D du score
    *******************************************************************************/
	updateScoreModel(){
		let scoreGeo = new THREE.TextGeometry( this.caroms, {
			font: this.font,
			size: 5,
			height: 1,
			curveSegments: 12				
		} );
		//Creer le modele la premiere fois, update les fois d'apres
		if(this.scoreModel == undefined){
			this.scoreModel = new THREE.Mesh(scoreGeo,this.material)
			this.scoreModel.position.set(25,15,0);
			this.scoreModel.castShadow = true;
			this.nameModel.add(this.scoreModel)
		}
		else{
			this.scoreModel.geometry.dispose()
			this.scoreModel.geometry = scoreGeo;
		}
	}

	/*******************************************************************************
    * Update sa queue
    *******************************************************************************/
	update(){
		let cueAngle = this.controlleur.getCueAngle();	
		let barRotation = this.controlleur.getPowerBarAngle();
		let percentage = this.controlleur.getForceInput();
		let justShot = this.controlleur.justShot();
		this.queue.update(cueAngle,barRotation,percentage,justShot);
	}

	/*******************************************************************************
    * Ajouter une collision de bande
    *******************************************************************************/
	hasHitEdge(edge){		
		this.bandesTouchees.push(edge)		
	}	

	/*******************************************************************************
    * Ajouter une collision de balle
    *******************************************************************************/
	hasHitBall(ball){
		let name = ball.model.name;
		//Si balle pas encore touchee
		if (this.boulesTouchees.filter((e)=> {return e.model.name == name; }).length == 0) {			
			this.boulesTouchees.push(ball)
			return false;
		}
		else{
			return true;
		}
	}

	/*******************************************************************************
    * Reset
    *******************************************************************************/
	reset(){
		this.bandesTouchees = [];
		this.boulesTouchees = [];
		//Aligne la queue au dessus de la boule du joueur		
		this.queue.pivot.position.x = this.boule.model.position.x;
		this.queue.pivot.position.z = this.boule.model.position.z;
		
		//Animation
		this.queue.fadeDown();
	}
}