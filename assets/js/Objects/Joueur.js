import Boule from '../Objects/Boule';

export default class Joueur{
	constructor(nom,score,couleur,position){
		this.nom = nom;
		this.score = score;
		this.isActive = false;
		this.nbBandes = 0;
		this.queue = null; //Change
		this.boule = new Boule(position[0],position[1],"Joueur_"+nom,couleur);
	}	
}