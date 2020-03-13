/**
 * Created by hzuellig on 12.02.20.
 * changed Karin 12.02.20
 */
var express = require('express');
var app= express();
var socket = require('socket.io');
var path = require('path');

//var server = app.listen(3000);
var server = app.listen(process.env.PORT || 80);


var socketIds=[];


// Variabeln für to next Screen
let totalW=0;
var totalClients=0;

var oldMaxAmp=0;

//variabeln von Sketch


var amplitud =[];

let xspacing = 10; // Distance between each horizontal location



let theta = 0.0; // Start angle at 0
let Maxamplitude = 0; // Height of wave
let period = 600.0; // How many pixels before the wave repeats
let Nperiod = 50.0; // How many pixels before the wave repeats

let Newyvalues =[];
let yvalues =[]; // Using an array to store height values for the wave
let dx = (Math.PI*2 / period) * xspacing;// Value for incrementing x
let Ndx = (Math.PI*2 / Nperiod) * xspacing;// Value for incrementing x


var offsetTop=350;
var NewoffsetTop=400;

 

//socket Angaben

app.use(express.static(path.join(__dirname, "public")));

console.log("my server is running");

var io = socket(server);
io.sockets.on('connection', newConnection);

let settings={

}




function newConnection(socket){
    //console.log("new connection");
    //console.log(socket.id);
    socket.on('get', startMsg);



        function startMsg(data){

        if(!socketIds.includes(socket.id)) {
            socketIds.push(socket.id);
            totalW+=data.w;
            totalClients++; //zählen der Clients
            yvalues = new Array(Math.floor(totalW/xspacing));
            Newyvalues = new Array(Math.floor(totalW/xspacing));
           

        }


        settings={
            id:totalClients,
            socketid:socket.id,
            offsetbeginX:totalW - data.w,
            offsetendX:totalW,
            offsetTop:offsetTop,
            NewoffsetTop:NewoffsetTop,
            xspacing:xspacing,
            dx:dx,
            Ndx:Ndx
           


        }


        io.to(socket.id).emit('get', settings);//msg geht an client der gesendet hat

    }//ende startMsg
        socket.on("waveMic",waveMicMsg);

        function waveMicMsg (data){
            if(!isNaN(data.vol)){

                amplitud.push(data.vol);
                Maxamplitude = getMaxOfArray(amplitud);

                if(Maxamplitude < oldMaxAmp){
                    Maxamplitude=oldMaxAmp*0.5;
                }

                oldMaxAmp = Maxamplitude;
               // console.log(Maxamplitude);
    
               // Maxamplitude = scale(max,0,1,0,800); //Amplitud höhe 
            }
            

        //io.socket.emit ("waveMic", max);
        if(amplitud.length>15){
            amplitud.splice(0,1);
        
        }

        function getMaxOfArray(numArray) {
            return Math.max.apply(null, numArray);
          }
       
        }

    }
function scale (num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
    setInterval(function(){
        calcWave();
        io.sockets.emit('update',yvalues, Newyvalues ); //msg geht an alle clients
    }, 16); // 1000 ms / 60 -> 16.6666  entspricht ca dem timing in p5.js das 60mal pro sekunde draw aufruft



    function calcWave() {
        // Increment theta (try different values for
        // 'angular velocity' here)
        //ursprünglich von sketch
        theta += 0.01;
      
        // For every x value, calculate a y value with sine function
        let x = theta;
        for (let i = 0; i < yvalues.length; i++) {
          yvalues[i] = Math.cos(x) * Maxamplitude;
          x += dx;
      
      }
      // For second wave
         let n = theta +2;
        for (let a = 0; a < Newyvalues.length; a++) {
             Newyvalues[a] = Math.sin(n) * Maxamplitude;
            n += Ndx;
    
    }


     
      //console.log(Maxamplitude);

      //console.log(yvalues);
      }



