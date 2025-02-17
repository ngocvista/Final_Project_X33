// voucher.model.js
import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Mã giảm giá
  discount: { type: Number, required: true }, // Phần trăm giảm giá hoặc giá trị giảm giá
  expirationDate: { type: Date, required: true }, // Ngày hết hạn
  isUsed: { type: Boolean, default: false }, // Đánh dấu nếu voucher đã được sử dụng
});

// Tạo model từ schema
const Voucher = mongoose.model("Voucher", voucherSchema);

export default Voucher;
