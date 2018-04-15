'use strict';


var watson = require('watson-developer-cloud');
var auth = require('../models/auth.js'); // you'll have to edit this file to include your credentials
var assistant = new watson.ConversationV1(auth.conversation)


exports.message = function(req, res) {
    let message = req.body.message;
    assistant.message({
        workspace_id: '220d6c23-754f-49d3-9fd0-7b9216f8e7ff',
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
exports.feedback = function(req, res) {
    let message = req.body.message;

}
exports.test_message = function(req, res) {

    assistant.message({
        workspace_id: '220d6c23-754f-49d3-9fd0-7b9216f8e7ff',
        input: { 'text': 'نقاطي زي الزفت يا زفت' }
    }, function(err, response) {
        if (err)
            console.log('error:', err);
        else {
            if (response.intents[0].confidence > 0.49) {
                let reply = {
                    "reply": response.output.text[0],
                    "intent": response.intents[0].intent,
                    "confidence": response.intents[0].confidence
                }
                res.send(reply);
            }
        }
    });


}