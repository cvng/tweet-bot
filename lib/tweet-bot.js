/* tweet-bot.js */

// OAuth 1.0 for Twitter REST API
var OAuth = require('oauth');

var params = {
    TWITTER_API_URL: 'https://api.twitter.com/',

    REQUEST_TOKEN_URL: 'oauth/request_token',
    ACCESS_TOKEN_URL: 'oauth/access_token',

    TWITTER_API_VERSION: '1.1/',
    USER_TIMELINE_URL: 'statuses/user_timeline.json',

    OAUTH_API_VERSION : '1.0',
    OAUTH_SIGNATURE_METHOD: 'HMAC-SHA1'
};

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
        params.TWITTER_API_URL + params.REQUEST_TOKEN_URL,
        params.TWITTER_API_URL + params.ACCESS_TOKEN_URL,
        this.options.CONSUMER_KEY,
        this.options.CONSUMER_SECRET,
        params.OAUTH_API_VERSION,
        (Math.round( new Date().getTime() / 1000 )),
        params.OAUTH_SIGNATURE_METHOD
    );

    oauth.get(
        params.TWITTER_API_URL + params.TWITTER_API_VERSION + params.USER_TIMELINE_URL,
        this.options.ACCESS_TOKEN,
        this.options.ACCESS_TOKEN_SECRET,

        function (error, data, response) {
            if (error)
                handleRequestError(error);
            else
                handleApiResponse(data);
        }
    );
};

function handleApiResponse (response) {
    console.log('[ oauth ] OK');

    var tweets = JSON.parse(response);
    console.log('[ body ]', tweets[0].text);
}

function handleRequestError (error) {
    console.log('[ oauth ] KO');
    console.log('[ error ]', error);
}

module.exports = TweetBot;