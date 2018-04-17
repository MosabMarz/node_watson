/**
 * Example for using the Slack RTM API.
 */

const { RTMClient } = require('@slack/client');
var axios = require('axios'); //the variable doesn't necessarily have to be named http

// Get an API token by creating an app at <https://api.slack.com/apps?new_app=1>
// It's always a good idea to keep sensitive data like the token outside your source code. Prefer environment variables.
const token = process.env.SLACK_API_TOKEN || 'xoxb-345218093776-0djUjUtyc5ROikxII60NLe5c';
if (!token) { console.log('You must specify a token to use this example'); process.exitCode = 1; return; }

// Initialize an RTM API client
const rtm = new RTMClient(token);
// Start the connection to the platform
rtm.start();

// Log all incoming messages
rtm.on('message', (message) => {
  const url = "https://localhost:3000/message";
  axios.post('http://localhost:3000/message', {
    message : message.text   
  })
  .then(function (response) {
    rtm.sendMessage(response.data.reply + "\nC: " + response.data.confidence + "\nIntent: "+response.data.intent,message.channel);
  })
  .catch(function (error) {
    rtm.sendMessage("didn't understand",message.channel);
  });

})

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