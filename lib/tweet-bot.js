/* tweet-bot.js */

// OAuth 1.0 for Twitter REST API
var OAuth = require('oauth').OAuth;
var utils = require('./_utils.js');

var TWITTER_API_URL = 'https://api.twitter.com/',

    REQUEST_TOKEN_URL = TWITTER_API_URL + 'oauth/request_token',
    ACCESS_TOKEN_URL = TWITTER_API_URL + 'oauth/access_token',

    TWITTER_API_VERSION = '1.1/',
    USER_TIMELINE_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'statuses/user_timeline.json',
    UPDATE_STATUS_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'statuses/update.json',

    OAUTH_API_VERSION = '1.0',
    OAUTH_SIGNATURE_METHOD = 'HMAC-SHA1';

function TweetBot (options, toTweet) {
    this.options = options || undefined;
    this.toTweet = toTweet || undefined;
}

TweetBot.prototype.loopInterval = '3000'; // In ms

TweetBot.prototype.run = function () {

    var self = this;
    console.log('tweetBot #run()', new Date(Date.now()));

    // Setup
    this.authenticate();
    this.getLastTweet(); // Not async for the moment

    // Main Loop
    setInterval(function () {

        self.sendNewTweet(); // Closure issue

    }, this.loopInterval);
};

TweetBot.prototype.authenticate = function () {
    console.log('tweetBot #authenticate()');

    this.oauth = new OAuth(
        REQUEST_TOKEN_URL,
        ACCESS_TOKEN_URL,
        this.options.CONSUMER_KEY,
        this.options.CONSUMER_SECRET,
        OAUTH_API_VERSION,
        null,
        OAUTH_SIGNATURE_METHOD
    );
};

TweetBot.prototype.getLastTweet = function () {

    console.log('tweetBot #getLastTweet()');

    this.oauth.get(
        USER_TIMELINE_URL,
        this.options.ACCESS_TOKEN,
        this.options.ACCESS_TOKEN_SECRET,

        function (error, data, response) {
            if (error)
                utils.handleRequestError(error);
            else
                utils.logTweet(data);
        }
    );
};

TweetBot.prototype.sendNewTweet = function () {

    console.log('tweetBot #sendNewTweet()');

    // Get random from array
    var text = utils.randomize(this.toTweet);
    console.log('[ random_tweet ]', text);

    // Request POST parameters
    var extraParams = { status: text };

    this.oauth.post(
        UPDATE_STATUS_URL,
        this.options.ACCESS_TOKEN,
        this.options.ACCESS_TOKEN_SECRET,
        extraParams,

        function (error, data, response) {
            if (error)
                utils.handleRequestError(error);
            else
                utils.logConfirmation(data);
        }
    );
};

module.exports = TweetBot;