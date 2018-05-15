/************************************************************************************
* Projet : Carom
* Cours  : B63 Programmation Web Avancée 
* Auteur : Kevin Mwanangwa
* Fichier: GameModel.js 
************************************************************************************/
import Boule from '../Objects/Boule';
import CaromTable from '../Objects/Table';
import Joueur from'../Objects/Joueur';
import CaromPhysics from'../Engine/CaromPhysics';
import * as THREE from 'three';
import GameEnvironment from '../Objects/GameEnvironment';

export default class GameModel{
	constructor(controlleur,gv,pl){			
		this.controlleur = controlleur;		
		this.nbBandesMin = gv;
		this.isProcessing = false;	
		this.turnIsValid = true;	
		
		this.joueurs = []
		this.boules = []
		this.initGame(pl)	
		this.initMeshList();		
	}	

	/*******************************************************************************
    * Initialisation de la partie
    *******************************************************************************/
	initGame(){		
		//Couleur
		let bouleNeutre = 0x730d0d;
		

		//Init table et boule neutre
		this.table = new CaromTable(0,0,0);	
		this.environment = new GameEnvironment();		
		this.boules.push(new Boule(25,0,null,bouleNeutre));		
		
		let mode = null;
		if (this.nbBandesMin == 0) {mode = "Libre"}
		if (this.nbBandesMin == 1) {mode = "1 Bande"}
		if (this.nbBandesMin == 3) {mode = "3 Bandes"}
		this.board = new Joueur(mode,this.controlleur.currentTurn,0x42e5f4,[-20,-4000],false,this.controlleur,"Tour : ")
		/*
		for (let i = -20; i < 20; i+=8) {			
			for (let j = -40; j < 40; j+=8) {
				let tmp = new Boule(j,i,null,bouleNeutre);
				//tmp.velocity.set(Math.random(),0,Math.random());
				this.boules.push(tmp)				
			}			
		}*/
		//Le engine physique
		this.physics = new CaromPhysics(this);				
	}	

	initPlayers(playerList){
		let bouleJoueur1 = 0xcc9900,
			bouleJoueur2 = 0xbfbfbf;
		//Init players
		for(let i = 0; i<playerList.length; i++) {
			const actuel = playerList[i];			
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
			this.joueurs.push(new Joueur(actuel.nom,0,couleur,position,isActive,this.controlleur,"Score : "));
			this.boules.push(this.joueurs[i].boule)

			//Setup la camera pour joueur actif
			if(isActive && actuel.nom == this.controlleur.me){					
				this.controlleur.currentPlayer = this.joueurs[i];
				setTimeout(()=>{
					this.controlleur.changeCameraFocus(this.joueurs[i].boule);
				},2500)		
			}			
		}	
	}

	initMeshList(){
		this.meshList = [];
		this.meshList.push(this.table.topEdge.model)
		
		this.meshList.push(this.table.bottomEdge.model)
		this.meshList.push(this.table.leftEdge.model)
		this.meshList.push(this.table.rightEdge.model)
		for (let b = 0; b < this.boules.length; b++) {
			const boule = this.boules[b].model;
			this.meshList.push(boule)			
		}
	}

	/*******************************************************************************
    * Boucle de jeu
    *******************************************************************************/
	update(){							
		/**
		 * Updates le joueur actif
		 *******************************************************/
		if(this.controlleur.currentPlayer != null && this.controlleur.currentPlayer.queue.isActive){					
			this.controlleur.currentPlayer.update()
		}			
		
		/**
		 * Updates les boules
		 *******************************************************/
		if(this.isProcessing){
			let nbStationary = 0;
			let currentFrameTime = 1; //Duree du frame actuel
			let currentFrameCollisions;

			let currentBalls = this.controlleur.currentPlayer.boulesTouchees;	
			let currentEdges = this.controlleur.currentPlayer.bandesTouchees;
			let hasHitFirstBall, hasHitSecondBall, nbBandes;

			//Tant que le FRAME actuel n'est pas termine
			while(currentFrameTime > 0){
				//Variables du joueurs actif				
				hasHitFirstBall = currentBalls.length >=1 ? true : false;
				hasHitSecondBall = currentBalls.length == 2 ? true : false;
				nbBandes = currentEdges.length; //Nb de bandes touchees apres avoir touche la premiere boule
				
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
					
					//Si balle touchee *******
					if(otherBall != null ){		
						this.controlleur.currentPlayer.hasHitBall(otherBall);				
						//Au premier tir, verifier qu'on a touché la boule rouge
						if(this.controlleur.currentTurn == 1 && otherBall.model.nom != "NEUTRAL" && !hasHitFirstBall){
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
						//Si premiere balle deja touchee et deuxieme pas encore touchee, incrementer 
						if(hasHitFirstBall && !hasHitSecondBall){
							this.controlleur.currentPlayer.hasHitEdge(edge);
							nbBandes = currentEdges.length;	
						}
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
						//Si premiere balle deja touchee et deuxieme pas encore touchee, incrementer 
						if(hasHitFirstBall && !hasHitSecondBall){
							this.controlleur.currentPlayer.hasHitEdge(edge);
							nbBandes = currentEdges.length;	
						}
						edge.hasBeenTouched();
					}

					
					//Quitter la boucle
					break;
				}
			}
			//Compter le nombre de boules stationnaires pour arreter le tour
			for (let i = 0; i < this.boules.length; i++) {
				const ball = this.boules[i];
				if(ball.velocity.equals(this.physics.isStationary)){
					nbStationary += 1;	
				}
			}

			//FIN DU TOUR ******************************************************************************
			if (nbStationary == this.boules.length){
				//Verification finale si on a pas au moins toucher les deux boules, invalide
				if(currentBalls.length != 2)
					this.turnIsValid = false;

				/*******IF DEBUGGING*******/
				if(this.controlleur.isDebugging){					
					let endLog = "[ DEBUG ]";
					endLog+="  TOUR : "+this.controlleur.currentTurn;
					endLog+="  ||  JOUEUR : "+this.controlleur.currentPlayer.nom;					
					endLog+="  ||  BANDES : "+nbBandes+"/"+this.nbBandesMin;
					endLog+="  ||  BALLES : "+currentBalls.length+"/2";
					endLog+= "  ||  CAROM ?: "+(this.turnIsValid? "Oui" : "Non");	
					console.log(endLog)			
				}
				this.physics.clearTrails();
				this.controlleur.endTurn(this.turnIsValid)				
			}
		}		
	}
}
