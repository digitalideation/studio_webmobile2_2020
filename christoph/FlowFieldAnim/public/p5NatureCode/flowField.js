var SimplexNoise = require('simplex-noise');
// let simplex = new SimplexNoise(300); //seed
// let value2d = simplex.noise2D(x,y);

var Victor = require('victor');
//var vec = new Victor(42, 1337);


class FlowField {
    constructor(r,cols,rows,field){
        //how large is each cell of the flow field
        this.resolution = r;
        //determine the number of columns and rows based on sketch's width and height
        this.cols = cols;
        this.rows = rows;
        //flow field is 2D array
        //we can't make them -> fake them
        this.field = field;
        this.init();
    }

    // make2Darray(n){
    //     let array = [];
    //     for (let i = 0; i < n; i++){
    //         array[i] = [];
    //     }
    //     return array;
    // }

    scale (num, in_min, in_max, out_min, out_max) {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
      }


    init(){
        //reset noise fpr new flow field every time
        //need to get noise working
        //noiseSeed(Math.floor(random(0,10000)));
        let simplex = new SimplexNoise(100);
        let xoff = 0;
        for (let i = 0; i < this.cols; i++){
            let yoff = 0;
            for (let j = 0; j < this.rows; j++){
                let theta = this.scale(simplex.noise2D(xoff,yoff),0,1,0,6.28318530717958647693); //letzte Zahl ist die Konstante TWO_PI (p5.js)
                //let theta = random(-PI/4, PI/4);
                //let theta = map(sin(xoff)+cos(yoff),-2,2,0,TWO_PI);
                //polar to cartesian transformation to get vector
                this.field[i][j] = new Victor(Math.cos(theta), Math.sin(theta));
                yoff += 0.01;
            }
            xoff += 0.01;
        }
    }

    constrainNumber(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }
    lookup(lookup) {
        console.log(lookup)
        let column = Math.floor(this.constrainNumber(lookup.x / this.resolution, 0, this.cols - 1));
        let row = Math.floor(this.constrainNumber(lookup.y / this.resolution, 0, this.rows - 1));

        // console.log(this.field);
        // console.log('row' + row);
        // console.log('col' + column);
        // console.log(this.field[column][row]);

        //return this.field[column][row].copy();
        return new Victor(this.field[column][row].x,this.field[column][row].y);
        //return this.field[column][row].clone();
        
    }

 /*

    //draw every vector
    display(){
        for (let i = 0; i < this.cols; i++){
            for(let j = 0; j< this.rows; j++){
                this.drawVector(this.field[i][j], i * this.resolution, j * this.resolution, this.resolution-2);
            }
        }
    }

    //renders a vector object 'v' as an arrow and a location 'x,y'
    drawVector(v,x,y,scayl){
        push();
        let arrowSize = 4;
        //translate location to render Vector
        translate(x,y);
        stroke(200,100);
        //call vector heading function to get direction (pointing to right is heading of 0)
        rotate(v.heading());
        //calculate length of vector & scale it
        let len = v.mag() * scayl;
        //draw 
        stroke(255,0,0);
        line(0,0,len,0);
        pop();
    }

    */
}



module.exports = FlowField;