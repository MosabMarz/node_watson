// nodejs.org
// npm install --save watson-developer-cloud
// bluemix.net
// ibm.com/watsondevelopercloud

var fs = require('fs');
var watson = require('watson-developer-cloud');
var auth = require('./auth.js'); // you'll have to edit this file to include your credentials

var assistant = new watson.ConversationV1(auth.conversation)

assistant.message({
    workspace_id: '220d6c23-754f-49d3-9fd0-7b9216f8e7ff',
    input: {'text': 'نقاطي زي الزفت يا زفت'}
  },  function(err, response) {
    if (err)
      console.log('error:', err);
    else {
        console.log(JSON.stringify(response.intents, null, 2));
        if (response.intents[0].confidence > 0.49) {
            console.log("pretty sure")
        }
    }
  });