// review.router.js
import express from "express";
import {
  getAllReviews,
  getReviewsByProduct,
  createReview,
} from "../controllers/review.controller.js";

const reviewRouter = express.Router();

// Định tuyến API lấy tất cả đánh giá với phân trang và tìm kiếm
reviewRouter.route("/").get(getAllReviews).post(createReview);

// Định tuyến API lấy các đánh giá của một sản phẩm cụ thể với phân trang và tìm kiếm
reviewRouter.route("/product/:productId").get(getReviewsByProduct);

export { reviewRouter };
