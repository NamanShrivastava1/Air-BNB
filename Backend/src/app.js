const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const userRoute = require("../src/routes/user.routes.js");
const propertyRoute = require("../src/routes/property.routes.js");
const bookingRoutes = require("../src/routes/booking.routes.js");
const paymentRoutes = require("../src/routes/payment.routes.js");
const adminRoutes = require("../src/routes/admin.routes.js");
const reviewRoutes = require("../src/routes/review.routes.js");
const errorHandler = require("./middlewares/errorHandler.js");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page");
});

app.use("/api/auth", userRoute);
app.use("/api/property", propertyRoute);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/review", reviewRoutes);

app.use(errorHandler);

module.exports = app;
