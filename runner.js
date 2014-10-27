/* index.js */

var TweetBot = require('./lib/tweet-bot.js');
var config = require('./config.json'); // App keys

var toSearch = [ 'nodejs', 'angularjs', 'javascript' ]; // Search on Twitter

var options = { toSearch: toSearch, lang: 'en' };
var tweetBot = new TweetBot(config, options);

tweetBot.run(); // Launch