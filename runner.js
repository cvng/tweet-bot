/* index.js */

var TweetBot = require('./lib/tweet-bot.js');
var config = require('./config.json'); // App keys

var toSearch = [ 'nodejs', 'angularjs', 'html5', 'css3' ]; // Search on Twitter

var options = { toSearch: toSearch, tweetInterval: 3000, lang: 'en' };
var tweetBot = new TweetBot(config, options);

tweetBot.run(); // Launch