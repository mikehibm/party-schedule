module.exports = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }

  // Make user info available in view files.
  req.app.locals.user = req.session.user;
  next();
};
