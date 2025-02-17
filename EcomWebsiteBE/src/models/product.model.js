// product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true }, // Thay Decimal128 bằng Number
  description: { type: String },
  discount: { type: Number, default: 0 }, // Thay Decimal128 bằng Number
  badge: { type: String },
  stock: { type: Number, default: 0 },
  isNewProduct: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  isSpecial: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isDelete: { type: Boolean, default: false },
  variations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariation" },
  ],
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductImage" }],
});

// Method to get the default image
productSchema.methods.getDefaultImage = function () {
  if (this.images && this.images.length > 0) {
    return this.images.find((image) => image.isDefault) || null;
  }
  return null;
};

// Tạo model từ schema
const Product = mongoose.model("Product", productSchema);

export default Product;
