module.exports = (app) => {
    const wishlists = require('../controllers/wishlist.controller.js');

    // Update wishlist
    app.post('/wishlist/update', wishlists.updateWishlist);

    // Get wishlist based on user
    app.get('/wishlist/user', wishlists.getWishlistForUser);

    // Get wishlists for group members
    app.get('/wishlist/group', wishtlists.getWishlistsForGroup);

}
