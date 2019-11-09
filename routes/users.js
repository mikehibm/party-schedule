var express = require('express');
var router = express.Router();

var db = require('../db/models/');

/* GET users */
router.get('/', async (req, res) => {
  const users = await db.User.findAll();
  if (!users) {
    console.log('ユーザーデータを取得できませんでした');
    res.status(500).send('Error');
    return;
  }

  res.json(users);
});

module.exports = router;
