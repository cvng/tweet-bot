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
    console.log('\ntweetBot #init()', new Date(Date.now()), options);

    this.config = config || undefined;
    this.options = options || undefined;

    this._authenticate(); // Setup OAuth
}

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

TweetBot.prototype.getLastTweet = function () {
    console.log('\ntweetBot #getLastTweet()');

    var self = this;

    this._get(USER_TIMELINE_URL, function (data) {
        self.logTweet(data);
    });
};

TweetBot.prototype.search = function (terms) {
    console.log('\ntweetBot #search()');

    var self = this;
    var i = 0;

    var searchFn = function () {
        console.log('[ tweet:search ] [ %s ]', terms[i]);

        var query = SEARCH_TWEETS_URL
            + '?q=' + encodeURIComponent(terms[i++])
            + '&lang=' + self.options.lang
            + '&count=' + '1'
            + '&result_type=' + 'recent';

        self._get(query, function (data) {
            var tweets = JSON.parse(data);
                tweets = tweets.statuses;

            if (tweets !== undefined) {

                for (var j = 0; j < tweets.length; j++) {
                    var tweet = tweets[j];
                    console.log('[ tweet:found ] [ %s ]', tweet.text);
                    self.sendTweet(tweet.text);
                }
            }
        });

        if (i >= terms.length) i = 0;
    };

    setInterval(searchFn, self.options.tweetInterval);
};

TweetBot.prototype.sendTweet = function (text, callback) {
    console.log('\ntweetBot #sendTweet()');

    var noOp = function () {};

    callback = callback || noOp;

    console.log('[ tweet:send ]', text);

    // Request POST parameters
    var extraParams = { status: text };

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

TweetBot.prototype.logTweet = function (data) {
    console.log('\ntweetBot #logTweet()');
    var tweets = JSON.parse(data);

    tweets.forEach(function (tweet) {
        console.log('[ tweet:text ]', tweet.text);
    });
};

module.exports = TweetBot;