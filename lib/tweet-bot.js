/* tweet-bot.js */

// OAuth 1.0 for Twitter REST API
var OAuth = require('oauth').OAuth;
var utils = require('./_utils.js');
var fs = require('fs');

var TWITTER_API_URL = 'https://api.twitter.com/',

    REQUEST_TOKEN_URL = TWITTER_API_URL + 'oauth/request_token',
    ACCESS_TOKEN_URL = TWITTER_API_URL + 'oauth/access_token',

    TWITTER_API_VERSION = '1.1/',
    USER_TIMELINE_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'statuses/user_timeline.json',
    UPDATE_STATUS_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'statuses/update.json',

    OAUTH_API_VERSION = '1.0',
    OAUTH_SIGNATURE_METHOD = 'HMAC-SHA1';

function TweetBot (config, toTweet, options) {
    this.config = config || undefined;
    this.toTweet = toTweet || undefined;
    this.options = options || undefined;
}

TweetBot.prototype.run = function () {
    console.log('tweetBot #run()', new Date(Date.now()), this.options);

    var self = this;

    // Setup
    this.authenticate();
    this.getLastTweet(); // Comment if unneeded.

    // runtime
    setInterval(function () {

        self.sendNewTweet(); // Closure issue

    }, this.options.tweetInterval);
};

TweetBot.prototype.authenticate = function () {
    console.log('tweetBot #authenticate()');

    this.oauth = new OAuth(
        REQUEST_TOKEN_URL,
        ACCESS_TOKEN_URL,
        this.config.CONSUMER_KEY,
        this.config.CONSUMER_SECRET,
        OAUTH_API_VERSION,
        null,
        OAUTH_SIGNATURE_METHOD
    );
};

TweetBot.prototype.getLastTweet = function () {
    console.log('tweetBot #getLastTweet()');

    var self = this;

    this.oauth.get(
        USER_TIMELINE_URL,
        this.config.ACCESS_TOKEN,
        this.config.ACCESS_TOKEN_SECRET,

        function (error, data, response) {
            if (error)
                utils.handleError(error);
            else
                self.logTweet(data);
        }
    );
};

TweetBot.prototype.sendNewTweet = function () {
    console.log('tweetBot #sendNewTweet()');

    var self = this;

    do {
        // Get random from array
        var randomIndex = utils.randomIndex(this.toTweet);
        var tweet = this.toTweet[randomIndex];

        if (tweet.posted === true)
            console.log('[ ALREADY_TWEETED ] [ %s ]', randomIndex);

    } while (tweet.posted === true);

    console.log('[ random_tweet ] [ %s ] %s', randomIndex, tweet.text);

    // Request POST parameters
    var extraParams = { status: tweet.text };

    this.oauth.post(
        UPDATE_STATUS_URL,
        this.config.ACCESS_TOKEN,
        this.config.ACCESS_TOKEN_SECRET,
        extraParams,

        function (error, data, response) {
            if (error)
                utils.handleError(error);
            else {
                self.ack(data, randomIndex);
            }
        }
    );
};

TweetBot.prototype.ack = function (data, index) {
    var self = this;

    var tweet = JSON.parse(data);
    console.log('[ status_updated ]', tweet.id);

    this.toTweet[index].posted = true;

    fs.writeFile('tmp/db.json', JSON.stringify(self.toTweet), function (err) {
        if (err)
            utils.handleError(err);
        else
            console.log('[ tweet_saved ]');
    });
};

TweetBot.prototype.logTweet = function (data) {
    var tweets = JSON.parse(data);
    console.log('[ last_tweet ]', tweets[0].text);
};

module.exports = TweetBot;