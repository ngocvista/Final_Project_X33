import express from "express";
import {
    createOrder,
    orderReturn,
} from "../controllers/vnpay.controller.js"; // Đảm bảo import controller chính xác

const vnpayRouter = express.Router();

// Route tạo URL thanh toán VNPay
vnpayRouter.get("/payment", createOrder);

// Route xử lý khi VNPay trả về kết quả thanh toán
vnpayRouter.get("/paymentReturn", orderReturn);

export default vnpayRouter;
