import Boule from '../Objects/Boule';
import CaromTable from '../Objects/Table';
import * as THREE from 'three';

export default class GameModel{
	constructor(gamevariant){
		this.variant = gamevariant;
		this.joueurs = []
		this.boules = []
		
		this.initGame()	
		this.initCollisionBoxes();
	}	

	initGame(){
		let couleurJoueur1 = 0xe6ac00;
		let couleurJoueur2 = 0xffffcc;
		let bouleNeutre = 0xe31919;

		this.table = new CaromTable(0,0,0);				
		this.boules.push(new Boule(-10,-11,"Joueur1TEMP",couleurJoueur1))
		//this.boules.push(new Boule(20,3,"Neutral",bouleNeutre))
		//this.boules.push(new Boule(14,12,"Joueur2TEMP",couleurJoueur2))
	}

	initCollisionBoxes(){
		//Liste qui contiendra tout les meshes pour le calcul des collision
		this.collidableMeshList = []

		//Les bords de la table
		this.collidableMeshList.push(this.table.bottomEdgeMesh)
		this.collidableMeshList.push(this.table.topEdgeMesh)
		this.collidableMeshList.push(this.table.leftEdgeMesh)
		this.collidableMeshList.push(this.table.rightEdgeMesh)		
		
		//Les boules
		for (let i = 0; i < this.boules.length; i++) {
			const element = this.boules[i];
			this.collidableMeshList.push(element.model)			
		}
		
	}

	update(){		
		//Update le mouvement de chaque boule
		for (let i = 0; i < this.boules.length; i++) {
			let lol = this.boules[i];
			//Calcule les collisions
			this.detectCollisions(lol);

			//Update la position celon les resultats					
			let delta = lol.direction.clone().multiply(lol.velocity)		
			lol.model.position.add(lol.velocity);
		}			
	}

	detectCollisions(node){
		
		let boule = node.model;
		let originPoint = boule.position.clone();

		//Passe à travers tout les vertex du mesh
		for (let vertexIndex = 0; vertexIndex < boule.geometry.vertices.length; vertexIndex++)
		{		
			//Clone le vertex actuel
			let localVertex = boule.geometry.vertices[vertexIndex].clone();
			//Applique le quat du mesh
			let globalVertex = localVertex.applyMatrix4( boule.matrix );
			//Subtract la direction du vertex
			let directionVector = globalVertex.sub( boule.position );
			
			let ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			//RayCast entre le point d'origin et le vecteur de direction
			let collisionResults = ray.intersectObjects( this.collidableMeshList );
			
			//Si il y a des intersections, collision
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() && collisionResults[0].object.id != boule.id) {
				console.log(collisionResults[0].distance , directionVector.length())
				//console.log(collisionResults[0])
				//this.calculateCollision()			
			}				
		}
	}

	calculateCollision(body1, body2){
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