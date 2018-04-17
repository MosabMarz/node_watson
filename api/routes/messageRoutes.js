'use strict';
module.exports = function(app) {
    var messages = require('../controllers/messageController.js');

    //get reply for message from user
    app.route('/message').post(messages.message)
    //submit example from message by user
    app.route('/feedback').post(messages.feedback)
    //submit example of irrelevant input
    app.route('/counterexample').post(messages.counter_example)
    //create new intent with one example
    app.route('/intent').post(messages.create_intent)

};