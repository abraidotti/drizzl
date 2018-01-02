// grab the forecast object in the hackiest way possible ;)
const forecast = JSON.parse(document.querySelector("H3").textContent);
document.querySelector("H3").remove();
console.log(forecast);

// render components
const controlPanel = document.querySelector("#control-panel");
const canvas = document.querySelector("#forecast-canvas");
const ticker = document.querySelector("#ticker");
const ctx = canvas.getContext("2d");

// play a piano sound
let soundFileNumber = Math.floor(Math.random() * 13) + 1;
let ding = new Audio(`.public/audio/extra-${soundFileNumber}.mp3`);
ding.volume = 0.1;
ding.play();

// set variables
var particles = [],
  particlesNum = (Math.abs(Math.round(forecast.currently.temperature))),
  w = 4 * document.documentElement.clientWidth / 5,
  h = 4 * document.documentElement.clientHeight / 5,
  colors = [
    `hsl(${Math.abs(Math.round(3 * forecast.currently.temperature))}, 60%, 60%)`,
    `hsl(${Math.abs(Math.round((3 * forecast.currently.temperature) + 180 ))}, 60%, 60%)`,
    `hsl(${Math.abs(Math.round((3 * forecast.currently.temperature) + 240 ))}, 60%, 60%)`
  ],
  particleSize = 2,
  particleSizeVariation = 2,
  outerCircleDistance = 2,
  outerCircleWidth = 0,
  outerCircleLineDashLineLength = 0,
  outerCircleLineDashGapLength = 0,
  particleTransparencyModifier = 1,
  umbilicalWidth = 0;
  umbilicalLineDashLineLength = 0,
  umbilicalLineDashGapLength = 0,
  maxUmbilicalDistance = 50,
  horizontalVelocity = (Math.round(forecast.currently.windSpeed / 10)),
  verticalVelocity = (Math.round(forecast.currently.windGust / 10)),
  velocityModifier = (Math.round(forecast.currently.windBearing / 60)),
  horizontalVelocityModifier = 0,
  verticalVelocityModifier = 0,
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

// set the composite operation (0-25) to the forecast's hours offset from UTC
ctx.globalCompositeOperation = gco[Math.abs(forecast.offset)];
console.log(
  `Based on the location's UTC offset of ${forecast.offset}, The canvas's composite operation is '${gco[Math.abs(forecast.offset)]}.'`
);
console.log(gcoText[Math.abs(forecast.offset)]);

// make a particle generator
function Particle() {
  // get coordinates
  this.x = Math.round(Math.random() * w);
  this.y = Math.round(Math.random() * h);
  // get size
  this.rad = Math.round(Math.random() * particleSizeVariation) + particleSize;
  // get color
  this.color = colors[Math.round(Math.random() * (colors.length - 1))];
  // get velocity
  this.vx = Math.round(Math.random() * velocityModifier) - horizontalVelocity;
  this.vy = Math.round(Math.random() * velocityModifier) - verticalVelocity;
}

