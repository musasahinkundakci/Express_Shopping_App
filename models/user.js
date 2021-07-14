const mongoose = require("mongoose");
const Product = require("./product");
const { isEmail } = require("validator");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: [isEmail, "invalid Email"],
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  cart: {
    items: [
      {
        productid: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});
userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};
userSchema.methods.getCart = function () {
  const ids = this.cart.items.map((i) => i.productid);
  return Product.find({ _id: { $in: ids } })
    .select("-description")
    .then((products) => {
      products.map((product) => {
        item = this.cart.items.find(
          (item) => item.productid.toString() === product._id.toString()
        );
        product.quantity = item.quantity;
        return product;
      });
      return products;
    })
    .catch((err) => console.log(err));
};
userSchema.methods.addToCart = function (product) {
  const updatedCartItems = [...this.cart.items];

  let itemQuantity = 1;

  const index = this.cart.items.findIndex((cp) => {
    return cp.productid.toString() === product._id.toString();
  });
  if (index >= 0) {
    itemQuantity = this.cart.items[index].quantity + 1;
    updatedCartItems[index].quantity = itemQuantity;
  } else {
    updatedCartItems.push({
      productid: product._id,
      quantity: itemQuantity,
    });
  }
  this.cart = { items: updatedCartItems };

  return this.save();
};
userSchema.methods.deleteCartItem = function (productid) {
  this.cart.items = this.cart.items.filter(
    (item) => item.productid.toString() !== productid.toString()
  );
  return this.save();
};
userSchema.methods.changeQuantityCartItem = function (
  productid,
  quantityChange
) {
  const index = this.cart.items.findIndex((item) => {
    return item.productid.toString() === productid.toString();
  });
  if (this.cart.items[index].quantity === 1 && Number(quantityChange) < 0) {
    return this.deleteCartItem(productid)
      .then(() => console.log(quantityChange))
      .catch((err) => console.log(err));
  } else {
    this.cart.items[index].quantity += Number(quantityChange);

    return this.save();
  }
};
module.exports = mongoose.model("User", userSchema);
