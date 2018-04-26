import * as THREE from 'three'

export default class Boule{
	constructor(x,z,prop,coul){
		this.x = x;		
		this.z = z;
		this.radius = 0.85;
		this.y = (this.radius*2)
		this.proprietaire = prop;
		this.couleur = coul;

		//TEST TEST TEST
		this.direction = new THREE.Vector3(1,0,0)
		this.velocity = new THREE.Vector3(0.25,0,0)
		
		this.createModel();
	}	

	createModel(){
		let geometry = new THREE.SphereGeometry(this.radius,  10 , 10);
		let material = new THREE.MeshPhongMaterial({ color:this.couleur ,  transparent: true,  opacity: 0.95  });
		this.model = new THREE.Mesh( geometry, material );
		this.model.position.set(this.x,this.y,this.z);		
	}
}