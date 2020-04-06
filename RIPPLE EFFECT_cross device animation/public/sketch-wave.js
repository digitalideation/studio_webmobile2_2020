var socket;
var outDiam = 0;
let circleClicked = 0;
let clickPosX, clickPosY;
let offsetbeginX;
var sound;
let opacityCol;
let lineWeight;
let waves = [];
let num_waves; //no waves on the canvas at first
let gradientBlue;
let gradientGreen;

let settings = {};

function setup() {
    createCanvas(windowWidth, windowHeight);

    settings.w = width;
    sound = loadSound("water effect echo.mp3", loaded);

    socket = io.connect("http://localhost:3000/");

    socket.on("click", newCircle);

    socket.emit("get", settings);
    socket.on("get", getSettings);

    background(0);
}

function loaded() {}

function getSettings(data) {
    settings = data;
    console.log(settings);
}


function newCircle(data) {
    //console.log(data);
    clickPosX = data.x;
    clickPosY = data.y;
    circleClicked = 1;

    outDiam = 0;

    let mywave = new Wave(data.x, data.y);
    waves.push(mywave);
}

function touchStarted() {
    //function mouseClicked() {

    sound.play();

    var data = {
        x: mouseX + settings.offsetbeginX,
        y: mouseY
    }
    socket.emit("click", data);
}

function draw() {

    gradientBlue = map(clickPosY, 120, windowHeight, 120, 30);
    gradientGreen = map(clickPosY, 80, windowHeight, 80, 0);

    background(10, gradientGreen, gradientBlue, 100);

    let volumeSound = map(mouseX, 0.1, width, 0.1, 1);
    sound.amp(volumeSound);

    let speedSound = map(mouseY, 2, height, 2, 0.5);
    sound.rate(speedSound);

    for (const wav of waves) wav.display();

}

class Wave {
    constructor(clickPosX, clickPosY) {
        this.x = clickPosX;
        this.y = clickPosY;
        this.outDiam = 0;
    }

    display() {

        if (circleClicked) {

            push();
            translate(-settings.offsetbeginX, 0);

            for (let count = 0; count < 5; count++) {
                let diam = this.outDiam - 80 * count;
                if (diam > 0) {
                    noFill();
                    opacityCol = map(diam, 0, width * 2, 200, 0);
                    lineWeight = map(diam, 0, width * 2, 10, 1)
                    stroke(255, 255, 255, opacityCol);
                    strokeWeight(lineWeight);
                    ellipse(this.x, this.y, diam);
                }
            }
            this.outDiam = this.outDiam + 10;
            pop();
        }
    }
}