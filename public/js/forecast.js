// grab the forecast object in the hackiest way possible ;)
const forecast = JSON.parse(document.querySelector("H3").textContent);
document.querySelector("H3").remove();
console.log(forecast);
const canvas = document.querySelector('#forecast-canvas');

// Based on Viktor Silfverstrom's Canvas Circle: https://codepen.io/bror/pen/yNxGee
//Settings
var elementsCount = 5000;
var increment = 0.01 / elementsCount;
var sizeX = 1;
var sizeY = 1;
var color = "rgb(0, 255, 0)";
//Global props
var getDimensions = function() {
  var offsetHeight = 10; // Codepen fix
  return {
    width: canvas.width,
    height: canvas.height,
    offsetHeight: offsetHeight
  }
}

var dimensions = getDimensions();
var time = 0.5;
var radius = Math.min(dimensions.width / 2, (dimensions.height - dimensions.offsetHeight) / 2) / elementsCount;

function draw() {
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  var dimensions = getDimensions();
  var width = dimensions.width;
  var height = dimensions.height;

  ctx.clearRect(0, 0, width, height);

  for (var i = 0; i < elementsCount; i += 1) {
    var x = (width - sizeX / 2) / 2 + Math.cos(time % 360 * i) * radius * i;
    var y = (height - sizeY / 2) / 2 + Math.sin(time % 360 * i) * radius * i;

    ctx.fillRect(x, y + 5, sizeX, sizeY);
  }

  time += increment;
  window.requestAnimationFrame(draw);
}

draw();


// create a button for each key/value in the forecast
const controlPanel = document.querySelector("#control-panel");
// this is the number to send over to the forecast display
var forecastModifier;

// make a header
let controlPanelHeader = document.createElement("H1");
controlPanelHeader.innerHTML =
  forecast.currently.summary + " " + forecast.currently.apparentTemperature;
controlPanel.appendChild(controlPanelHeader);

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

  // send the value over to the ticker
  btn.addEventListener("click", function(event) {
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
    // if the key's value is a number
    if (!isNaN(forecast.currently[`${key}`])) {
      forecastModifier = Math.round(forecast.currently[`${key}`]);
    } else {
      console.log("key value is " + forecast.currently.key);
    }
  }); // end button click function
});
