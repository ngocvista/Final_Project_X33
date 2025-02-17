// new.router.js
import express from "express";
import {
  getAllNews,
  getNewById,
  createNew,
  updateNew,
  deleteNew,
} from "../controllers/new.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import multer from "multer";

// Cấu hình bộ nhớ cho Multer để lưu trữ tạm thời trong bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const newRouter = express.Router();

// Lấy tất cả bản tin và tạo bản tin mới (có kiểm tra quyền)
newRouter
  .route("/")
  .get(getAllNews) // Lấy danh sách bản tin
  .post(checkAuth, upload.single("image"), createNew); // Tạo bản tin mới

// Lấy bản tin theo ID, cập nhật và xóa bản tin (có kiểm tra quyền)
newRouter
  .route("/:id")
  .get(getNewById) // Lấy thông tin bản tin theo ID
  .put(checkAuth, upload.single("image"), updateNew) // Cập nhật bản tin
  .delete(checkAuth, deleteNew); // Xóa bản tin

export { newRouter };
