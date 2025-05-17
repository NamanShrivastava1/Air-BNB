const bookingModel = require("../models/booking.model.js");
const paymentInstance = require("../services/payment.service.js");
const customError = require("../utils/customError.js");
const crypto = require("crypto");
const { paymentConfirmationTemplate } = require("../utils/emailTemplate.js");
const { sendMail } = require("../utils/email.js");

const processPaymentController = async (req, res, next) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return next(new customError("Missing required fields", 400));
    }

    const options = {
      amount: amount * 100,
      currency: currency || "INR",
      receipt: `receipt ${Date.now()}`,
      payment_capture: 1,
    };

    const razorpayOrder = await paymentInstance.orders.create(options);

    if (!razorpayOrder) {
      return next(new customError("Error in Payment", 400));
    }

    res.status(200).json({
      success: true,
      data: razorpayOrder,
    });
  } catch (error) {
    return next(new customError(error.message, 500));
  }
};

const verifyPaymentController = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return next(new customError("razorpay order details required", 400));
    }

    const booking = await bookingModel
      .findOne({
        razorpayOrderId: razorpay_order_id,
      })
      .populate("user_id", "userName email")
      .populate("property", "location");

    if (!booking) {
      return next(new customError("Booking not found", 404));
    } 

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id} | ${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(
        new customError("Verification failed, Payment declined", 400)
      );
    }

    booking.status = "Completed";
    booking.paymentDetails = {
      paymentId: razorpay_order_id,
      order_Id: razorpay_order_id,
      signature: razorpay_signature,
    };

    await booking.save();

    const emailTemplate = paymentConfirmationTemplate(
      req.user.userName,
      booking.property.location,
      booking.status,
      booking.totalPrice
    );

    await sendMail(
      "namanshrivastava008@gmail.com",
      "Booking and Payment Completed",
      emailTemplate
    );

    res.status(200).json({
      success: true,
      message: "Booking and Payment Completed",
      data: booking,
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

module.exports = {
  processPaymentController,
  verifyPaymentController,
};
