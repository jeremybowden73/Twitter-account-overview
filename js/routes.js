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
  const tweetText = req.body.message;  // parses body for the property 'message' which was sent by the Form Submit
  console.log('Tweeted "' + tweetText + '"');
  let sendTweet = T.post('statuses/update', { status: tweetText }); // Twit function to post a new Tweet

  // handler for the Promise that the Twit function returns
  sendTweet
    .then(function (result) {
      console.log("tweet_id: " + result.data.id);
      // create a new object in which to store the data from the new Tweet
      let newMessage = {
        userName: result.data.user.name,
        userScreenName: result.data.user.screen_name,
        text: result.data.text,
        userImage: result.data.user.profile_image_url,
        age: result.data.created_at.slice(4, 10),
        retweets: result.data.retweet_count,
        likes: result.data.favorite_count,
        following: result.data.user.friends_count
      };
      // add the object to the start of the array that contains the tweet objects, and then remove the last object so there are still 5 in total
      data.dataObject.tweets.unshift(newMessage);
      data.dataObject.tweets.pop();
      res.redirect('/');  // redirect to the '/' route, i.e. "refresh the page" when the new Tweet object is ready
    })
    .catch(function () {
      console.log("Error sending tweet to Twitter API");
    });
});

module.exports = router;
