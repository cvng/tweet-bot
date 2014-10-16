/* index.js */

var TweetBot = require('./lib/tweet-bot.js');

var config = require('./config.json'); // App keys
var toTweet = require('./to_tweet.json').tweets; // Read from JSON

// Timer between each tweet (ms)
// Be aware of Twitter API Rate Limits :
// https://dev.twitter.com/rest/public/rate-limiting
var options = { tweetInterval: 3000 };

var tweetBot = new TweetBot(config, toTweet, options);
tweetBot.run(); // Launch