# tweet-bot

Node.js Twitter bot

## work in progress

For now, the bot can read from a JSON file and send a random tweet.

## config

- Fill your app credentials (https://apps.twitter.com/) in `config.json` and you're done.
- see `test/` for details.

## usage

- Run `npm install`
- Write a bunch of text in `to_tweet.json` and let it do tha work !

## run test

- Simply as `npm test`

## to do

- Make bot runtime (bot should never stop)
- Set bot timer (between each tweet)
- read from mongoDB ?