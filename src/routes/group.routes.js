module.exports = (app) => {
    const groups = require('../controllers/group.controller.js');

    // Create group
    app.post('/group/create', groups.createGroup);

    // Join group
    app.post('/group/join', groups.joinGroup);

    // Get group
    app.post('/group/find', groups.findGroup);

    // Generate pairings
    app.post('/group/generatePairings', groups.generatePairings);

    // Add exclusions
    app.post('/group/addExclusion', groups.addExclusion);

}
