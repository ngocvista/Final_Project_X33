// review.controller.js
import Review from "../models/review.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Lấy tất cả các đánh giá với phân trang và tìm kiếm
export const getAllReviews = async (req, res) => {
  try {
    const { searchText } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Tìm kiếm theo từ khóa nếu có
    const query = {};
    if (searchText) {
      query.reviewText = { $regex: searchText, $options: "i" };
    }

    const reviews = await Review.find(query)
      .skip(skip)
      .limit(limit)
      .populate("user") // Lấy đầy đủ thông tin user
      .populate("product"); // Lấy đầy đủ thông tin product
    const totalElements = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalElements / limit);

    const paginationResponse = {
      content: reviews,
      page,
      limit,
      totalElements,
      totalPages,
    };

    res
      .status(200)
      .json(
        new ApiResponse(200, paginationResponse, "Lấy đánh giá thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách đánh giá"));
  }
};

// Lấy các đánh giá của một sản phẩm cụ thể với phân trang và tìm kiếm
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { searchText } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { product: productId };
    if (searchText) {
      query.reviewText = { $regex: searchText, $options: "i" };
    }

    const reviews = await Review.find(query)
      .skip(skip)
      .limit(limit)
      .populate("user") // Lấy đầy đủ thông tin user
      .populate("product"); // Lấy đầy đủ thông tin product
    const totalElements = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalElements / limit);

    const paginationResponse = {
      content: reviews,
      page,
      limit,
      totalElements,
      totalPages,
    };

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          paginationResponse,
          "Lấy đánh giá của sản phẩm thành công"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy đánh giá cho sản phẩm"));
  }
};

// Tạo mới đánh giá
export const createReview = async (req, res) => {
  try {
    const { productId, userId, reviewText, rating } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "ID không hợp lệ"));
    }

    // Tạo mới review
    const review = new Review({
      product: productId,
      user: userId,
      reviewText,
      rating,
      reviewDate: new Date(),
    });

    // Lưu review và populate dữ liệu user và product
    const savedReview = await review.save();
    const populatedReview = await Review.findById(savedReview._id)
      .populate("user") // Lấy đầy đủ thông tin user
      .populate("product") // Lấy đầy đủ thông tin product
      .exec();

    res
      .status(201)
      .json(new ApiResponse(201, populatedReview, "Tạo đánh giá thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo đánh giá"));
  }
};
