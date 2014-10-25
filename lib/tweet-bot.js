/* tweet-bot.js */

// OAuth 1.0 for Twitter REST API
var OAuth = require('oauth').OAuth;

var TWITTER_API_URL = 'https://api.twitter.com/',
    TWITTER_API_VERSION = '1.1/',

    REQUEST_TOKEN_URL = TWITTER_API_URL + 'oauth/request_token',
    ACCESS_TOKEN_URL = TWITTER_API_URL + 'oauth/access_token',

    USER_TIMELINE_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'statuses/user_timeline.json',
    UPDATE_STATUS_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'statuses/update.json',
    SEARCH_TWEETS_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'search/tweets.json',

    OAUTH_API_VERSION = '1.0',
    OAUTH_SIGNATURE_METHOD = 'HMAC-SHA1';

function TweetBot(config, options) {

    this.config = config || undefined;
    this.options = options || undefined;
    this._tweetQueue = [];

    this._authenticate(); // Setup OAuth, no I/O
}

TweetBot.prototype.run = function() {
    console.log('\ntweetBot #run()', new Date(Date.now()), this.options);

    var self = this;

    self._init(function() {

        var runFn = function() {

            self._executeTask(); // Main action

            if (!self._upKeep())
                clearInterval(interval); // If something goes wrong, trigger interruption.
        };

        var interval = setInterval(runFn, self.options.tweetInterval);
    });
};

TweetBot.prototype._init = function(callback) {
    // Prepare for execution.
    this.search(this.options.toSearch, callback);
};

TweetBot.prototype._executeTask = function() {
    this.sendTweet();
};

TweetBot.prototype._upKeep = function() {
    return this._tweetQueue.length > 0;
};

TweetBot.prototype._authenticate = function() {
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

TweetBot.prototype.search = function(terms, callback) {
    console.log('\ntweetBot #search()');

    var self = this;

    terms.forEach(function(term) {

        console.log('\n[ tweet:search ] [ %s ]', term);

        var query = self._buildQuery(term);

        self._get(query, function(data) {
            self._handleApiResponse(data);
        });
    });

    if (typeof callback === 'function') callback();
};

TweetBot.prototype._handleApiResponse = function(data) {
    var self = this;

    var tweets = self._extractTweets(data);

    if (tweets !== undefined) {
        tweets.forEach(function(tweet) {
            self._queueUp(tweet);
        });
    }
};

TweetBot.prototype._extractTweets = function(data) {
    var tweets = JSON.parse(data);
    tweets = tweets.statuses;

    return tweets;
};

TweetBot.prototype._queueUp = function (tweet) {
    this._tweetQueue.push(tweet.text);
    console.log('\ntweetBot #queue( %s )', this._tweetQueue.length);
};

TweetBot.prototype._buildQuery = function(term) {

    return SEARCH_TWEETS_URL
        + '?q=' + encodeURIComponent(term)
        + '&lang=' + this.options.lang
        + '&count=' + '50'
        + '&result_type=' + 'mixed';
};

TweetBot.prototype.getLastTweet = function() {
    console.log('\ntweetBot #getLastTweet()');

    var self = this;

    this._get(USER_TIMELINE_URL, function(data) {
        self.logTweet(data);
    });
};

TweetBot.prototype.sendTweet = function(callback) {
    console.log('\ntweetBot #sendTweet( %s )', this._tweetQueue.length);

    var noOp = function() {};
    var status = this._tweetQueue.shift();
    console.log('\n[ tweet:status ]', status);

    callback = callback || noOp;

    // Request POST parameters
    var extraParams = { status: status };

    this._post(UPDATE_STATUS_URL, extraParams, function (data) {
        callback(data);
    });
};

TweetBot.prototype._get = function(url, callback) {
    var self = this;

    self.oauth.get(url, this.config.ACCESS_TOKEN, this.config.ACCESS_TOKEN_SECRET, function (error, data, response) {
        if (error)
            self.handleError(error);
        else
            callback(data);
    });
};

TweetBot.prototype._post = function(url, extraParams, callback) {
    var self = this;
    extraParams = extraParams || null;

    self.oauth.post(url, this.config.ACCESS_TOKEN, this.config.ACCESS_TOKEN_SECRET, extraParams, function (error, data, response) {
        if (error)
            self.handleError(error);
        else
            callback(data);
    });
};

TweetBot.prototype.logTweet = function() {

    console.log('\ntweetBot #logTweet( %s )', this._tweetQueue.length);
    console.log('\n[ tweet:shift ]', this._tweetQueue.shift());
};

TweetBot.prototype.handleError = function (error) {
    console.log('[ error ]', error);
};

module.exports = TweetBot;