var forecast, forecastLoader, crd, userLat, userLong;

const navigatorLocateButton = document.querySelector("#locate-with-browser");
const locationInput = document.querySelector("#location-input");
const locationButton = document.querySelector("#location-button");
// navigator geolocation options
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

// if user hits the "get my location button":
navigatorLocateButton.addEventListener('click', function(){
  showLoader();
  navigator.geolocation.getCurrentPosition(success, error, options);

  // if successful grab, set coordinates
  function success(pos) {
    crd = pos.coords;
    userLat = crd.latitude;
    userLng = crd.longitude;

    // tell the user what's found
    console.log("Location found.");
    console.log("Your current position is:");
    console.log(`Latitude : ${userLat}`);
    console.log(`Longitude: ${userLng}`);
    readyLatLng(userLat, userLng);
  }
  // log error messages
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
});

// if user submits a location:
locationButton.addEventListener("click", function(event) {
  // prevent page reload on form submission
  event.preventDefault();

  var submittedLocation = locationInput.value;

  showLoader();
  // geocode the user's location
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: submittedLocation }, function(results,status){
    if (status === "OK") {
      var geoLocation = results[0].geometry.location
        .toString()
        .replace(/\s/g, "");
      userLat = results[0].geometry.location.lat();
      userLng = results[0].geometry.location.lng();

      // tell the user what's found
      console.log("Location found.");
      console.log("Your current position is:");
      console.log(`Latitude : ${userLat}`);
      console.log(`Longitude: ${userLng}`);

      readyLatLng(userLat, userLng);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    };
  }); // end of geocode block
}); // end of click function

function showLoader(){
  document.querySelector("#location-form").remove();
  var locationFormContainer = document.querySelector("#location-form-container");
  forecastLoader = document.createElement("CANVAS");
  forecastLoader.setAttribute("id", "spinner");
  forecastLoader.setAttribute("height", "locationFormContainer.height");
  forecastLoader.setAttribute("width", "locationFormContainer.width");
  locationFormContainer.appendChild(forecastLoader);

  var context = canvas.getContext('2d');
  var start = new Date();
  var lines = 16,
    cW = context.canvas.width,
    cH = context.canvas.height;

  var draw = function() {
    var rotation = parseInt(((new Date() - start) / 1000) * lines) / lines;
    context.save();
    context.clearRect(0, 0, cW, cH);
    context.translate(cW / 2, cH / 2);
    context.rotate(Math.PI * 2 * rotation);
    for (var i = 0; i < lines; i++) {
      context.beginPath();
      context.rotate(Math.PI * 2 / lines);
      context.moveTo(cW / 10, 0);
      context.lineTo(cW / 4, 0);
      context.lineWidth = cW / 30;
      context.strokeStyle = "rgba(0, 0, 0," + i / lines + ")";
      context.stroke();
    }
    context.restore();
};
window.setInterval(draw, 1000 / 40);
};

// get a forecast!
function getForecast(lat, lng) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET",`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/8c3c8dc972b787fa631b37e0cf3da0d2/${lat},${lng}?exclude=minutely,hourly,daily,alerts,flags`);
  console.log("OPENED", xhr.status);

  xhr.onload = function() {
    console.log("LOADING", xhr.status);
    if (xhr.status === 200) {
      forecast = JSON.parse(xhr.responseText);
      console.log(forecast);
    } else {
      alert("Request failed.  Returned status of " + xhr.status);
    }
  };
  xhr.send();
}

function readyLatLng(lat, lng){
  // kill the loading animation
  forecastLoader.remove();

  var readyDiv = document.createElement("DIV");
  readyDiv.setAttribute("id", "container");
  document.body.appendChild(readyDiv);

  var readyDivHeader = document.createElement("H1");
  readyDivHeader.textContent = "Location ready.";
  readyDiv.appendChild(readyDivHeader);

  var readyForm = document.createElement("FORM");
  readyForm.setAttribute("method", "post");
  readyForm.setAttribute("action", "/");
  readyDiv.appendChild(readyForm);

  var readyFormText = document.createElement("input"); //input element, text
  readyFormText.setAttribute('type',"text");
  readyFormText.setAttribute('name',"locationstring");
  readyFormText.setAttribute('size',"30");
  readyFormText.setAttribute('value',`${lat},${lng}`);
  readyForm.appendChild(readyFormText);

  var readyFormButton = document.createElement("input"); //input element, Submit button
  readyFormButton.setAttribute('type',"submit");
  readyFormButton.setAttribute('value',"Submit");
  readyForm.appendChild(readyFormButton);
}

// initialize the canvas
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth * 2/3;
canvas.height = window.innerHeight * 4/5;
var ctx = canvas.getContext("2d");

// // add some responsiveness to the page
// window.addEventListener('resize', function() {
// 	w = canvas.width = window.innerWidth;
// 	h = canvas.height = window.innerHeight;
// });

// play a piano sound
var soundFileNumber = Math.floor(Math.random() * 13) + 1;
var ding = new Audio(`.public/audio/extra-${soundFileNumber}.mp3`);
ding.volume = 0.2;
ding.play();

// setTimeout(function() {
//   //Do something after 5 seconds
// }, 5000);

// setInterval(function() {
//   // Do something every 5 seconds
// }, 5000);

//first draw the particle vortex

// set particle variables
var w = canvas.width;
var h = canvas.height;
// z axis = square root of h^2 + w^2
var z = Math.sqrt(h * h + w * w);

var particles = [];
var particleCount = 10;
var size = 8;

var particle = function(){
	this.x = Math.random()*w;
	this.y = Math.random()*3*h-h;
	this.d = Math.random()*(size-2)*1 + 2;
  // this.d = Math.random()*forecast.currently.windspeed*10;

	//draw a particle
	this.draw = function() {
    // particle interior outline color
    ctx.fillStyle = 'rgba(255,255,255,0.1';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.d, 0, 2*Math.PI);
		ctx.fill();
    ctx.lineTo(window.innerWidth/2.5, window.innerHeight/2.5);
    ctx.lineWidth = 2;

    // set line and circle color
    //ctx.strokeStyle = "hsl(" + (Math.random() * 360) + ",80%,50%)";
    ctx.strokeStyle = 'rgba(255,255,255,0.1';
    ctx.stroke();

	}
	// update the particle
	this.update = function() {
		if(this.d < size) {
			this.x += (1/2)*(this.d-size)*(this.d-size);
		}else{
			this.x -= (1/2)*(this.d-size)*(this.d-size);
		}
		if(this.x < -50 || this.x > w+50) {
			this.d = size*2 - this.d;
		}
	}
}

function draw() {
  //background color
	ctx.fillStyle = "black";

	ctx.fillRect(-w,-h,3*w,3*h);
	ctx.translate(w/2,h/2);
	ctx.rotate(0.001);
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
draw();




// setTimeout(function() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   canvas.remove();
//   console.log('Thanks for watching.');
//
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', "views/bye.ejs", true);
//   xhr.send();
//
// }, 30000);
