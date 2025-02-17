// productImage.routes.js
import express from "express";
import {
  getProductImages,
  createProductImage,
  updateProductImage,
  deleteProductImage,
  changeDefaultImage,
} from "../controllers/productImage.controller.js";
import multer from "multer";

// Cấu hình multer để xử lý file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productImageRouter = express.Router({ mergeParams: true });

// Route để lấy tất cả hình ảnh của một sản phẩm
productImageRouter.get("/", getProductImages);

// Route để tạo hình ảnh sản phẩm mới
productImageRouter.post("/", upload.single("image"), createProductImage);

// Route để cập nhật hình ảnh sản phẩm
productImageRouter.put("/:imageId", upload.single("image"), updateProductImage);

// Route để xóa hình ảnh sản phẩm
productImageRouter.delete("/:imageId", deleteProductImage);

// Route để thay đổi trạng thái hình ảnh mặc định
productImageRouter.put("/:imageId/default", changeDefaultImage);

export { productImageRouter };
