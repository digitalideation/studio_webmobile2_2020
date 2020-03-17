let waves = [];
let num_waves; //no waves on the canvas at first
var outDiam = 0;
let opacityCol;
let lineWeight;
var song;

function setup() {

    createCanvas(windowWidth, windowHeight);
    background(0);
    //socket = io.connect("172.20.10.2:3000/");
    socket = io.connect("http://localhost:3000/");
    song = loadSound("water effect echo.mp3", loaded);
}

function loaded() {}

function touchStarted() {
    //function mouseClicked() {
    let mywave = new Wave(mouseX, mouseY)
    //outDiam = 0;
    waves.push(mywave);
    song.play();
    socket.emit("click", data);

}

function draw() {
    //let gradient = map(mouseX + mouseY, 240, width + height, 240, 80);
    //background(0, 40, gradient);
    background(0);
    for (const wav of waves) wav.display();
}

class Wave {
    constructor(posX, posY) {
        this.x = posX;
        this.y = posY;
        this.outDiam = 0;
    }

    display() {
        for (let count = 0; count < 4; count++) {
            let diam = this.outDiam - 60 * count;
            if (diam > 0) {
                noFill();
                opacityCol = map(diam, 0, width, 255, 0);
                lineWeight = map(diam, 0, width, 1, 20)
                stroke(255, 255, 255, opacityCol);
                strokeWeight(lineWeight);
                ellipse(this.x, this.y, diam);
                //ellipse(this.x, this.y, 30);
            }
        }
        this.outDiam = this.outDiam + 10;
    }
}