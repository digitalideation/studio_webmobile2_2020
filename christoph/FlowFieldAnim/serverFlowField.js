/**
 * Created by hzuellig on 12.02.20.
 */
var FlowField = require('./public/p5NatureCode/flowField.js');
var flowField = [];

var Vehicle = require('./public/p5NatureCode/flowFieldVehicle.js');
var vehicles = [];

// var SimplexNoise = require('simplex-noise');

//const {FlowField,r} = require('./public/p5NatureCode/flowField.js');
//require('./public/p5NatureCode/flowField.js');
 

var express = require('express');
var app= express();
var server = app.listen(3000);

var maxH = 0;
var totalW = 0;
var resolution = 42;
var cols;
var rows;
var field;

var vehicleNumber = 2;

var totalClients=0;
var socketIds=[];


function make2Darray(n){
    let array = [];
    for (let i = 0; i < n; i++){
        array[i] = [];
    }
    return array;
}


app.use(express.static('public'));

console.log("my server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

let settings={

}

function newConnection(socket){
    //console.log("new connection");
    console.log(socket.id);

    socket.on('get', startMsg);

    function startMsg(data){

        if(!socketIds.includes(socket.id)) {
            socketIds.push(socket.id);
            totalW+=data.w;
            if (data.h > maxH){
                maxH = data.h;
            }
            totalClients++;
            cols=totalW/resolution;
            rows=maxH/resolution;
            field=make2Darray(cols);
            //console.log(totalW);
            flowField = new FlowField(resolution,cols,rows,field);
            for (let i = 0; i<vehicleNumber; i++){
                vehicles.push(new Vehicle(50,60,Math.random(0.2,4),Math.random(0.1,1),totalW,maxH))
            }
            //console.log(flowField.field)
        }


        settings={
            id: totalClients,
            socketid: socket.id,
            offsetbeginX: totalW - data.w,
            offsetendX: totalW,
            resolution: resolution,
            cols: flowField.cols,
            rows: flowField.rows,
            field: flowField.field,
            flowfield: flowField,
            vPosition: vehicles.position
        }


        io.to(socket.id).emit('get', settings);//msg geht an client der gesendet hat

    }

    setInterval(function(){
        if(vehicles.length > 0){
            calcVehicles();
        }
        io.sockets.emit('update', vehicles); //msg geht an alle clients
    }, 16); // 1000 ms / 60 -> 16.6666  entspricht ca dem timing in p5.js das 60mal pro sekunde draw aufruft
}

function calcVehicles(){

    for (let i=0; i<vehicles.length; i++){
        console.log(vehicles[i]);

         vehicles[i].follow(flowField);
         vehicles[i].run();
    }
}
