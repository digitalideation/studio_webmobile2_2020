let socket;
let settings={};

//using this variable to decide whether to draw all the stuff
let debug = true;

function setup(){
    createCanvas(windowWidth,windowHeight);
    background(255);

    pixelDensity(2); //retina sollte 2 haben

    settings.w = width;
    settings.h = height;

    socket=io.connect("http://localhost:3000");
    socket.emit('get',settings); //einmalige Anmeldung

    socket.on('get',getSettings);
    //socket.on('update',updateSettings);


    //new flowfield witch resolution of 20
    //flowField = new FlowField(20);

    //bunch of vehicles with random maxspeed and maxforce
    // for (let i=0;i<2000;i++){
    //     vehicles.push(new Vehicle(random(width), random(height), random(0.2,4), random(0.1,1)));
    // }
}

function getSettings(data){
    settings=data;
}

//let colorNoise = 0.1;

function draw(){
    //background(255,5,5);

    //display Flowfield in debug mode
    if (debug == true) {
        displayFlow();
    }
    //displayVehicles();

    // for (let i = 0; i < settings.numVehicle; i++){
    //     vehicles[i].follow(settings.flowfield);
    //     vehicles[i].run(random(0,360));
    // }
    //colorNoise+=0.01;
        

}


//draw every vector
function displayFlow(){
    let localX = 0;
    for (let i = floor(settings.offsetbeginX/settings.resolution); i < floor(settings.offsetendX/settings.resolution); i++){
        for(let j = 0; j< settings.rows; j++){
            this.drawVectorFlow(settings.field[i][j], localX * settings.resolution, j * settings.resolution, settings.resolution-2);
        //console.log(settings.field[i][j]);
        }
        localX ++;
    }
}

//renders a vector object 'v' as an arrow and a location 'x,y'
function drawVectorFlow(v,x,y,scayl){
    v=createVector(v.x,v.y); 
    push();
    //translate location to render Vector
    translate(x,y);
    stroke(0,100);
    //call vector heading function to get direction (pointing to right is heading of 0)
    rotate(v.heading());
    //calculate length of vector & scale it
    let len = v.mag() * scayl;
    //draw 
    stroke(0);
    strokeWeight(2);
    line(0,0,len,0);
    pop();
}

function displayVehicles(){
    //draw triangle rotated in direction of velocity
    let theta = this.velocity.heading() + PI / 2;
    
    push();
    colorMode(HSB);
    //let b = map(noise(this.colorNoise/2),0,1,0,360);
    translate(settings.vPosition.x, settings.vPosition.y);
    rotate(theta);
    fill(0,100,0);
    noStroke();
    // beginShape();
    // vertex(0, -this.r * 2);
    // vertex(-this.r, this.r * 2);
    // vertex(this.r, this.r * 2);
    // endShape(CLOSE);
    ellipse(0, 0, 2)
    //ellipse(0,-this.r*2,this.ellipseSize,this.ellipseSize);
    noFill();
    stroke(0,100,0);
    strokeWeight(0.3);
    // bezier(0,-this.r*2,0,0,map(noise(this.xOffNoise),0,1,-this.ellipseSize*2,this.ellipseSize*2),0,0,this.ellipseSize*2);
    //bezier(0,-this.r*2,0,this.r*2,0,this.r*2,map(noise(this.xOffNoise),0,1,-this.r*4,this.r*4),this.r*6);
    pop();
}

function keyPressed(){
    if (key == ' ') { //space
        debug = !debug;
    }
}

// //new flowfield
// function mousePressed(){
//     flowField.init();
//     // for (let i=0;i<42;i++){
//     //     vehicles.push(new Vehicle(random(width), random(height), random(2,5), random(0.1,0.5)));
//     // }
// }