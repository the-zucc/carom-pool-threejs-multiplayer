/************************************************************************************
* Projet : Carom
* Cours  : B63 Programmation Web Avancée 
* Auteur : Kevin Mwanangwa
* Fichier: Game.js 
************************************************************************************/
import GameModel from './GameModel';
import GameView from './GameView';
import Stats from '../Libs/Stats';
/*********************************************************************
* Class : CaromController
*********************************************************************/
export default class CaromController{
	constructor(me,gameVariant,playerList){	
		// Debug
		this.isDebugging = false;
		this.domContainer = document.getElementById("carom-container");
		this.stats = new Stats();
		this.stats.showPanel( 1 );
		document.onkeypress = (e)=>{
			//D : Toggle le debugging
			if(e.which == 100){
				this.isDebugging = !this.isDebugging;
				if(this.isDebugging)
					this.domContainer.appendChild(this.stats.dom)
				else
					this.domContainer.removeChild(this.stats.dom)
			}
		}
		
		this.me = me; //Nom de l'usager local	
		this.currentPlayer = null; //Variable qui contient le joueur actif du tour actuel

		//MVC
		this.vue = new GameView(this);
		this.modele = new GameModel(this,gameVariant,playerList);
		this.vue.initGameObjets();
		this.currentTurn = 1;

		//Input usager
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
			//Si right click up
			if(e.which == 3){					
				this.justLaunched = true;
				setTimeout(()=>{
					this.startingX = null;
					this.startingY = null;	
					this.distanceDown = null;	
				},100);					
			}
		}
		this.getCoups = null;
		this.getCueAngleFromRemote = null;
		this.sendCoupToServeur = null;
	}

	/*********************************************************************
	* Initialiser le prochain tour
	*********************************************************************/
	startProccessingTurn(){
		this.modele.isProcessing = true; //Sauve des calculs quand le jeu est idle
		if(this.currentPlayer.nom == this.me)
			this.resetCameraFocus();
	}

	/*********************************************************************
	* Gestion de fin de tour
	*********************************************************************/
	endTurn(scored){
		//Si reussi ****************************************
		if(scored){
			//Incrementer score
			this.currentPlayer.caroms+=1;			
			//Afficher animation de tour reussi
			this.vue.hasScored();
			this.currentPlayer.updateScoreModel();

			//Debut du prochain tour apres 2secs
			this.currentPlayer.reset();
			setTimeout(()=>{
				if(this.currentPlayer.nom == this.me)
					this.changeCameraFocus(this.currentPlayer.boule);				
			},2000);			
		}
		//Sinon ****************************************
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
						this.changeCameraFocus(p.boule);						
					},2000);
				}			
				break;			
			}			
		}
		//Reinitialise nouveau/prochain joueur
		this.currentPlayer.reset();

		//Change spotlight, le pointe vers l'autre joueur
		this.vue.rotateSpotLight();
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
				let force = this.currentPlayer.queue.force;
				let direction = {x:this.currentPlayer.queue.direction.x,
							y:this.currentPlayer.queue.direction.y,
							z:this.currentPlayer.queue.direction.z};
				let posBoules = [{},{},{}];
				let idPartie = null;
				this.sendCoupToServeur({force:force, direction:direction, posBoules:posBoules});
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
		//L'angle est est fonction de la camera locale, aucune requete
		return this.vue.cameraControls.getPolarAngle()+Math.PI;
	}

	/*********************************************************************
	* Update/Tick
	*********************************************************************/
	tick(){
		if(this.isDebugging){this.stats.begin();}
		
		//Update game	
		console.log(this.getCoups);
		this.modele.update()
		this.vue.renderScene()
		
		if(this.isDebugging){this.stats.end();}
	}
	/*********************************************************************
	* Initialisation du jeu
	*********************************************************************/
	startGame(gameVariant,me,playerList){	
		this.gameLoop();
	}
	/*********************************************************************
	* GameLoop
	*********************************************************************/
	gameLoop(){
		this.tick();
		//Callback function
		requestAnimationFrame(this.gameLoop);	
	}
}