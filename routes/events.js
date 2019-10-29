var express = require('express');
var router = express.Router();

var db = require('../models');

/* GET users listing. */
router.get('/', function(req, res) {
  db.Event.findAll().then(list => {
    if (!list) {
      console.log('Eventsデータを取得できませんでした');
      res.status(500).send('Error');
    } else {
      res.json(list);
    }
  });
});

module.exports = router;
