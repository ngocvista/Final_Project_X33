// brand.controller.js
import Brand from "../models/brand.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileToFirebase } from "../services/firebase.service.js";

// Lấy tất cả các thương hiệu
export const getAllBrands = async (req, res) => {
  try {
    const { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isDelete: false };
    if (keyword) {
      query.brandName = { $regex: keyword, $options: "i" };
    }

    const brands = await Brand.find(query).skip(skip).limit(limit);
    const totalElements = await Brand.countDocuments(query);
    const totalPages = Math.ceil(totalElements / limit);

    const paginationResponse = {
      content: brands,
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
          "Lấy danh sách thương hiệu thành công"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách thương hiệu"));
  }
};

// Lấy thương hiệu theo ID
export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id).where("isDelete").equals(false);

    if (!brand) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy thương hiệu"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, brand, "Lấy thương hiệu thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy thương hiệu theo ID"));
  }
};

// Tạo thương hiệu mới
export const createBrand = async (req, res) => {
  try {
    const { brandName, description } = req.body;
    const imageFile = req.file;

    const brand = new Brand({
      brandName,
      description,
      isDelete: false,
    });

    if (imageFile) {
      const imageUrl = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      brand.image = imageUrl;
    }

    const savedBrand = await brand.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedBrand, "Tạo thương hiệu thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo thương hiệu"));
  }
};

// Cập nhật thương hiệu
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { brandName, description } = req.body;
    const imageFile = req.file;

    const brand = await Brand.findById(id);
    if (!brand || brand.isDelete) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy thương hiệu"));
    }

    brand.brandName = brandName;
    brand.description = description;

    if (imageFile) {
      const imageUrl = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      brand.image = imageUrl;
    }

    const updatedBrand = await brand.save();
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedBrand, "Cập nhật thương hiệu thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật thương hiệu"));
  }
};

// Xóa thương hiệu (đánh dấu isDelete là true)
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand || brand.isDelete) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy thương hiệu"));
    }

    brand.isDelete = true;
    await brand.save();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Xóa thương hiệu thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa thương hiệu"));
  }
};
