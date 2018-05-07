import Boule from '../Objects/Boule';
import CaromTable from '../Objects/Table';
import Joueur from'../Objects/Joueur';
import CaromPhysics from'../Engine/CaromPhysics';
import * as THREE from 'three';
import GameEnvironment from '../Objects/GameEnvironment';

export default class GameModel{
	constructor(controlleur,gamevariant,playerList){			
		this.controlleur = controlleur;		
		this.nbBandesMin = gamevariant;
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
				setTimeout(()=>{
					this.controlleur.changeCameraFocus(this.joueurs[i].boule);
				},2500)		
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

			let currentBalls = this.controlleur.currentPlayer.boulesTouchees;	
			let currentEdges = this.controlleur.currentPlayer.bandesTouchees;
			let hasHitFirstBall, nbBandes;
			//Tant que le tick actuel n'est pas termine
			while(currentFrameTime > 0){
				//Variables du joueurs actif				
				hasHitFirstBall = currentBalls.length >=1 ? true : false;
				nbBandes = currentEdges.length;
			
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
					
					//Si balle touchee
					if(otherBall != null ){
						let ballHasBeenHit = this.controlleur.currentPlayer.hasHitBall(otherBall);
						
						//Si boule a deja ete touchee, invalide
						if(ballHasBeenHit){
							this.turnIsValid = false;
						}
						//Si on vient de frapper la deuxieme boule sans avoir touché assez de bandes, invalide
						else if(hasHitFirstBall && nbBandes < this.nbBandesMin){
							this.turnIsValid = false;
						}
					}

					//Verifier collisions avec bords de la table
					let edge = this.physics.detectBallToEdgeCollisions()
					if(edge != null){
						this.controlleur.currentPlayer.hasHitEdge(edge);
						nbBandes = currentEdges.length;
												
						//Si rebord touche avant d'avoir toucher la premiere balle ou apres avoir toucher la deuxieme, invalide
						if(!hasHitFirstBall){
							edge.isInvalid();
							this.turnIsValid = false;
						}
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
						this.controlleur.currentPlayer.hasHitEdge(edge);
						nbBandes = currentEdges.length;
												
						//Si rebord touche avant d'avoir toucher la premiere balle ou apres avoir toucher la deuxieme, invalide
						if(!hasHitFirstBall){
							edge.isInvalid();
							this.turnIsValid = false;
						}
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
				//Verification finale si on a pas au moins toucher les deux boules, invalide
				if(currentBalls.length != 2)
					this.turnIsValid = false;

				this.controlleur.endTurn(this.turnIsValid)				
			}
		}		
	}
}
