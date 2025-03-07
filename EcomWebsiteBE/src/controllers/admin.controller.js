import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import Voucher from "../models/voucher.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// User management functions
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(new ApiResponse(200, users, "Lấy danh sách người dùng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy danh sách người dùng"));
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }
    res.status(200).json(new ApiResponse(200, user, "Lấy người dùng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy người dùng theo ID"));
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, fullName, role, address } = req.body;
    const newUser = new User({ username, password, email, phoneNumber, fullName, role, address });
    await newUser.save();
    res.status(201).json(new ApiResponse(201, newUser, "Tạo người dùng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo người dùng"));
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phoneNumber, fullName, role, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { username, email, phoneNumber, fullName, role, address }, { new: true });
    if (!updatedUser) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }
    res.status(200).json(new ApiResponse(200, updatedUser, "Cập nhật người dùng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi cập nhật người dùng"));
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }
    res.status(200).json(new ApiResponse(200, null, "Xóa người dùng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa người dùng"));
  }
};

// Product management functions
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(new ApiResponse(200, products, "Lấy danh sách sản phẩm thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy danh sách sản phẩm"));
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy sản phẩm"));
    }
    res.status(200).json(new ApiResponse(200, product, "Lấy sản phẩm thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy sản phẩm theo ID"));
  }
};

export const createProduct = async (req, res) => {
  try {
    const { productName, price, description, category, brand, stock } = req.body;
    const newProduct = new Product({ productName, price, description, category, brand, stock });
    await newProduct.save();
    res.status(201).json(new ApiResponse(201, newProduct, "Tạo sản phẩm thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo sản phẩm"));
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, price, description, category, brand, stock } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, { productName, price, description, category, brand, stock }, { new: true });
    if (!updatedProduct) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy sản phẩm"));
    }
    res.status(200).json(new ApiResponse(200, updatedProduct, "Cập nhật sản phẩm thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi cập nhật sản phẩm"));
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy sản phẩm"));
    }
    res.status(200).json(new ApiResponse(200, null, "Xóa sản phẩm thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa sản phẩm"));
  }
};

// Order management functions
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(new ApiResponse(200, orders, "Lấy danh sách đơn hàng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy danh sách đơn hàng"));
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy đơn hàng"));
    }
    res.status(200).json(new ApiResponse(200, order, "Lấy đơn hàng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy đơn hàng theo ID"));
  }
};

export const createOrder = async (req, res) => {
  try {
    const { code, date, note, paymentMethod, totalPrice, discount, user, addressBook, status, orderDetails } = req.body;
    const newOrder = new Order({ code, date, note, paymentMethod, totalPrice, discount, user, addressBook, status, orderDetails });
    await newOrder.save();
    res.status(201).json(new ApiResponse(201, newOrder, "Tạo đơn hàng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo đơn hàng"));
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, date, note, paymentMethod, totalPrice, discount, user, addressBook, status, orderDetails } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(id, { code, date, note, paymentMethod, totalPrice, discount, user, addressBook, status, orderDetails }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy đơn hàng"));
    }
    res.status(200).json(new ApiResponse(200, updatedOrder, "Cập nhật đơn hàng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi cập nhật đơn hàng"));
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy đơn hàng"));
    }
    res.status(200).json(new ApiResponse(200, null, "Xóa đơn hàng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa đơn hàng"));
  }
};

// Category management functions
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(new ApiResponse(200, categories, "Lấy danh sách danh mục thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy danh sách danh mục"));
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy danh mục"));
    }
    res.status(200).json(new ApiResponse(200, category, "Lấy danh mục thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy danh mục theo ID"));
  }
};

export const createCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    const newCategory = new Category({ categoryName, description });
    await newCategory.save();
    res.status(201).json(new ApiResponse(201, newCategory, "Tạo danh mục thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo danh mục"));
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(id, { categoryName, description }, { new: true });
    if (!updatedCategory) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy danh mục"));
    }
    res.status(200).json(new ApiResponse(200, updatedCategory, "Cập nhật danh mục thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi cập nhật danh mục"));
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy danh mục"));
    }
    res.status(200).json(new ApiResponse(200, null, "Xóa danh mục thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa danh mục"));
  }
};

// Brand management functions
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(new ApiResponse(200, brands, "Lấy danh sách thương hiệu thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy danh sách thương hiệu"));
  }
};

export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy thương hiệu"));
    }
    res.status(200).json(new ApiResponse(200, brand, "Lấy thương hiệu thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy thương hiệu theo ID"));
  }
};

export const createBrand = async (req, res) => {
  try {
    const { brandName, description } = req.body;
    const newBrand = new Brand({ brandName, description });
    await newBrand.save();
    res.status(201).json(new ApiResponse(201, newBrand, "Tạo thương hiệu thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo thương hiệu"));
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { brandName, description } = req.body;
    const updatedBrand = await Brand.findByIdAndUpdate(id, { brandName, description }, { new: true });
    if (!updatedBrand) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy thương hiệu"));
    }
    res.status(200).json(new ApiResponse(200, updatedBrand, "Cập nhật thương hiệu thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi cập nhật thương hiệu"));
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy thương hiệu"));
    }
    res.status(200).json(new ApiResponse(200, null, "Xóa thương hiệu thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa thương hiệu"));
  }
};

// Voucher management functions
export const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(new ApiResponse(200, vouchers, "Lấy danh sách voucher thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy danh sách voucher"));
  }
};

export const getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy voucher"));
    }
    res.status(200).json(new ApiResponse(200, voucher, "Lấy voucher thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy voucher theo ID"));
  }
};

export const createVoucher = async (req, res) => {
  try {
    const { code, discount, expirationDate } = req.body;
    const newVoucher = new Voucher({ code, discount, expirationDate });
    await newVoucher.save();
    res.status(201).json(new ApiResponse(201, newVoucher, "Tạo voucher thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo voucher"));
  }
};

export const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expirationDate } = req.body;
    const updatedVoucher = await Voucher.findByIdAndUpdate(id, { code, discount, expirationDate }, { new: true });
    if (!updatedVoucher) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy voucher"));
    }
    res.status(200).json(new ApiResponse(200, updatedVoucher, "Cập nhật voucher thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi cập nhật voucher"));
  }
};

export const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVoucher = await Voucher.findByIdAndDelete(id);
    if (!deletedVoucher) {
      return res.status(404).json(new ApiResponse(404, null, "Không tìm thấy voucher"));
    }
    res.status(200).json(new ApiResponse(200, null, "Xóa voucher thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa voucher"));
  }
};
