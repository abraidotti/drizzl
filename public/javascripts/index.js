window.onload = function() {
  var forecast;

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  // geolocation block
  if ("geolocation" in navigator) {
    var confirmation = confirm("Use your current location?");

    if (confirmation) {
      var forecastLoader = document.createElement("DIV");
      forecastLoader.setAttribute("id", "forecast-loader");
      document.body.appendChild(forecastLoader);

      // grab position through browser
      navigator.geolocation.getCurrentPosition(success, error, options);

      // if successful grab, set coordinates
      function success(pos) {
        const crd = pos.coords;
        const userLat = crd.latitude;
        const userLong = crd.longitude;

        console.log("Location found.");
        console.log("Your current position is:");
        console.log(`Latitude : ${userLat}`);
        console.log(`Longitude: ${userLong}`);
        console.log(`Accuracy is more or less ${crd.accuracy} meters.`);

        getForecast(userLat, userLong);
        // kill the loading animation
        forecastLoader.remove();
      }
    } else {
      //build a form to get a location
      var formContainer = document.getElementById("container");
      var formHeader = document.createElement("H2");
      formHeader.textContent = "Get your forecast.";
      formContainer.appendChild(formHeader);

      var locationForm = document.createElement("FORM");
      locationForm.setAttribute("id", "location-form");
      formContainer.appendChild(locationForm);

      var locationInput = document.createElement("INPUT");
      locationInput.setAttribute("type", "text");
      locationInput.setAttribute("id", "location-input");
      locationInput.setAttribute("name", "location");
      locationInput.setAttribute("placeholder", "location");
      locationForm.appendChild(locationInput);

      var locationButton = document.createElement("INPUT");
      locationButton.setAttribute("type", "button");
      locationButton.setAttribute("id", "location-button");
      locationButton.setAttribute("value", "submit");
      locationForm.appendChild(locationButton);

      // grab the forecast when the user submits a location
      locationButton.addEventListener("click", function(event) {
        var forecastLoader = document.createElement("DIV");
        forecastLoader.setAttribute("id", "forecast-loader");
        document.body.appendChild(forecastLoader);
        // prevent page reload on form submission
        event.preventDefault();
        var submittedLocation = locationInput.value;

        // geocode the user's location
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: submittedLocation }, function(
          results,
          status
        ) {
          if (status === "OK") {
            var geoLocation = results[0].geometry.location
              .toString()
              .replace(/\s/g, "");
            const userLat = results[0].geometry.location.lat();
            const userLong = results[0].geometry.location.lng();
            console.log(`Geolocated coords = ${userLat}, ${userLong}`);

            getForecast(userLat, userLong);
            // kill the loading animation
            forecastLoader.remove();
          } else {
            alert(
              "Geocode was not successful for the following reason: " + status
            );
          } // end of if status === ok block
        }); // end of geocode block
      }); // end of click function
    } // end of else block

    // log error messages
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
  } // end of geolocation *if* block

  // get a forecast!
  function getForecast(latFloat, longFloat) {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      ` https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/8c3c8dc972b787fa631b37e0cf3da0d2/${latFloat},${longFloat}?exclude=minutely,hourly,daily,alerts,flags`
    );
    console.log("OPENED", xhr.status);

    xhr.onload = function() {
      console.log("LOADING", xhr.status);
      if (xhr.status === 200) {
        forecast = JSON.parse(xhr.responseText);
        console.log(forecast);

        let apparentTemperature = Math.round(forecast.currently.apparentTemperature);
        console.log(`Current temp: ${apparentTemperature} controls blip frequency.`)
        setInterval(function(){
          drawBlip(apparentTemperature);
          blipNum++;
        }, 2000);


      } else {
        forecastLoader.remove();
        alert("Request failed.  Returned status of " + xhr.status);
      }
    };
    xhr.send();
  }
}; // end of window.onload block

// Nice 'n neat audio initializers from http://middleearmedia.com/demos/webaudio/controllingosc.html

// Initialize the Audio Context
var context = new AudioContext(); // Create audio container with webkit prefix

// Declare variables in the global scope so they can be disconnected
var oscillator, gain;

