// *********************************************************************************
// authController.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var express = require('express');
var authRouter = express.Router();

var gtGroupSecret = process.env.GT_GROUP_SECRET || 'ImTooLazyToWriteMyOwnSecretEnvValue';

var salt = '$2a$10$.zvkhL71NZo804bNdFdBae';

authRouter.get("/signUp", function(req, res) {
  res.render("signUp", {
    status: "Please sign up"
  });
})

authRouter.get("/signIn", function(req, res) {
  res.render("signIn", {
    status: "Please sign in with Username and Password"
  });
})

// POST route for creating a new user
authRouter.post("/signUp", function(req, res) {
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
        /*token(req,res);*/
        /*res.status(200).json({'status': 'success'});*/
        res.redirect("/auth/signIn");
      })
      .catch(function(err) {
        res.render("signUp", {
          status: err
        });
      })
  });

});

authRouter.post("/signIn", function(req, res) {
  db.User.findOne({
      username: req.body.username
    })
    .then(function(user) {
      if (!user) {
        console.log('no user found')
        res.render("signIn", {
          'status': 'Invalid username or password'
        })
      } else {
        bcrypt.compare(req.body.password, user.password, function(err, valid) {
          if (err || !valid) {
            res.render("signIn", {
              'status': 'Invalid username or password'
            })
          } else {
            var oneHour = Math.floor(Date.now() / 1000) + (60 * 60);
            var payload = {
              exp: oneHour,
              user: {
                id: user.id,
                name: user.username
              }
            };
            var jwtAuthToken = jwt.sign(payload, gtGroupSecret);
            // Create a cookie embedding JWT token
            res.cookie('jwtAuthToken', jwtAuthToken, {
              secure: process.env.NODE_ENV === "production",
              signed: true
            });
            res.redirect('/app')
              
          }
        });
      }

    })
});



// Routes
// =============================================================
module.exports = authRouter;