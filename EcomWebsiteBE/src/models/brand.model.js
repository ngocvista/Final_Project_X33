// brand.model.js
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  brandName: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  isDelete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, immutable: true }, // Không cho phép cập nhật, chỉ tạo một lần
});

// Tạo model từ schema
const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
