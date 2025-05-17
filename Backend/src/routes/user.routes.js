const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

router.post("/register", userController.registerController);
router.post("/login", userController.loginController);
router.post("/logout", userController.logoutController);
router.get(
  "/current-user",
  authMiddleware,
  userController.currentUserController
);
router.post(
  "/update-user",
  authMiddleware,
  userController.updateUserControlller
);
router.post(
  "/reset-password",
  authMiddleware,
  userController.resetPasswordController
);

module.exports = router;
