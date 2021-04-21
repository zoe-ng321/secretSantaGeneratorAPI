var express = require("express");
var app = express();

const wishlists = require('../controllers/wishlist.controller.js');

// Update wishlist
app.post('/add', wishlists.addWishlist);

// Update wishlist
app.post('/update', wishlists.updateWishlist);

// Get wishlist based on user
app.get('/user', wishlists.getWishlistForUserInGroup);

// Get wishlists for group members
app.get('/group', wishlists.getWishlistsForGroup);


module.exports = app;
