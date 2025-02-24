import express from "express";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { checkAdmin } from "../middlewares/admin.middleware.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// User routes
adminRouter.get("/users", checkAuth, checkAdmin, getAllUsers);
adminRouter.get("/users/:id", checkAuth, checkAdmin, getUserById);
adminRouter.post("/users", checkAuth, checkAdmin, createUser);
adminRouter.put("/users/:id", checkAuth, checkAdmin, updateUser);
adminRouter.delete("/users/:id", checkAuth, checkAdmin, deleteUser);

// Product routes
adminRouter.get("/products", checkAuth, checkAdmin, getAllProducts);
adminRouter.get("/products/:id", checkAuth, checkAdmin, getProductById);
adminRouter.post("/products", checkAuth, checkAdmin, createProduct);
adminRouter.put("/products/:id", checkAuth, checkAdmin, updateProduct);
adminRouter.delete("/products/:id", checkAuth, checkAdmin, deleteProduct);

// Order routes
adminRouter.get("/orders", checkAuth, checkAdmin, getAllOrders);
adminRouter.get("/orders/:id", checkAuth, checkAdmin, getOrderById);
adminRouter.post("/orders", checkAuth, checkAdmin, createOrder);
adminRouter.put("/orders/:id", checkAuth, checkAdmin, updateOrder);
adminRouter.delete("/orders/:id", checkAuth, checkAdmin, deleteOrder);

// Category routes
adminRouter.get("/categories", checkAuth, checkAdmin, getAllCategories);
adminRouter.get("/categories/:id", checkAuth, checkAdmin, getCategoryById);
adminRouter.post("/categories", checkAuth, checkAdmin, createCategory);
adminRouter.put("/categories/:id", checkAuth, checkAdmin, updateCategory);
adminRouter.delete("/categories/:id", checkAuth, checkAdmin, deleteCategory);

// Brand routes
adminRouter.get("/brands", checkAuth, checkAdmin, getAllBrands);
adminRouter.get("/brands/:id", checkAuth, checkAdmin, getBrandById);
adminRouter.post("/brands", checkAuth, checkAdmin, createBrand);
adminRouter.put("/brands/:id", checkAuth, checkAdmin, updateBrand);
adminRouter.delete("/brands/:id", checkAuth, checkAdmin, deleteBrand);

// Voucher routes
adminRouter.get("/vouchers", checkAuth, checkAdmin, getAllVouchers);
adminRouter.get("/vouchers/:id", checkAuth, checkAdmin, getVoucherById);
adminRouter.post("/vouchers", checkAuth, checkAdmin, createVoucher);
adminRouter.put("/vouchers/:id", checkAuth, checkAdmin, updateVoucher);
adminRouter.delete("/vouchers/:id", checkAuth, checkAdmin, deleteVoucher);

export default adminRouter;
