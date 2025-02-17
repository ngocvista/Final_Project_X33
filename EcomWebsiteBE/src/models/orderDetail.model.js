// orderDetail.model.js
import mongoose from "mongoose";

const orderDetailSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // Tham chiếu đến Order
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }, // Tham chiếu đến Product
  productVariation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariation",
    default: null,
  }, // Có thể không có productVariation
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Giá sản phẩm, sử dụng Decimal128 cho độ chính xác cao
});

// Tạo model từ schema
const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);

export default OrderDetail;
