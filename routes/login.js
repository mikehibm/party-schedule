const express = require('express');
const router = express.Router();
const db = require('../db/models/');

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

router.get('/', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/', async (req, res) => {
  const { id, password } = req.body;

  req.session.user = null;
  try {
    const user = await db.User.findOne({
      where: {
        email: id,
        password: db.User.hashPwd(password),
      },
    });
    if (!user) {
      res.render('login', { title: 'Login', message: 'Invalid login' });
      return;
    }

    // eslint-disable-next-line require-atomic-updates
    req.session.user = user;
    res.redirect('/');
  } catch (err) {
    res.render('login', { title: 'Login', message: 'Invalid login' });
  }
});

router.get('/reset', (req, res) => {
  res.render('reset', { title: 'Reset Password' });
});

router.post('/reset', (req, res) => {
  if (req.body.button === 'back') {
    res.redirect('/login');
    return;
  }
});

module.exports = router;
