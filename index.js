/* index.js */

var TweetBot = require('./lib/tweet-bot.js');

var config = require('./config.json'); // App keys
//var toTweet = require('./to_tweet.json').tweets; // Read from JSON

var toSearch = ['node.js', 'angularjs', 'html5'];

// Timer between each tweet (ms)
// Be aware of Twitter API Rate Limits :
// https://dev.twitter.com/rest/public/rate-limiting
var options = { toSearch: toSearch, tweetInterval: 3000, lang: 'en' };

var tweetBot = new TweetBot(config, toSearch, options);
tweetBot.run(); // Launch