module.exports = (req, res, next) => {
  if (!req.session.user) {
    // Remove user info from res.locals.
    delete res.locals.user;

    res.redirect('/login');
    return;
  }

  // Make user info available in view files.
  res.locals.user = req.session.user;

  next();
};
