import GameModel from './GameModel';
import GameView from './GameView';
/*********************************************************************
* Variables
*********************************************************************/
let modele = null;
let vue = null;
let table = null;
/*********************************************************************
* Initialisation de la page
*********************************************************************/
function startGame(gameVariant){	
	modele = new GameModel(gameVariant);
	vue = new GameView(modele);
	startGameLoop();	
}

function startGameLoop(){
	let tmp = performance.now()

	//Update game	
	modele.update()
	vue.renderScene()

	//Callback function
	requestAnimationFrame(startGameLoop)

	console.log("This thicc took "+(performance.now() - tmp)+" [B]illiseconds ")
}

export default {
	startGame,
	startGameLoop
}