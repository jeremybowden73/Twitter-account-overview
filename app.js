const express = require('express');
const app = express();
app.use('/static', express.static('public')); // serves the static files from the directory 'public', to the .../static address in the browser 
app.set('view engine', 'pug');

const mainRoutes = require('./js/routes.js'); // import the "exported routes" from the routes.js file in the /js directory

app.use(mainRoutes); // use the mainRoutes variable to make the middleware in the /js/routes.js file 

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});

// app.listen(3000, () => {  // this callback function is only required to log the info message to the console
//   console.log('The application is running on localhost:3000')
// });


//
// get the Twitter authentication credentials object from config.js  and create a
// new Twit object with it, which can be used to make requests to Twitter's API
//
const accessKeys = require('./js/config');
const screenName = accessKeys.screen_name; // the user's Twitter name e.g. @DonaldDuck
const Twit = require('twit');
const T = new Twit(accessKeys);
// let myTweets = []; // array to store 5 recent tweets, as objects
let DMconversation = [];  // array to store recent conversation (5 DMs), as objects
// let myFriends = [];  // array to store 5 recent friends, as objects


// 1. Most recent tweets (x 5)
function recentTweets(userID) {
  T.get('statuses/user_timeline', { screen_name: screenName, count: 1 }, function (err, data, response) {
    // data is an array of JSON objects, one for each tweet by the specified user
    if (err !== undefined) {
      console.log(err);
      console.log("ERROR GETTING DATA FROM TWITTER API");
    } else if (data) {
      // object constructor for a tweet
      function tweet(userName, userScreenName, userImage, text, retweets, likes, date) {
        this.userName = `${data[0].user.name}`;
        this.userScreenName = `${data[0].user.screen_name}`;
        this.userImage = `${data[0].user.profile_image_url}`;
        this.text = text;
        this.retweets = retweets;
        this.likes = likes;
        this.date = date;
      }
      // create a tweet object for every tweet in the data returned from the Twitter API
      // and add each one to the array "myTweets"
      data.forEach(element => {
        let newTweet = new tweet();
        newTweet.text = element.text;
        newTweet.retweets = element.retweet_count;
        newTweet.likes = element.favorite_count;
        newTweet.date = element.created_at;
        myTweets.push(newTweet);
      });

    } else {
      errorMessage = `There's been a ${response.statusCode} error`;
      console.log(errorMessage);
    }
  });
};

// 2. Most recent friends (users that you follow) (x5)

T.get('friends/list', { screen_name: screenName, count: 1 }, function (err, data, response) {
  // data is a JSON object with one property, "users"
  // value of data.users is an array of JSON objects, one for each of the users that the account is following

  let friend = {};
  friend.userName = data.users[0].name;
  friend.userScreenName = data.users[0].screen_name;
  friend.userImage = data.users[0].profile_image_url;
  // myFriends.push(friend);
  // console.log(friend);
});





let dataObject = {};

let tweets = T.get('statuses/user_timeline', { screen_name: screenName, count: 2 });
let friends = T.get('friends/list', { screen_name: screenName, count: 1 });
let DMs = T.get('direct_messages/events/list', { screen_name: screenName, count: 1 });


// get the user_id of the Twitter user as a Promise
const getUserIDfromScreenName = T.get('users/show', { screen_name: screenName });
//   .then(function (result) {

//   dataObject.friends = result1.data; // result1.data = object with one property (users: [ {} ])
//   console.log(dataObject);
//   return T.get('friends/list', { screen_name: screenName, count: 1 });
// })



tweets                          // get the Promise returned by the first Twit function
  .then(function (result) {     // 'result' is the resolve Object from the first Twit function, i.e. { data : ... , resp : ... } 
    data = result.data;         // result.data is an array of JSON objects, one for each tweet by the user
    let myTweets = [];

    // object constructor for a tweet
    function tweet(userName, userScreenName, userImage, text, retweets, likes, date) {
      this.userName = `${data[0].user.name}`;
      this.userScreenName = `${data[0].user.screen_name}`;
      this.userImage = `${data[0].user.profile_image_url}`;
      this.text = text;
      this.retweets = retweets;
      this.likes = likes;
      this.date = date;
    }

    // create a tweet object for every tweet in the data returned from the Twitter API and add each one to the array "myTweets"
    data.forEach(element => {
      let newTweet = new tweet();
      newTweet.text = element.text;
      newTweet.retweets = element.retweet_count;
      newTweet.likes = element.favorite_count;
      newTweet.date = element.created_at;
      myTweets.push(newTweet);
    });
    dataObject.tweets = myTweets;   // populate the dataObject object
    console.log("111 111 111");
    console.log(dataObject);
    return friends;                 // return a new Promise to the next .then
  })
  .then(function (result2) {
    data = result2.data;             // data is a JSON object with one property, "users"
    let myFriends = [];

    let friend = {};
    friend.userName = data.users[0].name;
    friend.userScreenName = data.users[0].screen_name;
    friend.userImage = data.users[0].profile_image_url;
    myFriends.push(friend);
    dataObject.friends = myFriends;
    console.log("222 222 222");
    console.log(dataObject);
  })

//   return T.get('friends/list', { screen_name: screenName, count: 1 });
// })
// .then(function (result2) {
//   dataObject.friends2 = result2.data; // result1.data = object with one property (users: [ {} ])
//   console.log(dataObject);
// })



// data is a JSON object with one property, "users"
// value of data.users is an array of JSON objects, one for each of the users that the account is following

//   let friend = {};
//   friend.userName = data.users[0].name;
//   friend.userScreenName = data.users[0].screen_name;
//   friend.userImage = data.users[0].profile_image_url;
//   // myFriends.push(friend);
//   console.log(friend);
// });






// 3. Most recent direct messages (x5)
function getDMs(userID) {
  T.get('direct_messages/events/list', { screen_name: screenName, count: 1 }, function (err, data, response) {
    // data is a JSON object, the value of the first key ("events") is an array of objects
    // data.events is the array of objects, one for each of the DMs sent or received by the user
    // console.log(data.events[0].message_create);
    const DMevents = data.events;
    // for unknown reasons some 'events' (i.e. DMs) are not counted, so I requested 20 and now
    // truncate the list of DM 'events' to 5
    DMevents.splice(5);
    DMevents.forEach(element => {
      // console.log(element.message_create.message_data.text);
      const senderDetails = {};
      const senderID = element.message_create.sender_id;
      T.get('users/show', { user_id: senderID }, function (err, data, response) {
        senderDetails.userName = data.name;
        senderDetails.userImage = data.profile_image_url;
        senderDetails.text = element.message_create.message_data.text;
        senderDetails.date = element.created_timestamp;
        DMconversation.push(senderDetails);
      });
    });
  });
};

function userIDerror(message) {
  console.log(message);
};




// Promise is not chained, because I want to pass the "resolve" value that the Promise returns
// to all of these functions, and the 3 functions do not have to run synchronously.
// Chaining promises passes the result of each Promise to the next
// getUserIDfromScreenName
//   .then(getDMs)
//   .then(recentTweets)
//   .then(friends)
//   .then(timer)
//   .catch(userIDerror)


function timer() {
  setTimeout(function () {
    // console.log("Timer done!");
    console.log(DMconversation);
    console.log(myTweets);
    console.log(myFriends);
  }, 1000);
};
