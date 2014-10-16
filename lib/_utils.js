/* _utils.js */

exports.handleError = function (error) {
    console.log('[ error ]', error);
};

exports.randomIndex = function (array) {
    return Math.floor(Math.random() * array.length);
};