/************************************************************************************
* Projet : Carom
* Cours  : B63 Programmation Web Avancée 
* Auteur : Kevin Mwanangwa
* Fichier: Table.js 
************************************************************************************/
import * as THREE from 'three';

export default class CaromTable{
	constructor(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = 80;
		this.height = 2;
		this.depth = 40;		
		this.surfaceColor = 0x2a6f2a; 
		this.edgeColor = 0x2a6f2a;		
		this.lineColor = 0x235c23;			

		this.frameColor = 0x663300;
		this.frameLineColor = 0x4d2600;
		
		this.model = new THREE.Object3D();
		this.model.name = "Table Model"			
		this.model.position.set(this.x,this.y,this.z)	

		this.initGameSurface();	
		this.initTableFrame();	
	}

	/*******************************************************************************
    * Creation du modele 3D de la surface de jeu
    *******************************************************************************/
	initGameSurface(){
		let image = require('assets/images/textures/Table.png');
		let textureSurface = new THREE.TextureLoader().load( image);	
		//Surface de jeu		
		let surfaceGeo = new THREE.BoxGeometry( this.width-0.01, this.height, this.depth-0.01 );
		let surfaceMaterial = new THREE.MeshPhongMaterial( {map:textureSurface} );
		let edgeMaterial = new THREE.MeshPhongMaterial( {color: this.edgeColor} );
		this.surface = new THREE.Mesh( surfaceGeo, surfaceMaterial );	
		this.surface.position.y = -0.505;
		this.surface.receiveShadow = true;	
		let marginPos = 0.5;
		let marginEdge = 2;
		//LEFT,RIGHT ******************************************************************************
		let sideEdgesGeo = new THREE.BoxGeometry( this.width+marginEdge, this.height/1.8, this.height/2 );		
		
		let leftEdgeMesh =  new THREE.Mesh( sideEdgesGeo, edgeMaterial.clone() );
		leftEdgeMesh.name = "Left Edge";
		leftEdgeMesh.receiveShadow = true;
		leftEdgeMesh.position.set(0,this.height/2,this.depth/2+marginPos)		
		
		let rightEdgeMesh =  new THREE.Mesh( sideEdgesGeo, edgeMaterial.clone() );
		rightEdgeMesh.name = "Right Edge";
		rightEdgeMesh.receiveShadow = true;		
		rightEdgeMesh.position.set(0,this.height/2,-this.depth/2-marginPos);
		
		this.rightEdge = new Edge(rightEdgeMesh,new THREE.Vector3(1,0,0));
		this.leftEdge = new Edge(leftEdgeMesh,new THREE.Vector3(1,0,0));

		//TOP,BOTTOM *******************************************************************************
		let topEdgesGeo = new THREE.BoxGeometry( this.height/2, this.height/1.8, this.depth+marginEdge );		
		
		let topEdgeMesh =  new THREE.Mesh( topEdgesGeo, edgeMaterial.clone() );
		topEdgeMesh.name = "Top Edge";
		topEdgeMesh.receiveShadow = true;
		topEdgeMesh.position.set(this.width/2+marginPos,this.height/2,0)	
		
		let bottomEdgeMesh =  new THREE.Mesh( topEdgesGeo, edgeMaterial.clone() );
		bottomEdgeMesh.name = "Bottom Edge";
		bottomEdgeMesh.receiveShadow = true;
		bottomEdgeMesh.position.set(-this.width/2-marginPos,this.height/2,0)			

		this.topEdge = new Edge(topEdgeMesh,new THREE.Vector3(0,0,1));
		this.bottomEdge = new Edge(bottomEdgeMesh,new THREE.Vector3(0,0,1));

		//LINES ************************************************************************************
		let surfaceLine = new THREE.EdgesGeometry( surfaceGeo );
		let line0 = new THREE.LineSegments( surfaceLine, new THREE.LineBasicMaterial( { color: this.lineColor } ) );
		let topLines = new THREE.EdgesGeometry( topEdgesGeo );
		let line1 = new THREE.LineSegments( topLines, new THREE.LineBasicMaterial( { color: this.lineColor } ) );
		let line2 = new THREE.LineSegments( topLines, new THREE.LineBasicMaterial( { color: this.lineColor } ) );
		let sideLines = new THREE.EdgesGeometry( sideEdgesGeo );
		let line3 = new THREE.LineSegments( sideLines, new THREE.LineBasicMaterial( { color: this.lineColor } ) );
		let line4 = new THREE.LineSegments( sideLines, new THREE.LineBasicMaterial( { color: this.lineColor } ) );
		this.surface.add(line0)
		topEdgeMesh.add(line1);
		bottomEdgeMesh.add(line2);
		leftEdgeMesh.add(line3);
		rightEdgeMesh.add(line4);

		//Ajouts
		this.model.add(this.surface)
		this.model.add(leftEdgeMesh)
		this.model.add(rightEdgeMesh)	
		this.model.add(topEdgeMesh)	
		this.model.add(bottomEdgeMesh)	

		this.edges = [this.topEdge,this.bottomEdge,this.leftEdge,this.rightEdge]		
	}

