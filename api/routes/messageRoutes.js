'use strict';
module.exports = function(app) {
    var messages = require('../controllers/messageController.js');


    // todoList Routes
    app.route('/message/test')
        .get(messages.test_message)
    app.route('/message')
        .post(messages.message)
    app.route('/feedback')
        .post(messages.feedback)
};