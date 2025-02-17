import Order from "../models/order.model.js";
import OrderDetail from "../models/orderDetail.model.js";
import Product from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// API to create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      code,
      date,
      note,
      paymentMethod,
      totalPrice,
      discount,
      user,
      addressBook,
      status,
      orderDetails,
    } = req.body;

    // Kiểm tra các ObjectId hợp lệ
    if (
      !mongoose.Types.ObjectId.isValid(user.userId) ||
      !mongoose.Types.ObjectId.isValid(addressBook.addressBookId)
    ) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "ID người dùng hoặc địa chỉ không hợp lệ")
        );
    }

    // Tạo đơn hàng mới
    const order = new Order({
      code,
      date,
      note,
      paymentMethod,
      totalPrice,
      discount,
      user: user.userId,
      addressBook: addressBook.addressBookId,
      status,
    });
    await order.save();

    // Xử lý từng chi tiết đơn hàng
    for (const detail of orderDetails) {
      const product = await Product.findById(detail.product.productId);
      if (!product) {
        throw new Error(
          `Không tìm thấy sản phẩm với ID: ${detail.product.productId}`
        );
      }

      // Kiểm tra tồn kho
      if (product.stock < detail.quantity) {
        throw new Error(`Sản phẩm ${product.productName} không đủ tồn kho.`);
      }

      // Trừ tồn kho
      product.stock -= detail.quantity;
      await product.save();

      // Tạo chi tiết đơn hàng
      const orderDetail = new OrderDetail({
        order: order._id,
        product: detail.product.productId,
        productVariation: detail.productVariation
          ? detail.productVariation.variationId
          : null,
        quantity: detail.quantity,
        price: detail.price,
      });
      await orderDetail.save();

      // Thêm ID của orderDetail vào mảng orderDetails của đơn hàng
      order.orderDetails.push(orderDetail._id);
    }

    await order.save();

    res
      .status(201)
      .json(new ApiResponse(201, order, "Tạo đơn hàng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo đơn hàng"));
  }
};

// API to get all orders with pagination and filters
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, code, status, method } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (code) query.code = code;
    if (status) query.status = status;
    if (method) query.paymentMethod = method;

    const orders = await Order.find(query)
      .populate("user addressBook")
      .populate({
        path: "orderDetails",
        populate: [
          {
            path: "product",
            populate: { path: "images", select: "imageUrl isDefault" }, // Populate images for each product
          },
          {
            path: "productVariation",
            select: "attributeName attributeValue price", // Populate fields of productVariation
          },
        ],
      })
      .skip(skip)
      .limit(Number(limit))
      .sort({ date: -1 });

    const totalElements = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalElements / limit);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          content: orders,
          page: Number(page),
          limit: Number(limit),
          totalElements,
          totalPages,
        },
        "Lấy danh sách đơn hàng thành công"
      )
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách đơn hàng"));
  }
};

// API to get orders by user ID with pagination
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const userOrders = await Order.find({ user: userId })
      .populate("user addressBook")
      .populate({
        path: "orderDetails",
        populate: [
          {
            path: "product",
            populate: { path: "images", select: "imageUrl isDefault" }, // Populate images for each product
          },
          {
            path: "productVariation",
            select: "attributeName attributeValue price", // Populate fields of productVariation
          },
        ],
      })
      .skip(skip)
      .limit(Number(limit))
      .sort({ date: -1 });

    const totalElements = await Order.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalElements / limit);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          content: userOrders,
          page: Number(page),
          limit: Number(limit),
          totalElements,
          totalPages,
        },
        "Lấy danh sách đơn hàng theo người dùng thành công"
      )
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Lỗi khi lấy danh sách đơn hàng theo người dùng"
        )
      );
  }
};

// API to change order status
export const changeOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.query; // Lấy status từ query parameter

    if (!status) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Thiếu trạng thái đơn hàng"));
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Đơn hàng không tồn tại"));
    }

    order.status = status;
    await order.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, null, "Thay đổi trạng thái đơn hàng thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi thay đổi trạng thái đơn hàng"));
  }
};
