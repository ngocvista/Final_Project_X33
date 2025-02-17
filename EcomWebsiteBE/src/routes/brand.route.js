// brand.router.js
import express from "express";
import {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
} from "../controllers/brand.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import multer from "multer";

// Cấu hình bộ nhớ cho Multer để lưu trữ tạm thời trong bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const brandRouter = express.Router();

// Lấy tất cả thương hiệu và tạo thương hiệu mới (có kiểm tra quyền)
brandRouter
  .route("/")
  .get(getAllBrands) // Lấy danh sách thương hiệu
  .post(checkAuth, upload.single("image"), createBrand); // Tạo thương hiệu mới

// Lấy thương hiệu theo ID, cập nhật và xóa thương hiệu (có kiểm tra quyền)
brandRouter
  .route("/:id")
  .get(getBrandById) // Lấy thông tin thương hiệu theo ID
  .put(checkAuth, upload.single("image"), updateBrand) // Cập nhật thương hiệu
  .delete(checkAuth, deleteBrand); // Xóa thương hiệu

export { brandRouter };
