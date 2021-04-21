var express = require("express");
var app = express();

const groups = require('../controllers/group.controller.js');

// Create group
app.post('/create', groups.createGroup);

// Join group
app.post('/join', groups.joinGroup);

// Get group
app.post('/find', groups.findGroup);

// Generate pairings
app.post('/generatePairings', groups.generatePairings);

// Add exclusions
app.post('/addExclusion', groups.addExclusion);


module.exports = app;
