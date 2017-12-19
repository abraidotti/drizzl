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
    userLong = crd.longitude;

    // tell the user what's found
    console.log("Location found.");
    console.log("Your current position is:");
    console.log(`Latitude : ${userLat}`);
    console.log(`Longitude: ${userLong}`);
    getForecast(userLat, userLong);
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
      userLong = results[0].geometry.location.lng();

      // tell the user what's found
      console.log("Location found.");
      console.log("Your current position is:");
      console.log(`Latitude : ${userLat}`);
      console.log(`Longitude: ${userLong}`);

      getForecast(userLat, userLong);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    };
  }); // end of geocode block
}); // end of click function

function showLoader(){
  document.querySelector("#container").remove();
  forecastLoader = document.createElement("DIV");
  forecastLoader.setAttribute("id", "forecast-loader");
  document.body.appendChild(forecastLoader);
};

// get a forecast!
function getForecast(lat, long) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    ` https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/8c3c8dc972b787fa631b37e0cf3da0d2/${lat},${long}?exclude=minutely,hourly,daily,alerts,flags`
  );
  console.log("OPENED", xhr.status);
  // kill the loading animation
  forecastLoader.remove();

  xhr.onload = function() {
    console.log("LOADING", xhr.status);
    if (xhr.status === 200) {
      forecast = JSON.parse(xhr.responseText);
      console.log(forecast);

      let apparentTemperature = Math.round(
        forecast.currently.apparentTemperature
      );
      console.log(`Current temp: ${apparentTemperature}.`);
      // kill the loading animation
      forecastLoader.remove();
    } else {
      alert("Request failed.  Returned status of " + xhr.status);
    }
  };
  xhr.send();
}
