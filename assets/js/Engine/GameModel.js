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
		this.table = new CaromTable(0,0,0);	
		this.test = new Boule(20,9,"Joueur1TEMP",0xb6ccd7)
		this.test2 = new Boule(10,9,"lololol",0xb6ccd7)
		this.boules.push(this.test);
		this.boules.push(this.test2)	
		this.boules.push(new Boule(-10,-11,"Joueur1TEMP",0xe31919))
		this.boules.push(new Boule(20,3,"Joueur1TEMP",0xe31919))
		this.boules.push(new Boule(14,12,"Joueur1TEMP",0xe31919))
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
			this.calculateCollisions(lol);

			//Update la position celon les resultats					
			let delta = lol.direction.clone().multiply(lol.velocity)		
			lol.model.position.add(delta);
		}			
	}

	calculateCollisions(node){
		
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
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
				node.velocity.multiply(new THREE.Vector3(-1,0,0));				
			}
				
		}
	}
}