jQuery(document).ready(function($){


  function sportsData() {
    console.log("Inside sportsData()");

    var d = new Date();
    var dayOfMonth = d.getUTCDate();
    var month = d.getMonth();
    var year = d.getYear();
    var daysInTheMonth = new Date(year, month, 0).getDate();
    console.log("Days in the month: " + daysInTheMonth);
    // var team = req.params.team;//sql 
    var team = "ATL";

    var schedule, home, away, venue, bc, zipCode, time, city;

    for(var j = dayOfMonth; j < daysInTheMonth; j++){
      schedule = "http://api.sportradar.us/mlb-t6/games/2017/" + month + "/" + j + "/schedule.json?api_key=y89xxrup6qutvvyqqsxu8hv3";

      $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function(res) {
        console.log("Res: ", res);
        
        for(var i = 0; i < res.games.length; i++){
          home = res.games[i].home.abbr;
          away = res.games[i].away.abbr;  
          venue = res.games[i].venue.name;
          bc = res.games[i].broadcast.network;
          zipCode = res.games[i].venue.zip;
          time = res.games[i].scheduled;
          city = res.games[i].venue.city;

          if(home === team || away === team){
            var info = [home, away, venue, bc, city, team];
            res.render("index", info);
          } 
        }
      });
    }
}

sportsData();
});