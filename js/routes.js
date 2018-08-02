const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

  const x = 'Jeremy';
  const y = 'Bowden';

  const templateData = { x, y };


  res.render('main', templateData);
});

module.exports = router;