let shift = 1000;

let x = [];
let y = [];

let fourierX;
let fourierY;

let time = 0;
let path = [];
let pts = [];
let step1path = [];
let counter = 0;

let totalScroll = 0;
let scrollCoord = 1700;
let visible = false;

let theta1 = 0;
let theta2 = 0;
let theta3 = 0;
let ex = 300;
let ey = 880;

function mouseWheel(event) {

  totalScroll += event.delta;
  if (totalScroll + windowHeight > scrollCoord) {
    visible = true;
  }

}

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
  let tsize = 300 - 20 * tlen;
  let points;
  let pointsize = 2;
  let options1 = {
    sampleFactor: 0.08,
    simplifyThreshold: 0
  }

  pts = tracePoints(t,
    -100,
    100 + shift,
    tsize,
    options1);

  ep1 = {
    x: 500,
    y: 150 + shift
  };
  ep2 = {
    x: -140,
    y: 150 + shift
  };
  ep3 = {
    x: -140,
    y: -100 + shift
  };
  ep4 = {
    x: 500,
    y: -100 + shift
  };
  ep5 = {
    x: 500,
    y: 150 + shift
  };
  ep6 = {
    x: -140,
    y: 150 + shift
  };

  pts.push(ep1);
  pts.push(ep2);
  pts.push(ep3);
  pts.push(ep4);
  pts.push(ep5);
  pts.push(ep6);

  return pts;
}

// FUNCTION FOR DRAWING OUT THE PATH IN DOTS
function drawPath(p, xshift, yshift) {
  fill(255)
  for (let i = 0; i < p.length; i++) {
    ellipse(p[i].x + xshift, p[i].y + yshift, 2, 2);
  }
}

// KEEPS ADDING POINTS TO THE NAME
function advancePath(p) {
  if (counter >= pts.length) {
    return
  }
  let nxt = pts[counter];
  counter += 1;
  p.push(nxt);
}

function tracePoints(txt, x, y, sz, opt) {
  points = font.textToPoints(
    txt, x, y, sz, opt
  );
  return points;
}
  
function createSliders() {
  amplitudeSlider1 = createSlider(0, 150, 75, 1);
  amplitudeSlider1.position(ex-50, ey+80);
  amplitudeSlider1.style('width', '100px');
  
  frequencySlider1 = createSlider(-0.5, 0.5, -0.05, 0.01);
  frequencySlider1.position(ex-50, ey+110);
  frequencySlider1.style('width', '100px');
  
  amplitudeSlider2 = createSlider(0, 150, 120, 1);
  amplitudeSlider2.position(ex+150, ey+80);
  amplitudeSlider2.style('width', '100px');
  
  frequencySlider2 = createSlider(-0.5, 0.5, 0.1, 0.01);
  frequencySlider2.position(ex+150, ey+110);
  frequencySlider2.style('width', '100px');
  
  amplitudeSlider3 = createSlider(0, 150, 50, 1);
  amplitudeSlider3.position(ex+350, ey+80);
  amplitudeSlider3.style('width', '100px');
  
  frequencySlider3 = createSlider(-0.5, 0.5, 0.3, 0.01);
  frequencySlider3.position(ex+350, ey+110);
  frequencySlider3.style('width', '100px');
  
}

// SETUP: CREATE INITIAL POINT PATH, CALCULATE FOURIER
function setup() {
  frameRate(20)
  createCanvas(1000, 2000);
  
  createSliders();

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
      stroke(255, 40);
      ellipse(prevx, prevy, radius * 2, radius * 2)
    }
    stroke(255, 100)

    // Draw Rotating Point
    stroke(255, 100)
    fill(255)
    ellipse(x, y, 0.5, 0.5);
  }
  return createVector(x, y);
}

function draw() {
  // DESIGN STUFF
  background(0);
  textSize(32);
  textFont(bigfont);
  fill(255);
  stroke(255);

  // WRITE STEP 1
  text("Step 1: Create set of points to trace out Paourh's name", 175, 100);

  // DRAW STEP 1
  advancePath(step1path)
  drawPath(step1path, 300, -700);

  // WRITE STEP 1
  text("Step 2: Use the Discrete Fourier Transform to calculate", 175, 600);
  text("frequency and amplitude of corresponding epicycles", 250, 640);

  // DRAW STEP 2
  step2();


  // DRAW FORMULA
  image(formula, 100, 700);

  // WRITE STEP 3
  text("Step 3: Superimpose epicycles to write Paourh's Name", 175, shift + 120);

  // DRAW STEP 3 IF VISIBLE
  if (visible) {
    step3();
  }

}

function step2() {
  let er1 = amplitudeSlider1.value();
  let freq1 = frequencySlider1.value();
  let er2 = amplitudeSlider2.value();
  let freq2 = frequencySlider2.value();
  let er3 = amplitudeSlider3.value();
  let freq3 = frequencySlider3.value();
  
  stroke(255, 50);
  noFill();
  ellipse(ex, ey, er1, er1);
  ellipse(ex+200, ey, er2, er2);
  ellipse(ex+400, ey, er3, er3);
  
  stroke(255, 100);
  fill(255);
  
  lex1 = (er1/2)*cos(theta1) + ex;
  ley1 = (er1/2)*sin(theta1) + ey;
  lex2 = (er2/2)*cos(theta2) + ex+200;
  ley2 = (er2/2)*sin(theta2) + ey;
  lex3 = (er3/2)*cos(theta3) + ex+400;
  ley3 = (er3/2)*sin(theta3) + ey;
  
  ellipse(lex1, ley1, 3, 3);
  ellipse(lex2, ley2, 3, 3);
  ellipse(lex3, ley3, 3, 3);
  
  textSize(22);
  text('Amplitude', ex-130, ey+93);
  text('Frequency', ex-130, ey+125);
  
  text('Amplitude', ex+70, ey+93);
  text('Frequency', ex+70, ey+125);
  
  text('Amplitude', ex+270, ey+93);
  text('Frequency', ex+270, ey+125);
  
  textSize(32);
  
  theta1 += freq1;
  theta2 += freq2;
  theta3 += freq3;

}

function step3() {
  // DRAW X AND Y CIRCLES
  let vx = epiCycles(300, 250 + shift, 0, fourierX);
  let vy = epiCycles(100, 550, HALF_PI, fourierY);
  let v = createVector(vx.x, vy.y);

  // ADD LATEST POINT TO THE PATH
  path.unshift(v)

  // DRAW PATH
  noFill();
  stroke(150 * noise(5 * time), 200 * noise(1000 + 10 * time), 250 * noise(2000 + 15 * time));
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
