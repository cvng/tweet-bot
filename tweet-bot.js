/* tweet-bot.js */

// OAuth 1.0 for Twitter REST API
var oauth = require('oauth').OAuth;

module.exports = TweetBot;

function TweetBot (options) {}

TweetBot.prototype.run = function () {
    console.log('Bot running [%s]', Date.now());
};

// Launch
var tweetBot = new TweetBot();
tweetBot.run();