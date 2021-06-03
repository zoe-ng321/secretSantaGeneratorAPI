var express = require("express");
var app = express();

const users = require('../controllers/user.controller.js');

// Find user
app.get('/find', users.findUser);

// Update profile
app.post('/updateProfile', users.updateProfile);

// Update newPassword
app.post('/updatePassword', users.updatePassword);


module.exports = app;
