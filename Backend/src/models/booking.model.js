const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "property",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    checkIn_date: {
      type: String,
      required: true,
    },
    checkOut_date: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    razorpayOrderId: {
      type: String,
    },
    paymentDetails: {
      paymentId: {
        type: String,
      },
      order_Id: {
        type: String,
      },
      signature: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
