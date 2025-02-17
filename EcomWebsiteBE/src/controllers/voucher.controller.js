// voucher.controller.js
import Voucher from "../models/voucher.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Lấy tất cả các voucher
export const getAllVouchers = async (req, res) => {
  try {
    const { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Tìm kiếm theo từ khóa và lọc kết quả chưa bị xóa
    const query = {};
    if (keyword) {
      query.code = { $regex: keyword, $options: "i" };
    }

    const vouchers = await Voucher.find(query).skip(skip).limit(limit);
    const totalElements = await Voucher.countDocuments(query);
    const totalPages = Math.ceil(totalElements / limit);

    const paginationResponse = {
      content: vouchers,
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
          "Lấy danh sách voucher thành công"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách voucher"));
  }
};

// Tạo voucher mới
export const createVoucher = async (req, res) => {
  try {
    const { code, discount, expirationDate } = req.body;

    const newVoucher = new Voucher({
      code,
      discount,
      expirationDate,
      isUsed: false,
    });

    const savedVoucher = await newVoucher.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedVoucher, "Tạo voucher thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo voucher"));
  }
};

// Cập nhật voucher
export const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expirationDate } = req.body;

    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy voucher"));
    }

    voucher.code = code;
    voucher.discount = discount;
    voucher.expirationDate = expirationDate;

    const updatedVoucher = await voucher.save();
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedVoucher, "Cập nhật voucher thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật voucher"));
  }
};

// Xóa voucher (thực hiện xóa thật sự)
export const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findByIdAndDelete(id);
    if (!voucher) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy voucher"));
    }

    res.status(200).json(new ApiResponse(200, null, "Xóa voucher thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa voucher"));
  }
};

// Đánh dấu voucher là đã sử dụng
export const markVoucherAsUsed = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy voucher"));
    }

    voucher.isUsed = true;
    await voucher.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, voucher, "Voucher đã được đánh dấu là đã sử dụng")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        new ApiResponse(500, null, "Lỗi khi đánh dấu voucher là đã sử dụng")
      );
  }
};

// Kiểm tra mã voucher
export const checkVoucherCode = async (req, res) => {
  try {
    const { code } = req.params;

    const voucher = await Voucher.findOne({
      code,
      isUsed: false,
      expirationDate: { $gt: new Date() },
    });
    if (!voucher) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, null, "Voucher không hợp lệ hoặc đã hết hạn")
        );
    }

    res.status(200).json(new ApiResponse(200, voucher, "Voucher hợp lệ"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi kiểm tra voucher"));
  }
};

// Thay đổi trạng thái sử dụng của voucher (toggle)
export const changeVoucherStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy voucher"));
    }

    voucher.isUsed = !voucher.isUsed; // Thay đổi trạng thái
    await voucher.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, voucher, "Thay đổi trạng thái voucher thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi thay đổi trạng thái voucher"));
  }
};
