const express = require('express');
const router = express.Router();
const db = require('../db/models/');
const authAdmin = require('./auth-admin-helper');

// List users
router.get('/', authAdmin, async (req, res) => {
  const message = req.session.message;
  req.session.message = undefined;

  const users = await db.User.findAll();
  res.render('users', { title: 'Users', users, message });
});

// Show Edit user screen
router.get('/edit/:id', authAdmin, async (req, res) => {
  const viewFile = 'users_edit';
  const message = req.session.message;
  req.session.message = undefined;

  const id = req.params.id | 0;
  const isNew = id === 0;
  let user = db.User.build({ id: 0 });

  if (!isNew) {
    user = await db.User.findByPk(id, { raw: true });
  }

  if (!user) {
    res.render(viewFile, { title: 'User', user, error: 'User not found' });
    return;
  }

  delete user.password;
  res.render(viewFile, { title: 'User', user, isNew, message });
});

// Create/Update user
router.post('/edit/:id', authAdmin, async (req, res) => {
  const viewFile = 'users_edit';
  const id = req.params.id | 0;
  const isNew = id === 0;
  let user = db.User.build({ id: 0 });

  if (!isNew) {
    user = await db.User.findByPk(id);
  }

  if (!user) {
    res.render(viewFile, { title: 'User', user, error: 'User not found' });
    return;
  }

  try {
    user.name = req.body.name;
    user.email = req.body.email;
    user.isAdmin = req.body.isAdmin === '1';

    if (isNew) {
      user.password = req.body.password;
    }

    await user.save();

    // eslint-disable-next-line require-atomic-updates
    req.session.message = 'User was saved successfully.';

    res.redirect(`/users/edit/${user.id}`);
  } catch (err) {
    user.password = undefined;
    res.render(viewFile, { title: 'User', user, isNew, error: err.message });
  }
});

// Show Change password screen
router.get('/change_pwd/:id', authAdmin, async (req, res) => {
  const viewFile = 'users_change_pwd';
  const id = req.params.id | 0;
  let user = db.User.build();

  if (id) {
    user = await db.User.findByPk(id, { raw: true });
  }

  if (!user) {
    res.render(viewFile, {
      title: 'User - Change Password',
      user,
      error: 'User not found',
    });
    return;
  }

  delete user.password;
  res.render(viewFile, { title: 'User - Change Password', user });
});

// Change User password
router.post('/change_pwd/:id', authAdmin, async (req, res) => {
  const viewFile = 'users_change_pwd';

  const id = req.params.id | 0;
  let user = db.User.build();

  if (id) {
    user = await db.User.findByPk(id);
  }

  if (!user) {
    res.render(viewFile, {
      title: 'User - Change Password',
      user,
      error: 'User not found',
    });
    return;
  }

  try {
    // Automatically hashed by the 'Setter' function defined in the model.
    user.password = req.body.password;
    await user.save();

    user.password = undefined;

    // eslint-disable-next-line require-atomic-updates
    req.session.message = `User's password was changed successfully.`;

    res.redirect(`/users/edit/${user.id}`);
  } catch (err) {
    user.password = undefined;
    res.render(viewFile, {
      title: 'User - Change Password',
      user,
      error: err.message,
    });
  }
});

// Delete User
router.post('/delete/:id', authAdmin, async (req, res) => {
  const id = req.params.id | 0;
  let user = await db.User.findByPk(id);
  if (!user) {
    res.render('user_edit', { title: 'User', user, error: 'User not found' });
    return;
  }

  try {
    await user.destroy();

    // eslint-disable-next-line require-atomic-updates
    req.session.message = 'User was deleted successfully.';

    res.redirect('/users/');
  } catch (err) {
    user.password = undefined;
    res.render('user_edit', { title: 'User', user, error: err.message });
  }
});

module.exports = router;
