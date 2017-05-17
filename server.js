var express = require("express"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");
  cookieParser= require("cookie-parser");

var app = express();
var port = process.env.PORT || 8080;

var db = require("./models");

var jwt = require('jsonwebtoken');

var jwtExp = require('express-jwt');

app.use(express.static(process.cwd() + "/public"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(methodOverride("_method"));

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({
  type: "application/vnd.api+json"
}));

// handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//routes
var auth = require("./controllers/authController.js");
var appPages= require("./controllers/pageController.js");
var appApi = require("./controllers/apiController.js");

var gtGroupSecret = process.env.GT_GROUP_SECRET || 'ImTooLazyToWriteMyOwnSecretEnvValue';

app.use(cookieParser(gtGroupSecret));

app.use('/auth', auth);

app.use('/app', function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.redirect('/');
  }
});
app.use('/app', jwtExp({
  secret: gtGroupSecret,
  getToken: function fromCookie(req) {
    if (req.signedCookies) {
      return req.signedCookies.jwtAuthToken;
    }
    return null;
  }
}));
app.use('/app', appPages);

app.use('/api', function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ 'message': 'Not Authorized', details: err });
  }
});
app.use('/app', function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.redirect('/');
  }
});
app.use('/api', jwtExp({
  secret: gtGroupSecret
}));
app.use('/api', appApi);

app.get("/", jwtExp({
  secret: gtGroupSecret,
  getToken: function fromCookie(req) {
    if (req.signedCookies) {
      return req.signedCookies.jwtAuthToken;
    }
    return null;
  },
  credentialsRequired: false
}));

app.get("/", function(req, res) {
  if (!req.user) {
    res.redirect('/auth/signin')
  } else {
    res.redirect("/app")
  }
})

db.sequelize.sync({ /* force: true */ }).then(function() {
  app.listen(port, function() {
    console.log("App listening on port " + port);
  });
});