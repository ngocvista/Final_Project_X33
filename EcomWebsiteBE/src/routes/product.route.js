import express from "express";
import multer from "multer";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFilteredProducts,
  checkOrderStock, // Thêm hàm controller cho route mới
} from "../controllers/product.controller.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productRouter = express.Router();

productRouter
  .route("/")
  .get(getAllProducts) // Lấy danh sách sản phẩm
  .post(upload.array("images"), createProduct); // Tạo sản phẩm mới

productRouter.route("/filtered").get(getFilteredProducts); // Lấy danh sách sản phẩm với bộ lọc

productRouter
  .route("/:id")
  .get(getProductById) // Lấy chi tiết sản phẩm
  .put(upload.array("images"), updateProduct) // Cập nhật sản phẩm
  .delete(deleteProduct); // Xóa sản phẩm
productRouter.route("/check-order-stock").post(checkOrderStock);
export { productRouter };
