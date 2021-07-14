const Product = require("../models/product");
const Category = require("../models/category");
const User = require("../models/user");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {

  let products;


  Product.find()
    .then((products) => {
      Category.find().then((categories) => {
        res.render("shop/index", {
          title: "Shopping",
          products,
          categoryid: 0,
          categories,
          path: "/",
          isAuthenticated: req.session.isAuthenticated,
        });
      });
    })
    .catch((err) => console.log(err));
};
exports.getProducts = (req, res, next) => {
  let products;

  Product.find()
    .then((products) => {
      Category.find().then((categories) => {
        res.render("shop/products", {
          title: "Products",
          products,
          categoryid: 0,
          categories,
          path: "/products",
          isAuthenticated: req.session.isAuthenticated,
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.productid)
    //.findOne({ name: "Iphone 8 Pro", price: 3000 })
    .then((product) => {
      res.render("shop/product-detail", {
        product,
        title: product.name,
        path: "/product",
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => console.log(err));

};
exports.getProductDetails = (req, res, next) => {
  res.render("shop/details", {
    title: "Detail",
    isAuthenticated: req.session.isAuthenticated,
    path: "/details",
  });
};
exports.getCart = (req, res, next) => {
  const user = req.user;
  user
    .populate("cart.items.productid")
    .execPopulate()
    .then((user) => {
      res.render("shop/cart", {
        title: "Cart",
        path: "/cart",
        products: user.cart.items,
        isAuthenticated: req.session.isAuthenticated,
      });
    });
};
exports.postCart = (req, res) => {
  const productid = req.body.productid;
  const user = req.user;
  Product.findById(productid)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
};
exports.postDeleteCartItem = (req, res) => {
  const user = req.user;
  let productid = req.body.productid;
  user
    .deleteCartItem(productid)
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};
exports.changeQuantityCartItem = (req, res) => {
  const productid = req.body.productid;
  const quantity = req.body.quantityChange;
  const user = req.user;
  user
    .changeQuantityCartItem(productid, quantity)
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
  res.redirect("/cart");
};

exports.getProductsByCategoryId = (req, res) => {
  const categoryid = req.params.categoryid;

  const model = [];
  Category.find()
    .then((categories) => {
      model.categories = categories;
      return Product.find({
        categories: { $in: categoryid },
      });
    })
    .then((products) => {
      return res.render("shop/products", {
        title: "Products",
        products: products,
        path: "/products",
        categories: model.categories,
        isAuthenticated: req.session.isAuthenticated,
        categoryid,
      });
    })
    .catch((err) => console.log(err));
};
exports.postOrder = (req, res) => {
  const user = req.user;
  user
    .populate("cart.items.productid")
    .execPopulate()
    .then((user) => {
      const order = new Order({
        user: { userId: user._id, name: user.name, email: user.email },
        items: user.cart.items.map((product) => {
          return {
            product: {
              userId: user._id,
              _id: product.productid._id,
              name: product.productid.name,
              price: product.productid.price,
              image: product.productid.image,
            },
            quantity: product.quantity,
          };
        }),
      });
      return order.save();
    })
    .then(() => {
      user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
exports.getOrders = (req, res) => {
  Order.find().then((orders) => {
    console.log(orders);
    res.render("shop/orders", {
      title: "Orders",
      orders: orders,
      isAuthenticated: req.session.isAuthenticated,
      path: "/orders",
    });
  });
};
