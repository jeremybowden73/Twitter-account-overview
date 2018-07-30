// get the Twitter authentication credentials object from config.js
// and create a new Twit object with it, which can be used to make requests
// to Twitter's API
const accessKeys = require('./config');
const Twit = require('twit');
const T = new Twit(accessKeys);

// T.get('search/tweets', { q: 'vardy since:2011-07-11', count: 5 }, function (err, data, response) {
//   console.log(data)
// });

// required data from the Twitter API
// 1. Most recent tweets (x 5)

// 2. Most recent friends (users that you follow) (x5)
// 2978109514
T.get('friends/ids', { screen_name: 'theJeremyBowden', count: 8 }, function (err, data, response) {
  // data is a JSON object containing the key "ids"; the value of "ids" is an array
  // containing the user_ids for the user's friends
  const friendsIDs = data.ids;
  console.log(friendsIDs);

  T.get('users/lookup', { user_id: friendsIDs }, function (err, data, response) {
    // data is an array of JSON objects, one for each of the comma-separated list in user_id
    const friendsObj = data;
    // console.log(friendsObj);
    // console.log(friendsObj[1].name);
    friendsObj.forEach(element => {
      console.log(element.name);
    });
  });


});





// 3. Most recent direct messages (x5)
