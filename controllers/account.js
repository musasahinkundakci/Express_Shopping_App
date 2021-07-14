const User = require("../models/user");
const bcrypt = require("bcrypt");
exports.getLogin = (req, res) => {
  let message = req.session.errorMessage;
  delete req.session.errorMessage;
  res.render("account/login", {
    path: "/login",
    title: "Login",
    isAuthenticated: req.session.isAuthenticated,
    action: req.query.action,
    errorMessage: message,
  });
};
exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((isSuccess) => {
            if (isSuccess) {
              req.session.user = user;
              req.session.isAuthenticated = true;
            }
            return req.session.save(function (err) {
              console.log(err);
              let url = req.session.redirectTo || "/";
              delete req.session.redirectTo;
              res.redirect(url);
            });
          })
          .catch((err) => console.log(err));
      } else {
        req.session.errorMessage =
          "Bu mail adresinde bağlı bir hesap yok veya şifre yanlış!";
        req.session.save(function (err) {
          console.log(err);
          res.redirect("/login");
        });
      }
    })
    .catch((err) => console.log(err));
};
exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
exports.getRegister = (req, res) => {
  res.render("account/register", {
    path: "/register",
    title: "Register",
    isAuthenticated: req.session.isAuthenticated,
  });
};
exports.postRegister = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email,
  })
    .then((user) => {
      if (user) {
        return res.redirect("/register");
      }

      return bcrypt.hash(password, 10);
    })
    .then((hashed) => {
      const newUser = new User({
        name: name,
        email: email,
        password: hashed,
        cart: { items: [] },
      });
      return newUser.save();
    })
    .then(() => res.redirect("/login"))
    .catch((err) => console.log(err));
};

exports.getReset = (req, res) => {
  res.render("account/reset", {
    path: "/reset",
    title: "Reset",
    isAuthenticated: req.session.isAuthenticated,
  });
};
exports.PostReset = (req, res) => {
  res.redirect("/");
};
