/* tweet-bot.js */

// OAuth 1.0 for Twitter REST API
var OAuth = require('oauth').OAuth,
    utils = require('./_utils.js');

var TWITTER_API_URL = 'https://api.twitter.com/',
    TWITTER_API_VERSION = '1.1/',

    REQUEST_TOKEN_URL = TWITTER_API_URL + 'oauth/request_token',
    ACCESS_TOKEN_URL = TWITTER_API_URL + 'oauth/access_token',

    USER_TIMELINE_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'statuses/user_timeline.json',
    UPDATE_STATUS_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'statuses/update.json',
    SEARCH_TWEETS_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'search/tweets.json',

    OAUTH_API_VERSION = '1.0',
    OAUTH_SIGNATURE_METHOD = 'HMAC-SHA1';

function TweetBot (config, options) {

    this.config = config || undefined;
    this.options = options || undefined;
    this._tweetQueue = [];

    this._authenticate(); // Setup OAuth
}

TweetBot.prototype.run = function () {
    console.log('\ntweetBot #run()', new Date(Date.now()), this.options);

    var self = this;

    self.search(self.options.toSearch);

    var runFn = function () {

//        self.logTweet(); // Main loop action
        self.sendTweet(); // Main loop action

        if (self._tweetQueue.length <= 0)
            clearInterval(interval);
    };

    var interval = setInterval(runFn, this.options.tweetInterval);
};

TweetBot.prototype._authenticate = function () {
    console.log('\ntweetBot #_authenticate()');

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

TweetBot.prototype.search = function (terms) {
    console.log('\ntweetBot #search()');

    var self = this;

    terms.forEach(function (term) {

        console.log('\n[ tweet:search ] [ %s ]', term);

        var query = self._buildQuery(term);

        self._get(query, function (data) {

            var tweets = JSON.parse(data);
            tweets = tweets.statuses;

            if (tweets !== undefined) {
                tweets.forEach(function (tweet) {

                    console.log('\n[ tweet:queue ] [ %s ]', tweet.text);
                    self._tweetQueue.push(tweet.text);
                });

//                callback();
            }
        });
    });
};

TweetBot.prototype._buildQuery = function (term) {

    return SEARCH_TWEETS_URL
        + '?q=' + encodeURIComponent(term)
        + '&lang=' + this.options.lang
        + '&count=' + '5'
        + '&result_type=' + 'mixed';
};

TweetBot.prototype.getLastTweet = function () {
    console.log('\ntweetBot #getLastTweet()');

    var self = this;

    this._get(USER_TIMELINE_URL, function (data) {
        self.logTweet(data);
    });
};

TweetBot.prototype.sendTweet = function (callback) {
    console.log('\ntweetBot #sendTweet()');

    var noOp = function () {};
    var status = this._tweetQueue.shift();

    callback = callback || noOp;

    // Request POST parameters
    var extraParams = { status: status };

    this._post(UPDATE_STATUS_URL, extraParams, function (data) {
        callback(data);
    });
};

TweetBot.prototype._get = function (url, callback) {

    this.oauth.get(url, this.config.ACCESS_TOKEN, this.config.ACCESS_TOKEN_SECRET, function (error, data, response) {
        if (error) {
            utils.handleError(error);
            console.log(response);
        }
        else
            callback(data);
    });
};

TweetBot.prototype._post = function(url, extraParams, callback) {
    extraParams = extraParams || null;

    this.oauth.post(url, this.config.ACCESS_TOKEN, this.config.ACCESS_TOKEN_SECRET, extraParams, function (error, data, response) {
        if (error)
            utils.handleError(error);
        else
            callback(data);
    });
};

TweetBot.prototype.logTweet = function () {

    console.log('\ntweetBot #logTweet()');
    console.log('\n[ tweet:shift ]', this._tweetQueue.shift());
};

module.exports = TweetBot;