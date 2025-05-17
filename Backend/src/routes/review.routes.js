const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const reviewController = require("../controllers/review.controller");

router.post("/create", authMiddleware, reviewController.cretaeReviewController);
router.delete(
  "/delete/:id",
  authMiddleware,
  reviewController.deleteReviewController
);
router.put(
  "/update/:id",
  authMiddleware,
  reviewController.updateReviewController
);
router.get("/view/:id", authMiddleware, reviewController.viewReviewController);

module.exports = router;
