module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Login user
    app.post('/user/login', users.login);

    // Register user
    app.post('/user/registration', users.registration);

    // Find user
    app.post('/user/find', users.findUser);

    // Update profile
    app.put('/user/updateProfile', users.updateProfile);

    // Update newPassword
    app.put('/user/updatePassword', users.updatePassword);

}
