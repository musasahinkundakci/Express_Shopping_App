const express = require("express");
const router = express.Router();
const locals = require("../middleware/locals");
const accountController = require("../controllers/account");

router.get("/login", locals, accountController.getLogin);
router.post("/login", accountController.postLogin);

router.get("/register", locals, accountController.getRegister);
router.post("/register", accountController.postRegister);

router.get("/logout", accountController.getLogout);

router.get("/reset-password", locals, accountController.getReset);
router.post("/reset-password", accountController.PostReset);

module.exports = router;
