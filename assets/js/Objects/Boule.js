import * as THREE from 'three'

export default class Boule{
	constructor(x,z,prop,coul){
		this.x = x;		
		this.z = z;
		this.radius = 1;
		this.y = (this.radius*1.5);
		this.proprietaire = prop;
		this.couleur = coul;	
		this.mass = 1;		
		this.velocity = new THREE.Vector3(0,0,0);		
		
		//Si pas de proprio, boule neutre
		if(this.proprietaire != undefined)
			this.createModel(prop.nom);
		else
			this.createModel("NEUTRAL");
	}	

	createModel(name){
		let geometry = new THREE.SphereBufferGeometry(this.radius,  25 , 25);
		let material = new THREE.MeshPhongMaterial({ color:this.couleur ,  transparent: false,  opacity: 1  , shininess: 60});
		material.needsUpdate = true;
		this.model = new THREE.Mesh( geometry, material );
		this.model.name = name;
		this.model.castShadow = true;
		this.model.recieveShadow = true;
		this.model.position.set(this.x,this.y,this.z);				
	}
}