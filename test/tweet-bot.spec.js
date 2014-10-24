/* tweet-bot.spec.js */

var TweetBot = require('../lib/tweet-bot.js');
var config = require('../config.json');

var tweetBot;

describe('tweetBot', function() {

    beforeEach(function () {
        tweetBot = new TweetBot(config);
    });

    it('should exists', function() {
        expect(tweetBot).toBeDefined();
    });

    it('should have OAuth credentials', function() {
        expect(tweetBot.config).toBeDefined();
    });

    it('should have consumer KEY', function() {
        expect(tweetBot.config.CONSUMER_KEY).toBeDefined();
    });

    it('should have consumer SECRET', function() {
        expect(tweetBot.config.CONSUMER_SECRET).toBeDefined();
    });

    it('should have access TOKEN', function() {
        expect(tweetBot.config.ACCESS_TOKEN).toBeDefined();
    });

    it('should have access TOKEN SECRET', function() {
        expect(tweetBot.config.ACCESS_TOKEN_SECRET).toBeDefined();
    });
});