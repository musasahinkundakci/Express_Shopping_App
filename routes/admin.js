const express = require("express");
const router = express.Router();
const isAdmin = require("..//middleware/isAdmin");
const adminController = require("../controllers/admin");
const locals = require("../middleware/locals");
router.get("/add-product", locals, isAdmin, adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);

router.get("/add-category", locals, isAdmin, adminController.getAddCategory);
router.post("/add-category", adminController.postAddCategory);

router.get(
  "/edit-product/:productid",
  locals,
  isAdmin,
  adminController.getEditProduct
);
router.post("/edit-product", adminController.postEditProduct);

router.get(
  "/edit-category/:categoryid",
  locals,
  isAdmin,
  adminController.getEditCategory
);
router.post("/edit-category", adminController.postEditCategory);

router.get("/products", locals, isAdmin, adminController.getProducts);
router.get("/categories", locals, isAdmin, adminController.getCategories);
router.post("/delete-product", adminController.postDeleteProduct);
router.post("/delete-category", adminController.postDeleteCategory);

module.exports = router;
