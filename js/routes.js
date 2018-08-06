const express = require('express');
const router = express.Router();

const data = require('../app.js'); // import the file app.js

router.get('/', (req, res) => {
  // data.dataObject is the entire object named "dataObject" that was exported from app.js
  res.render('main', data.dataObject);
});

module.exports = router;