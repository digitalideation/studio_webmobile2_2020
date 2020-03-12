var Victor = require('victor');
//var vec = new Victor(42, 1337);

class Vehicle {
    constructor(x,y,ms,mf,w,h){
        this.position = new Victor(x,y);
        this.acceleration = new Victor(0,0);
        this.velocity = new Victor(0,0);
        this.r = 4;
        this.maxspeed = ms || 4;
        this.maxforce = mf || 0.1;
        this.ellipseSize = this.r * 3;
        this.xOffNoise = 0.1;
        this.colorNoise = 0.1;
        this.totalWidth = w;
        this.maxHeight = h;
        
        
    }

    run(){
        this.update();
        this.borders();
        //this.display(h);
    }

    //following flowfield
    follow(flow){
        //what is the vector at that spot in the flowfield
        let desired = flow.lookup(this.position);
        //scale it up by maxspeed
        desired.multiply(this.maxspeed);
        //steering is desired minus velocity
        let steer = desired.subtract(this.velocity);
        steer.limit(this.maxforce); //limit to maximum steering force
        this.applyForce(steer);
    }

    applyForce(force){
        //could add Mass A=F/M
        this.acceleration.add(force);
    }

    update(){
        //update velocity
        this.velocity.add(this.acceleration);
        //limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        //reset acceleration to 0
        this.acceleration.multiply(0);
        this.xOffNoise += 0.02;
        this.colorNoise += 0.01;
    }

    borders(){
        if (this.position.x < -this.r) {
            this.position.x = this.totalWidth + this.r;
        }
        if (this.position.y < -this.r) {
            this.position.y = this.maxHeight + this.r;
        }
        if (this.position.x > this.totalWidth + this.r) {
            this.position.x = -this.r;
        }
        if (this.position.y > this.maxHeight + this.r) {
            this.position.y = -this.r;
        }
        // if (this.position.x < this.r *2) {
        //         this.position.x = width - this.r;
        //     }
        //     if (this.position.y < 0) {
        //         this.position.y = height + this.r;
        //     }
        //     if (this.position.x > width) {
        //         this.position.x = 0;
        //     }
        //     if (this.position.y > height) {
        //         this.position.y = 0;
        //     }
    }

    // display(){
    //     //draw triangle rotated in direction of velocity
    //     let theta = this.velocity.heading() + PI / 2;
        
    //     push();
    //     colorMode(HSB);
    //     //let b = map(noise(this.colorNoise/2),0,1,0,360);
    //     translate(this.position.x, this.position.y);
    //     rotate(theta);
    //     fill(0,100,0);
    //     noStroke();
    //     // beginShape();
    //     // vertex(0, -this.r * 2);
    //     // vertex(-this.r, this.r * 2);
    //     // vertex(this.r, this.r * 2);
    //     // endShape(CLOSE);
    //     ellipse(0, 0, 2)
    //     //ellipse(0,-this.r*2,this.ellipseSize,this.ellipseSize);
    //     noFill();
    //     stroke(0,100,0);
    //     strokeWeight(0.3);
    //     // bezier(0,-this.r*2,0,0,map(noise(this.xOffNoise),0,1,-this.ellipseSize*2,this.ellipseSize*2),0,0,this.ellipseSize*2);
    //     //bezier(0,-this.r*2,0,this.r*2,0,this.r*2,map(noise(this.xOffNoise),0,1,-this.r*4,this.r*4),this.r*6);
    //     pop();
    // }
}

module.exports = Vehicle;