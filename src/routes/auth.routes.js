var express = require("express");
var app = express();

const auth = require('../controllers/auth.controller.js');

// Login user
app.post('/login', auth.login);

// Register user
app.post('/registration', auth.registration);


module.exports = app;
