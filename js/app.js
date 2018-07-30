// get the Twitter authentication credentials object from config.js
// and create a new Twit object with it, which can be used to make requests
// to Twitter's API
const accessKeys = require('./config');
const Twit = require('twit');
const T = new Twit(accessKeys);

// required data from the Twitter API
// 1. Most recent tweets (x 5)
T.get('users/lookup', { screen_name: 'theJeremyBowden' }, function (err, data, response) {
  console.log(data);
});


// 2. Most recent friends (users that you follow) (x5)
T.get('friends/list', { screen_name: 'theJeremyBowden', count: 5 }, function (err, data, response) {
  // data is a JSON object with one property, "users"
  // value of data.users is an array of JSON objects, one for each of the users that the account is following
  const users = data.users;
  users.forEach(element => {
    // console.log(element.name);
  });
});




// 3. Most recent direct messages (x5)
