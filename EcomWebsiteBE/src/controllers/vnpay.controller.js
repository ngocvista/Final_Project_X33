// vnpay.controller.js
import {
  createOrderService,
  orderReturnService,
} from "../config/vnpayService.js";

// Controller để tạo URL thanh toán VNPay
// Controller để tạo URL thanh toán VNPay
export const createOrder = async (req, res) => {
  const { amount, orderInfo, returnUrl } = req.query;
  try {
    const paymentUrl = await createOrderService(
      req,
      parseInt(amount),
      orderInfo,
      returnUrl
    );
    res.status(200).send(paymentUrl); // Trả về URL dưới dạng chuỗi
  } catch (error) {
    console.error("Error creating payment URL:", error);
    res.status(500).send("Failed to create payment URL"); // Trả về chuỗi thông báo lỗi
  }
};

// Controller để xử lý phản hồi thanh toán từ VNPay
export const orderReturn = async (req, res) => {
  try {
    const result = await orderReturnService(req);
    switch (result) {
      case 1:
        res
          .status(200)
          .json({ status: "SUCCESS", message: "Giao dịch thành công!" });
        break;
      case 0:
        res
          .status(400)
          .json({ status: "FAILED", message: "Giao dịch thất bại!" });
        break;
      default:
        res
          .status(400)
          .json({ status: "INVALID", message: "Giao dịch không hợp lệ!" });
        break;
    }
  } catch (error) {
    console.error("Error handling payment return:", error);
    res
      .status(500)
      .json({ status: "ERROR", message: "Failed to handle payment return" });
  }
};
