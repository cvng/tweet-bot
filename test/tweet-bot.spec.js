/* tweet-bot.spec.js */

var TweetBot = require('../lib/tweet-bot.js');
var config = require('../config.json');

var tweetBot;

describe('tweetBot', function() {

    beforeEach(function () {
        tweetBot = new TweetBot(config);
    });

    it('should exists', function() {
        expect(tweetBot).not.toBeUndefined();
    });

    it('should have OAuth credentials', function() {
        expect(tweetBot.config).not.toBeUndefined();
    });

    it('should have consumer KEY', function() {
        expect(tweetBot.config.CONSUMER_KEY).not.toBeUndefined();
    });

    it('should have consumer SECRET', function() {
        expect(tweetBot.config.CONSUMER_SECRET).not.toBeUndefined();
    });

    it('should have access TOKEN', function() {
        expect(tweetBot.config.ACCESS_TOKEN).not.toBeUndefined();
    });

    it('should have access TOKEN SECRET', function() {
        expect(tweetBot.config.ACCESS_TOKEN_SECRET).not.toBeUndefined();
    });
});