/**
 * Example for using the Slack RTM API.
 */

const { RTMClient } = require('@slack/client');
var axios = require('axios'); //the variable doesn't necessarily have to be named http
var learningMode = false;
var lowConReplies;
var lastMessage = "";
// Get an API token by creating an app at <https://api.slack.com/apps?new_app=1>
// It's always a good idea to keep sensitive data like the token outside your source code. Prefer environment variables.
const token = process.env.SLACK_API_TOKEN || 'xoxb-345218093776-RnQJsyZPklXsroKauzQAMYd4';
if (!token) {
    console.log('You must specify a token to use this example');
    process.exitCode = 1;
}

// Initialize an RTM API client
const rtm = new RTMClient(token);
// Start the connection to the platform
rtm.start();
// Log all incoming messages
rtm.on('message', (message) => {
    if (learningMode) {
        var feedback = lowConReplies[parseInt(message.text)];
        if (feedback != null) {
            feedbackWatson(feedback, message);
        } else {
            rtm.sendMessage("failed to add feedback , fire Mos'ab", message.channel);
        }
    } else {
        messageWatson(message);
    }
})

var feedbackWatson = function(feedback, message) {
    console.log("message : " + lastMessage);
    console.log("intent : " + feedback.intent);
    axios.post('http://localhost:3001/feedback', {
            message: lastMessage,
            intent: feedback.intent
        })
        .then(function() {
            clearEnv();
            rtm.sendMessage("feedback added , thank you!", message.channel);

        })
        .catch(function(error) {
            rtm.sendMessage("failed to add feedback , fire Mos'ab", message.channel);
        });
}
var messageWatson = function(message) {
    /*made as api call because slack bot is just an intermediate state, 
    we can't change the code relying on it as primary input*/
    axios.post('http://localhost:3001/message', {
            message: message.text
        })
        .then(function(response) {
            if (response.data.trustedReply == true) {
                rtm.sendMessage(response.data.reply + "\nC: " +
                    response.data.confidence + "\nIntent: " +
                    response.data.intent, message.channel);
            } else {
                learningMode = true;
                lowConReplies = response.data.replies;
                lastMessage = message.text;
                rtm.sendMessage(getStringFromRepliesArray(lowConReplies), message.channel);
            }
        })
        .catch(function(error) {
            rtm.sendMessage("no intent with enough confidence 75%", message.channel);
        });
}
var clearEnv = function() {
        learningMode = false;
        lowConReplies = [];
        lastMessage = "";
    }
    // Log all reactions
rtm.on('reaction_added', (event) => {
    // Structure of `event`: <https://api.slack.com/events/reaction_added>
    console.log(`Reaction from ${event.user}: ${event.reaction}`);
});
rtm.on('reaction_removed', (event) => {
    // Structure of `event`: <https://api.slack.com/events/reaction_removed>
    console.log(`Reaction removed by ${event.user}: ${event.reaction}`);
});

// Send a message once the connection is ready
rtm.on('ready', (event) => {

    // Getting a conversation ID is left as an exercise for the reader. It's usually available as the `channel` property
    // on incoming messages, or in responses to Web API requests.

    // const conversationId = '';
    // rtm.sendMessage('Hello, world!', conversationId);
});

var getStringFromRepliesArray = function(array) {
    var replyString = ""
    array.forEach(reply => {
        replyString += (reply.index + "- I: " + reply.intent + " C:" + reply.confidence + "\n");
    });
    return replyString;
}