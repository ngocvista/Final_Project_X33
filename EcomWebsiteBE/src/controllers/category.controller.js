// category.controller.js
import Category from "../models/category.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileToFirebase } from "../services/firebase.service.js";

export const getAllCategories = async (req, res) => {
  try {
    const { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Lọc danh mục chưa bị xóa và tìm kiếm theo từ khóa
    const query = { isDelete: false };
    if (keyword) {
      query.categoryName = { $regex: keyword, $options: "i" };
    }

    const categories = await Category.find(query).skip(skip).limit(limit);
    const totalElements = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalElements / limit);

    const paginationResponse = {
      content: categories,
      page,
      limit,
      totalElements,
      totalPages,
    };

    res
      .status(200)
      .json(
        new ApiResponse(200, paginationResponse, "Lấy danh mục thành công")
      );
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi lấy danh mục"));
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id)
      .where("isDelete")
      .equals(false);

    if (!category) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy danh mục"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, category, "Lấy danh mục thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh mục theo ID"));
  }
};

export const createCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    const imageFile = req.file;

    const category = new Category({
      categoryName,
      description,
      isDelete: false,
    });

    // Kiểm tra nếu có tệp ảnh
    if (imageFile) {
      const imageUrl = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      category.image = imageUrl;
    }

    const savedCategory = await category.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedCategory, "Tạo danh mục thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo danh mục"));
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, description } = req.body;
    const imageFile = req.file;

    const category = await Category.findById(id);
    if (!category || category.isDelete) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy danh mục"));
    }

    // Cập nhật thông tin danh mục
    category.categoryName = categoryName;
    category.description = description;

    // Tải ảnh mới lên Firebase nếu có
    if (imageFile) {
      const imageUrl = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      category.image = imageUrl;
    }

    const updatedCategory = await category.save();
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedCategory, "Cập nhật danh mục thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật danh mục"));
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category || category.isDelete) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy danh mục"));
    }

    // Đánh dấu danh mục là đã xóa
    category.isDelete = true;
    await category.save();

    res.status(200).json(new ApiResponse(200, null, "Xóa danh mục thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa danh mục"));
  }
};
