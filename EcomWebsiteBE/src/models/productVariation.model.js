// productVariation.model.js
import mongoose from "mongoose";

const productVariationSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }, // Tham chiếu đến Product
  attributeName: { type: String, required: true }, // Ví dụ: "Color", "Storage", "RAM"
  attributeValue: { type: String, required: true }, // Ví dụ: "Red", "128GB", "16GB"
  price: { type: Number, required: true }, // Giá cho biến thể sản phẩm
  quantity: { type: Number, required: true }, // Số lượng của biến thể
  isDelete: { type: Boolean, default: false }, // Đánh dấu nếu biến thể bị xóa
});

// Tạo model từ schema
const ProductVariation = mongoose.model(
  "ProductVariation",
  productVariationSchema
);

export default ProductVariation;
