/* index.js */

var TweetBot = require('./lib/tweet-bot.js');
var config = require('./config.json'); // App keys

var toSearch = ['#node.js', '#angularjs', '#html5', '#css3']; // Search on Twitter

var options = { tweetInterval: 2000, lang: 'en' };
var tweetBot = new TweetBot(config, options);

tweetBot.search(toSearch, 15000);