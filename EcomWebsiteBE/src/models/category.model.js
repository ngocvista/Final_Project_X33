// category.model.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  isDelete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, immutable: true }, // Không cho phép cập nhật, chỉ tạo một lần
});

// Tạo model từ schema
const Category = mongoose.model("Category", categorySchema);

export default Category;
