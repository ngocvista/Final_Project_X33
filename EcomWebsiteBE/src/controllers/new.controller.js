// new.controller.js
import New from "../models/new.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileToFirebase } from "../services/firebase.service.js";

// Lấy tất cả các bản tin với phân trang, tìm kiếm và lọc bản tin chưa bị xóa
export const getAllNews = async (req, res) => {
  try {
    const { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    const news = await New.find(query).skip(skip).limit(limit);
    const totalElements = await New.countDocuments(query);
    const totalPages = Math.ceil(totalElements / limit);

    const paginationResponse = {
      content: news,
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
          "Lấy danh sách bản tin thành công"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách bản tin"));
  }
};

// Lấy bản tin theo ID
export const getNewById = async (req, res) => {
  try {
    const { id } = req.params;
    const newsItem = await New.findById(id).where("isDeleted").equals(false);

    if (!newsItem) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy bản tin"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, newsItem, "Lấy bản tin thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy bản tin theo ID"));
  }
};

// Tạo bản tin mới
export const createNew = async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageFile = req.file;

    const newsItem = new New({
      title,
      content,
      isDeleted: false,
    });

    if (imageFile) {
      const imageUrl = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      newsItem.image = imageUrl;
    }

    const savedNew = await newsItem.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedNew, "Tạo bản tin thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo bản tin"));
  }
};

// Cập nhật bản tin
export const updateNew = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const imageFile = req.file;

    const newsItem = await New.findById(id);
    if (!newsItem || newsItem.isDeleted) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy bản tin"));
    }

    newsItem.title = title;
    newsItem.content = content;

    if (imageFile) {
      const imageUrl = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      newsItem.image = imageUrl;
    }

    const updatedNew = await newsItem.save();
    res
      .status(200)
      .json(new ApiResponse(200, updatedNew, "Cập nhật bản tin thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật bản tin"));
  }
};

// Xóa bản tin (đánh dấu isDeleted là true)
export const deleteNew = async (req, res) => {
  try {
    const { id } = req.params;

    const newsItem = await New.findById(id);
    if (!newsItem || newsItem.isDeleted) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy bản tin"));
    }

    newsItem.isDeleted = true;
    await newsItem.save();

    res.status(200).json(new ApiResponse(200, null, "Xóa bản tin thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa bản tin"));
  }
};
