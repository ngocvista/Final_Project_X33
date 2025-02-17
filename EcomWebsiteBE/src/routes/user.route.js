// user.router.js
import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  approveUserAccount, // Thêm API duyệt tài khoản
} from "../controllers/user.controller.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getAllUsers) // Lấy danh sách người dùng
  .post(upload.single("avatar"), createUser); // Tạo mới người dùng

userRouter
  .route("/:id")
  .get(getUserById) // Lấy người dùng theo ID
  .put(upload.single("avatar"), updateUser) // Cập nhật người dùng
  .delete(deleteUser); // Xóa người dùng

userRouter.put("/:id/change-password", changePassword); // Đổi mật khẩu

// ➕ Thêm route duyệt tài khoản
userRouter.put("/:id/approve", approveUserAccount); // Duyệt tài khoản người dùng

export { userRouter };
