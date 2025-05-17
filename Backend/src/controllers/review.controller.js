const userModel = require("../models/user.model");
const propertyModel = require("../models/property.model");
const bookingModel = require("../models/booking.model");
const reviewModel = require("../models/review.model");
const customError = require("../utils/customError");

const cretaeReviewController = async (req, res, next) => {
  try {
    const { ratings, comment, property_id } = req.body;

    if (!ratings || !comment || !property_id) {
      return next(new customError("All fields are required", 400));
    }

    const bookings = await bookingModel.findOne({
      user_id: req.user._id,
    });
    if (!bookings) {
      return next(new customError("Access Denied", 400));
    }

    const review = await reviewModel.create({
      property: property_id,
      user: req.user._id,
      ratings,
      comment,
    });

    if (!review) {
      return next(new customError("Review not created", 400));
    }

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

const deleteReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new customError("Review id is required", 400));
    }

    const deleteReview = await reviewModel.findByIdAndDelete(id);

    if (!deleteReview) {
      return next(new customError("Error in Deleting Review", 400));
    }
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

const updateReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new customError("Review id is required", 400));
    }

    const updateReview = await reviewModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateReview) {
      return next(new customError("Error in Updating Review", 400));
    }
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updateReview,
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

const viewReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new customError("Review id is required", 400));
    }

    const viewReview = await reviewModel.findById(id);
    if (!viewReview) {
      return next(new customError("Error in Viewing Review", 400));
    }
    res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: viewReview,
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

module.exports = {
  cretaeReviewController,
  deleteReviewController,
  updateReviewController,
  viewReviewController,
};
