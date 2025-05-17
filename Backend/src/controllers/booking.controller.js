const bookingModel = require("../models/booking.model.js");
const propertyModel = require("../models/property.model.js");
const customError = require("../utils/customError.js");
const paymentInstance = require("../services/payment.service.js");
const { bookingConfirmationTemplate } = require("../utils/emailTemplate.js");
const { sendMail } = require("../utils/email.js");

const createBookingController = async (req, res, next) => {
  try {
    const { property_id, checkIn_date, checkOut_date, totalPrice } = req.body;

    const property = await propertyModel.findById(property_id);
    if (!property) {
      return next(new customError("Property not Found", 400));
    }

    if (!property_id && !checkIn_date && !checkOut_date && !totalPrice) {
      return next(new customError("All fields are required", 400));
    }

    const booking = await bookingModel.create({
      property: property_id,
      user_id: req.user._id,
      checkIn_date,
      checkOut_date,
      totalPrice,
      status: "Pending",
    });

    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: `receipt ${booking._id}`,
      payment_capture: 1,
    };

    const razorpayOrder = await paymentInstance.orders.create(options);

    booking.razorpayOrderId = razorpayOrder.id;
    await booking.save();

    const bookingTemplate = bookingConfirmationTemplate(
      req.user.userName,
      property.location,
      checkIn_date,
      checkOut_date
    );

    await sendMail(
      "namanshrivastava008@gmail.com",
      "Booking Confirmed",
      bookingTemplate
    );

    res.status(200).json({
      success: true,
      data: booking,
      amount: totalPrice,
    });
  } catch (error) {
    return next(new customError(error.message, 500));
  }
};

const viewBookingsController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return next(new customError("User not Found", 404));
    }

    const bookings = await bookingModel
      .findOne({ user_id: userId })
      .populate("user_id", "userName email");

    if (!bookings) {
      return next(new custonError("Booking details not Found", 404));
    }

    res.status(200).json({
      message: "Booking details",
      data: bookings,
    });
  } catch (error) {
    return next(new customError(error.message, 500));
  }
};

module.exports = {
  createBookingController,
  viewBookingsController
};
