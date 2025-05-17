const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware.js");
const paymentController = require("../controllers/payment.controller.js");

const router = express.Router();

router.post(
  "/payment-process",
  authMiddleware,
  paymentController.processPaymentController
);

router.post(
  "/payment-verify",
  authMiddleware,
  paymentController.verifyPaymentController
);

module.exports = router;
