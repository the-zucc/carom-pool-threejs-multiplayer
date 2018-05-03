import Boule from '../Objects/Boule';
import Queue from '../Objects/Queue';

export default class Joueur{
	constructor(nom,score,couleur,position,isActive){
		this.nom = nom;
		this.score = score;
		this.isActive = isActive;
		this.nbBandes = 0;	
		this.couleur = couleur;	
		this.boule = new Boule(position[0],position[1],this,this.couleur);
		this.queue = new Queue(-10,0.5,0,this);
	}
}