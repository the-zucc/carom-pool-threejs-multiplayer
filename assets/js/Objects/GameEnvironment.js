/************************************************************************************
* Projet : Carom
* Cours  : B63 Programmation Web Avancée 
* Auteur : Kevin Mwanangwa
* Fichier: GameEnvironment.js 
************************************************************************************/
import * as THREE from 'three'
import CaromTable from '../Objects/Table';

export default class GameEnvironment{
    constructor(x,z){
        this.model = new THREE.Object3D(0,0,0)
        this.createModel();
    }	

    /*******************************************************************************
    * Creation du modele 3D
    *******************************************************************************/
    createModel(name){    
        //Plancher
        let floorTexture = new THREE.TextureLoader().load( require('assets/images/textures/TEST4.jpg'));
        floorTexture.repeat.set(8,8);
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;                
        let floorMaterial = new THREE.MeshPhongMaterial( { map:floorTexture });  
        let geometry = new THREE.BoxGeometry(400,5,400);  
        let floor = new THREE.Mesh(geometry, floorMaterial); 
        floor.receiveShadow = true; 
        floor.castShadow = true; 
        floor.position.set(0,-25,0); 
        this.model.add(floor)   
        this.model.castShadow = true;
        this.model.receiveShadow = true;  

        let table1 = new CaromTable(0,0,90);
        let table2 = new CaromTable(0,0,-90);
        let table3 = new CaromTable(-120,0,90);
        let table4 = new CaromTable(120,0,90);
        let table5 = new CaromTable(120,0,-90);
        let table6 = new CaromTable(-120,0,-90);
        let table7 = new CaromTable(120,0,0);
        let table8 = new CaromTable(-120,0,0);
        
        this.model.add(table1.model);
        this.model.add(table2.model);
        this.model.add(table3.model);
        this.model.add(table4.model);
        this.model.add(table5.model);
        this.model.add(table6.model);
        this.model.add(table7.model);
        this.model.add(table8.model);

        
        let wallTexture = new THREE.TextureLoader().load( require('assets/images/textures/RoomWall.jpg'));
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;  
        wallTexture.repeat.set(2,1)  
        let box = new THREE.BoxGeometry(400,200,400)
        let mat = new THREE.MeshPhongMaterial({map:wallTexture, side:THREE.BackSide});
        let wall = new THREE.Mesh(box,mat);
        //wall.position.y = -15;
        wall.receiveShadow = true;
        this.model.add(wall);

        let kr = new THREE.SphereBufferGeometry(350,40,20);
        let kt = new THREE.TextureLoader().load( require('assets/images/lol.jpg'));
        let stage = new THREE.MeshPhongMaterial({map:kt, side:THREE.BackSide});
        let sp = new THREE.Mesh(kr,stage)
        //this.model.add(sp)
    }
}