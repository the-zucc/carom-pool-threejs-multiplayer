import * as THREE from 'three';

export default class CaromTable{
	constructor(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = 80;
		this.height = 2;
		this.depth = 40;		
		this.mainColor = 0x2d782d;
		this.lineColor = 0x193c19;
		this.frameColor = 0x663300;
		this.frameLineColor = 0x4d2600;

		this.model = new THREE.Object3D();
		this.model.position.set(this.x,this.y,this.z)	

		this.initGameSurface();	
		this.initTableFrame();
		
	}

	initGameSurface(){
		//Surface de jeu		
		let surfaceGeo = new THREE.BoxGeometry( this.width-0.01, this.height, this.depth-0.01 );
		let surfaceMaterial = new THREE.MeshPhongMaterial( {color: this.mainColor} );
		this.surface = new THREE.Mesh( surfaceGeo, surfaceMaterial );	
		this.surface.position.y = -0.505;
	
		let marginPos = 0.5;
		let marginEdge = 2;
		//LEFT,RIGHT ******************************************************************************
		let sideEdgesGeo = new THREE.BoxGeometry( this.width+marginEdge, this.height/2, this.height/2 );		
		
		this.leftEdgeMesh =  new THREE.Mesh( sideEdgesGeo, surfaceMaterial );
		this.leftEdgeMesh.position.set(0,this.height/2,this.depth/2+marginPos)		
		
		this.rightEdgeMesh =  new THREE.Mesh( sideEdgesGeo, surfaceMaterial );
		this.rightEdgeMesh.position.set(0,this.height/2,-this.depth/2-marginPos)

		//TOP,BOTTOM *******************************************************************************
		let topEdgesGeo = new THREE.BoxGeometry( this.height/2, this.height/2, this.depth+marginEdge );		
		
		this.topEdgeMesh =  new THREE.Mesh( topEdgesGeo, surfaceMaterial );
		this.topEdgeMesh.position.set(this.width/2+marginPos,this.height/2,0)	
		
		this.bottomEdgeMesh =  new THREE.Mesh( topEdgesGeo, surfaceMaterial );
		this.bottomEdgeMesh.position.set(-this.width/2-marginPos,this.height/2,0)			

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
		this.topEdgeMesh.add(line1);
		this.bottomEdgeMesh.add(line2);
		this.leftEdgeMesh.add(line3);
		this.rightEdgeMesh.add(line4);

		//Ajouts
		this.model.add(this.surface)
		this.model.add(this.leftEdgeMesh)
		this.model.add(this.rightEdgeMesh)	
		this.model.add(this.topEdgeMesh)	
		this.model.add(this.bottomEdgeMesh)			
	}