	/*******************************************************************************
    * Creation du modele 3D de la table
    *******************************************************************************/
	initTableFrame(){
		let image = require('assets/images/textures/TEST.jpg');	
		let textureFrame = new THREE.TextureLoader().load( image);
		textureFrame.repeat.set(2,4);
		textureFrame.wrapS = THREE.RepeatWrapping;
		textureFrame.wrapT = THREE.RepeatWrapping;
		let frameMaterial = new THREE.MeshPhongMaterial( {map:textureFrame, side:THREE.DoubleSide, shininess: 100} );
		let marginPos = 1.51;
		let marginEdge = 4.02;
		//UNDER SURFACE
		let surfaceGeo = new THREE.BoxGeometry( this.width+1, this.height, this.depth+1 );		
		let surface = new THREE.Mesh( surfaceGeo, frameMaterial );
		surface.castShadow = true;	
		surface.position.y = -2;

		//LEFT,RIGHT ******************************************************************************
		let sideEdgesGeo = new THREE.BoxGeometry( this.width+marginEdge, this.height*3, this.height/2 );	
		let lowerSideEdgesGeo = new THREE.BoxGeometry( this.width+marginEdge, this.height, this.height/2 );		
		
		let leftEdgeMesh =  new THREE.Mesh( sideEdgesGeo, frameMaterial );
		leftEdgeMesh.position.set(0,-this.height/2,this.depth/2+marginPos)	
		leftEdgeMesh.castShadow = true;	
		leftEdgeMesh.receiveShadow = true;	
		
		let rightEdgeMesh =  new THREE.Mesh( sideEdgesGeo, frameMaterial );
		rightEdgeMesh.position.set(0,-this.height/2,-this.depth/2-marginPos)
		rightEdgeMesh.castShadow = true;
		rightEdgeMesh.receiveShadow = true;

		let lowerLeftEdgeMesh =  new THREE.Mesh( lowerSideEdgesGeo, frameMaterial );
		lowerLeftEdgeMesh.position.set(0,-this.depth/4,this.depth/2+marginPos)	
		lowerLeftEdgeMesh.castShadow = true;	
		lowerLeftEdgeMesh.receiveShadow = true;	
		
		let lowerRightEdgeMesh =  new THREE.Mesh( lowerSideEdgesGeo, frameMaterial );
		lowerRightEdgeMesh.position.set(0,-this.depth/4,-this.depth/2-marginPos)
		lowerRightEdgeMesh.castShadow = true;
		lowerRightEdgeMesh.receiveShadow = true;

		//TOP,BOTTOM *******************************************************************************
		let topEdgesGeo = new THREE.BoxGeometry( this.height/2, -this.height*3, this.depth+marginEdge );		
		let lowerTopEdgesGeo = new THREE.BoxGeometry( this.height/2, this.height, this.depth+marginEdge );		
		
		let topEdgeMesh =  new THREE.Mesh( topEdgesGeo, frameMaterial );
		topEdgeMesh.position.set(this.width/2+marginPos,-this.height/2,0);	
		topEdgeMesh.castShadow = true;
		topEdgeMesh.receiveShadow = true;
		

		let bottomEdgeMesh =  new THREE.Mesh( topEdgesGeo, frameMaterial );
		bottomEdgeMesh.position.set(-this.width/2-marginPos,-this.height/2,0);	
		bottomEdgeMesh.castShadow = true;
		bottomEdgeMesh.receiveShadow = true;


		let lowerTopEdgeMesh =  new THREE.Mesh( lowerTopEdgesGeo, frameMaterial );
		lowerTopEdgeMesh.position.set(this.width/2+marginPos,-this.depth/4,0);	
		lowerTopEdgeMesh.castShadow = true;
		lowerTopEdgeMesh.receiveShadow = true;


		let lowerBottomEdgeMesh =  new THREE.Mesh( lowerTopEdgesGeo, frameMaterial );
		lowerBottomEdgeMesh.position.set(-this.width/2-marginPos,-this.depth/4,0);	
		lowerBottomEdgeMesh.castShadow = true;
		lowerBottomEdgeMesh.receiveShadow = true;

		//TABLE LEGS *******************************************************************************
		let legMargin = this.height/2;
		let legGeo = new THREE.BoxGeometry( this.height*2, this.depth/1.5 , this.height*2);	
		let leg1 = new THREE.Mesh( legGeo, frameMaterial );	
		leg1.position.set(this.width/2 - legMargin , -this.depth/3 , this.depth/2-legMargin);	
		leg1.castShadow = true;
		leg1.receiveShadow = true;
		
		let leg2 = new THREE.Mesh( legGeo, frameMaterial );	
		leg2.position.set(-this.width/2 + legMargin , -this.depth/3 ,this.depth/2-legMargin);	
		leg2.castShadow = true;
		leg2.receiveShadow = true;
		

		let leg3 = new THREE.Mesh( legGeo, frameMaterial );	
		leg3.position.set(this.width/2 - legMargin,-this.depth/3,-this.depth/2 + legMargin);	
		leg3.castShadow = true;	
		leg3.receiveShadow = true;	


		let leg4 = new THREE.Mesh( legGeo, frameMaterial );	
		leg4.position.set(-this.width/2 + legMargin,-this.depth/3,-this.depth/2 + legMargin);
		leg3.castShadow = true;	
		leg3.receiveShadow = true;	
		
		//Ajouts
		this.model.add(surface)
		this.model.add(leg1)
		this.model.add(leg2)
		this.model.add(leg3)
		this.model.add(leg4)
		this.model.add(leftEdgeMesh)
		this.model.add(rightEdgeMesh)	
		this.model.add(topEdgeMesh)	
		this.model.add(bottomEdgeMesh)	
		this.model.add(lowerLeftEdgeMesh)
		this.model.add(lowerRightEdgeMesh)	
		this.model.add(lowerTopEdgeMesh)	
		this.model.add(lowerBottomEdgeMesh)	
	}

	/*******************************************************************************
    * Reinitialise les couleurs des bandes
    *******************************************************************************/
	reset(){
		for (let i = 0; i < this.edges.length; i++) {
			const element = this.edges[i].model;
			element.material.color.set(this.edgeColor);	
			for (let c = 0; c < element.children.length; c++) {
				const line = element.children[c];
				line.material.color.set(this.lineColor);
			}		
		}
	}
}

/*******************************************************************************
* Class : Edge
*******************************************************************************/
class Edge{
	constructor(model,orientation){
		this.model = model;
		this.direction = orientation;
		this.edgeHitValid = 0xb3b300;
		this.edgeHitValidLine = 0x999900;
		this.edgeHitInvalid = 0x0033cc;
		this.edgeHitInvalidLine = 0x002db3;
	}

	/*******************************************************************************
    * Change de couleur si valide
    *******************************************************************************/
	hasBeenTouched(){		
		this.model.material.color.set(this.edgeHitValid);
		for (let i = 0; i < this.model.children.length; i++) {
			const element = this.model.children[i];
			element.material.color.set(this.edgeHitValidLine);		
		}
	}	
}