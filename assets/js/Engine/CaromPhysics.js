/************************************************************************************
* Projet : Carom
* Cours  : B63 Programmation Web Avancée 
* Auteur : Kevin Mwanangwa
* Fichier: CaromPhysics.js 
************************************************************************************/
import * as THREE from 'three';
export default class CaromPhysics{
    constructor(modele){  
        this.isStationary = new THREE.Vector3(0,0,0);
        this.lowestSpeed = 0.005; //Vitesse minimum avant de clamper
        this.friction = 0.012; //Perte de mouvement à chaque déplacement
        this.cushionAbsorbtion = 0.05; //Perte de mouvement àpres collision avec une bande
        this.modele = modele;  //Reference au modele parent    
        this.trails = []; //Tableau qui contient les trainées/trajectoires
    }

    /*******************************************************************************
    * Calcul toutes le collision qui arriveront dans le frame actuel
    *******************************************************************************/
    detectAllCollisions(){    
        let balls = this.modele.boules;
        let n = balls.length;
        let currentFrameCollisions = [];
		for (let i = 0; i < n; i++) {
            const ball1 = balls[i];	            		
            //Optimisation pour eviter une double comparaison
            if (i < (n-1)) {
                for (let j = i + 1; j < n; j++) {
                    const ball2 = balls[j];       
                    
                    //Predire les collision entre les deux boules actuelles
                    let t = this.getCollisionTime(ball1,ball2);

                    //Si il y a une collision future ET elle se produira pendant le frame actuel ( <= 1)
                    if (t !== null && t >= 0 && t <= 1) {                        
                        //Ajouter collision a la liste
                        currentFrameCollisions.push({
                            t: t,
                            ballA: ball1,
                            ballB: ball2
                        })											
                    }					
                }
            }			
        }	
        return currentFrameCollisions;
    }

    /******************************************************************************* 
    * Calcul le plus petit temps d'impact entre deux balles
    *******************************************************************************/
    getCollisionTime(ball1,ball2) {
        //Recuperer les donnes des deux balles
        let x1 = ball1.model.position.x;
        let y1 = ball1.model.position.z;
        let vX1 = ball1.velocity.x;
        let vY1 = ball1.velocity.z;
        let r1 = ball1.radius;

        let x2 = ball2.model.position.x;
        let y2 = ball2.model.position.z;
        let vX2 = ball2.velocity.x;
        let vY2 = ball2.velocity.z;
        let r2 = ball2.radius;

        //Parametres de l'equation
        let a, b, c, d, t1, t2;
        let tmp1 = new THREE.Vector2(),
            tmp2 = new THREE.Vector2(),
            tmp1Length, 
            tmp2Length, 
            rSum;
            
   
        //Balle 1 ***********************************************
        //Position actuelle de la balle 1 
        let p0 = new THREE.Vector2();
        p0.set(x1, y1);

        //Prochaine position de la balle 1
        let pf = new THREE.Vector2();
        pf.set(x1 + vX1, y1 + vY1);

        //Delta position balle 1
        let dp = pf.sub(p0);

        //Balle 2 ***********************************************
        //Position actuelle de la balle 2 
        let q0 = new THREE.Vector2();
        q0.set(x2, y2);

        //Prochaine position de la balle 2
        let qf = new THREE.Vector2();
        qf.set(x2 + vX2, y2 + vY2);

        //Delta position balle 1
        let dq = qf.sub(q0); 

        //Calculer A de la quadratique **************************
        tmp1.subVectors(dq, dp);
        tmp1Length = tmp1.length();
        a = tmp1Length * tmp1Length;

        //Calculer B de la quadratique **************************
        tmp2.subVectors(q0, p0);
        tmp2.multiplyScalar(2);
        b = tmp2.dot(tmp1);

        //Calculer C de la quadratique **************************
        tmp2.subVectors(q0, p0);
        tmp2Length = tmp2.length();
        rSum = r1 + r2;
        c = (tmp2Length * tmp2Length) - ( rSum * rSum );

        //Solution de la quadratique
        let bSquared = b * b;
        let fourAC = 4 * a * c;
        let diff = bSquared - fourAC;

        //Si la difference est superieure a 0, retourne le plus petit temps d'impact
        if (diff >= 0) {
            d = Math.sqrt(diff);
            t1 = (-b + d) / (2 * a);
            t2 = (-b - d) / (2 * a);
            return Math.min(t1, t2);
        }
        else {
            return null;
        }
    }

