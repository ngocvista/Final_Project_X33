import express from "express";
import multer from "multer";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

// Cấu hình multer trực tiếp
const upload = multer({
  storage: multer.memoryStorage(), // Sử dụng bộ nhớ trong RAM để lưu file tạm thời
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file là 5MB
});

// Route đăng ký người dùng mới
authRouter.post("/register", register);

// Route đăng nhập người dùng
authRouter.post("/login", login);

// Route yêu cầu đặt lại mật khẩu
authRouter.post("/forgot-password", forgotPassword);

// Route đặt lại mật khẩu
authRouter.post("/reset-password", resetPassword);

export { authRouter };
