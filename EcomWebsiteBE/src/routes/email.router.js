// email.router.js
import express from "express";
import { sendOrderConfirmationEmail } from "../controllers/email.controller.js";

const emailRouter = express.Router();

// Định nghĩa route để gửi email xác nhận đơn hàng
emailRouter.post("/sendOrderConfirmation", sendOrderConfirmationEmail);

export default emailRouter;
