import Boule from '../Objects/Boule';
import CaromTable from '../Objects/Table';

export default class GameModel{
	constructor(gameVariant){
		this.variant = gameVariant;
		this.joueurs = []
		this.boules = []
		this.initGame()
	}	

	initGame(){
		this.table = new CaromTable(0,0,0);	
		this.boules.push(new Boule(2,3,"Joueur1TEMP",0xFFFFFF));	
		this.boules.push(new Boule(-10,-11,"Joueur1TEMP",0xce210e))
		this.boules.push(new Boule(30,9,"Joueur1TEMP",0xce210e))
		this.boules.push(new Boule(14,12,"Joueur1TEMP",0xce210e))
	}

	update(){

	}

	calculateTrajectory(){


	}
}