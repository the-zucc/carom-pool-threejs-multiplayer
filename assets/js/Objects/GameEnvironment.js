import * as THREE from 'three'

export default class GameEnvironment{
    constructor(x,z){
        this.model = new THREE.Object3D(0,0,0)
        this.createModel();
    }	

    createModel(name){    
        //Plancher
        let floorTexture = new THREE.TextureLoader().load( require('assets/images/textures/TEST4.jpg'));
        floorTexture.repeat.set(8,8);
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;                
        let floorMaterial = new THREE.MeshPhongMaterial( { map:floorTexture });  
        let geometry = new THREE.BoxGeometry(300,5,300);  
        let floor = new THREE.Mesh(geometry, floorMaterial); 
        floor.receiveShadow = true; 
        floor.castShadow = true; 
        floor.position.set(0,-25,0); 
        this.model.add(floor)   
        this.model.castShadow = true;
        this.model.receiveShadow = true;  
        
        let box = new THREE.BoxGeometry(300,100,300)
        let mat = new THREE.MeshPhongMaterial();
    }
}