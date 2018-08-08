const express = require('express');
const router = express.Router();

let data = require('../app.js'); // import the file app.js

const accessKeys = require('./config');  // get info for Twit function
const Twit = require('twit');
const T = new Twit(accessKeys);

router.get('/', (req, res) => {
  // data.dataObject is the entire object named "dataObject" that was exported from app.js
  res.render('main', data.dataObject);
});

router.post('/', (req, res) => {
  const tweetText = req.body.message;  // parse body for the property 'message' which was sent by the Form Submit
  console.log('Tweeted "' + tweetText + '"');
  let sendTweet = T.post('statuses/update', { status: tweetText });
  sendTweet
    .then(function (result) {
      console.log("tweet_id: " + result.data.id);
      let newMessage = {
        userScreenName: result.data.user.screen_name,
        text: result.data.text
      }
      // newMessage.userName = result.data.user.screen_name;
      // newMessage.text = result.data.text;
      console.log(newMessage);
      data.dataObject.tweets.unshift(newMessage);
      data.dataObject.tweets.pop();
      // console.log(data.dataObject.tweets);
    })
    .catch(function () {
      console.log("Error sending tweet to Twitter API");
    });

  timer();

  function timer() {
    setTimeout(function () {
      console.log("Timer done!");
      res.redirect('/');
    }, 2000);
  };
});

module.exports = router;