module.exports = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    req.session.redirectTo = req.originalUrl;

    return res.redirect("/login?action=notAllowed");
  }
  if (!req.user.isAdmin) {
    return res.redirect("/");
  }
  next();
};
