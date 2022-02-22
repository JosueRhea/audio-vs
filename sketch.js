let song = null;
let fft;
let particles = [];
const MAX_PARTICLES = 50;
let img;
let start = false;


function preload() {
 song = loadSound("song.mp3");
 img = loadImage("background.jpg");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  fft = new p5.FFT();
  img.filter(BLUR, 5);
}

function draw() {
  background(0);

  translate(width / 2, height / 2);
  fft.analyze();
  let amp = fft.getEnergy(20, 200);

  let wave = fft.waveform();

  push();
  if (amp > 200) {
    rotate(random(-0.5, 0.5));
  }
  image(img, 0, 0, 1920, 1080);
  pop();

  let alpha = map(amp, 0, 255, 255, 0);
    fill(0, alpha);
  noStroke();
  rect(0, 0, width, height);
  noFill();
  stroke(255);
  strokeWeight(2);

  for (let t = -1; t <= 1; t += 2) {
    beginShape();
    for (let i = 0; i <= 180; i += 0.2) {
      let index = floor(map(i, 0, 180, 0, wave.length - 1));

      let r = map(wave[index], -1, 1, 150, width / 4);

      let x = r * sin(i) * t;
      let y = r * cos(i);
      vertex(x, y);
    }
    endShape();
  }

  if (start) {
    if (particles.length < MAX_PARTICLES) {
      let p = new Particle();
      particles.push(p);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 200);
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    start = true;
    loop();
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(100);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.000001));
    this.w = random(3,5);
  }

  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }

  edges() {
    if (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > height / 2
    ) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
}
