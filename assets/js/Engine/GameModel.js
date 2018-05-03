import Boule from '../Objects/Boule';
import CaromTable from '../Objects/Table';
import Joueur from'../Objects/Joueur';
import CaromPhysics from'../Engine/CaromPhysics';
import * as THREE from 'three';

export default class GameModel{
	constructor(controller,gamevariant,playerList){		
		/*
		*
		*/
		this.collisionTest = true;
		/*
		*
		*/

		this.controller = controller;
		this.physics = new CaromPhysics();
		this.variant = gamevariant;

		this.joueurs = []
		this.boules = []
		
		this.initGame(playerList)			
	}	

	initGame(playerList){
		let bouleNeutre = 0xe31919;
		let nbBoulesNeutres = 80;

		//Init table et boule neutre
		this.table = new CaromTable(0,0,0);	
		
		if(!this.collisionTest){
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
		}
		else{
					//-----BALLES ADDITIONNELLES POUR TEST DE COLLISIONS-----
					for(let i = 0; i < nbBoulesNeutres; i++){
						let x = Math.floor(Math.random()*20 -10);
						let z = Math.floor(Math.random()*40 -20);
						let boule = new Boule(x,z,"B_"+i.toString(),bouleNeutre);
						boule.velocity.set(Math.random()*1.5,0,Math.random()*1.5)
						this.boules.push(boule)
					}
		}				
	}	

	update(){		
		let currentFrameTime = 1;
		let currentFrameCollisions;
		
		//Tant que le tick actuel n'est pas termine
		while(currentFrameTime > 0){
			//Calculer toutes les collisions possibles
			currentFrameCollisions = this.physics.detectAllCollisions(this.boules);
			
			//S'il y a au moins 1 collision
			if(currentFrameCollisions.length > 0){
				//Trier les collisions en fonction de leur ordre d'occurence
				currentFrameCollisions.sort( (a,b)=>{return a.t - b.t} )

				//Deplacer toutes les balles en fonction du temps de la premiere collision
				let firstCollision = currentFrameCollisions[0];
				let t = firstCollision.t;				
				this.physics.translateAllBallsByFraction(t,this.boules);

				//Calculer la collision entre les deux boules 
				this.physics.ballToBallCollision(firstCollision.ballA,firstCollision.ballB);

				//Verifier collisions avec bords de la table
				this.physics.detectBallToEdgeCollisions(this.boules,this.table)

				//Decrementer le temps ecoule
				currentFrameTime -= t;				
			}
			else{
				//Sinon , deplacement normal en fonction du temps restant au frame
				this.physics.translateAllBallsByFraction(currentFrameTime,this.boules);
				
				//Verifier collisions avec bords de la table
				this.physics.detectBallToEdgeCollisions(this.boules,this.table);
				
				//Quitter la boucle
				break;
			}
		}			
	}	
}
