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
const accessKeys = require('./js/config');
const screenName = accessKeys.screen_name; // the user's Twitter name e.g. @DonaldDuck
const Twit = require('twit');
const T = new Twit(accessKeys);

let dataObject = {};

let tweets = T.get('statuses/user_timeline', { screen_name: screenName, count: 2 });
let friends = T.get('friends/list', { screen_name: screenName, count: 3 });
let DMs = T.get('direct_messages/events/list', { screen_name: screenName, count: 1 });


// get the user_id of the Twitter user as a Promise
const getUserIDfromScreenName = T.get('users/show', { screen_name: screenName });




tweets                          // get the Promise returned by the first Twit function
  .then(function (result) {     // 'result' is the resolve Object from the first Twit function, i.e. { data : ... , resp : ... } 
    const data = result.data;   // result.data is an array of JSON objects, one for each tweet by the user
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
    console.log("222 222 222");
    return DMs;                       // return a new Promise to the next .then in the chain
  })

  .then(function (result) {
    let DMlist = [];
    // for unknown reasons some 'events' (i.e. DMs) are not counted, so I requested 20 and now truncate the list of DM 'events' to 5
    const data = result.data.events;    // result.data.events is an array of JSON objects, one for each DM
    data.splice(5);
    // console.log(data);
    data.forEach(element => {
      // console.log(element.message_create.message_data.text);
      let DMdetails = {};
      DMdetails.text = element.message_create.message_data.text;
      DMdetails.date = element.created_timestamp;
      DMlist.push(DMdetails);
      // need to get the user's name and image, which is not available in the API for "direct_messages/events/list"
      // so need to make another request to the API for that data
      /*const senderID = element.message_create.sender_id;
      let user = T.get('users/show', { user_id: senderID });

      user
        .then(function (result) {
          const data = result.data;
          DMdetails.userName = data.name;
          DMdetails.userImage = data.profile_image_url;
        })
        .then(function () {
          console.log("HELLO");
          DMlist.push(DMdetails);
        })*/
    });

    // console.log("DMLIST" + DMlist);
    dataObject.DMs = DMlist;
    console.log(dataObject);
  });






// getUserIDfromScreenName
//   .then(getDMs)
//   .then(recentTweets)
//   .then(friends)
//   .then(timer)
//   .catch(userIDerror)


function timer() {
  setTimeout(function () {
    // console.log("Timer done!");
    console.log(DMlist);
    console.log(myTweets);
    console.log(myFriends);
  }, 1000);
};
