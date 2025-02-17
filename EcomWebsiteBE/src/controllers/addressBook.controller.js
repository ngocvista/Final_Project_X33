// addressBook.controller.js
import AddressBook from "../models/addressBook.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Lấy danh sách AddressBook theo userId
export const getAddressBookByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "ID người dùng không hợp lệ"));
    }

    const addressBooks = await AddressBook.find({ user: userId });

    res
      .status(200)
      .json(
        new ApiResponse(200, addressBooks, "Lấy danh sách địa chỉ thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách địa chỉ"));
  }
};

// Tạo mới AddressBook
export const createAddressBook = async (req, res) => {
  try {
    const { userId } = req.params;
    const { recipientName, phoneNumber, address, ward, district, city, email } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "ID người dùng không hợp lệ"));
    }

    const newAddressBook = new AddressBook({
      user: userId,
      recipientName,
      phoneNumber,
      address,
      ward,
      district,
      city,
      email,
    });

    const createdAddressBook = await newAddressBook.save();
    res
      .status(201)
      .json(
        new ApiResponse(201, createdAddressBook, "Tạo địa chỉ mới thành công")
      );
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo địa chỉ mới"));
  }
};

// Cập nhật AddressBook
export const updateAddressBook = async (req, res) => {
  try {
    const { addressBookId } = req.params;
    const { recipientName, phoneNumber, address, ward, district, city, email } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(addressBookId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "ID địa chỉ không hợp lệ"));
    }

    const updatedAddressBook = await AddressBook.findByIdAndUpdate(
      addressBookId,
      { recipientName, phoneNumber, address, ward, district, city, email },
      { new: true }
    );

    if (!updatedAddressBook) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy địa chỉ"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedAddressBook, "Cập nhật địa chỉ thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật địa chỉ"));
  }
};

// Xóa AddressBook
export const deleteAddressBook = async (req, res) => {
  try {
    const { addressBookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressBookId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "ID địa chỉ không hợp lệ"));
    }

    const deletedAddressBook = await AddressBook.findByIdAndDelete(
      addressBookId
    );

    if (!deletedAddressBook) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy địa chỉ"));
    }

    res.status(200).json(new ApiResponse(200, null, "Xóa địa chỉ thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa địa chỉ"));
  }
};
