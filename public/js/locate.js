var forecast, forecastLoader, crd, userLat, userLong;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 2 * document.documentElement.clientWidth / 5;
canvas.height = 2 * document.documentElement.clientHeight / 5;

const locationFormContainer = document.querySelector("#location-form-container");
const locationForm = document.querySelector("#location-form");
const navigatorLocateButton = document.querySelector("#locate-with-browser");
const locationInput = document.querySelector("#location-input");
const locationButton = document.querySelector("#location-button");

// navigator geolocation options
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

// play a piano sound
let soundFileNumber = Math.floor(Math.random() * 13) + 1;
let ding = new Audio(`.public/audio/extra-${soundFileNumber}.mp3`);
ding.volume = 0.1;
ding.play();

// if user hits "get mine" button:
navigatorLocateButton.addEventListener('click', function() {

  // play a piano sound
  soundFileNumber = Math.floor(Math.random() * 13) + 1;
  ding = new Audio(`.public/audio/extra-${soundFileNumber}.mp3`);
  ding.volume = 0.1;
  ding.play();

  // make a request for the user's geolocation
  navigator.geolocation.getCurrentPosition(success, error, options);
  while (locationForm.firstChild) {
    locationForm.firstChild.remove();
  }

  // if successful grab, set coordinates
  function success(pos) {
    crd = pos.coords;
    userLat = crd.latitude;
    userLng = crd.longitude;

    // log what's found
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

  // play a piano sound
  soundFileNumber = Math.floor(Math.random() * 13) + 1;
  ding = new Audio(`.public/audio/extra-${soundFileNumber}.mp3`);
  ding.volume = 0.1;
  ding.play();

  // geocode the user's location
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    address: locationInput.value
  }, function(results, status) {
    if (status === "OK") {
      var geoLocation = results[0].geometry.location
        .toString()
        .replace(/\s/g, "");
      userLat = results[0].geometry.location.lat();
      userLng = results[0].geometry.location.lng();

      // log what's found
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

function getForecast(lat, lng) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/8c3c8dc972b787fa631b37e0cf3da0d2/${lat},${lng}?exclude=minutely,hourly,daily,alerts,flags`);
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

function readyLatLng(lat, lng) {
  locationForm.remove();

  var readyDiv = document.createElement("DIV");
  readyDiv.setAttribute("id", "ready-form");
  locationFormContainer.appendChild(readyDiv);

  var readyDivHeader = document.createElement("H1");
  readyDivHeader.textContent = "Location ready.";
  readyDiv.appendChild(readyDivHeader);

  var readyForm = document.createElement("FORM");
  readyForm.setAttribute("method", "post");
  readyForm.setAttribute("action", "/");
  readyDiv.appendChild(readyForm);

  var readyFormText = document.createElement("INPUT"); //input element, text
  readyFormText.setAttribute('type', "text");
  readyFormText.setAttribute('name', "locationstring");
  readyFormText.setAttribute('size', "30");
  readyFormText.setAttribute('value', `${lat},${lng}`);
  readyForm.appendChild(readyFormText);

  var readyFormButton = document.createElement("INPUT"); //input element, Submit button
  readyFormButton.setAttribute('type', "submit");
  readyFormButton.setAttribute('value', "Submit");
  readyForm.appendChild(readyFormButton);

  // play a piano sound
  soundFileNumber = Math.floor(Math.random() * 13) + 1;
  ding = new Audio(`.public/audio/extra-${soundFileNumber}.mp3`);
  ding.volume = 0.1;
  ding.play();
}

// set canvas particle variables
var w = canvas.width;
var h = canvas.height;
// z axis = square root of h^2 + w^2
var z = Math.sqrt(h * h + w * w);

var particles = [];
var particleCount = 10;
var size = 8;

var particle = function() {
  this.x = Math.random() * w;
  this.y = Math.random() * h;
  this.d = Math.random() * (size - 4) * 1 + 7;

  //draw particle
  this.draw = function() {
    // particle interior color
    ctx.fillStyle = 'hsl('+ 360*Math.random() +',15%,15%)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.d, 0, 2 * Math.PI);
    ctx.fill();

    // draw line to particle
    ctx.lineTo(canvas.width / 2.5, canvas.height / 2.5);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'hsl('+ 360*Math.random() +',15%,15%)';
    ctx.stroke();
  }
  // update the particle
  this.update = function() {
    if (this.d < size) {
      this.x += (1 / 2) * (this.d - size) * (this.d - size);
    } else {
      this.x -= (1 / 2) * (this.d - size) * (this.d - size);
    }
    if (this.x < -50 || this.x > w + 50) {
      this.d = size * 2 - this.d;
    }
  }
}

function draw() {
  //background color
  ctx.fillStyle = "black";

  ctx.fillRect(-w, -h, 3 * w, 3 * h);
  ctx.translate(w / 2, h / 2);
  ctx.rotate(0.001);
  ctx.translate(-w / 2, -h / 2);

  // now draw a bunch of particles
  for (var i = 0; i < particles.length; i++) {
    particles[i].draw();
    particles[i].update();
  }
  window.requestAnimationFrame(draw);
}
// add the particle to the array of particles
for (var i = 0; i < particleCount; i++) {
  particles.push(new particle());
}
draw();
