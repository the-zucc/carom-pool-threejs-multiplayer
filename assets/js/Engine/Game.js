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
	let playerListTMP = '{"joueurs":[{"nom":"JM Deschamps","score":"420" },{"nom":"Pye Pwol","score":"1337"}]}';
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
	}

	endTurn(scored){
		if(scored){
			this.currentPlayer.hasScored();
		}
		else{
			this.currentPlayer.hasNotScored();
		}
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