import Boule from '../Objects/Boule';
import CaromTable from '../Objects/Table';
import Joueur from'../Objects/Joueur';
import * as THREE from 'three';

export default class GameModel{
	constructor(controller,gamevariant,playerList){		
		this.controller = controller;
		this.vue = null;
		this.variant = gamevariant;
		this.joueurs = []
		this.boules = []
		
		this.initGame(playerList)	
		this.initCollisionBoxes();
	}	

	initGame(playerList){
		let bouleNeutre = 0xe31919;
		let nbBoulesNeutres = 1;

		//Init table et boule neutre
		this.table = new CaromTable(0,0,0);	
		this.boules.push(new Boule(25,0,"Neutre",bouleNeutre));		
				
		//Init players
		for(let i = 0; i<2; i++) {
			const actuel = playerList.joueurs[i];			
			let couleur = null;
			let position = null;

			if(i == 0){
				couleur = 0xe6ac00;
				position = [-20,0];
			}
			else{
				couleur = 0xffffcc;
				position = [-20,5];
			}

			this.joueurs.push(new Joueur(actuel.nom,actuel.score,couleur,position));
			this.boules.push(this.joueurs[i].boule)
		}

		
		/*  //-----BALLES ADDITIONNELLES POUR TEST DE COLLISIONS-----
		for(let i = 0; i < nbBoulesNeutres; i++){
			let x = Math.floor(Math.random()*20 -10);
			let z = Math.floor(Math.random()*40 -20);
			this.boules.push(new Boule(x,z,"1",bouleNeutre))
		}
		*/		
	}

	initCollisionBoxes(){
		//Liste qui contiendra tout les meshes pour le calcul des collision
		this.collidableMeshList = []

		//Les bords de la table
		this.collidableMeshList.push(this.table.bottomEdge.model)
		this.collidableMeshList.push(this.table.topEdge.model)
		this.collidableMeshList.push(this.table.leftEdge.model)
		this.collidableMeshList.push(this.table.rightEdge.model)		
		
		//Les boules
		for (let i = 0; i < this.boules.length; i++) {
			const element = this.boules[i];
			this.collidableMeshList.push(element.model)			
		}		
	}

	update(){		
		//Statio
		let stationary = new THREE.Vector3(0,0,0);

		//Update le mouvement de chaque boule
		for (let i = 0; i < this.boules.length; i++) {
			const currentBall = this.boules[i];			
			//Si la boule n'est pas stationaire
			if(!currentBall.velocity.equals(stationary)){
				//Calcule les collisions
				this.detectCollisions(currentBall);

				//Update la position celon les resultats			
				currentBall.model.position.add(currentBall.velocity);
			}
		}			
	}

	detectCollisions(objetJeu){		
		let boule = objetJeu.model;
		let originPoint = boule.position.clone();
		let hasCollided = false; //Arrete la boucle si il y a une collision

		//Passe à travers tout les vertex du mesh
		for (let vertexIndex = 0; vertexIndex < boule.geometry.vertices.length && !hasCollided  ; vertexIndex++)
		{		
			//Clone le vertex actuel
			let localVertex = boule.geometry.vertices[vertexIndex].clone();
			//Applique la matrice du model sur le vertex
			let globalVertex = localVertex.applyMatrix4( boule.matrix );
			//Subtract la position du model (le offset)
			let directionVector = globalVertex.sub( boule.position );
			
			//RayCast entre le point d'origin et le vecteur de direction
			let ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );			
			let collisionResults = ray.intersectObjects( this.collidableMeshList );
			
			//Si il y a des intersections, collisions
			if (collisionResults.length > 0 && collisionResults[0].distance < node.radius) {
				let collidedWith = collisionResults[0].object;											
				hasCollided = true;
				this.calculateCollision(node,collidedWith);		
			}				
		}
	}
	
	calculateCollision(body1, body2){		
		/*
		* BOULE -> MUR 
		*********************************************************************/
		if(body2.name.includes("Edge")){
			let angle = null;
			let newVelocity = null;
			let axis = null;			
			if(body2.name.includes("Left") || body2.name.includes("Right")){
				axis = new THREE.Vector3(1,0,0);
				angle = body1.velocity.clone().angleTo(axis);	
			}		
			else if(body2.name.includes("Top") || body2.name.includes("Bottom")){
				axis = new THREE.Vector3(0,0,1)
				angle = body1.velocity.clone().angleTo(axis);				
			}

			//Reflection angulaire
			newVelocity = body1.velocity.clone().reflect(axis);
			//Inverser la reflexion
			newVelocity.multiplyScalar(-1);	
			//Appliquer nouvelle direction	
			body1.velocity = newVelocity; 			
		}
		/*
		* BOULE -> BOULE 
		*********************************************************************/
		else{
			let n 
		}
			
		

		/*//Trouver vecteur normalisé entre les deux corps
		let n = body1.position.clone().sub(body2.position);
		n.normalize();
		// Find the length of the component of each of the movement
		// vectors along n. 
		// a1 = v1 . n
		// a2 = v2 . n
		let a1 = body1.velocity.dot(n);
		let a2 = body2.velocity.dot(n);

		// Using the optimized version, 
		// optimizedP =  2(a1 - a2)
		//              -----------
		//                m1 + m2
		float optimizedP = (2.0 * (a1 - a2)) / (circle1.mass + circle2.mass);

		// Calculate v1', the new movement vector of circle1
		// v1' = v1 - optimizedP * m2 * n
		Vector v1' = v1 - optimizedP * circle2.mass * n;

		// Calculate v1', the new movement vector of circle1
		// v2' = v2 + optimizedP * m1 * n
		Vector v2' = v2 + optimizedP * circle1.mass * n;

		circle1.setMovementVector(v1');
		circle2.setMovementVector(v2');*/
	}
}