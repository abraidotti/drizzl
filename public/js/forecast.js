// grab the forecast object in the hackiest way possible ;)
const forecast = JSON.parse(document.querySelector("H3").textContent);
document.querySelector("H3").remove();
console.log(forecast);

// create a button for each key/value in the forecast
const controlPanel = document.querySelector("#control-panel");
// this is the number to send over to the forecast display
var forecastModifier;
Object.keys(forecast.currently).forEach(function(key) {
  // for each key, make a button that sends the value to the ticker
  let btn = document.createElement("BUTTON");
  btn.setAttribute("id", `btn-${key}`);
  btn.setAttribute("value", `${key}`);
  btn.innerHTML = key;
  controlPanel.appendChild(btn);

  // send the value over to the ticker
  btn.addEventListener("click", function(event) {
    let ticker = document.querySelector(".ticker");
    let sendToTicker = document.createElement("DIV");
    sendToTicker.setAttribute("class", "ticker__item");
    sendToTicker.textContent = `The ${key} is ${forecast.currently[`${key}`]}.`;
    console.log(`${key} button value set to ${forecast.currently[`${key}`]}.`)
    // delete all the ticker elements
    while (ticker.firstChild) {
      ticker.removeChild(ticker.firstChild);
    }
    // and then add this one
    ticker.appendChild(sendToTicker);
  }); // end button click function

    // if the key's value is a number
    if(!isNaN(forecast.currently[`${key}`])){
      forecastModifier = Math.round(forecast.currently[`${key}`]);
  } else {
    console.log('key value is ' + forecast.currently.key)
  }
});
