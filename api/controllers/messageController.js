'use strict';


var watson = require('watson-developer-cloud');
var auth = require('../models/auth.js'); // you'll have to edit this file to include your credentials
var assistant = new watson.AssistantV1(auth.conversation);
const workspace_id = '220d6c23-754f-49d3-9fd0-7b9216f8e7ff';

//get user message to watson
exports.message = function(req, res) {
    let message = req.body.message;
    assistant.message({
        workspace_id: workspace_id,
        input: { 'text': message },
        alternate_intents: true
    }, function(err, response) {
        if (err)
            console.log('error:', err);
        else {
            if (response.intents.length > 0) {
                var foundGoodAnswer = false;
                var reply;
                response.intents.forEach(intent => {
                    if (intent.confidence > 0.75) {
                        reply = {
                            "trustedReply": true,
                            "reply": response.output.text[0],
                            "intent": intent.intent,
                            "confidence": intent.confidence
                        }
                        foundGoodAnswer = true;
                        res.send(reply);
                    }
                });
                if (!foundGoodAnswer) {
                    var replies = [];
                    response.intents.forEach((intent, index) => {
                        var tempReply = {
                            index: index,
                            intent: intent.intent,
                            confidence: intent.confidence
                        }

                        replies.push(tempReply);
                    });
                    reply = {
                        "trustedReply": false,
                        "replies": replies
                    }
                    res.send(reply);
                }


            } else {
                res.status(404);
                res.send('None shall pass');
            }
        }
    });
}

//enter feedback example for user input
exports.feedback = function(req, res) {
    let message = req.body.message;
    let intent = req.body.intent;

    let params = {
        workspace_id: workspace_id,
        intent: intent,
        text: message
    }
    assistant.createExample(params,
        function(err, response) {
            if (err) {
                console.log(err);

                res.status(404);
                res.send();
            } else {
                console.log(response);
                res.send();
            }
        });
}

//enter new intent for watson with 1 example 
exports.create_intent = function(req, res) {
    let example = req.body.example;
    let intent = req.body.intent;
var params = {
    workspace_id: workspace_id,
    intent: intent,
    examples: [
      {
        text: example
      }
    ]
  };
  
  assistant.createIntent(params, function(err, response) {
    if (err) {
      console.error(err);
      res.status(404);
      res.send();
    } else {
      console.log(JSON.stringify(response, null, 2));
      res.send(response);
    }
  });
}
exports.counter_example = function(req, res) {
    
}
