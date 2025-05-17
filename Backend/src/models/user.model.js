const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  mobileNo: {
    type: Number,
    require: true,
    minLength: 10,
  },
  address: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  if (!token) {
    throw new Error("Token generation failed");
  }
  return token;
};

userSchema.statics.authenticateUser = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  return user;
};

module.exports = mongoose.model("user", userSchema);
