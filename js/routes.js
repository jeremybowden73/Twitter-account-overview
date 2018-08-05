const express = require('express');
const router = express.Router();

// const mydata = require('../app.js');  need to place this inside the route method so it is declared on every GET request to the / route

router.get('/', (req, res) => {
  const mydata = require('../app.js');
  console.log("Routes.js:");
  console.log(mydata);
  res.render('main', { my: mydata });
});

module.exports = router;