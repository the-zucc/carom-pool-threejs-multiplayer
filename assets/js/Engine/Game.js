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
	vue = new GameView();
	startGameLoop();	
}

function startGameLoop(){
	//Update game
	modele.update()
	vue.renderScene()

	//Callback function
	requestAnimationFrame(startGameLoop)
}