// Dependencies
// =============================================================

// Requiring our models
var express = require('express');
var app = express.Router();
var request = require("request");
var rp = require("request-promise");

try{
var dataTimer, homeTimer, awayTimer;

app.get("/sports", function(req, res) {

	console.log("Inside Test");
try{
	var venue = function(){
		console.log("Inside sportsData()");

		var d = new Date();
		var dayOfMonth = d.getDate();
		var month = d.getMonth();
		var year = d.getYear();

		var daysInTheMonth = new Date(year, month, 0).getDate();

	    // var team = req.params.team;//sql 
	    var team = "ATL";
	    // var dataTimer, homeTimer, awayTimer;
	    var schedule, home, homeID, awayID, away, venue, bc, zipCode, time, city, thisData, info, newSchedule;
	    var j = dayOfMonth;

	    	schedule="http://api.sportradar.us/mlb-t6/games/2017/05/" + j +"/schedule.json?api_key=y89xxrup6qutvvyqqsxu8hv3";
	    	// schedule="http://api.sportradar.us/mlb-t6/games/2017/05/20/schedule.json?api_key=c4q2dh7afte4fkv6sfh6jb4d";	    	
	    	getTheData(schedule);
	    	console.log("getTheData(schedule)");

	    	function getTheData(schedule){
	    		request(schedule, function(error, res, body) {
						if (JSON.parse(body).Response != 'False') {
							thisData = JSON.parse(body);

							if (!error && res.statusCode === 200) {	
								for(var i = 0; i < thisData.games.length; i++){
									home = thisData.games[i].home.abbr;
									homeID = thisData.games[i].home.id;		          
									away = thisData.games[i].away.abbr;
									awayID = thisData.games[i].away.id;

									venue = thisData.games[i].venue.name;
									bc = thisData.games[i].broadcast.network;
									zipCode = thisData.games[i].venue.zip;
									time = thisData.games[i].scheduled;
									city = thisData.games[i].venue.city;

									if(home === team || away === team){
										info = [home, homeID, away, awayID, venue, bc, zipCode, time, city, team];
										console.log("Info: ", info);

										// awayDepthChart(awayID, info);
										homeDepthTimer();										
									    function homeDepthTimer() {
									        homeTimer = setTimeout(function() {
									        	homeDepthChart(homeID, awayID, info)
									        }, 3000);
									    }									
					            		break;
					        		}else{
							        	j++;
							        	newSchedule ="http://api.sportradar.us/mlb-t6/games/2017/05/"+j+"/schedule.json?api_key=c4q2dh7afte4fkv6sfh6jb4d"
							         	// getTheData(newSchedule);
							        	getDataTimer();
									    function getDataTimer() {
									        dataTimer = setTimeout(function() {
									        	getTheData(newSchedule)
									        }, 3000);
									    }							        	
							        } 
					    		}
							}console.log("Hit line 83");
						}
				});console.log("Hit line 85");
	    	}
	}
}catch(err){
	console.log("Err caught in venue: ", err);
}

try{
	var homeDepthChart = function(homeID, awayID, info){
		console.log("Inside Home Depth Chart");
		var homeDepth = "http://api.sportradar.us/mlb-t6/teams/" + homeID + "/depth_chart.json?api_key=y89xxrup6qutvvyqqsxu8hv3";
		// var homeDepth = "http://api.sportradar.us/mlb-t6/teams/12079497-e414-450a-8bf2-29f91de646bf/depth_chart.json?api_key=y89xxrup6qutvvyqqsxu8hv3";		
		// console.log("Home Depth API URL: ", homeDepth);

		var homeDepthArr = [], homeFirstName, homeLastName, homeName, homeData;

		request(homeDepth, function(error, res, homeBody) {

			if (JSON.parse(homeBody).Response != 'False') {
				homeData = JSON.parse(homeBody);

				if (!error && res.statusCode === 200) {
					for(var i = 0; i < homeData.team.positions.length; i++){
						if(homeData.team.positions[i].players !== undefined){
							for(var j = 0; j < homeData.team.positions[i].players.length; j++){
								if(homeData.team.positions[i].players[j].depth === 1){
									homeFirstName = homeData.team.positions[i].players[j].first_name;
									homeLastName = homeData.team.positions[i].players[j].last_name;
									homeName = homeFirstName + " " + homeLastName;
									homeDepthArr.push(homeName);
								}
							}
						}
					}
				}
			}
			console.log("Home Depth Array: ", homeDepthArr);
			awayDepthTimer();
		    function awayDepthTimer() {
		        awayTimer = setTimeout(function() {
		        	awayDepthChart(awayID, info)
		        }, 10000);
		    }
		   	return homeDepthArr;			
		});
	}
}catch(err){
	console.log("Err caught in homeDepthChart(): ", err);
}

try{
	var awayDepthChart = function(awayID, info){
		console.log("Inside Away Depth Chart");		
		var awayDepth = "http://api.sportradar.us/mlb-t6/teams/" + awayID + "/depth_chart.json?api_key=cz2jqxcfmddqn8gsr5udxssm";
		// var awayDepth = "http://api.sportradar.us/mlb-t6/teams/d89bed32-3aee-4407-99e3-4103641b999a/depth_chart.json?api_key=cz2jqxcfmddqn8gsr5udxssm";		
		console.log("Away Depth API URL: ", awayDepth);
		var awayDepthArr = [], awayFirstName, awayLastName, awayName, awayData;

		request(awayDepth, function(error, res, awayBody) {		
			if (JSON.parse(awayBody).Response != 'False') {
				awayData = JSON.parse(awayBody);	
				if (!error && res.statusCode === 200) {
					for(var i = 0; i < awayData.team.positions.length; i++){
						if(awayData.team.positions[i].players !== undefined){						
							for(var j = 0; j < awayData.team.positions[i].players.length; j++){
								
								if(awayData.team.positions[i].players[j].depth === 1){
									awayFirstName = awayData.team.positions[i].players[j].first_name;
									awayLastName = awayData.team.positions[i].players[j].last_name;
									awayName = awayFirstName + " " + awayLastName;
									awayDepthArr.push(awayName);
								}
							}
						}
					}
				}
			}
			console.log("Away Depth Array: ", awayDepthArr);
		});		
		res.render("index", info);
	}
}catch(err){
	console.log("Err caught in awayDepthChart(): ", err);
}
	venue();
	// homeDepthChart();
	// awayDepthChart();

});
}catch(err) {
	console.log("Err caught in the whole route: ", err);
}

module.exports = app;