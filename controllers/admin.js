const Product = require("../models/product");
const Category = require("../models/category");
const fs = require("fs");
// const User = require("../models/user");
exports.getProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    .populate("userId", "name -_id") 
    .then((products) => {
      return res.render("admin/products", {
        title: "Admin Products",
        products: products,
        path: "/admin/products",
        action: req.query.action,
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => console.log(err));
};
exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    title: "New Product",
    path: "/admin/add-product",
    isAuthenticated: req.session.isAuthenticated,
  });
};
exports.postAddProduct = (req, res, next) => {
  const body = req.body;

  const name = body.name;
  const price = body.price;
  const image = req.file.filename;
  const categories = body.categoryids;
  const description = body.description;

  const product = Product({
    name,
    price,
    image,
    description,
    userId: req.user,
  });
  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      let message = "";
      if (err.name == "ValidationError") {
        for (field in err.errors) {
          message += err.errors[field].message + "<br>";
        }
        console.log(message);
        res.render("admin/add-product", {
          title: "New Product",
          path: "/admin/add-product",
          isAuthenticated: req.session.isAuthenticated,
          errorMessage: message,
          inputs: {
            name: name,
            price: price,
            image: image,
            description,
          },
        });
      }
    });
};

exports.getEditProduct = (req, res, next) => {
  let product;
  Product.findOne({ _id: req.params.productid, userId: req.user._id })
    //.populate("categories", "name -_id")
    .then((product) => {
      if (!product) {
        res.redirect("/");
      }
      product = product;
      Category.find()
        .then((categories) => {
          categories = categories.map((category) => {
            if (product.categories) {
              product.categories.find((item) => {
                if (item.toString() === category._id.toString()) {
                  category.selected = true;
                }
              });
            }
            return category;
          });
          res.render("admin/edit-product", {
            title: "Edit Product",
            path: "/admin/edit-product",
            product,
            isAuthenticated: req.session.isAuthenticated,
            categories,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  //const selectedcategory = Category.getById(product.categoryid);
};
exports.postEditProduct = (req, res, next) => {
  const _id = req.body._id;
  const name = req.body.name;
  const price = req.body.price;
  const image = req.file.filename;
  const description = req.body.description;
  const ids = req.body.categoryids;
  const product = {
    name,
    price,
    description,
    ids,
  };
  Product.findById(_id)
    .then((product) => {
      if (image && product.image) {
        fs.unlink("public/img/" + product.image, (err) => {
          if (err) console.log(err + "ım here");
        });
        product.image = image;
      }
      return product.save();
    })
    .then(() => res.redirect("/admin/products?action=edit"))
    .catch((err) => console.log(err));

exports.postDeleteProduct = (req, res, next) => {

  Product.findById(req.body.productid)
    .then((product) => {
      if (product.image) {
        fs.unlink("public/img/" + product.image, (err) => {
          if (err) console.log(err + "ım here");
        });
      } else if (!product) {
        return next(new Error("Silinmek istenen ürün bulunamadı!"));
  
      }
    })
    .then(() =>
      Product.findByIdAndDelete(req.body.productid)
        .then(() => {
          res.redirect("/admin/products?action=delete");
        })
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};
exports.getCategories = (req, res) => {
  Category.find()
    .then((categories) => {
      return res.render("admin/categories", {
        title: "Categories",
        categories,
        isAuthenticated: req.session.isAuthenticated,
        path: "/admin/categories",
        action: req.query.action,
      });
    })
    .catch((err) => console.log(err));
};
exports.getAddCategory = (req, res) => {
  res.render("admin/add-category", {
    title: "Add Category",
    path: "/admin/add-category",
    isAuthenticated: req.session.isAuthenticated,
  });
};
exports.postAddCategory = (req, res) => {
  const body = req.body;
  const category = new Category({
    name: body.name,
    description: body.description,
  });
  category
    .save()
    .then(() => res.redirect("/admin/categories?action=insert"))
    .catch((err) => console.log(err));
};
exports.getEditCategory = (req, res) => {
  Category.findById(req.params.categoryid).then((category) =>
    res.render("admin/edit-category", {
      title: "Edit Category",
      isAuthenticated: req.session.isAuthenticated,
      path: "/admin/edit-category",
      category,
    })
  );
};
exports.postEditCategory = (req, res) => {
  Category.update(
    { _id: req.body._id },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
      },
    }
  )
    .then(() => res.redirect("/admin/categories?action=edit"))
    .catch((err) => console.log(err));
};
exports.postDeleteCategory = (req, res) => {
  // Category.deleteOne({ _id: req.body._id })
  Category.findByIdAndRemove(req.body._id)
    .then(() => res.redirect("/admin/categories?action=delete"))
    .catch((err) => console.log(err));
};
