module.exports = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    req.session.redirectTo = req.originalUrl;

    return res.redirect("/login?action=notAllowed");
  }
  next();
};
