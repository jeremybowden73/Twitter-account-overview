const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const mydata = require('../app.js');
  console.log("Routes.js:");
  console.log(mydata);
  res.render('main', { my: mydata });
});

module.exports = router;