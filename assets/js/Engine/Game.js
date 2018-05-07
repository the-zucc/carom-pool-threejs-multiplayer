import GameModel from './GameModel';
import GameView from './GameView';
/*********************************************************************
* Variables
*********************************************************************/
let controller = null;
/*********************************************************************
* Initialisation de la page
*********************************************************************/
function startGame(gameVariant,me,playerList){		
	let playerListTMP = '{"joueurs":[{"nom":"JM Deschamps","score":"420" },{"nom":"JM Deschamps .. again","score":"1337"}]}';
	let Json = JSON.parse(playerListTMP);	
	controller = new Controller("JM Deschamps",gameVariant,Json);	

	startGameLoop();	
}

function startGameLoop(){
	//let tmp = performance.now()

	controller.tick();
	//console.log("This tick took "+(performance.now() - tmp)+" [B]illiseconds ")
	
	//Callback function
	requestAnimationFrame(startGameLoop);	
}

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

	startProccessingTurn(){
		this.modele.isProcessing = true;
		this.resetCameraFocus();
	}

	endTurn(scored){
		//Si reussi
		if(scored){
			this.currentPlayer.caroms+=1;
			this.vue.hasScored();
			
			setTimeout(()=>{
				this.changeCameraFocus(this.currentPlayer.boule);
				this.resetPlayer();
			},2000)
			
		}
		//Sinon
		else{
			this.vue.hasNotScored();
			this.nextPlayer();
		}
		//Reset Modele
		this.modele.isProcessing = false;
		this.modele.turnIsValid = true;	
		this.modele.table.reset();					
	}

	nextPlayer(){
		//Change de joueur actif
		for (let i = 0; i < this.modele.joueurs.length; i++) {
			let p = this.modele.joueurs[i];			
			if(p.nom != this.currentPlayer.nom){
				this.currentPlayer = p;
				if(p.nom == this.me){
					setTimeout(()=>{
						this.changeCameraFocus(this.currentPlayer.boule);
						this.resetPlayer();
					},2000);
				}			
				break;			
			}			
		}
		this.resetPlayer()

		//Change spotlight
		this.vue.rotateSpotLight();
	}

	resetPlayer(){				
		this.currentPlayer.bandesTouchees = [];
		this.currentPlayer.boulesTouchees = [];
		//Aligne la queue au dessus de la boule du joueur		
		this.currentPlayer.queue.pivot.position.x = this.currentPlayer.boule.model.position.x;
		this.currentPlayer.queue.pivot.position.z = this.currentPlayer.boule.model.position.z;
		
		//Animation
		this.currentPlayer.queue.fadeDown();
	}
	getForceInput(){
		//Else get force data from server
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

	justShot(){
		//Else get shot data from server
		if(this.justLaunched){
			this.justLaunched = false;
			return true;
		}
		else
			return false;
	}

	changeCameraFocus(focus){		
		this.vue.changeCameraFocus(focus);				
	}

	resetCameraFocus(){		
		this.vue.resetCameraFocus();				
	}

	getCueAngle(){
		//else return server other player data	
		return this.vue.cameraControls.getAzimuthalAngle() + Math.PI/2;
	}

	getPowerBarAngle(){
		//Angle is only local, to help the local viewer
		return this.vue.cameraControls.getPolarAngle()+Math.PI;
	}

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