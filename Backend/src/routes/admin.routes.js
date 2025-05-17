const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middlewares/adminMiddleware");
const adminController = require("../controllers/admin.controller");

router.get(
  "/all-users",
  adminMiddleware,
  adminController.getAllUsersController
);
router.delete(
  "/delete-user/:id",
  adminMiddleware,
  adminController.deleteUserController
);
router.get(
  "/all-bookings",
  adminMiddleware,
  adminController.getAllBookingsController
);
router.delete(
  "/delete-booking/:id",
  adminMiddleware,
  adminController.deletedBookingController
);
router.get(
  "/all-properties",
  adminMiddleware,
  adminController.getAllPropertiesController
);
router.delete(
  "/delete-property/:id",
  adminMiddleware,
  adminController.deletePropertyController
);

module.exports = router;
