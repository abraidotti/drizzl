// grab the forecast object in the hackiest way possible ;)
const forecast = JSON.parse(document.querySelector("H3").textContent);
document.querySelector("H3").remove();
console.log(forecast);
const canvas = document.querySelector("#forecast-canvas");

// set some variables
var ctx = canvas.getContext('2d'),
  particles = [],
  particlesNum = 100,
  w = 4*document.documentElement.clientWidth/5,
  h = 4*document.documentElement.clientHeight/5,
  colors = ['#f35d4f','#f36849','#c0d988','#6ddaf1','#f1e85b'];

// make a particle generator
function Factory(){
  this.x =  Math.round( Math.random() * w);
  this.y =  Math.round( Math.random() * h);
  this.rad = Math.round( Math.random() * 1) + 1;
  this.rgba = colors[ Math.round( Math.random() * 3) ];
  this.vx = Math.round( Math.random() * 3) - 1.5;
  this.vy = Math.round( Math.random() * 3) - 1.5;
}

function draw(){
  // automatically resize the canvas
  canvas.width = 4*document.documentElement.clientWidth/5;
  canvas.height = 4*document.documentElement.clientHeight/5;

  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter';
  for(var i = 0;i < particlesNum; i++){
    var temp = particles[i];
    var factor = 1;

    for(var j = 0; j<particlesNum; j++){

       var temp2 = particles[j];
       ctx.linewidth = 0.5;

       if(temp.rgba == temp2.rgba && findDistance(temp, temp2)<50){
          ctx.strokeStyle = temp.rgba;
          ctx.beginPath();
          ctx.moveTo(temp.x, temp.y);
          ctx.lineTo(temp2.x, temp2.y);
          ctx.stroke();
          factor++;
       }
    }


    ctx.fillStyle = temp.rgba;
    ctx.strokeStyle = temp.rgba;

    ctx.beginPath();
    ctx.arc(temp.x, temp.y, temp.rad*factor, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(temp.x, temp.y, (temp.rad+5)*factor, 0, Math.PI*2, true);
    ctx.stroke();
    ctx.closePath();


    temp.x += temp.vx;
    temp.y += temp.vy;

    if(temp.x > w)temp.x = 0;
    if(temp.x < 0)temp.x = w;
    if(temp.y > h)temp.y = 0;
    if(temp.y < 0)temp.y = h;
  }
}

function findDistance(p1,p2){
  return Math.sqrt( Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) );
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function init(){
  for(var i = 0; i < particlesNum; i++){
    particles.push(new Factory);
  }
})();

(function loop(){
  draw();
  requestAnimFrame(loop);
})();



// create a button for each key/value in the forecast
const controlPanel = document.querySelector("#control-panel");
// this is the number to send over to the forecast display
var forecastModifier;

// send the button's value to the ticker.
let ticker = document.querySelector(".ticker");
let sendToTicker = document.createElement("DIV");
sendToTicker.setAttribute("class", "ticker__item");
// format those forecast keys to be more readable.
sendToTicker.innerHTML = `${Math.round(forecast.currently.apparentTemperature)}°F and ${forecast.currently.summary.toLowerCase()}`;
ticker.appendChild(sendToTicker);

// // make a header
// let controlPanelHeader = document.createElement("H1");
// controlPanelHeader.innerHTML =
//   forecast.currently.summary + " " + forecast.currently.apparentTemperature;
// controlPanel.appendChild(controlPanelHeader);

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
      console.log(`canvas fill color is ${canvasContext.fillStyle}`);
      canvasContext.fillStyle = 'white';
    } else {
      console.log("key value is " + forecast.currently.key);
    }
  }); // end button click function
});
