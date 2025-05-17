const userModel = require("../models/user.model.js");
const propertyModel = require("../models/property.model.js");
const bookingModel = require("../models/booking.model.js");
const customError = require("../utils/customError");

const getAllUsersController = async (req, res, next) => {
  try {
    const allUsers = await userModel.find();
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allUsers = await userModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

const getAllBookingsController = async (req, res, next) => {
  try {
    const allBookings = await bookingModel.find();
    res.status(200).json({
      success: true,
      message: "All bookings fetched successfully",
      data: allBookings,
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

const deletedBookingController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBooking = await bookingModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

const getAllPropertiesController = async (req, res, next) => {
  try {
    const allProperties = await propertyModel.find();
    res.status(200).json({
      success: true,
      message: "All properties fetched successfully",
      data: allProperties,
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

const deletePropertyController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProperty = await propertyModel.findByIdAndDelete(id);
    res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (err) {
    return next(new customError(err.message, 500));
  }
};

module.exports = {
  getAllUsersController,
  deleteUserController,
  getAllBookingsController,
  deletedBookingController,
  getAllPropertiesController,
  deletePropertyController,
};
