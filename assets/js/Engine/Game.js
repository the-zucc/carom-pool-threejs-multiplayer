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
	constructor(me,partieCourante){	
		let playerList = partieCourante.joueurs;
		let gameVariant = partieCourante.type;
		this.partieCourante = partieCourante;
		this.currentTurn = 1;
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

		this.remotePlayer = {
			force : 0.05,
			angle : Math.PI,
			shot : false
		}//null; //Objet JSON qui contiendra les info de l'autre joueur		
		this.aEnvoye = false;
		this.sendCoupToServeur = null; //Envoyer coup local au serveur
		this.sendCueInfo = null; //Envoyer les parametres de position locaux au serveur
		this.changerTourNiveauServeur = null;
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
		this.modele.board.caroms += 1; //QUick fix
		this.modele.board.updateScoreModel();
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
			this.changerTourNiveauServeur();
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
		this.changerTourNiveauServeur();
	}
	/*********************************************************************
	* Recuperer l'input de force du joueur actuel
	*********************************************************************/
	getForceInput(){
		//Si c'est notre tour
		if(this.currentPlayer.nom == this.me && this.currentPlayer.isActive){
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
		else {
			return this.remotePlayer.force;
		}			
	}

	/*********************************************************************
	* Recuperer l'input de tir du joueur actuel
	*********************************************************************/
	justShot(){
		//Si c'est notre tour
		if(this.currentPlayer.nom == this.me && this.currentPlayer.isActive){
			let force = this.getForceInput();
			let direction = this.getCueAngle();
			let idPartie = this.partieCourante._id;
			if(this.justLaunched){
				this.justLaunched = false;
				//Envoyer params locaux au serveur
				if(!this.aEnvoye){
					this.sendCoupToServeur({force:force, angle:direction, shot:true}, this.currentPlayer.nom);
				}
				//setTimeout(()=>this.sendCoupToServeur({angle:0,force:0,shot:false}, this.partieCourante.joueurs[currIdx].nom), 60)
				return true;
			}
			else{
				this.sendCoupToServeur({force:force, angle:direction, shot:false}, this.currentPlayer.nom);
				return false;
			}
				

		}
		//Sinon, recuperer infos du serveur pour le deuxieme joueur
		else {
			return this.remotePlayer.shot;
		}			
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
		if(this.currentPlayer.nom == this.me && this.currentPlayer.isActive){
			let currAngle = this.vue.cameraControls.getAzimuthalAngle() + Math.PI/2
			return currAngle;
		}
		//Sinon, recuperer infos du serveur pour le deuxieme joueur
		else{
			return this.remotePlayer.angle;
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
		//console.log(this.getCoups);
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
		if(this.modele.joueurs.length == 0 && (this.partieCourante.joueurs[0] != undefined && this.partieCourante.joueurs[1] != undefined)){
			this.modele.initPlayers(this.partieCourante.joueurs);
			this.vue.initPlayers(this.modele);
			this.modele.initMeshList();
		}
		
		let currIdx = this.partieCourante.joueurCourant;
		//console.log("Current : "+currIdx)
		if(this.modele.joueurs.length > 0){
			if(this.currentPlayer == null){
				this.currentPlayer = this.modele.joueurs[currIdx]
			}
			else if(this.modele.joueurs[currIdx].nom != this.currentPlayer.nom){
				this.nextPlayer();
			}
			this.remotePlayer = this.partieCourante.joueurs[currIdx].coup;
		}

		//this.remotePlayer.angle += 0.01;
		//this.remotePlayer.force = Math.random()*0.9;
		this.tick();
		//Callback function
		requestAnimationFrame(()=>this.gameLoop());
	}
}