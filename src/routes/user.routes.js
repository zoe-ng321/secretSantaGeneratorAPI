module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Login user
    app.post('/login', users.login);

    // Register user
    app.post('/registration', users.registration);

}
