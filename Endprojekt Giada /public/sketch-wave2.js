var socket;
var outDiam = 0;
let circleClicked = 0;
let clickPosX, clickPosY;
let offsetbeginX;
var song;
let opacityCol;
let lineWeight;

let settings = {};

function setup() {
    createCanvas(windowWidth, windowHeight);

    settings.w = width;
    song = loadSound("water effect echo.mp3", loaded);

    socket = io.connect("http://localhost:3000/");
    //socket = io.connect("172.20.10.2:3000/");

    socket.on("click", newCircle);

    socket.emit("get", settings);
    socket.on("get", getSettings);
    socket.on("update", updateSettings);

    background(0);
}

function loaded() {}

function getSettings(data) {
    settings = data;
    console.log(settings);
}

function updateSettings(data) {
    // settings.xvalue = data;
    //console.log(settings.xvalue);
}

function newCircle(data) {

    // console.log(data);
    clickPosX = data.x;
    clickPosY = data.y;
    circleClicked = 1;

    outDiam = 0;
}

//function touchStarted() {
function mouseClicked() {

    song.play();

    var data = {
        x: mouseX + settings.offsetbeginX,
        y: mouseY
    }
    socket.emit("click", data);
}

function draw() {
    if (circleClicked == 1) {
        // let gradient = map(mouseX + mouseY, 240, width + height, 240, 80);
        //background(0, 40, gradient);
        background(0, 0, 0, 100);

        push();
        translate(-settings.offsetbeginX, 0);

        for (let count = 0; count < 3; count++) {
            let diam = outDiam - 50 * count;
            if (diam > 0) {
                noFill();
                opacityCol = map(diam, 0, width, 255, 0);
                lineWeight = map(diam, 0, width, 1, 20)
                stroke(255, 255, 255, opacityCol);
                strokeWeight(lineWeight);
                ellipse(clickPosX, clickPosY, diam);
            }
            outDiam = outDiam + 2;
        }

        pop();
    }

}