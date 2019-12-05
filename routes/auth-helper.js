module.exports = (req, res, next) => {
  if (!req.session.loginUser) {
    // Remove user info from res.locals.
    delete res.locals.loginUser;

    res.redirect('/login');
    return;
  }

  // Make user info available in view files.
  res.locals.loginUser = req.session.loginUser;

  next();
};
