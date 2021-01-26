let x = [];
let y = [];

let fourierX;
let fourierY;

let time = 0;
let path = [];
let pts = [];

// PRELOADING IMAGES AND FONTS
function preload() {
  bigfont = loadFont('assets/Amsterdam Signature Duo.otf');
  font = loadFont('assets/Demo_ConeriaScript.ttf');
  //formula = loadImage('assets/dft.png');
  formula = loadImage('assets/CodeCogsEqn.png');

}

// CREATE POINT PATH
function createTextPoints() {
    let t = 'Paourh!';
    let tlen = t.length;
    let tw = textWidth(t);
    let tsize = 300-20*tlen;
    let points;
    let pointsize = 2;
    let options1 = {
      sampleFactor: 0.1,
      simplifyThreshold:0
    }

    pts = tracePoints(t,
      -100,
      100,
      tsize,
      options1);
  
  return pts;
}

function tracePoints(txt, x, y, sz, opt) {
  points = font.textToPoints(
    txt,x,y,sz,opt
  );
  return points;
}


// SETUP: CREATE INITIAL POINT PATH, CALCULATE FOURIER
function setup() {
  frameRate(20)
  createCanvas(1000, 1000);
  
  pts = createTextPoints();
  
  for (let i = 0; i < pts.length; i++) {
      x.push(pts[i].x);
      y.push(pts[i].y);
  }
  
  fourierY = dft(y);
  fourierX = dft(x);
  
}

// CREATES 1 CIRCLE FOR EACH FOURIER POINT
function epiCycles(x, y, rotation, fourier) {
  // Draw i circles
  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;
    
    // Set parameters of circles
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;

    // Calculate X and Y
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);
    
    noFill();
  
    //Draw Circle
    if (i == 0) {
      stroke(0);
    } else {
      stroke(255, 20);
      ellipse(prevx, prevy, radius*2)
    }
    stroke(255, 100)

    // Draw Rotating Point
    stroke(255, 100)
    fill(255)
    ellipse(x, y, 0.5);
  }
  return createVector(x, y);
}


function draw() {
  // DESIGN STUFF
  background(0);
  image(formula, 100, 500);
  textSize(32);
  textFont(bigfont);
  fill(255);
  stroke(255);
  text("Using Fourier Transform Epicycles to write Paourh's Name", 200, 450);
  
  // DRAW X AND Y CIRCLES
  let vx = epiCycles(300, 50, 0, fourierX);
  let vy = epiCycles(100, 220, HALF_PI, fourierY);
  let v = createVector(vx.x, vy.y);
  
  // ADD LATEST POINT TO THE PATH
  path.unshift(v)
  
  // DRAW PATH
  noFill();
  stroke(150*noise(5*time), 200*noise(1000+10*time), 250*noise(2000+15*time));
  beginShape();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].x, path[i].y)
  }
  endShape();
  
  // DRAW LINES FROM CIRCLES TO PATH
  fill(125, 20, 230, 80);
  stroke(255);
  stroke(255, 50);
  line(vx.x, vx.y, vx.x, vy.y);
  line(vy.x, vy.y, vx.x, vy.y);
  
  // ADVANCE TIME
  const dt = TWO_PI / fourierY.length
  time += dt;
  
  // Avoid more than 500 points
  if (path.length > 420) {
    path.pop();
  }
}