    /*******************************************************************************
    * Detecte les collision entre les balles et rebords de la table
    *******************************************************************************/
    detectBallToEdgeCollisions(){
        let table = this.modele.table;
        let balls= this.modele.boules;
        let halfWidth  = table.width  / 2,
            halfHeight = table.depth / 2; 
        let hit = null;  //Retourne la bande frappee SEULEMENT si frappee par la boule du joueur actuel             
        let current = this.modele.controlleur.currentPlayer.nom;
        for(let i = 0; i < balls.length; i++){
            const ball = balls[i];  
            
            let m = ball.model,
                r = ball.radius                
         
            //Verifier si la balle est hors des limites de la tables
            if (m.position.x+r > halfWidth) {
                m.position.x = halfWidth - r;
                /*******IF DEBUGGING*******/
                if(this.modele.controlleur.isDebugging){this.showBounce(ball)}    
                
                ball.velocity.x *= -1 //inverser le X                  
                hit = m.name == current ? table.topEdge: null;    
                //Perte d'absorption
                ball.velocity.sub(ball.velocity.clone().multiplyScalar(this.cushionAbsorbtion)) 
                    
            }
            else if (m.position.x-r < -halfWidth) {
                m.position.x = -halfWidth + r;
                /*******IF DEBUGGING*******/
                if(this.modele.controlleur.isDebugging){this.showBounce(ball)}    

                ball.velocity.x *= -1 //inverser le X               
                hit = m.name == current ? table.bottomEdge: null; 
                //Perte d'absorption
                ball.velocity.sub(ball.velocity.clone().multiplyScalar(this.cushionAbsorbtion)) 
                            
            }

            if (m.position.z+r > halfHeight) {
                m.position.z = halfHeight - r;
                /*******IF DEBUGGING*******/
                if(this.modele.controlleur.isDebugging){this.showBounce(ball)}  

                ball.velocity.z *= -1 //inverser le Z
                hit = m.name == current ? table.leftEdge: null;  
                //Perte d'absorption
                ball.velocity.sub(ball.velocity.clone().multiplyScalar(this.cushionAbsorbtion)) 
                     
            }
            else if (m.position.z-r < -halfHeight) {                
                m.position.z = -halfHeight + r;
                /*******IF DEBUGGING*******/
                if(this.modele.controlleur.isDebugging){this.showBounce(ball)}    

                ball.velocity.z *= -1 //inverser le Z
                hit = m.name == current ? table.rightEdge: null;  
                //Perte d'absorption
                ball.velocity.sub(ball.velocity.clone().multiplyScalar(this.cushionAbsorbtion)) 
                           
            }            
        }        
          
        return hit;
    }    
    
    /*******************************************************************************
    * Montre rebonds et forces des impact
    *******************************************************************************/
    showBounce(ball){   
        this.showTrail(ball);       
        ball.lastCollision = ball.model.position.clone();
        ball.trail = null;
    }

    /*******************************************************************************
    * Montrer les trainées et trajectoires
    *******************************************************************************/
    showTrail(ball){
        //Si le trail actuel est null, init
        if(ball.trail == undefined || ball.trail == null){
            ball.trail = new THREE.ArrowHelper(ball.velocity.clone(),ball.model.position.clone(),0.1,ball.couleur,1,1);    
            this.trails.push(ball.trail)   
            this.modele.controlleur.vue.scene.add(ball.trail)
        }
        //Update le trail actuel en fonction de la distance voyagée depuis la dernière collision
        let distance = ball.lastCollision.clone().distanceTo(ball.model.position)
        ball.trail.setLength(distance,1,1);        
    }

    clearTrails(){
        //Effacer tous les trails en séquence à la fin du tour
        let baseTime = 100;
        let delta = 100;
        for (let i = 0; i < this.trails.length; i++) {
            const trail = this.trails[i];
            setTimeout( ()=>{
                this.modele.controlleur.vue.scene.remove(trail);                
            }, baseTime)
            baseTime += delta;
        }
        this.trails = []
    }

    /*******************************************************************************
    * Applique une translation fractionnaire sur toutes les balles
    *******************************************************************************/
    translateAllBallsByFraction(fraction){
        let balls = this.modele.boules;
        let i, n, ball, ba = balls;
        for (i = 0, n = ba.length; i < n; i++) {
            ball = ba[i];
            if(!ball.velocity.equals(this.isStationary)){
                /*******IF DEBUGGING*******/
                if(this.modele.controlleur.isDebugging){this.showTrail(ball); }      

                //Deplace toutes les balles d'une fraction de leur vecteur de mouvement
                ball.model.position.add(ball.velocity.clone().multiplyScalar(fraction));  
                //Applique la friction
                ball.velocity.sub(ball.velocity.clone().multiplyScalar(this.friction*fraction)) 
                //Si vitesse trop petite, arondir a 0
                if(Math.abs(ball.velocity.x) < this.lowestSpeed){
                    ball.velocity.x = 0;                    
                }
                if(Math.abs(ball.velocity.z) < this.lowestSpeed){
                    ball.velocity.z = 0;                    
                }          
            }                    
        }  
    }