// Create function that routes an OscillatorNode through a GainNode and then to the output
function startOsc(frequency){ // Frequency is passed to this function from input button

	// Create OscillatorNode
	oscillator = context.createOscillator(); // Create sound source
	oscillator.type = 'sine'; // Sine wave
	oscillator.frequency.value = frequency; // Frequency in hertz (passed from input button)
	oscillator.start(0); // Play oscillator instantly

	// Create GainNode
	gain = context.createGain(); // Create gain node
	gain.gain.value = 1; // Set gain to full volume
  gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);

  // Connect the Nodes
	oscillator.connect(gain); // Connect oscillator to gain
	gain.connect(context.destination); // Connect gain to output
}

function off() {
	oscillator.stop(0); // Stop oscillator after 0 seconds
  oscillator.disconnect(); // Disconnect oscillator so it can be picked up by browser�s garbage collector
}

// big ol' note object
var noteValues = { 'C0': 16.35, 'C#0': 17.32, 'Db0': 17.32, 'D0': 18.35, 'D#0':
19.45, 'Eb0': 19.45, 'E0': 20.60, 'F0': 21.83, 'F#0': 23.12, 'Gb0': 23.12, 'G0':
24.50, 'G#0': 25.96, 'Ab0': 25.96, 'A0': 27.50, 'A#0': 29.14, 'Bb0': 29.14,
'B0': 30.87, 'C1': 32.70, 'C#1': 34.65, 'Db1': 34.65, 'D1': 36.71, 'D#1': 38.89,
'Eb1': 38.89, 'E1': 41.20, 'F1': 43.65, 'F#1': 46.25, 'Gb1': 46.25, 'G1': 49.00,
'G#1': 51.91, 'Ab1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'Bb1': 58.27, 'B1':
61.74, 'C2': 65.41, 'C#2': 69.30, 'Db2': 69.30, 'D2': 73.42, 'D#2': 77.78,
'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'Gb2': 92.50, 'G2': 98.00,
'G#2': 103.83, 'Ab2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'Bb2': 116.54, 'B2':
123.47, 'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56,
'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3':
196.00, 'G#3': 207.65, 'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3':
233.08, 'B3': 246.94, 'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66,
'D#4': 311.13, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4':
369.99, 'G4': 392.00, 'G#4': 415.30, 'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16,
'Bb4': 466.16, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5':
587.33, 'D#5': 622.25, 'Eb5': 622.25, 'E5': 659.26, 'F5': 698.46, 'F#5': 739.99,
'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'Ab5': 830.61, 'A5': 880.00, 'A#5':
932.33, 'Bb5': 932.33, 'B5': 987.77, 'C6': 1046.50, 'C#6': 1108.73, 'Db6':
1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'Eb6': 1244.51, 'E6': 1318.51, 'F6':
1396.91, 'F#6': 1479.98, 'Gb6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'Ab6':
1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'Bb6': 1864.66, 'B6': 1975.53, 'C7':
2093.00, 'C#7': 2217.46, 'Db7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'Eb7':
2489.02, 'E7': 2637.02, 'F7': 2793.83, 'F#7': 2959.96, 'Gb7': 2959.96, 'G7':
3135.96, 'G#7': 3322.44, 'Ab7': 3322.44, 'A7': 3520.00, 'A#7': 3729.31, 'Bb7':
3729.31, 'B7': 3951.07, 'C8': 4186.01 }

// make an array of notes
var keys = [];
for (var prop in noteValues) {
    if (noteValues.hasOwnProperty(prop)) {
        keys.push(prop);
    }
}

var blipNum = 0;

function getRandomPosition(element) {
  const w = window
	const x = w.innerHeight;
	const y = w.innerWidth;
	const randomX = Math.floor(Math.random()*x);
	const randomY = Math.floor(Math.random()*y);
	return [randomX,randomY];
}

var drawBlip = (num) => {
	const blip = document.createElement('div');
  blip.setAttribute("id", "blip-"+blipNum)
  document.createElement("div")
  blip.setAttribute( 'style', 'border:2px solid black; border-radius: 25px; background-color:steelblue; height:50px; width:50px; position: absolute;' );
  // draw the blip in a random spot in the window
  let xy = getRandomPosition(blip);
	blip.style.top = xy[0] + 'px';
	blip.style.left = xy[1] + 'px';
  document.body.appendChild(blip);
  // make a noise
  console.log(num + 400);
  var blipFrequency = num +
  400;
  startOsc(blipFrequency);
  console.log(`${blip.id} frequency = ${blipFrequency}`);

  // remove old blips one by one after 10 appear on the screen
  if (blipNum >9){
    var oldBlip = document.getElementById("blip-"+(blipNum-10));
    console.log(`Goodbye ${oldBlip.id}!`)
    oldBlip.remove();
  }
};
