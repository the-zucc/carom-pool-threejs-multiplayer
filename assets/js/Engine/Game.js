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
	//Update game
	modele.update()
	vue.renderScene()

	//Callback function
	requestAnimationFrame(startGameLoop)
}

export default {
	startGame,
	startGameLoop
}