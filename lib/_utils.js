/* _utils.js */

exports.logTweet = function (data) {
    var tweets = JSON.parse(data);
    console.log('[ last_tweet ]', tweets[0].text);
};

exports.logConfirmation = function (data) {
    var tweet = JSON.parse(data);
    console.log('[ status_updated ]', tweet.id);
};

exports.handleRequestError = function (error) {
    console.log('[ error ]', error);
};

exports.randomize = function (array) {
    return array[Math.floor(Math.random() * array.length)];
};