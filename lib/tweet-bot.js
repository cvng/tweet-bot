/* tweet-bot.js */

// OAuth 1.0 for Twitter API
var OAuth = require('oauth').OAuth;

var TWITTER_API_URL = 'https://api.twitter.com/',
    TWITTER_STREAM_URL = 'https://stream.twitter.com/',
    TWITTER_API_VERSION = '1.1/',

    REQUEST_TOKEN_URL = TWITTER_API_URL + 'oauth/request_token',
    ACCESS_TOKEN_URL = TWITTER_API_URL + 'oauth/access_token',

    FILTER_STATUS_URL = TWITTER_STREAM_URL + TWITTER_API_VERSION + 'statuses/filter.json',
    SAMPLE_STATUS_URL = TWITTER_STREAM_URL + TWITTER_API_VERSION + 'statuses/sample.json',
    UPDATE_STATUS_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'statuses/update.json',

    OAUTH_API_VERSION = '1.0',
    OAUTH_SIGNATURE_METHOD = 'HMAC-SHA1';

function TweetBot(config, options) {

    this.config = config || undefined;
    this.options = options || undefined;

    this._authenticate(); // Setup OAuth, no I/O
}

TweetBot.prototype.run = function() {
    var self = this;

    console.log('\ntweetBot #run()', new Date(Date.now()), this.options);

    this.track(this.options.toSearch, function (tweet) {
        console.log('[ tweet:new:%s ] %s', tweet.id, tweet.text);
        self.sendTweet(tweet.text);
    });
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

TweetBot.prototype.track = function(terms, callback) {
    console.log('\ntweetBot #track()');

    var self = this;

    terms.forEach(function(term) {

        console.log('\n[ tweet:track ] [ %s ]', term);

        var query = self._buildQuery(term);

        self._get(query, function(data, response) {
            self._handleStreamResponse(data, response, callback);
        });
    });
};

TweetBot.prototype._handleStreamResponse = function(data, response, callback) {

    var message = ''; // chunks collector 
    var tweetDelimiter = "\r";

    response.on('data', function(chunk) {
        message += chunk;

        var tweetDelimiterIndex = message.indexOf(tweetDelimiter);

        // Once found tweet delimiter, start processing chunk
        if (tweetDelimiterIndex != -1) {
            var tweet = message.slice(0, tweetDelimiterIndex);

            try {
                tweet = JSON.parse(tweet);
                if (tweet.id !== undefined) // Filter only tweet
                    callback(tweet);
            } catch (e) {
                console.log('[ error:tweet:parsing ]', e);
            }

            message = message.slice(tweetDelimiterIndex + 1);
        }
    });
};

TweetBot.prototype._buildQuery = function(term) {
    return FILTER_STATUS_URL
        + '?track=' + encodeURIComponent(term)
        + '&language=' + this.options.lang;
};

TweetBot.prototype.sendTweet = function(tweet, callback) {
    console.log('\ntweetBot #sendTweet()');

    var noOp = function() {};

    callback = callback || noOp;

    // Request POST parameters
    var extraParams = { status: tweet };

    this._post(UPDATE_STATUS_URL, extraParams, function (data) {
        callback(data);
    });
};

TweetBot.prototype._get = function(url, callback) {
    var self = this;

    console.log('\n[ GET ]', url);

    self.oauth.get(url, this.config.ACCESS_TOKEN, this.config.ACCESS_TOKEN_SECRET, function (error, data, response) {
        if (error)
            self.handleError(error, response);
        else
            callback(data, response);
    });
};

TweetBot.prototype._post = function(url, extraParams, callback) {
    var self = this;
    extraParams = extraParams || null;

    self.oauth.post(url, this.config.ACCESS_TOKEN, this.config.ACCESS_TOKEN_SECRET, extraParams, function (error, data, response) {
        if (error)
            self.handleError(error, response);
        else
            callback(data);
    });
};

TweetBot.prototype.handleError = function (error, r) {
    console.log('[ error ]', error);
//    console.log('[ response ]', r);
};

module.exports = TweetBot;