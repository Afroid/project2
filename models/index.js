'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
// default config set-up errors for me, we may need to handle this file differently to access config.json per system
// var config    = require(__dirname + '/..\config\config.json')[env];
var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var db        = {};


// if (config.test) {
  console.log("Inside config.test if");
  // var sequelize = new Sequelize(process.env[config.test]);
  var sequelize = new Sequelize("qbd6ru6f5h9i4zc6", "xvp8o7uqxma31xw9", "wg5quba6q5ch9qh8");  
  console.log("After sequelize variables");
// } else {
//   var sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
