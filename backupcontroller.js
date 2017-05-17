// *********************************************************************************
// main_controller.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var express = require('express');
var apiRouter = express.Router();

var salt = '$2a$10$.zvkhL71NZo804bNdFdBae';

apiRouter.get("/test", function(req, res) {
  res.status(200).json({ 'message': 'Success'})
});



// POST route for creating a new user
apiRouter.post("/signUp", function(req, res) {
  bcrypt.hash(req.body.password, salt, function(err, hash) {
    // Store hash in your password DB.
    // TODO: update schema to enforce unique usernames
    db.User.create({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      team: req.body.team
    })
      .then(function(dbPost) {
        token(req,res);
        /*res.status(200).json({'status': 'success'});*/

      })
      .catch(function (err) {
        res.status(500).send(err);
      })
  });

});

apiRouter.post("/signIn", function(req, res) {
  token(req,res);
});

function token(req,res){
  db.User.findOne({
    username: req.body.username
  })
    .then(function(user) {
      if (!user) {
        console.log('no user found')
        res.status(400).json({
          'status' : 'Invalid username or password'
        })
      } else {
        bcrypt.compare(req.body.password, user.password, function(err, valid) {
          if (err || !valid) {
            res.status(400).json({
              'status' : 'Invalid username or password'
            })
          } else {
            var userToken = jwt.sign({
              exp: Math.floor(Date.now() / 1000) + (60 * 60),
              data: user.id
            }, 'randomsecretforsigningjwt');
            res.cookie
            /*res.status(200).json({
              id: user.id,
              username: user.username,
              token: userToken*/
            });
          }
        });
      }

    })
}
// Routes
// =============================================================
module.exports = apiRouter;