	initTableFrame(){
		let frameMaterial = new THREE.MeshPhongMaterial( {color: this.frameColor} );
		let marginPos = 1.51;
		let marginEdge = 4.02;
		//LEFT,RIGHT ******************************************************************************
		let sideEdgesGeo = new THREE.BoxGeometry( this.width+marginEdge, this.height*2.85, this.height/2 );	
		let lowerSideEdgesGeo = new THREE.BoxGeometry( this.width+marginEdge, this.height, this.height/2 );		
		
		let leftEdgeMesh =  new THREE.Mesh( sideEdgesGeo, frameMaterial );
		leftEdgeMesh.position.set(0,-this.height/2,this.depth/2+marginPos)		
		
		let rightEdgeMesh =  new THREE.Mesh( sideEdgesGeo, frameMaterial );
		rightEdgeMesh.position.set(0,-this.height/2,-this.depth/2-marginPos)

		let lowerLeftEdgeMesh =  new THREE.Mesh( lowerSideEdgesGeo, frameMaterial );
		lowerLeftEdgeMesh.position.set(0,-this.depth/4,this.depth/2+marginPos)		
		
		let lowerRightEdgeMesh =  new THREE.Mesh( lowerSideEdgesGeo, frameMaterial );
		lowerRightEdgeMesh.position.set(0,-this.depth/4,-this.depth/2-marginPos)

		//TOP,BOTTOM *******************************************************************************
		let topEdgesGeo = new THREE.BoxGeometry( this.height/2, -this.height*2.85, this.depth+marginEdge );		
		let lowerTopEdgesGeo = new THREE.BoxGeometry( this.height/2, this.height, this.depth+marginEdge );		
		
		let topEdgeMesh =  new THREE.Mesh( topEdgesGeo, frameMaterial );
		topEdgeMesh.position.set(this.width/2+marginPos,-this.height/2,0);	
		
		let bottomEdgeMesh =  new THREE.Mesh( topEdgesGeo, frameMaterial );
		bottomEdgeMesh.position.set(-this.width/2-marginPos,-this.height/2,0);	
		
		let lowerTopEdgeMesh =  new THREE.Mesh( lowerTopEdgesGeo, frameMaterial );
		lowerTopEdgeMesh.position.set(this.width/2+marginPos,-this.depth/4,0);	
		
		let lowerBottomEdgeMesh =  new THREE.Mesh( lowerTopEdgesGeo, frameMaterial );
		lowerBottomEdgeMesh.position.set(-this.width/2-marginPos,-this.depth/4,0);	

		//TABLE LEGS *******************************************************************************
		let legMargin = this.height/4;
		let legGeo = new THREE.BoxGeometry( this.height*2, this.depth/2 , this.height*2);	
		let leg1 = new THREE.Mesh( legGeo, frameMaterial );	
		leg1.position.set(this.width/2 , -this.depth/4 , this.depth/2-legMargin);	

		
		let leg2 = new THREE.Mesh( legGeo, frameMaterial );	
		leg2.position.set(-this.width/2 , -this.depth/4 ,this.depth/2-legMargin);	


		let leg3 = new THREE.Mesh( legGeo, frameMaterial );	
		leg3.position.set(this.width/2,-this.depth/4,-this.depth/2);		


		let leg4 = new THREE.Mesh( legGeo, frameMaterial );	
		leg4.position.set(-this.width/2,-this.depth/4,-this.depth/2);


		//LINES ************************************************************************************		
		let topLines = new THREE.EdgesGeometry( topEdgesGeo );
		let line1 = new THREE.LineSegments( topLines, new THREE.LineBasicMaterial( { color: this.frameLineColor } ) );
		let line2 = new THREE.LineSegments( topLines, new THREE.LineBasicMaterial( { color: this.frameLineColor } ) );
		let sideLines = new THREE.EdgesGeometry( sideEdgesGeo );
		let line3 = new THREE.LineSegments( sideLines, new THREE.LineBasicMaterial( { color: this.frameLineColor } ) );
		let line4 = new THREE.LineSegments( sideLines, new THREE.LineBasicMaterial( { color: this.frameLineColor } ) );

		let lowerTopLines = new THREE.EdgesGeometry( lowerTopEdgesGeo );
		let line5 = new THREE.LineSegments( lowerTopLines, new THREE.LineBasicMaterial( { color: this.frameLineColor } ) );
		let line6 = new THREE.LineSegments( lowerTopLines, new THREE.LineBasicMaterial( { color: this.frameLineColor } ) );
		let lowerSideLines = new THREE.EdgesGeometry( lowerSideEdgesGeo );
		let line7 = new THREE.LineSegments( lowerSideLines, new THREE.LineBasicMaterial( { color: this.frameLineColor } ) );
		let line8 = new THREE.LineSegments( lowerSideLines, new THREE.LineBasicMaterial( { color: this.frameLineColor } ) );

		let legLines = new THREE.EdgesGeometry( legGeo );
		let line9 = new THREE.LineSegments( legLines, new THREE.LineBasicMaterial( { color: this.frameLineColor } ) );
		let line10 = new THREE.LineSegments( legLines, new THREE.LineBasicMaterial( { color: this.frameLineColor } ) );
		let line11 = new THREE.LineSegments( legLines, new THREE.LineBasicMaterial( { color: this.frameLineColor } ) );
		let line12 = new THREE.LineSegments( legLines, new THREE.LineBasicMaterial( { color: this.frameLineColor } ) );
		
		topEdgeMesh.add(line1);
		bottomEdgeMesh.add(line2);
		leftEdgeMesh.add(line3);
		rightEdgeMesh.add(line4);
		
		lowerTopEdgeMesh.add(line5);
		lowerBottomEdgeMesh.add(line6);
		lowerLeftEdgeMesh.add(line7);
		lowerRightEdgeMesh.add(line8);

		leg1.add(line9)
		leg2.add(line10)
		leg3.add(line11)
		leg4.add(line12)

		//Ajouts
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
}