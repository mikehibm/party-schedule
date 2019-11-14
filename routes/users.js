const express = require('express');
const router = express.Router();
const db = require('../db/models/');
const auth = require('./auth-helper');

/* GET users */
router.get('/', auth, async (req, res) => {
  const users = await db.User.findAll();
  if (!users) {
    console.log('ユーザーデータを取得できませんでした');
    res.status(500).send('Error');
    return;
  }

  res.json(users);
});

module.exports = router;
