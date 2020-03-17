var socket;
var outDiam = 0;
let circleClicked = 0;
let clickPosX, clickPosY;


function setup() {
    createCanvas(windowWidth, windowHeight);
    socket = io.connect("http://localhost:3000/");

    socket.on("click", newCircle);

    background(0);
}


function newCircle(data) {

    // console.log(data);
    clickPosX = data.x;
    clickPosY = data.y;
    circleClicked = 1;

    outDiam = 0;

}

function mouseClicked() {

    var data = {
        x: mouseX,
        y: mouseY
    }
    socket.emit("click", data);
}

function draw() {
    if (circleClicked == 1) {
        background(0, 0, 0, 100);

        for (let count = 0; count < 3; count++) {
            let diam = outDiam - 50 * count;
            if (diam > 0) {
                noFill();
                stroke(255);
                strokeWeight(3);
                ellipse(clickPosX, clickPosY, diam);
            }
            outDiam = outDiam + 2;
        }
    }

}