console.log("YESSS");

var express = require("express");
var app = express();
var server = app.listen(3000);

app.use(express.static("public"));

console.log("IT'S WORKING");

var socket = require("socket.io");
var io = socket(server);

io.sockets.on("connection", newConnection);

var totalW = 0;
var totalClients = 0;
var settings = {}



function newConnection(socket) {

    //console.log(socket.id);
    socket.on("get", mouseMsg);

    function mouseMsg(data) {

        console.log(data.w);
        // socket.broadcast.emit("click", data);
        totalW += data.w; //totalW = totalW + data.w
        settings = {
            id: totalClients,
            socketid: socket.id,
            offsetbeginX: totalW - data.w,
            offsetendX: totalW,
        }
        io.to(socket.id).emit("get", settings);
    }
    socket.on("click", newCircle);

    function newCircle(data) {
        io.sockets.emit("click", data); // msg to all clients 
    }
}