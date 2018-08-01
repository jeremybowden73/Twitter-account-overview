// get the Twitter authentication credentials object from config.js
// and create a new Twit object with it, which can be used to make requests
// to Twitter's API
const accessKeys = require('./config');
const screenName = accessKeys.screen_name; // the user's Twitter name e.g. @DonaldDuck
const Twit = require('twit');
const T = new Twit(accessKeys);


// 1. Most recent tweets (x 5)
function recentTweets(userID) {
  let tweetsArray = []; // array to store objects, one for each of the 5 recent tweets, containing only properties I need for the app
  T.get('statuses/user_timeline', { screen_name: screenName, count: 1 }, function (err, data, response) {
    // data is an array of JSON objects, one for each tweet by the specified user
    if (err !== undefined) {
      console.log(err);
      console.log("ERROR GETTING DATA FROM TWITTER API");
    } else if (data) {
      const tweetObjectTemplate = {
        userName: `${data[0].user.name}`,
        userScreenName: `${data[0].user.screen_name}`,
        userImage: `${data[0].user.profile_image_url}`
      };

    } else {
      errorMessage = `There's been a ${response.statusCode} error`;
      console.log(errorMessage);
    }




    data.forEach(element => {
      // tweet = tweetObjectTemplate;
      // tweet.text = element.text;
      // tweet.retweets = element.retweet_count;
      // tweet.like = element.favorite_count;
      // console.log(tweet);
      console.log("Hello");
    });
  });
};

// 2. Most recent friends (users that you follow) (x5)
function friends(userID) {
  T.get('friends/list', { screen_name: screenName, count: 5 }, function (err, data, response) {
    // data is a JSON object with one property, "users"
    // value of data.users is an array of JSON objects, one for each of the users that the account is following
    const users = data.users;
    users.forEach(element => {
      console.log(element.name);
    });
  });
};

// 3. Most recent direct messages (x5)
function getDMs(userID) {
  T.get('direct_messages/events/list', { screen_name: screenName, count: 20 }, function (err, data, response) {
    // data is a JSON object, the value of the first key ("events") is an array of objects
    // data.events is the array of objects, one for each of the DMs sent by the user
    const DMs = data.events;
    // for unknown reasons some 'events' (i.e. DMs) are not counted, so I requested 20 and now
    // truncate the list of DM 'events' to 5
    DMs.splice(5);
    DMs.forEach(element => {
      // console.log(element.message_create.message_data.text);
      const senderID = element.message_create.sender_id;
      if (senderID == userID) {
        console.log("sent by you");
      } else {
        console.log("reply from your friend");
      }
    });
  });
};

function userIDerror(message) {
  console.log(message);
};


// get the user_id of the Twitter user as a Promise
let getUserIDfromScreenName = new Promise((resolve, reject) => {
  T.get('users/show', { screen_name: screenName }, function (err, data, response) {
    userID = data.id;
    if (userID) {
      resolve(userID);
    } else {
      reject("Error getting userID");
    }
  });
});

// Promise is not chained, because I want to pass the "resolve" value that the Promise returns
// to all of these functions. Chaining promises passes the result of each Promise to the next
getUserIDfromScreenName.then(recentTweets);
// getUserIDfromScreenName.then(friends);
// getUserIDfromScreenName.then(getDMs);
getUserIDfromScreenName.catch(userIDerror);


