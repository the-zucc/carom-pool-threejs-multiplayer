import * as THREE from 'three'

export default class Boule{
	constructor(x,z,prop,coul){
		this.x = x;		
		this.z = z;
		this.radius = 1;
		this.y = (this.radius*2)
		this.proprietaire = prop;
		this.couleur = coul;
		this.justCollided = false;

		//TEST TEST TEST		
		this.velocity = new THREE.Vector3(Math.random(),0,Math.random());
		
		this.createModel();
	}	

	createModel(){
		let geometry = new THREE.SphereGeometry(this.radius,  10 , 10);
		let material = new THREE.MeshPhongMaterial({ color:this.couleur ,  transparent: true,  opacity: 0.95  });
		this.model = new THREE.Mesh( geometry, material );
		this.model.position.set(this.x,this.y,this.z);				
	}
}