    /*******************************************************************************
    * Calcule la collision entre deux balles
    *******************************************************************************/
    ballToBallCollision(ball1,ball2) {  
        let x1 = ball1.model.position.x;
        let y1 = ball1.model.position.z;
        let vX1 = ball1.velocity.x;
        let vY1 = ball1.velocity.z;
        let m1 = ball1.mass;
        
        let x2 = ball2.model.position.x;
        let y2 = ball2.model.position.z;
        let vX2 = ball2.velocity.x;
        let vY2 = ball2.velocity.z;
        let m2 = ball2.mass;

        let deltaX = x2 - x1,  deltaY = y2 - y1;

        //Calculs Trigo
        let angle = Math.atan2(deltaY, deltaX),
            sin = Math.sin(angle),
            cos = Math.cos(angle),
            e = 1, //Coefficient de transfert 

        //Calcul de la rotation du vector de la boule1
            vel0 = this.rotateCoords(vX1, vY1, sin, cos, true),
        // Calcul de la rotation du vector de la boule2
            vel1 = this.rotateCoords(vX2, vY2, sin, cos, true);

        //Appliquer la conservation de l'inertie
        let tmp = 1 / (m1 + m2);
        let newVxBall0 = (m1 - e * m2) * vel0.x * tmp + (1 + e) * m2 * vel1.x * tmp;
        let newVxBall1 = (1 + e) * m1 * vel0.x * tmp + (m2 - e * m1) * vel1.x * tmp;

        //Appliquer la perte causée par la friction lors d'une collision oblique
        let obliquenessDetectionVx, obliquenessDetectionVy;
        if (vel0.x === 0 && vel0.y === 0) {
            obliquenessDetectionVx = vel1.x;
            obliquenessDetectionVy = vel1.y;
        }
        else {
            obliquenessDetectionVx = vel0.x;
            obliquenessDetectionVy = vel0.y;
        }

        if (this.isObliqueBallCollision(obliquenessDetectionVx, obliquenessDetectionVy, deltaX, deltaY)) {
            let fiveSeventh = 5 / 7;           
            vel0.y = fiveSeventh * vel0.y;
            vel1.y = fiveSeventh * vel1.y;
        }

        //Undo la rotation
        let vel0F = this.rotateCoords(newVxBall0, vel0.y, sin, cos, false),
            vel1F = this.rotateCoords(newVxBall1, vel1.y, sin, cos, false);

        //Appliquer/changer les nouveaux vecteurs de velocite
        ball1.velocity.x = vel0F.x;
        ball1.velocity.z = vel0F.y;
        ball2.velocity.x = vel1F.x;
        ball2.velocity.z = vel1F.y;   
        
       /*******IF DEBUGGING*******/
        if(this.modele.controlleur.isDebugging){
            this.showBounce(ball1)
            this.showBounce(ball2)       
        }

        //Return boule touchee par la notre
        let current = this.modele.controlleur.currentPlayer.nom       
        if(ball1.model.name == current){    
            return ball2;
        }
        else if(ball2.model.name == current){           
            return ball1;
        }
        else return null;
    }    

    /*******************************************************************************
    * Verifie si la collision est oblique/diagonale
    *******************************************************************************/
    isObliqueBallCollision(vX0, vY0, vX1, vY1) {
        //Calcule le produit DOT (scalaire)
        let dotProduct = vX0 * vX1 + vY0 * vY1;        
        let V0 = Math.sqrt(vX0*vX0 + vY0*vY0);
        let V1 = Math.sqrt(vX1*vX1 + vY1*vY1);

        //Calculer l'angle entre les deux
        let cosAngle = dotProduct / (V0 * V1);

        //Calculer l'angle
        let angle = Math.acos(cosAngle);

        //La collision est oblique si elle n'est pas un multiple de Pi/2 (90 degrees)
        return (angle % (Math.PI/2)) !== 0;
    }

    /*******************************************************************************
    * Appliquer une rotation sur les coords données
    *******************************************************************************/
    rotateCoords(x, y, sin, cos, reverse) {
        return {
            x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
            y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
        };
    }
}