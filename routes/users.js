const express = require('express');
const router = express.Router();
const db = require('../db/models/');
const authAdmin = require('./auth-admin-helper');

/* List users */
router.get('/', authAdmin, async (req, res) => {
  const users = await db.User.findAll();
  res.render('users', { users });
});

/* Edit user */
router.get('/edit/:id', authAdmin, async (req, res) => {
  const viewFile = 'users_edit';
  const id = req.params.id | 0;
  let user = db.User.build({ id: 0 });

  if (id) {
    user = await db.User.findByPk(id, { raw: true });
  }

  if (!user) {
    res.render(viewFile, { user, error: 'User not found' });
    return;
  }

  delete user.password;
  res.render(viewFile, { user, isNew: user.id === 0 });
});

router.post('/edit/:id', authAdmin, async (req, res) => {
  const viewFile = 'users_edit';
  const id = req.params.id | 0;
  let user = db.User.build({ id: 0 });

  if (id) {
    user = await db.User.findByPk(id);
  }

  if (!user) {
    res.render(viewFile, { user, error: 'User not found' });
    return;
  }

  try {
    user.name = req.body.name;
    user.email = req.body.email;
    user.isAdmin = req.body.isAdmin === '1';

    if (user.id === 0) {
      user.password = req.body.password;
    }

    const savedUser = await user.save();
    savedUser.password = undefined;

    // eslint-disable-next-line require-atomic-updates
    req.session.message = 'User was successfully saved.';
    res.redirect(req.originalUrl);
  } catch (err) {
    user.password = undefined;
    res.render(viewFile, { user, error: err.message });
    return;
  }

  return;
});

/* Edit user */
router.get('/change_pwd/:id', authAdmin, async (req, res) => {
  const viewFile = 'users_change_pwd';
  const id = req.params.id | 0;
  let user = db.User.build();

  if (id) {
    user = await db.User.findByPk(id, { raw: true });
  }

  if (!user) {
    res.render(viewFile, { user, error: 'User not found' });
    return;
  }

  delete user.password;
  res.render(viewFile, { user });
});

router.post('/change_pwd/:id', authAdmin, async (req, res) => {
  const viewFile = 'users_change_pwd';
  const id = req.params.id | 0;
  let user = db.User.build();

  if (id) {
    user = await db.User.findByPk(id);
  }

  if (!user) {
    res.render(viewFile, { user, error: 'User not found' });
    return;
  }

  try {
    // Automatically hashed by the 'Setter' function defined in the model.
    user.password = req.body.password;

    await user.save();
  } catch (err) {
    user.password = undefined;
    res.render(viewFile, { user, error: err.message });
    return;
  }

  user.password = undefined;
  res.render(viewFile, {
    user,
    message: `User's password was successfully changed.`,
  });
  return;
});

module.exports = router;
