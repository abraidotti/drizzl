const forecastText = JSON.parse(document.querySelector("H1").textContent);
document.querySelector("H1").remove();
console.log(forecastText);
console.log(`Dewpoint: ${forecastText.currently.dewPoint}. This is the circle's line width.`)

// initialize the canvas
const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

draw();

function draw() {
  // draw the colored region
  c.beginPath();
  c.arc(200, 200, 93, 0, 2 * Math.PI, true);
  c.fillStyle = "#E2FFC6";
  c.fill();

  // draw the stroke
  c.lineWidth = forecastText.currently.dewPoint;
  c.strokeStyle = "#66CC01";
  c.stroke();

  c.font = "30px Arial";
  c.fillText(`Hi Amber. You can open the console to see your forecast in an object.`,10,50);
  c.fillText(`Dewpoint: ${forecastText.currently.dewPoint}. This is the circle's line width.`,10,400);
}
