/* tweet-bot.js */

// OAuth 1.0 for Twitter REST API
var OAuth = require('oauth');

var TWITTER_API_URL = 'https://api.twitter.com/',

    REQUEST_TOKEN_URL = TWITTER_API_URL + 'oauth/request_token',
    ACCESS_TOKEN_URL= TWITTER_API_URL + 'oauth/access_token',

    TWITTER_API_VERSION = '1.1/',
    USER_TIMELINE_URL = TWITTER_API_URL + TWITTER_API_VERSION + 'statuses/user_timeline.json',

    OAUTH_API_VERSION = '1.0',
    OAUTH_SIGNATURE_METHOD = 'HMAC-SHA1';

function TweetBot (options) {
    this.options = options || undefined;
}

TweetBot.prototype.run = function () {
    console.log('bot#run', Date.now());

    this.authenticate();
};

TweetBot.prototype.authenticate = function () {
    console.log('bot#authenticate');

    var oauth = new OAuth.OAuth(
        REQUEST_TOKEN_URL,
        ACCESS_TOKEN_URL,
        this.options.CONSUMER_KEY,
        this.options.CONSUMER_SECRET,
        OAUTH_API_VERSION,
        null,
        OAUTH_SIGNATURE_METHOD
    );

    oauth.get(
        USER_TIMELINE_URL,
        this.options.ACCESS_TOKEN,
        this.options.ACCESS_TOKEN_SECRET,

        function (error, data, response) {
            if (error)
                handleRequestError(error);
            else
                handleApiResponse(data, response);
        }
    );
};

function handleApiResponse (data, response) {
    console.log('[ oauth ] OK');

    var tweets = JSON.parse(data);
    console.log('[ body ]', tweets[0].text);
}

function handleRequestError (error) {
    console.log('[ oauth ] KO');
    console.log('[ error ]', error);
}

module.exports = TweetBot;