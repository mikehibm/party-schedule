const express = require('express');
const router = express.Router();
const db = require('../db/models/');
const authAdmin = require('./auth-admin-helper');

/* List users */
router.get('/', authAdmin, async (req, res) => {
  const users = await db.User.findAll();
  if (!users) {
    console.log('ユーザーデータを取得できませんでした');
    res.status(500).send('Error');
    return;
  }

  res.render('users', { users });
});

module.exports = router;
