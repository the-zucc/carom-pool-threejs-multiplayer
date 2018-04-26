class CaromTable{
	constructor(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = 80;
		this.height = 2;
		this.depth = 40;
		this.mainColor = 0x2d782d;
		this.lineColor = 0x193c19;

		this.model = new THREE.Object3D();
		this.model.position.set(this.x,this.y,this.z)	
		
		this.initGameSurface();			
	}

	initGameSurface(){
		//Surface de jeu		
		let surfaceGeo = new THREE.BoxGeometry( this.width, this.height, this.depth );
		let surfaceMaterial = new THREE.MeshPhongMaterial( {color: this.mainColor} );
		this.surface = new THREE.Mesh( surfaceGeo, surfaceMaterial );	
		this.surface.position.y = -0.9;
	
		let margin = 1;
		//LEFT,RIGHT ******************************************************************************
		let sideEdgesGeo = new THREE.BoxGeometry( this.width+margin, this.height/2, this.height/2 );		
		
		this.leftEdgeMesh =  new THREE.Mesh( sideEdgesGeo, surfaceMaterial );
		this.leftEdgeMesh.position.set(0,this.height/2,this.depth/2)		
		
		this.rightEdgeMesh =  new THREE.Mesh( sideEdgesGeo, surfaceMaterial );
		this.rightEdgeMesh.position.set(0,this.height/2,-this.depth/2)

		//TOP,BOTTOM *******************************************************************************
		let topEdgesGeo = new THREE.BoxGeometry( this.height/2, this.height/2, this.depth+margin );		
		
		this.topEdgeMesh =  new THREE.Mesh( topEdgesGeo, surfaceMaterial );
		this.topEdgeMesh.position.set(this.width/2,this.height/2,0)	
		
		this.bottomEdgeMesh =  new THREE.Mesh( topEdgesGeo, surfaceMaterial );
		this.bottomEdgeMesh.position.set(-this.width/2,this.height/2,0)			

		//LINES 
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

	}
}