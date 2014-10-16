/* index.js */

var TweetBot = require('./lib/tweet-bot.js');

var config = require('./config.json'); // App keys
var toTweet = require('./to_tweet.json').tweets; // Read from JSON

var tweetBot = new TweetBot(config, toTweet);
tweetBot.run(); // Launch