/* index.js */

var TweetBot = require('lib/tweet-bot.js');
var config = require('config');

// Launch
var tweetBot = new TweetBot(config);
tweetBot.run();