const express = require('express');
const router = express.Router();

// const data = require('../app.js'); // import the file app.js




router.get('/', (req, res) => {
  // data.dataObject is the entire object named "dataObject" that was exported from app.js
  // console.log("/ page");
  const dt = getDataForRenderingClient();
  console.log(dt);
  res.render('main', dt);
});

router.post('/', (req, res) => {
  const tweetText = req.body.message;  // parse body for the property 'message' which was sent by the Form Submit
  console.log('Tweeted "' + tweetText + '"');
  let sendTweet = T.post('statuses/update', { status: tweetText });
  sendTweet
    .then(function (result) {
      console.log("tweet_id: " + result.data.id);
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


function getDataForRenderingClient() {
  let d = {
    tweets:
      [{
        userName: 'Jeremy Bowden',
        userScreenName: 'TheJeremyBowden',
        userImage: 'http://pbs.twimg.com/profile_images/967146176448524289/3pGqrvzR_normal.jpg',
        userBanner: 'https://pbs.twimg.com/profile_banners/883632004348211200/1533588473',
        text: 'I guess the system was (is) in need of chang at a decent price. https://t.co/3w4iXwl6eF',
        retweets: 0,
        likes: 0,
        age: 'Aug 02'
      },
      {
        userName: 'Jeremy Bowden',
        userScreenName: 'TheJeremyBowden',
        userImage: 'http://pbs.twimg.com/profile_images/967146176448524289/3pGqrvzR_normal.jpg',
        userBanner: 'https://pbs.twimg.com/profile_banners/883632004348211200/1533588473',
        text: 'Funny\nWhy you should not learn to code.  ("Just stop already, it\'s too hard.") https://t.co/5lu6sGI9vJ via @YouTube',
        retweets: 0,
        likes: 0,
        age: 'Jul 30'
      }],


    friends:
      [{
        userName: 'Daniel',
        userScreenName: 'Daniel70483817',
        userImage: 'http://pbs.twimg.com/profile_images/1022276224880500736/MAxiuCnI_normal.jpg'
      },
      {
        userName: 'Shutter Socks',
        userScreenName: 'ShutterSocks',
        userImage: 'http://pbs.twimg.com/profile_images/1010200596396347392/js3hd9cA_normal.jpg'
      },
      {
        userName: 'Houghton CE Primary',
        userScreenName: 'HoughtonPrimary',
        userImage: 'http://pbs.twimg.com/profile_images/798273681843752964/LL9M30vo_normal.jpg'
      }],


    DMs:
      [{
        text: 'Thanks !',
        date: '1533022664723',
        userName: 'Jeremy Bowden',
        userImage: 'http://pbs.twimg.com/profile_images/967146176448524289/3pGqrvzR_normal.jpg'
      },
      {
        text: 'done :) good luck',
        date: '1533022658855',
        userName: 'Daniel',
        userImage: 'http://pbs.twimg.com/profile_images/1022276224880500736/MAxiuCnI_normal.jpg'
      }]
  };

  return d;
}

/*
function getDataForRenderingClient() {
  const accessKeys = require('./config');  // get info for Twit function
  const screenName = accessKeys.screen_name; // the user's Twitter name e.g. @DonaldDuck
  const Twit = require('twit');
  const T = new Twit(accessKeys);

  let dataObject = {};

  let tweets = T.get('statuses/user_timeline', { screen_name: screenName, count: 5 });
  let friends = T.get('friends/list', { screen_name: screenName, count: 5 });
  let DMs = T.get('direct_messages/events/list', { screen_name: screenName, count: 20 });


  tweets                          // get the Promise returned by the first Twit function
    .then(function (result) {     // 'result' is the resolve Object from the first Twit function, i.e. { data : ... , resp : ... } 
      const data = result.data;   // result.data is an array of JSON objects, one for each tweet by the user
      let myTweets = [];

      // object constructor for a tweet
      function tweet(userName, userScreenName, userImage, text, retweets, likes, age) {
        this.userName = `${data[0].user.name}`;
        this.userScreenName = `${data[0].user.screen_name}`;
        this.userImage = `${data[0].user.profile_image_url}`;
        this.userBanner = `${data[0].user.profile_banner_url}`;
        this.text = text;
        this.retweets = retweets;
        this.likes = likes;
        this.age = age;
        this.following = `${data[0].user.friends_count}`;
      }

      // create a tweet object for every tweet in the data returned from the Twitter API and add each one to the array "myTweets"
      data.forEach(element => {
        let newTweet = new tweet();
        newTweet.text = element.text;
        newTweet.retweets = element.retweet_count;
        newTweet.likes = element.favorite_count;


        //
        //
        // To display the age of tweets in minutes, hours, or days, use this code block
        // instead of the line that follows-- -> newTweet.age = element.created_at.slice(4, 10);
        // Also need to declare as a global: const today = Date.now();
        // let ageInMillisecs = today - Date.parse(element.created_at);
        // if (ageInMillisecs > 864e5) {                                       // if tweet is > 24 hours old
        //   newTweet.age = Math.floor(ageInMillisecs / 864e5) + "days";       // answer in days
        // } else if (ageInMillisecs < 36e5) {                                 // if tweet is < 1 hour old
        //   newTweet.age = Math.floor(ageInMillisecs / 6e4) + "mins";         // answer in minutes
        // } else {
        //   newTweet.age = Math.floor(ageInMillisecs / 36e5) + "hours";       // answer in hours
        // } 
        //
        //


        newTweet.age = element.created_at.slice(4, 10);
        myTweets.push(newTweet);
      });
      dataObject.tweets = myTweets;   // populate the dataObject object
      return friends;                 // return a new Promise to the next .then in the chain
    })

    .then(function (result) {
      const data = result.data.users;       // result.data.users is an arrau of JSON objects, one for each friend
      let myFriends = [];
      data.forEach(element => {
        let friend = {};
        friend.userName = element.name;
        friend.userScreenName = element.screen_name;
        friend.userImage = element.profile_image_url;
        myFriends.push(friend);
      });
      dataObject.friends = myFriends;   // populate the dataObject object
      return DMs;                       // return a new Promise to the next .then in the chain
    })

    .then(function (result) {
      let DMlist = [];
      // for unknown reasons some 'events' (i.e. DMs) are not counted, so I requested 20 and now truncate the list of DM 'events' to 5
      const data = result.data.events;    // result.data.events is an array of JSON objects, one for each DM
      data.splice(5);

      data.forEach(element => {
        // Promise to create and populate some of the object DMdetails 
        let promise1 = new Promise(function (resolve, reject) {
          let DMdetails = {};
          DMdetails.text = element.message_create.message_data.text;
          const dateAndTime = new Date(Number(element.created_timestamp)).toUTCString();
          DMdetails.date = dateAndTime.slice(5, 11);
          resolve(DMdetails);
        });

        // need to get the user's name and image, which is not available in the API for "direct_messages/events/list"
        // so need to make another request to the API for that data
        const senderID = element.message_create.sender_id;
        // Promise will be returned from the twit method
        let user = T.get('users/show', { user_id: senderID });

        // get a Promise to resolve when both the Promises above are resolved
        let populateDMdetails = Promise.all([promise1, user]);

        // post-process the resolve received from populateDMdetails
        populateDMdetails.then(function (result) {
          let objToStore = result[0];         // get the object that's resolved from promise1
          const data = result[1].data;        // get the data part from the Twit resolve
          objToStore.userName = data.name;
          objToStore.userImage = data.profile_image_url;
          DMlist.push(objToStore);
        });
      });
      dataObject.DMs = DMlist;
    })
    .catch(function () {
      console.log("Error getting data from Twitter API");
    });

  return dataObject;
};
*/


module.exports = router;