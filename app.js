//Import
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);
const bcrypt = require("bcrypt");
const path = require("path");
const csurf = require("csurf");
//Import Routes
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const accountRoutes = require("./routes/account");
const errorRoutes = require("./controllers/error");

const mongoose = require("mongoose");
const User = require("./models/user");
// const Category = require("./models/category");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cartitem");
// const User = require("./models/user");
// const Order = require("./models/order");
// const OrderItem = require("./models/orderItem");
//Template Engine
const multer = require("multer");

app.set("view engine", "pug");
app.set("views", "./views");
process.env.PORT;
//

const store = new mongoDbStore({
  uri: "mongodb+srv://phonenumber:z1RE71hgPiZN5yk7@my-cluster.xi1xh.mongodb.net/node-app2?retryWrites=true&w=majority",
  collection: "mySessions",
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
    },
    store,
  })
);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: storage }).single("image"));
app.use(cookieParser());
app.use(express.static("public"));
app.use(csurf());
//Routes
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).render("error/500", { title: "Error" });
});
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById({ _id: req.session.user._id })
    .then((user) => {
      req.user = user;

      next();
    })
    .catch((err) => console.log(err));
});
app.use(accountRoutes);
app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(errorRoutes.get404Page);

mongoose
  .connect(
    "mongodb+srv://phonenumber:z1RE71hgPiZN5yk7@my-cluster.xi1xh.mongodb.net/node-app2?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to DB!");
    app.listen(process.env.PORT || 3000);
  })

  .catch();
