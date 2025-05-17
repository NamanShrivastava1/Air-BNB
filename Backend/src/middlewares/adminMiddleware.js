const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");
const customError = require("../utils/customError.js");
const cacheClient = require("../services/cache.service.js");

const adminMiddleware = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return next(new customError("User unauthorized", 400));
    }
    const isBlacklisted = await cacheClient.get(token);
    if (isBlacklisted) {
      return next(new customError("Token Blacklisted", 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return next(new customError("User not found", 401));
    }

    if (req.user.isAdmin !== true) {
      return next(new customError("Access Denied", 400));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new customError(err.message, 500));
  }
};

module.exports = adminMiddleware;
