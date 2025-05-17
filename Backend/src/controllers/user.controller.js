const userModel = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const customError = require("../utils/customError.js");
const cacheClient = require("../services/cache.service.js");
const { resetPasswordTemplate } = require("../utils/emailTemplate.js");
const { sendMail } = require("../utils/email.js");

const registerController = async (req, res, next) => {
  const { userName, email, mobileNo, address, password } = req.body;
  try {
    const userExist = await userModel.findOne({ email: email });
    if (userExist) {
      return next(new customError("User already exists", 400));
    }
    const user = await userModel.create({
      userName,
      email,
      mobileNo,
      address,
      password,
    });

    const token = await user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
    });

    res
      .status(201)
      .json({ message: "User created successfully", token: token });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.authenticateUser(email, password);

    const token = await user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
    });

    res.status(200).json({ message: "Login successful", token: token });
  } catch (err) {
    next(new customError(err.message, 500));
  }
};

const logoutController = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      return next(new customError("User unauthorized", 400));
    }

    const blacklistToken = await cacheClient.set(
      token,
      "blacklist",
      "EX",
      3600
    );

    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next(new customError(err.message, 500));
  }
};

const currentUserController = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new customError("User not found", 400));
    }
    res.status(200).json({ message: "Authentication Successfull", user });
  } catch (err) {
    next(new customError(err.message, 500));
  }
};

const updateUserControlller = async (req, res, next) => {
  try {
    const { userName, email, mobileNo, address, newPassword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new customError("User not found", 400));
    }
    if (userName) {
      user.userName = userName;
    }
    if (email) {
      user.email = email;
    }
    if (mobileNo) {
      user.mobileNo = mobileNo;
    }
    if (address) {
      user.address = address;
    }

    let newToken = null;
    if (newPassword) {
      newToken = user.generateAuthToken();

      user.password = newPassword;
    }

    await user.save();

    if (!newToken) {
      return next(new customError("Token generation failed", 400));
    }

    res.cookie("token", newToken);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: user,
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

const resetPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new customError("Email is required", 400));
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new customError("User not found", 400));
    }

    const rawToken = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const resetLink = `http://localhost/api/user/reset-password/${rawToken}`;

    const emailTemplate = resetPasswordTemplate(user.userName, resetLink);

    await sendMail(
      "namanshrivastava008@gmail.com",
      "Reset Password",
      emailTemplate
    );

    res.status(200).json({
      success: true,
      message: "Reset Password link shared on your Gmail",
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  currentUserController,
  updateUserControlller,
  resetPasswordController,
};
