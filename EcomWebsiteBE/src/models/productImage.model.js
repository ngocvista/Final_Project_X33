// productImage.model.js
import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }, // Tham chiếu đến Product
  imageUrl: { type: String, required: true }, // URL của hình ảnh
  isDelete: { type: Boolean, default: false }, // Đánh dấu nếu hình ảnh bị xóa
  isDefault: { type: Boolean, default: false }, // Đánh dấu nếu đây là hình ảnh mặc định
});

// Tạo model từ schema
const ProductImage = mongoose.model("ProductImage", productImageSchema);

export default ProductImage;
