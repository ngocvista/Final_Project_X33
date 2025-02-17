// voucher.router.js
import express from "express";
import {
  getAllVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  markVoucherAsUsed,
  checkVoucherCode,
  changeVoucherStatus,
} from "../controllers/voucher.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const voucherRouter = express.Router();

// Lấy tất cả voucher và tạo voucher mới
voucherRouter
  .route("/")
  .get(getAllVouchers) // Lấy danh sách voucher với phân trang và tìm kiếm
  .post(checkAuth, createVoucher); // Tạo voucher mới (yêu cầu quyền truy cập)

// Lấy, cập nhật, và xóa voucher theo ID
voucherRouter
  .route("/:id")
  .put(checkAuth, updateVoucher) // Cập nhật voucher
  .delete(checkAuth, deleteVoucher); // Xóa voucher

// Đánh dấu voucher là đã sử dụng
voucherRouter.route("/:id/mark-as-used").put(checkAuth, markVoucherAsUsed); // Đánh dấu voucher đã sử dụng (yêu cầu quyền truy cập)

// Kiểm tra mã voucher
voucherRouter.route("/check/:code").get(checkVoucherCode); // Kiểm tra mã voucher có hợp lệ không

// Thay đổi trạng thái sử dụng của voucher (toggle)
voucherRouter.route("/:id/change-status").put(checkAuth, changeVoucherStatus); // Thay đổi trạng thái sử dụng của voucher (yêu cầu quyền truy cập)

export { voucherRouter };
