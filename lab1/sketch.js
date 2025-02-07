

function setup(){
    createCanvas(windowWidth,windowHeight);
    
}

function draw(){
  //background('aquamarine');
  //background('#FFDDF3');
  background(255, 350, 150, 60); //"60" is the alpha value
  fill('pink');
  stroke('white');
  //if(mouseX < 200){
    //rect(mouseX,mouseY,100,100,3);
  //}else{
    //rect(mouseX, mouseY, 30, 30, 30);
 // }
 
  for(var i = 0; i < 10000; i++){
  rect((i*10)%width,(i*10)%height,10,10);
  }


fill('#FFDA78');
stroke('yellow');
let ellipseWidth = 30;
let ellipseHeight = 15;
//let spacing=45;
for(var t = 0; t < 1000; t++){
    //let x = (t*spacing)%width;
    //let y = Math.floor((t*spacing)/width)*spacing;
    //ellipse(x,y,ellipseWidth,ellipseHeight);

    ellipse((t*80)%width,(t*90)%height,ellipseWidth,ellipseHeight);
}

  fill('brown');
  stroke('black');
  let heartSize = 50;
  for(let x = 0; x < width; x += heartSize * 4){
    for(let y = 0; y < height; y += heartSize*3){
        let offsetX =(y /(heartSize*2))%2 === 0?0: heartSize;
        drawHeart(x+offsetX, y, heartSize);
    }
  }
  //for(var j = 0; j < 300; j++){
  //  drawHeart((j*50)%width,(j*50)&height,30);
//}

    fill('aquamarine');
    stroke('purple');
if(mouseX <960){
    rect(mouseX,mouseY,100,100);
}else{
    fill('blue');
    stroke('white');
    rect(mouseX,mouseY,50,50,25);
}

}

function drawHeart(x,y,size){
    beginShape();
    vertex(x,y);
    bezierVertex(x-size/2,y-size/2,x-size,y+size/3,x,y+size);
    bezierVertex(x+size,y+size/3,x+size/2,y-size/2,x,y);
    endShape(CLOSE);
}