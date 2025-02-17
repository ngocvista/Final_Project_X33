// new.model.js
import mongoose from "mongoose";

const newSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Có thể chứa HTML
  publishDate: { type: Date, default: Date.now, immutable: true }, // Ngày xuất bản, không cho phép cập nhật
  isDeleted: { type: Boolean, default: false },
  image: { type: String }, // Đường dẫn hoặc tên tệp hình ảnh
});

// Tạo model từ schema
const New = mongoose.model("New", newSchema);

export default New;
