const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");
const isAuthenticated = require("../middleware/auth");
const locals = require("../middleware/locals");
router.get("/", locals, shopController.getIndex);

router.get("/products", locals, shopController.getProducts);
router.get("/products/:productid", locals, shopController.getProduct);

router.get(
  "/categories/:categoryid",
  locals,
  shopController.getProductsByCategoryId
);

router.get("/details", locals, shopController.getProductDetails);

router.get("/cart", locals, isAuthenticated, shopController.getCart);
router.post("/cart", shopController.postCart);

router.post(
  "/delete-cartitem",
  isAuthenticated,
  shopController.postDeleteCartItem
);

router.post("/change-quantity", shopController.changeQuantityCartItem);

router.get("/orders", locals, isAuthenticated, shopController.getOrders);
router.post("/create-order", shopController.postOrder);

module.exports = router;
