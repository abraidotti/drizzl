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
  document.querySelector("#container").remove();
  forecastLoader = document.createElement("CANVAS");
  forecastLoader.setAttribute("id", "spinner");
  forecastLoader.setAttribute("height", "window.innerHeight");
  forecastLoader.setAttribute("width", "window.innerWidth");
  document.body.appendChild(forecastLoader);

  var canvas = document.getElementById('spinner');
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
