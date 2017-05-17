var express = require("express"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override");

var app = express();
var port = process.env.PORT || 8080;

var db = require("./models");

var jwt= require('jsonwebtoken');
 
app.use(express.static(process.cwd() + "/public")); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(methodOverride("_method"));

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//routes
var api = require("./controllers/main_controller.js");

app.get("/", function(req, res) {
  res.render("sign-in");
})

app.use('/api', api);
app.use('/api/secure', function (req, res, next) {
  // check authorization
  // if authorized next()
  if (!req.header('Authorization')) {
    res.status(401).json({ 'status': 'Not Authorized'});
  } else {
    jwt.verify(req.header('Authorization'), 'randomsecretforsigningjwt', function(err, decoded) {
      if (err) {
        console.log('err', err)
        res.status(401).json({ 'status': 'Not Authorized'});
      } else {
        console.log(decoded.data) // bar
        // query db for privileges for user
        // add to req.privs
        next();
      }
    });
  }
  
});
app.use('/api/secure', api);

db.sequelize.sync({/* force: true */}).then(function() {
  app.listen(port, function() {
    console.log("App listening on port " + port);
  });
});

