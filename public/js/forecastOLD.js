//credit is due to the following sources:
//balls = random responsive balls by Nash Vail: https://codepen.io/nashvail/pen/wpGgXO
//particles = stars by Arturo Morán: https://codepen.io/Armolp/pen/zrdPJg

// grab the forecast object in the hackiest way possible ;)
const forecast = JSON.parse(document.querySelector("H1").textContent);
document.querySelector("H1").remove();
console.log(forecast);

// initialize the canvas
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

// add some responsiveness to the page
window.addEventListener('resize', function() {
	w = canvas.width = window.innerWidth;
	h = canvas.height = window.innerHeight;
});

//first draw the particle vortex

// set particle variables
var w = window.innerWidth;
var h = window.innerHeight;
// z axis = square root of h^2 + w^2
var z = Math.sqrt(h * h + w * w);

var particles = [];
var particleCount = 1000;
var size = 5;

var particle = function(){
	this.x = Math.random()*w;
	this.y = Math.random()*3*h-h;
  //set distance from user
	this.d = Math.random()*(size-2)*2 + 2;

	//draw a particle
	this.draw = function() {
		ctx.fillStyle = "rgba(255,255,255,0.3)";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.d, 0, 2*Math.PI);
		ctx.fill();
	}
	// update the particle
	this.update = function() {
    // if distance is less than size
		if(this.d < size) {
			this.x += (1/3)*(this.d-size)*(this.d-size);
		}else{
			this.x -= (1/3)*(this.d-size)*(this.d-size);
		}
		if(this.x < -50 || this.x > w+50) {
			this.d = size*2 - this.d;
		}
	}
}

function draw() {
  //particle color and specs
	ctx.fillStyle = "#334";
	ctx.fillRect(-w,-h,3*w,3*h);
	ctx.translate(w/2,h/2);
	ctx.rotate(0.002);
	ctx.translate(-w/2,-h/2);
  // now draw a bunch of particles
	for(var i=0; i<particles.length; i++) {
		particles[i].draw();
		particles[i].update();
	}
	window.requestAnimationFrame(draw);
}
// add the particle to the array of particles
for(var i=0; i < particleCount; i++) {
	particles.push(new particle());
}

ctx.fillStyle = "rgba(255,255,255,0.3)";
draw();

// Some random colors
const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];

const numBalls = Math.round(forecast.currently.apparentTemperature);
console.log(`number of balls = temperature = ${numBalls}.`)
const balls = [];

for (let i = 0; i < numBalls; i++) {
  let ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.background = colors[Math.floor(Math.random() * colors.length)];
  ball.style.left = `${Math.floor(Math.random() * 100)}vw`;
  ball.style.top = `${Math.floor(Math.random() * 100)}vh`;
  ball.style.transform = `scale(${Math.random()})`;
  ball.style.width = `${Math.random()}em`;
  ball.style.height = ball.style.width;

  balls.push(ball);
  document.body.append(ball);
}

// Keyframes
balls.forEach((el, i, ra) => {
  let to = {
    x: Math.random() * (i % 2 === 0 ? -11 : 11),
    y: Math.random() * 12
  };

  let anim = el.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: `translate(${to.x}rem, ${to.y}rem)` }
    ],
    {
      duration: (Math.random() + 1) * 2000, // random duration
      direction: "alternate",
      fill: "both",
      iterations: Infinity,
      easing: "ease-in-out"
    }
  );
});



var sound = new Audio("./ding.wav");
sound.preload = 'auto';
sound.load();
sound.play();