function draw() {
  // automatically resize the canvas
  canvas.width = 4 * document.documentElement.clientWidth / 5;
  canvas.height = 4 * document.documentElement.clientHeight / 5;

  ctx.clearRect(0, 0, w, h);

  // grab a circle
  for (let i = 0; i < particlesNum; i++) {
    let temp = particles[i];

    //and then compare it to others
    for (let j = 0; j < particlesNum; j++) {
      let temp2 = particles[j];

      // toggle a bizarre and rigid umbilicus among like and close circles
      if (
        temp.color == temp2.color &&
        findDistance(temp, temp2) < maxUmbilicalDistance
      ) {
        ctx.strokeStyle = temp.color;
        ctx.lineWidth = 1 + umbilicalWidth;
        ctx.setLineDash([umbilicalLineDashLineLength, umbilicalLineDashGapLength]);
        ctx.beginPath();
        ctx.moveTo(temp.x, temp.y);
        ctx.lineTo(temp2.x, temp2.y);
        ctx.stroke();
      }
    }

    // render a particle
    ctx.globalAlpha = particleTransparencyModifier;
    ctx.fillStyle = temp.color;
    ctx.strokeStyle = temp.color;
    ctx.setLineDash([0, 0]);
    ctx.beginPath();
    ctx.arc(
      temp.x, temp.y,
      temp.rad * particleSize,
      0, Math.PI * 2, true
    );
    ctx.fill();
    ctx.closePath();

    // render an outer circle around the particle
    ctx.setLineDash([outerCircleLineDashLineLength, outerCircleLineDashGapLength]);
    ctx.lineWidth = 1 + outerCircleWidth;
    ctx.beginPath();
    ctx.arc(
      temp.x, temp.y,
      (temp.rad + outerCircleDistance) * particleSize,
      0, Math.PI * 2, true
    );
    ctx.stroke();
    ctx.closePath();

    // render movement at constant velocity
    temp.x += temp.vx + horizontalVelocityModifier;
    temp.y += temp.vy + verticalVelocityModifier;

    // wrap particles on canvas
    if (temp.x > w) temp.x = 0;
    if (temp.x < 0) temp.x = w;
    if (temp.y > h) temp.y = 0;
    if (temp.y < 0) temp.y = h;
  }

  // load the temperature (F) and forecast summary into the ticker
  if (ticker.childElementCount === 0) {
    let tickerGreeting = document.createElement("DIV");
    tickerGreeting.setAttribute("class", "ticker__item");
    // render a forecast greeting
    tickerGreeting.innerHTML = `${Math.round(
      forecast.currently.apparentTemperature
    )}°F
      and ${forecast.currently.summary.toLowerCase()}`;
    ticker.appendChild(tickerGreeting);
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

// iterate through each forecast key
Object.keys(forecast.currently).forEach(function(key) {
  // if the key's value is numerical
  if (key != "time" && key != "icon" && key != "summary" && key != "temperature" && key != "apparentTemperature") {
    // make a control panel button
    let btn = document.createElement("BUTTON");
    btn.setAttribute("id", `btn-${key}`);
    btn.setAttribute("value", `${key}`);
    // label the button with a readable key name
    let btnReadableLabel = key
      .split(/(?=[A-Z])/)
      .join(" ")
      .toLowerCase();
    btn.innerHTML = btnReadableLabel;

    // listen for button clicks
    btn.addEventListener("click", function(event) {
      forecastModifier = forecast.currently[`${key}`];

      btn.classList.toggle("activated");

      // if the key's value is a number, store its integer
      if (btn.classList.contains("activated")) {
        let tickerItem = document.createElement("DIV");
        tickerItem.setAttribute("class", `ticker__item ${key}`);
        tickerItem.textContent = `The ${btnReadableLabel} is
        ${forecast.currently[`${key}`]}.`;
        ticker.appendChild(tickerItem);
        console.log(`${key} button activated.`);

        if (key === 'nearestStormDistance'){
          console.log(`${key}(${forecastModifier}) changes the maximum particle link distance.`);
          maxUmbilicalDistance += forecastModifier;
        }
        if (key === 'nearestStormBearing'){
          console.log(`${key}(${forecastModifier}) changes particle size.`);
          particleSize += Math.round(forecastModifier / 100);
        }
        if (key === 'precipIntensity'){
          console.log(`${key}(${forecastModifier}) changes particle vertical velocity.`);
          verticalVelocityModifier += forecastModifier;
        }
        if (key === 'precipProbability'){
          console.log(`${key}(${forecastModifier}) changes particle outer circle distance.`);
          outerCircleDistance += forecastModifier * 10;
        }
        if (key === 'dewPoint'){
          console.log(`${key}(${forecastModifier}) changes outer circle line composition.`);
          outerCircleLineDashLineLength += Math.round(forecastModifier / 100);
          outerCircleLineDashGapLength += Math.round(forecastModifier / 100);
        }
        if (key === 'humidity'){
          console.log(`${key}(${forecastModifier}) changes particle transparency.`);
          particleTransparencyModifier = forecastModifier;
        }
        if (key === 'pressure'){
          console.log(`${key}(${forecastModifier}) changes particle size.`);
          particleSize += Math.round(forecastModifier / 1000);
        }
        if (key === 'windSpeed'){
          console.log(`${key}(${forecastModifier}) changes particle horizontal velocity.`);
          horizontalVelocityModifier += Math.round(forecastModifier / 10);
        }
        if (key === 'windGust'){
          console.log(`${key}(${forecastModifier}) changes particle horizontal velocity.`);
          horizontalVelocityModifier += Math.round(forecastModifier / 10);
        }
        if (key === 'windBearing'){
          console.log(`${key}(${forecastModifier}) changes particle vertical velocity.`);
          verticalVelocityModifier += Math.round(forecastModifier / 100);
        }
        if (key === 'cloudCover'){
          console.log(`${key}(${forecastModifier}) changes particle link line composition.`);
          umbilicalLineDashLineLength += Math.round(forecastModifier);
          umbilicalLineDashGapLength += Math.round(forecastModifier);
        }
        if (key === 'uvIndex'){
          console.log(`${key}(${forecastModifier}) changes particle link width.`);
          umbilicalWidth = forecastModifier;
        }
        if (key === 'visibility'){
          console.log(`${key}(${forecastModifier}) changes particle size.`);
          particleSize += forecastModifier;
        }
        if (key === 'ozone'){
          console.log(`${key}(${forecastModifier}) changes outer circle width.`);
          outerCircleWidth = Math.round(forecastModifier / 100);
        }
      };

      if (!btn.classList.contains("activated")) {
        console.log(`${key} button deactivated.`);
        let tickerItemToDestroy = document.querySelector(`.${key}`);
        ticker.removeChild(tickerItemToDestroy);

        if (key === 'nearestStormDistance'){
          maxUmbilicalDistance -= forecastModifier;
        }
        if (key === 'nearestStormBearing'){
          particleSize -= Math.round(forecastModifier / 100);
        }
        if (key === 'precipIntensity'){
          verticalVelocityModifier -= forecastModifier;;
        }
        if (key === 'precipProbability'){
          outerCircleDistance -= forecastModifier * 10;
        }
        if (key === 'dewPoint'){
          outerCircleLineDashLineLength -= Math.round(forecastModifier / 100);
          outerCircleLineDashGapLength -= Math.round(forecastModifier / 100);
        }
        if (key === 'humidity'){
          particleTransparencyModifier = 1;
        }
        if (key === 'pressure'){
          particleSize -= Math.round(forecastModifier / 1000);
        }
        if (key === 'windSpeed'){
          horizontalVelocityModifier -= Math.round(forecastModifier / 10);
        }
        if (key === 'windGust'){
          horizontalVelocityModifier -= Math.round(forecastModifier / 10);
        }
        if (key === 'windBearing'){
          verticalVelocityModifier -= Math.round(forecastModifier / 100);
        }
        if (key === 'cloudCover'){
          umbilicalLineDashLineLength -= Math.round(forecastModifier);
          umbilicalLineDashGapLength -= Math.round(forecastModifier);
        }

        if (key === 'uvIndex'){
          umbilicalWidth = 0;
        }
        if (key === 'visibility'){
          particleSize -= forecastModifier;
        }
        if (key === 'ozone'){
          outerCircleWidth = 0;
        }
      }

    }); // end button click function
    controlPanel.appendChild(btn);
  }
});
