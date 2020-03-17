let xspacing = 16; // Distance between each horizontal location

let w; // Width of entire wave

let theta = 0.0; // Start angle at 0

let amplitude = 75.0; // Height of wave

let period = 500.0; // How many pixels before the wave repeats

let yvalue = []; // Using an array to store height values for the wave

var express = require('express');

var app = express();

var server = app.listen(3000);

var totalW = 0;

var totalClients = 0;

var offsetTop = 211;

let dx = (Math.PI / period) * xspacing; // Value for incrementing x

var socketIds = [];



app.use(express.static('public'));

console.log("my server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

var settings = {}

function newConnection(socket) {
    //console.log("new connection");
    console.log(socket.id);


    socket.on('get', startMsg);


    function startMsg(data) {

        if (!socketIds.includes(socket.id)) {
            socketIds.push(socket.id);
            totalW += data.w;
            totalClients++;

            yvalue = new Array(Math.floor(totalW / xspacing));
        }

        settings = {
            id: totalClients,
            socketid: socket.id,
            offsetbeginX: totalW - data.w,
            offsetendX: totalW,
            offsetTop: offsetTop,
            xspacing: xspacing,
            dx: dx,
        }

        io.to(socket.id).emit('get', settings); //msg geht an client der gesendet hat

    }

    setInterval(function () {
        calcWave();
        io.sockets.emit('update', yvalue); //msg geht an alle clients
    }, 16); // 1000 ms / 60 -> 16.6666  entspricht ca dem timing in p5.js das 60mal pro sekunde draw aufruft

}

function calcWave() {
    // Increment theta (try different values for
    // 'angular velocity' here)
    theta += 0.02;

    // For every x value, calculate a y value with sine function
    let x = theta;
    for (let i = 0; i < yvalue.length; i++) {
        yvalue[i] = Math.sin(x) * amplitude;
        x += dx;
    }
    //console.log(yvalue);
}