/* tweet-bot.js */

// OAuth 1.0 for Twitter REST API
var OAuth = require('oauth').OAuth,
    utils = require('./_utils.js'),
    fs = require('fs');

var TWITTER_API_URL = 'https://api.twitter.com/',
    TWITTER_API_VERSION = '1.1/',

    REQUEST_TOKEN_URL = TWITTER_API_URL + 'oauth/request_token',
    ACCESS_TOKEN_URL = TWITTER_API_URL + 'oauth/access_token',

    USER_TIMELINE_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'statuses/user_timeline.json',
    UPDATE_STATUS_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'statuses/update.json',
    SEARCH_TWEETS_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'search/tweets.json',

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
    this.getLastTweet(); // Basic verification.

    // Loop action
    setInterval(function () {

        self.search(self.options.toSearch[utils.randomIndex(self.options.toSearch)]);

    }, self.options.tweetInterval);
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

    this.get(USER_TIMELINE_URL, function (data) {
        self.logTweet(data);
    });
};

TweetBot.prototype.search = function (toSearch) {
    console.log('tweetBot #search( %s )', toSearch);

    var self = this;

    var query = SEARCH_TWEETS_URL + '?q=' + encodeURI(toSearch) + '&lang=' + self.options.lang;

    this.get(query, function (data) {
        var allTweets = JSON.parse(data);
        var aTweet = allTweets.statuses[0].text;

        console.log('[ find_tweet ] [ %s ]', aTweet);

        self.sendNewTweet(allTweets.statuses[0].text);
    });
};

TweetBot.prototype.get = function (url, callback) {

    this.oauth.get(url, this.config.ACCESS_TOKEN, this.config.ACCESS_TOKEN_SECRET, function (error, data, response) {
        if (error) {
            utils.handleError(error);
            console.log(response);
        }
        else
            callback(data);
    });
};

TweetBot.prototype.sendNewTweet = function (text) {
    console.log('tweetBot #sendNewTweet()');
    text = text || undefined;

    var self = this;
    var randomIndex, tweet;

    do {
        // Get random from array
        randomIndex = utils.randomIndex(this.toTweet);
        tweet = this.toTweet[randomIndex];

        if (tweet.posted === true)
            console.log('[ ALREADY_TWEETED ] [ %s ]', randomIndex);

    } while (tweet.posted === true);

//    console.log('[ random_tweet ] [ %s ] %s', randomIndex, tweet.text);

    // Request POST parameters
    var extraParams = { status: text ? text : tweet.text };

    this.post(UPDATE_STATUS_URL, extraParams, function (data) {
        self.ack(data, randomIndex);
    });
};

TweetBot.prototype.post = function(url, extraParams, callback) {
    extraParams = extraParams || null;

    this.oauth.post(url, this.config.ACCESS_TOKEN, this.config.ACCESS_TOKEN_SECRET, extraParams, function (error, data, response) {
        if (error)
            utils.handleError(error);
        else
            callback(data);
    });
};

TweetBot.prototype.ack = function (data, index) {

    var tweet = JSON.parse(data);
    console.log('[ tweet_posted ] [ %s ]', tweet.id);

    this.toTweet[index].posted = true;

    fs.writeFile('tmp/db.json', JSON.stringify(this.toTweet), function (err) {
        if (err)
            utils.handleError(err);
        else
            console.log('[ tweet_saved ] [ %s ]', index);
    });
};

TweetBot.prototype.logTweet = function (data) {
    var tweets = JSON.parse(data);
    console.log('[ last_tweet ]', tweets[0].text);
};

module.exports = TweetBot;