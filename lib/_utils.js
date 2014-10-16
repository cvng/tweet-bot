/* _utils.js */

exports.logTweet = function (data) {
    var tweets = JSON.parse(data);
    console.log('[ last_tweet ]', tweets[0].text);
};

exports.handleError = function (error) {
    console.log('[ error ]', error);
};

exports.randomize = function (array) {
    var next = Math.floor(Math.random() * array.length);
    return { random: array[next], index: next };
};