// grab the forecast object in the hackiest way possible ;)
const forecast = JSON.parse(document.querySelector("H3").textContent);
document.querySelector("H3").remove();
console.log(forecast);

// render components
const controlPanel = document.querySelector("#control-panel");
const canvas = document.querySelector("#forecast-canvas");

const ctx = canvas.getContext("2d");

// set variables
var particles = [],
  particlesNum = 100,
  w = 4 * document.documentElement.clientWidth / 5,
  h = 4 * document.documentElement.clientHeight / 5,
  colors = [
    "#f35d4f",
    "#f36849",
    "#c0d988",
    "#6ddaf1",
    "#f1e85b",
    "hsl(" + 360 * Math.random() + ",100%,50%)"
  ],
  circleSize = 2,
  circleSizeVariation = 2,
  outerCircleDistance = 2,
  maxUmbilicalDistance = 50,
  horizontalVelocity = 1.1,
  verticalVelocity = 1.1,
  gco = [
    "source-over",
    "source-in",
    "source-out",
    "source-atop",
    "destination-over",
    "destination-in",
    "destination-out",
    "destination-atop",
    "lighter",
    "copy",
    "xor",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "color-burn",
    "hard-light",
    "soft-light",
    "difference",
    "exclusion",
    "hue",
    "saturation",
    "color",
    "luminosity"
  ],
  gcoText = [
    "This is the default setting and draws new shapes on top of the existing canvas content.",
    "The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent.",
    "The new shape is drawn where it doesn't overlap the existing canvas content.",
    "The new shape is only drawn where it overlaps the existing canvas content.",
    "New shapes are drawn behind the existing canvas content.",
    "The existing canvas content is kept where both the new shape and existing canvas content overlap. Everything else is made transparent.",
    "The existing content is kept where it doesn't overlap the new shape.",
    "The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content.",
    "Where both shapes overlap the color is determined by adding color values.",
    "Only the new shape is shown.",
    "Shapes are made transparent where both overlap and drawn normal everywhere else.",
    "The pixels are of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result.",
    "The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply)",
    "A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter.",
    "Retains the darkest pixels of both layers.",
    "Retains the lightest pixels of both layers.",
    "Divides the bottom layer by the inverted top layer.",
    "Divides the inverted bottom layer by the top layer, and then inverts the result.",
    "A combination of multiply and screen like overlay, but with top and bottom layer swapped.",
    "A softer version of hard-light. Pure black or white does not result in pure black or white.",
    "Subtracts the bottom layer from the top layer or the other way round to always get a positive value.",
    "Like difference, but with lower contrast.",
    "Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.",
    "Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.",
    "Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.",
    "Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer."
  ];

// make a particle generator
function Particle() {
  // get coordinates
  this.x = Math.round(Math.random() * w);
  this.y = Math.round(Math.random() * h);
  // get size
  this.rad = Math.round(Math.random() * circleSizeVariation) + circleSize;
  // get color
  this.rgba = colors[Math.round(Math.random() * 3)];
  //this.fillStyle = 'hsl('+ 360*Math.random() +',100%,50%)';
  // get velocity
  this.vx = Math.round(Math.random() * 3) - horizontalVelocity;
  this.vy = Math.round(Math.random() * 3) - verticalVelocity;
}

function draw() {
  // automatically resize the canvas
  canvas.width = 4 * document.documentElement.clientWidth / 5;
  canvas.height = 4 * document.documentElement.clientHeight / 5;

  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < particlesNum; i++) {
    // grab a circle
    let temp = particles[i];

    //and then compare it to others
    for (let j = 0; j < particlesNum; j++) {
      let temp2 = particles[j];

      // toggle a bizarre and rigid umbilicus among like circles.
      if (
        temp.rgba == temp2.rgba &&
        findDistance(temp, temp2) < maxUmbilicalDistance
      ) {
        ctx.strokeStyle = temp.rgba;
        ctx.beginPath();
        ctx.moveTo(temp.x, temp.y);
        ctx.lineTo(temp2.x, temp2.y);
        ctx.stroke();
      }
    }

    ctx.fillStyle = temp.rgba;
    ctx.strokeStyle = temp.rgba;

    ctx.beginPath();
    ctx.arc(temp.x, temp.y, temp.rad * circleSize, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();

    // draw an outer circle around the main circle
    ctx.beginPath();
    ctx.arc(
      temp.x,
      temp.y,
      (temp.rad + outerCircleDistance) * circleSize,
      0,
      Math.PI * 2,
      true
    );
    ctx.stroke();
    ctx.closePath();

    temp.x += temp.vx;
    temp.y += temp.vy;

    if (temp.x > w) temp.x = 0;
    if (temp.x < 0) temp.x = w;
    if (temp.y > h) temp.y = 0;
    if (temp.y < 0) temp.y = h;
  }
}

function findDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

(function init() {
  for (var i = 0; i < particlesNum; i++) {
    particles.push(new Particle());
  }
})();

(function loop() {
  draw();
  requestAnimFrame(loop);
})();

// send the button's value to the ticker.
let ticker = document.querySelector(".ticker");
let sendToTicker = document.createElement("DIV");
sendToTicker.setAttribute("class", "ticker__item");
// format those forecast keys to be more readable.
sendToTicker.innerHTML = `${Math.round(
  forecast.currently.apparentTemperature
)}°F and ${forecast.currently.summary.toLowerCase()}`;
ticker.appendChild(sendToTicker);

// for each key, make a button that sends the value to the ticker
Object.keys(forecast.currently).forEach(function(key) {
  let btn = document.createElement("BUTTON");
  btn.setAttribute("id", `btn-${key}`);
  btn.setAttribute("value", `${key}`);
  // make the labels readable
  let btnReadableLabel = key
    .split(/(?=[A-Z])/)
    .join(" ")
    .toLowerCase();
  btn.innerHTML = btnReadableLabel;
  // let's exclude non-numerical values and the time.
  if (key != "time" && key != "icon" && key != "summary")
    controlPanel.appendChild(btn);

  btn.addEventListener("click", function(event) {
    // if the key's value is a number
    if (!isNaN(forecast.currently[`${key}`])) {
      let forecastModifier = Math.abs(Math.round(forecast.currently[`${key}`]));
      // if the number is less than than 100;
      // particlesNum = forecastModifier;
      // draw();
    }

    // set the composite operation (0-25)
    ctx.globalCompositeOperation = gco[3];
    console.log(gcoText[3]);

    // to toggle a css class:
    // btn.classList.toggle("activated");

    // if the button has the activated class, particlesNum += key values

    // send the button's value to the ticker.
    let ticker = document.querySelector(".ticker");
    let sendToTicker = document.createElement("DIV");
    sendToTicker.setAttribute("class", "ticker__item");
    // format those forecast keys to be more readable.
    sendToTicker.textContent = `The ${btnReadableLabel} is ${
      forecast.currently[`${key}`]
    }.`;
    console.log(`${key} is ${forecast.currently[`${key}`]}.`);

    // set a max of 7 ticker elements
    while (ticker.childElementCount > 7) {
      ticker.removeChild(ticker.firstChild);
    }
    // and then add this one
    ticker.appendChild(sendToTicker);
  }); // end button click function
});
