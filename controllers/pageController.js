var express = require('express');
var pageRouter= express.Router();

pageRouter.get("/", function(req, res){
  res.render("index");
});

module.exports = pageRouter;

