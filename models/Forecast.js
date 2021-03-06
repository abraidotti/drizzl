var mongoose = require('mongoose');
var Schema    = mongoose.Schema;

var forecastSchema = new Schema(
{
    "type" : "object",
    "$schema" : "http://json-schema.org/draft-03/schema",
    "id" : "datapoint",
    "properties" : {
        "time" : {
            "type" : "number",
            "required" : true
        },
        "summary" : {
            "type" : "string",
            "required" : false
        },
        "icon" : {
            "type" : "string",
            "required" : false
        },
        "sunriseTime" : {
            "type" : "number",
            "required" : false
        },
        "sunsetTime" : {
            "type" : "number",
            "required" : false
        },
        "precipIntensity" : {
            "type" : "number",
            "required" : false
        },
        "precipIntensityError" : {
            "type" : "number",
            "required" : false
        },
        "precipIntensityMax" : {
            "type" : "number",
            "required" : false
        },
        "precipIntensityMaxTime" : {
            "type" : "number",
            "required" : false
        },
        "precipIntensityMaxError" : {
            "type" : "number",
            "required" : false
        },
        "precipProbability" : {
            "type" : "number",
            "required" : false
        },
        "precipProbabilityError" : {
            "type" : "number",
            "required" : false
        },
        "precipType" : {
            "type" : "string",
            "required" : false
        },
        "precipAccumulation" : {
            "type" : "number",
            "required" : false
        },
        "precipAccumulationError" : {
            "type" : "number",
            "required" : false
        },
        "temperature" : {
            "type" : "number",
            "required" : false
        },
        "temperatureError" : {
            "type" : "number",
            "required" : false
        },
        "temperatureMin" : {
            "type" : "number",
            "required" : false
        },
        "temperatureMinTime" : {
            "type" : "number",
            "required" : false
        },
        "temperatureMinError" : {
            "type" : "number",
            "required" : false
        },
        "temperatureMax" : {
            "type" : "number",
            "required" : false
        },
        "temperatureMaxTime" : {
            "type" : "number",
            "required" : false
        },
        "temperatureMaxError" : {
            "type" : "number",
            "required" : false
        },
        "dewPoint" : {
            "type" : "number",
            "required" : false
        },
        "dewPointError" : {
            "type" : "number",
            "required" : false
        },
        "windSpeed" : {
            "type" : "number",
            "required" : false
        },
        "windSpeedError" : {
            "type" : "number",
            "required" : false
        },
        "windBearing" : {
            "type" : "number",
            "required" : false
        },
        "windBearingError" : {
            "type" : "number",
            "required" : false
        },
        "cloudCover" : {
            "type" : "number",
            "required" : false
        },
        "cloudCoverError" : {
            "type" : "number",
            "required" : false
        },
        "humidity" : {
            "type" : "number",
            "required" : false
        },
        "humidityError" : {
            "type" : "number",
            "required" : false
        },
        "pressure" : {
            "type" : "number",
            "required" : false
        },
        "pressureError" : {
            "type" : "number",
            "required" : false
        },
        "visibility" : {
            "type" : "number",
            "required" : false
        },
        "visibilityError" : {
            "type" : "number",
            "required" : false
        },
        "ozone" : {
            "type" : "number",
            "required" : false
        },
        "ozoneError" : {
            "type" : "number",
            "required" : false
        }
    }
});

//Export model
module.exports = mongoose.model('forecast', forecastSchema);
