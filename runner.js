/* index.js */

var TweetBot = require('./lib/tweet-bot.js');
var config = require('./config.json'); // App keys

var toSearch = [ 'nodejs', 'angularjs', 'javascript' ]; // Fill your own keywords

var options = { toSearch: toSearch, lang: 'en' };
var tweetBot = new TweetBot(config, options);

tweetBot.run(); // Launch