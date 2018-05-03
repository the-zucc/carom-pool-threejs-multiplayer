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
		this.edgeColor = 0x2d782d;
		this.lineColor = 0x235c23;
		this.frameColor = 0x663300;
		this.frameLineColor = 0x4d2600;

		this.model = new THREE.Object3D();
		this.model.name = "Table Model"	
		this.model.position.set(this.x,this.y,this.z)	

		this.initGameSurface();	
		this.initTableFrame();

		this.edges = [this.topEdge,this.bottomEdge,this.leftEdge,this.rightEdge];
		this.cornerMax = new THREE.Vector3(this.width/2-0.75, 1.5 ,this.depth/2-0.75)
		this.cornerMin = new THREE.Vector3(-this.width/2+0.75, 1.5 ,-this.depth/2+0.75)	

		//TEMPORAIRE TEST
		let LIMIT = new THREE.BoxGeometry(0.1,20,0.1)
		let mat = new THREE.MeshPhongMaterial( {color: 0xFF0000} );

		let tmp1 = new THREE.Mesh( LIMIT, mat );	
		tmp1.position.copy(this.cornerMax)

		let tmp2 = new THREE.Mesh( LIMIT, mat );	
		tmp2.position.copy(this.cornerMin)
		this.model.add(tmp1)
		this.model.add(tmp2)	
	}

	initGameSurface(){
		//Surface de jeu		
		let surfaceGeo = new THREE.BoxGeometry( this.width-0.01, this.height, this.depth-0.01 );
		let surfaceMaterial = new THREE.MeshPhongMaterial( {color: this.surfaceColor} );
		let edgeMaterial = new THREE.MeshPhongMaterial( {color: this.edgeColor} );
		this.surface = new THREE.Mesh( surfaceGeo, surfaceMaterial );	
		this.surface.position.y = -0.505;
	
		let marginPos = 0.5;
		let marginEdge = 2;
		//LEFT,RIGHT ******************************************************************************
		let sideEdgesGeo = new THREE.BoxGeometry( this.width+marginEdge, this.height/2, this.height/2 );		
		
		let leftEdgeMesh =  new THREE.Mesh( sideEdgesGeo, edgeMaterial );
		leftEdgeMesh.name = "Left Edge";
		leftEdgeMesh.position.set(0,this.height/2,this.depth/2+marginPos)		
		
		let rightEdgeMesh =  new THREE.Mesh( sideEdgesGeo, edgeMaterial );
		rightEdgeMesh.name = "Right Edge";
		rightEdgeMesh.position.set(0,this.height/2,-this.depth/2-marginPos);
		
		this.rightEdge = new Edge(rightEdgeMesh,new THREE.Vector3(1,0,0));
		this.leftEdge = new Edge(leftEdgeMesh,new THREE.Vector3(1,0,0));

		//TOP,BOTTOM *******************************************************************************
		let topEdgesGeo = new THREE.BoxGeometry( this.height/2, this.height/2, this.depth+marginEdge );		
		
		let topEdgeMesh =  new THREE.Mesh( topEdgesGeo, edgeMaterial );
		topEdgeMesh.name = "Top Edge";
		topEdgeMesh.position.set(this.width/2+marginPos,this.height/2,0)	
		
		let bottomEdgeMesh =  new THREE.Mesh( topEdgesGeo, edgeMaterial );
		bottomEdgeMesh.name = "Bottom Edge";
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
	}

	initTableFrame(){
		let frameMaterial = new THREE.MeshPhongMaterial( {color: this.frameColor, transparent:true, opacity:1} );
		let marginPos = 1.51;
		let marginEdge = 4.02;
		//UNDER SURFACE
		let surfaceGeo = new THREE.BoxGeometry( this.width+1, this.height, this.depth+1 );		
		let surface = new THREE.Mesh( surfaceGeo, frameMaterial );	
		surface.position.y = -2;

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
		let legMargin = this.height/2;
		let legGeo = new THREE.BoxGeometry( this.height*2, this.depth/1.5 , this.height*2);	
		let leg1 = new THREE.Mesh( legGeo, frameMaterial );	
		leg1.position.set(this.width/2 - legMargin , -this.depth/3 , this.depth/2-legMargin);	

		
		let leg2 = new THREE.Mesh( legGeo, frameMaterial );	
		leg2.position.set(-this.width/2 + legMargin , -this.depth/3 ,this.depth/2-legMargin);	


		let leg3 = new THREE.Mesh( legGeo, frameMaterial );	
		leg3.position.set(this.width/2 - legMargin,-this.depth/3,-this.depth/2 + legMargin);		


		let leg4 = new THREE.Mesh( legGeo, frameMaterial );	
		leg4.position.set(-this.width/2 + legMargin,-this.depth/3,-this.depth/2 + legMargin);


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
}

class Edge{
	constructor(model,orientation){
		this.model = model;
		this.direction = orientation;
	}
}