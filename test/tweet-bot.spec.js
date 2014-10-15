/* tweet-bot.spec.js */

var tweetBot = require('../lib/tweet-bot');

describe("tweetBot", function() {

    it("should exists", function() {
        expect(tweetBot).not.toBe(undefined);
    });
});