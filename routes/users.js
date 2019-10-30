var express = require('express');
var router = express.Router();

var db = require('../db/models/');

/* GET users listing. */
router.get('/', function(req, res) {
  db.User.findAll().then(users => {
    if (!users) {
      console.log('ユーザーデータを取得できませんでした');
      res.status(500).send('Error');
    } else {
      res.json(users);
    }
  });
});

module.exports = router;
