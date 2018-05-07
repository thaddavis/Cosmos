var restify = require('restify');
var builder = require('botbuilder');
var azure = require('botbuilder-azure');

var documentDbOptions = {
    host: 'https://charliebotcosmosdb.documents.azure.com:443/',
    masterKey: '2DlKR2cb1xT3fjVb2zm79rz0A5IlHxJzGjB91UN60gtC5q0fY4lbaST9Ge3L5K7F0k45HnQb0DLMlJL2iOtVUA==',
    database: 'charliebotcosmosdb',
    collection: 'bot'
};

var docDbClient = new azure.DocumentDbClient(documentDbOptions);

var cosmosStorage = new azure.AzureBotStorage({ gzipData: false }, docDbClient);

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
// var bot = new builder.UniversalBot(connector, function (session) {
//     session.send("You said: %s", session.message.text);
// });

var bot = new builder.UniversalBot(connector, function (session) {
  session.send("You said: %s", session.message.text);
})
.set('storage', cosmosStorage);
