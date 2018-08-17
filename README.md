# Twitter-client
A single-page summary of a Twitter user's recent activity


Please insert your own Twitter access keys in a config file at this location:

/js/config.js

Formatted like this:

```javascript
const keys = {
  consumer_key: '.....',
  consumer_secret: '.....',
  access_token: '.....',
  access_token_secret: '.....'
};

module.exports = keys;
```

Then run the app from the command line:
```node app.js```

Open a browser window and navigate to:
localhost:3000
