import Boule from '../Objects/Boule';
import CaromTable from '../Objects/Table';
import Joueur from'../Objects/Joueur';
import CaromPhysics from'../Engine/CaromPhysics';
import * as THREE from 'three';
import GameEnvironment from '../Objects/GameEnvironment';

export default class GameModel{
	constructor(controlleur,gamevariant,playerList){			
		this.controlleur = controlleur;		
		this.variant = gamevariant;
		this.isProcessing = false;
		this.turnIsValid = true;
		
		this.joueurs = []
		this.boules = []
		this.initGame(playerList)			
	}	

	initGame(playerList){		
		//Couleur
		let bouleNeutre = 0x730d0d,
			bouleJoueur1 = 0xcc9900,
			bouleJoueur2 = 0xbfbfbf;

		//Init table et boule neutre
		this.table = new CaromTable(0,0,0);	
		this.environment = new GameEnvironment();		
		this.boules.push(new Boule(25,0,null,bouleNeutre));	

		//Init players
		for(let i = 0; i<2; i++) {
			const actuel = playerList.joueurs[i];			
			let couleur = null; 
			let position = null;
			let isActive = null;
			if(i == 0){
				couleur = bouleJoueur1;
				position = [-20,0];
				isActive = true;				
			}
			else{
				couleur = bouleJoueur2;
				position = [-20,5];
				isActive = false;
			}
			this.joueurs.push(new Joueur(actuel.nom,actuel.score,couleur,position,isActive,this.controlleur));
			this.boules.push(this.joueurs[i].boule)

			//Setup la camera pour joueur actif
			if(isActive && actuel.nom == this.controlleur.me){					
				this.controlleur.currentPlayer = this.joueurs[i];					
				this.controlleur.changeCameraFocus(this.joueurs[i].boule.model);
			}			
		}		
		//Le engine physique
		this.physics = new CaromPhysics(this);				
	}	

	update(){							
		/**
		 * Updates le joueur actif
		 *******************************************************/
		if(this.controlleur.currentPlayer != null){					
			this.controlleur.currentPlayer.update()
		}	
		
		
		/**
		 * Updates les boules
		 *******************************************************/
		if(this.isProcessing){
			let nbStationary = 0;
			let currentFrameTime = 1;
			let currentFrameCollisions;		
			//Tant que le tick actuel n'est pas termine
			while(currentFrameTime > 0){
				//Calculer toutes les collisions possibles
				currentFrameCollisions = this.physics.detectAllCollisions();
				
				//S'il y a au moins 1 collision
				if(currentFrameCollisions.length > 0){
					//Trier les collisions en fonction de leur ordre d'occurence
					currentFrameCollisions.sort( (a,b)=>{return a.t - b.t} )

					//Deplacer toutes les balles en fonction du temps de la premiere collision
					let firstCollision = currentFrameCollisions[0];
					let t = firstCollision.t;				
					this.physics.translateAllBallsByFraction(t);

					//Calculer la collision entre les deux boules 
					let otherBall = this.physics.ballToBallCollision(firstCollision.ballA,firstCollision.ballB);
					if(otherBall != null){
						this.controlleur.currentPlayer.hasHitBall(otherBall);						
					}

					//Verifier collisions avec bords de la table
					let edge = this.physics.detectBallToEdgeCollisions()
					if(edge != null){
						let hasBeenHit = this.controlleur.currentPlayer.hasHitEdge(edge)
						//Si rebord touche avant d'avoir toucher la premiere balle ou apres avoir toucher la deuxieme, invalide
						if(this.controlleur.currentPlayer.boulesTouchees.length != 1)
							edge.isInvalid();
						else
							edge.hasBeenTouched();
					}

					//Decrementer le temps ecoule
					currentFrameTime -= t;				
				}
				else{
					//Sinon , deplacement normal en fonction du temps restant au frame
					this.physics.translateAllBallsByFraction(currentFrameTime);
					
					//Verifier collisions avec bords de la table
					let edge = this.physics.detectBallToEdgeCollisions();
					if(edge != null){
						let hasBeenHit = this.controlleur.currentPlayer.hasHitEdge(edge)
						//Si rebord touche avant d'avoir toucher la premiere balle ou apres avoir toucher la deuxieme, invalide
						if(this.controlleur.currentPlayer.boulesTouchees.length != 1)
							edge.isInvalid();
						else
							edge.hasBeenTouched();
					}
					
					//Quitter la boucle
					break;
				}
			}
			//Compter le nombre de boules stationnaires pour arreter le tour
			for (let i = 0; i < this.boules.length; i++) {
				const v = this.boules[i].velocity;
				if(v.equals(this.physics.isStationary))
					nbStationary += 1;				
			}

			if (nbStationary == this.boules.length){
				this.controlleur.currentPlayer.queue.pivot.position.x = this.controlleur.currentPlayer.boule.model.position.x;
				this.controlleur.currentPlayer.queue.pivot.position.z = this.controlleur.currentPlayer.boule.model.position.z;
				this.controlleur.currentPlayer.queue.fadeDown();//this.controlleur.endTurn();
			}
		}		
	}
}
