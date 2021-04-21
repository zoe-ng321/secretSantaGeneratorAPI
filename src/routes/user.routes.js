var express = require("express");
var app = express();

const users = require('../controllers/user.controller.js');

// Find user
app.post('/find', users.findUser);

// Update profile
app.put('/updateProfile', users.updateProfile);

// Update newPassword
app.put('/updatePassword', users.updatePassword);


module.exports = app;
