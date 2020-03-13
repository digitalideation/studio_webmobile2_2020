let socket;

let settings={

};


function preload(){
 
   
    mic= new p5.AudioIn();
    mic.start();
}




function setup() {
    
    createCanvas(windowWidth, windowHeight);
    frameRate(40);
    //socket=io.connect("http://localhost:3000/");
    socket=io.connect();
    colorMode(HSB,width,height,100);
    amp =new p5.Amplitude();
    mic= new p5.AudioIn();
    mic.start();
  
    settings.w=width; //übermittele dem server die Devicebreite
    
   
        
    socket.emit("get",settings);// einmalige Anmeldung

    socket.on("get",getSettings);
    
    socket.on("update",updateSettings);
  

}
   function getSettings(data){
    settings=data;
    
}
function updateSettings(data){
    settings.yvalues=data;
    settings.Newyvalues=data;
    
    //console.log (settings.yvalues);
    background(0);
    renderWave();
}



function draw(){

    //if(frameCount%20==0){
        var volmic = mic.getLevel();
        let amplitude = floor(map(volmic,0,1,0,400));
        var data={
            vol:amplitude,
            id:settings.id
        }
        socket.emit("waveMic",data)
        //console.log("ich sende"+data.vol)
    //}
    
   
 
   
 }

    
    
    
    function renderWave() {
        noFill();
    

       
        let localX=0;
        // A simple way to draw the wave with an ellipse at each location
        for (let x = floor(settings.offsetbeginX/settings.xspacing); x <= floor(settings.offsetendX/settings.xspacing);  x++) {
           
            
            var volmic = mic.getLevel();
            let amplitude = floor(map(volmic,0,1,0,400));

            let amplitudesize = map(volmic,0,1,0,200);
            let amplitudeSsize= map (volmic,0,1,20,400)

            //let amplitudeXsize= map (amplitudesize,0,1,0,400)
            let amplitudeNsize= map (amplitudesize,0,1,0,600)

            stroke(amplitudesize,230,amplitudeNsize);
            rect(localX * settings.xspacing,settings.NewoffsetTop + settings.Newyvalues[x],amplitudeSsize,10);
           
            stroke(amplitudesize,amplitudeNsize,200);
            ellipse(localX * settings.xspacing,settings.offsetTop + settings.yvalues[x],amplitudeSsize,amplitudesize);
           
           
        
            localX++;
         
         }
       
      
      }


