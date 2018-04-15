"use strict";
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3001,
    bodyParser = require('body-parser');
process.setMaxListeners(0);
require('events').EventEmitter.prototype._maxListeners = 100;
require('./api/controllers/slackController.js');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var routes = require('./api/routes/messageRoutes.js');
routes(app);
app.listen(port);
console.log('todo list RESTful API server started on: ' + port);