




var song;

var vol;
var amp;
var volhistory =[];


var col;




function preload(){
    song= loadSound("RISE.mp3");
    
}
function setup() {
  
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    colorMode(HSB,width,height,100);
    background(200,200,200,);
    song.play();
    amp =new p5.Amplitude();
   

    
  
    
    
}
function draw(){
    background(255);

    var vol = amp.getLevel();
    volhistory.push(vol);
    noFill();
   

    translate (0, height/2);
    beginShape();
    for (var i=0; i<volhistory.length; i++) {
        var r = map(volhistory[i], 0,1,height/3,0)
        //var x =r * cos(i*2);
        var y =r * sin (i);
    
        stroke(i,i,i);
       ellipse(i, y,r/2,20);
      

    }
    endShape();

    if(volhistory.length > width){
        volhistory.splice(0,1);
    }
 
   
    
    
    
    
       
    }


