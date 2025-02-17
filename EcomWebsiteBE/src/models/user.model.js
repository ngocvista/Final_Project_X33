// user.model.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  fullName: { type: String },
  avatar: { type: String },
  resetPasswordToken: { type: String },
  role: {
    type: String,
    enum: ["ADMIN", "STAFF", "CUSTOMER", "SELLER"],
    required: true,
  },
  address: { type: String },
  isDelete: { type: Boolean, default: false },
  active: { type: Boolean, default: true }, // Hoạt động khi không bị xóa
});

// Generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

// Method to check if the user account is enabled (not deleted)
userSchema.methods.isEnabled = function () {
  return !this.isDelete;
};

const User = mongoose.model("User", userSchema);
export default User;
