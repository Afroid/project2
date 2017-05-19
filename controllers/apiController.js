var express = require('express');
var apiRouter= express.Router();
var weather = require("weather-js");

apiRouter.get('/weather/:zipcode', function (req, res) {
 
var searchZip = process.argv[2]; 

weather.find({ search: searchZip, degreeType: "F" }, function(err, result) {

  // If there is an error log it.
  if (err) {
    console.log(err);
  }

  // If there is no error... then print out the weather data.
  // We use JSON.stringify to print the data in string format.
  // We use the JSON.stringify argument of "2" to make the format pretty.
  // See link here: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
  console.log(JSON.stringify(result, null, 2));

});
  res.status(200).json(weather);
});


module.exports = apiRouter;
