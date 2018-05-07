/************************************************************************************
* Projet : Carom
* Cours  : B63 Programmation Web Avancée 
* Auteur : Kevin Mwanangwa
* Fichier: Game.js 
************************************************************************************/
import GameModel from './GameModel';
import GameView from './GameView';
/*********************************************************************
* Variables
*********************************************************************/
let controller = null;
/*********************************************************************
* Initialisation du jeu
*********************************************************************/
function startGame(gameVariant,me,playerList){		
	let playerListTMP = '{"joueurs":[{"nom":"Kevin Mwa","score":"420" },{"nom":"Laurier L-G","score":"1337"}]}';
	let Json = JSON.parse(playerListTMP);	
	controller = new Controller("Kevin Mwa",gameVariant,Json);	

	startGameLoop();	
}

/*********************************************************************
* GameLoop
*********************************************************************/
function startGameLoop(){
	//let tmp = performance.now()

	controller.tick();
	//console.log("This tick took "+(performance.now() - tmp)+" [B]illiseconds ")
	
	//Callback function
	requestAnimationFrame(startGameLoop);	
}

/*********************************************************************
* Class : Controller
*********************************************************************/
class Controller{
	constructor(me,gameVariant,playerList){	
		this.me = me;	
		this.currentPlayer = null;
		this.vue = new GameView(this);
		this.modele = new GameModel(this,gameVariant,playerList);
		this.vue.initGameObjets();
		this.currentTurn = 1;

		this.startingX = null;
		this.startingY= null;
		this.distanceDown = null;
		this.maxDistance = 200;
		this.justLaunched = false;
	
		//Start powerBar
		document.onmousedown = (e)=>{
			//Si right click down
			if(e.which == 3){
				this.startingX = e.screenX;
				this.startingY = e.screenY;	
				this.distanceDown = 0;			
			}
		}

		//Update powerBar
		document.onmousemove = (e)=>{
			if(this.startingX != null){
				this.distanceDown += e.movementY;				
			}
		}

		//Shoot
		document.onmouseup = (e)=>{
			//Si right click down
			if(e.which == 3){
				
				this.justLaunched = true;
				setTimeout(()=>{
					this.startingX = null;
					this.startingY = null;	
					this.distanceDown = null;	
				},16);					
			}
		}
	}

	/*********************************************************************
	* Initialiser le prochain tour
	*********************************************************************/
	startProccessingTurn(){
		this.modele.isProcessing = true;
		this.resetCameraFocus();
	}

	/*********************************************************************
	* Gestion de fin de tour
	*********************************************************************/
	endTurn(scored){
		//Si reussi *******
		if(scored){
			//Incrementer score
			this.currentPlayer.caroms+=1;
			//Afficher animation de tour reussi
			this.vue.hasScored();
			//Debut du deuxième tour apres 2secs
			setTimeout(()=>{
				this.changeCameraFocus(this.currentPlayer.boule);
				this.resetPlayer();
			},2000);			
		}
		//Sinon ********
		else{
			this.vue.hasNotScored();
			this.nextPlayer();
		}
		//Reset Modele
		this.modele.isProcessing = false;
		this.modele.turnIsValid = true;	
		this.modele.table.reset();
		
		//Incrementer les tours	
		this.currentTurn+=1;				
	}

	/*********************************************************************
	* Passer au prochain joueur
	*********************************************************************/
	nextPlayer(){
		//Change de joueur actif
		for (let i = 0; i < this.modele.joueurs.length; i++) {
			let p = this.modele.joueurs[i];	
			//Trouver l'AUTRE joueur		
			if(p.nom != this.currentPlayer.nom){
				this.currentPlayer = p;
				if(p.nom == this.me){
					//Si on est le prochain joueur, focus la camera sur notre boule
					setTimeout(()=>{
						this.changeCameraFocus(this.currentPlayer.boule);						
					},2000);
				}			
				break;			
			}			
		}
		//Reinitialise nouveau/prochain joueur
		this.resetPlayer()

		//Change spotlight, le pointe vers l'autre joueur
		this.vue.rotateSpotLight();
	}

	/*********************************************************************
	* Reinitialise/reset le joueur actuel
	*********************************************************************/
	resetPlayer(){				
		this.currentPlayer.bandesTouchees = [];
		this.currentPlayer.boulesTouchees = [];
		//Aligne la queue au dessus de la boule du joueur		
		this.currentPlayer.queue.pivot.position.x = this.currentPlayer.boule.model.position.x;
		this.currentPlayer.queue.pivot.position.z = this.currentPlayer.boule.model.position.z;
		
		//Animation
		this.currentPlayer.queue.fadeDown();
	}

	/*********************************************************************
	* Recuperer l'input de force du joueur actuel
	*********************************************************************/
	getForceInput(){
		//Si c'est notre tour
		if(true){//this.currentPlayer.nom == this.me){
			if(this.distanceDown != null){
				if(this.distanceDown > 0 && this.distanceDown < this.maxDistance){
					let percentage = this.distanceDown/this.maxDistance;
					return percentage;
				}
				else
					return this.distanceDown <= 0 ? 0.001 : 1;
			}
			else return 0.001;
		}
		//Sinon, recuperer infos du serveur pour le deuxieme joueur
		else 
			return 0.001;
	}

	/*********************************************************************
	* Recuperer l'input de tir du joueur actuel
	*********************************************************************/
	justShot(){
		//Si c'est notre tour
		if(true){//this.currentPlayer.nom == this.me){
			if(this.justLaunched){
				this.justLaunched = false;
				return true;
			}
			else
				return false;
		}
		//Sinon, recuperer infos du serveur pour le deuxieme joueur
		else 
			return false;
	}

	/*********************************************************************
	* Changer le focus de la camera
	*********************************************************************/
	changeCameraFocus(focus){		
		this.vue.changeCameraFocus(focus);				
	}

	/*********************************************************************
	* Reset le focus de la camera
	*********************************************************************/
	resetCameraFocus(){		
		this.vue.resetCameraFocus();				
	}

	/*********************************************************************
	* Recuperer l'angle de la queue du joueur actuel
	*********************************************************************/
	getCueAngle(){
		//Si c'est notre tour
		if(true){//this.currentPlayer.nom == this.me){	
			return this.vue.cameraControls.getAzimuthalAngle() + Math.PI/2;
		}
		//Sinon, recuperer infos du serveur pour le deuxieme joueur
		else{
			return 0;
		}
	}

	/*********************************************************************
	* Recuperer l'angle de la powerBar/ Jauge de tir
	*********************************************************************/
	getPowerBarAngle(){
		//L'angle est local
		return this.vue.cameraControls.getPolarAngle()+Math.PI;
	}

	/*********************************************************************
	* Update/Tick
	*********************************************************************/
	tick(){
		//Update game	
		this.modele.update()
		this.vue.renderScene()
	}
}

export default {
	startGame,
	startGameLoop
}