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
	controller = new Controller("TEST",gameVariant,Json);	
	startGameLoop();	
}

function startGameLoop(){
	let tmp = performance.now()

	controller.tick();
	console.log("This thicc took "+(performance.now() - tmp)+" [B]illiseconds ")
	
	//Callback function
	requestAnimationFrame(startGameLoop);	
}

class Controller{
	constructor(me,gameVariant,playerList){		
		this.modele = new GameModel(this,gameVariant,playerList);
		this.vue = new GameView(this);
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