// user.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileToFirebase } from "../services/firebase.service.js";
import nodemailer from "nodemailer";

export const getAllUsers = async (req, res) => {
  try {
    const { searchText, role, active } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Khởi tạo query cơ bản
    const query = { isDelete: false }; // Chỉ lấy người dùng không bị xóa

    // Kiểm tra searchText
    if (searchText) {
      query.username = { $regex: searchText, $options: "i" };
    }

    // Kiểm tra role (nếu có thể có nhiều vai trò)
    if (role) {
      const roles = role.split(","); // Tách các vai trò bằng dấu phẩy
      query.role = { $in: roles }; // Sử dụng $in để lọc theo nhiều vai trò
    }

    // Kiểm tra active
    if (active !== undefined) {
      query.active = active === "true"; // Chuyển chuỗi 'true' thành Boolean
    }

    // Truy vấn người dùng
    const users = await User.find(query).skip(skip).limit(limit);
    const totalElements = await User.countDocuments(query);
    const totalPages = Math.ceil(totalElements / limit);

    // Trả về kết quả phân trang
    const paginationResponse = {
      content: users,
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
          "Lấy danh sách người dùng thành công"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy danh sách người dùng"));
  }
};

// Lấy người dùng theo ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, user, "Lấy người dùng thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy người dùng theo ID"));
  }
};

// Tạo mới người dùng
export const createUser = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, fullName, role, address } =
      req.body;
    const imageFile = req.file;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      fullName,
      role,
      address,
      isDelete: false,
    });

    if (imageFile) {
      const imageUrl = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      user.avatar = imageUrl;
    }

    const savedUser = await user.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedUser, "Tạo người dùng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi tạo người dùng"));
  }
};

// Cập nhật người dùng
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phoneNumber, fullName, role, address } = req.body;
    const imageFile = req.file;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }

    user.username = username;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.fullName = fullName;
    user.role = role;
    user.address = address;

    if (imageFile) {
      const imageUrl = await uploadFileToFirebase(
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      user.avatar = imageUrl;
    }

    const updatedUser = await user.save();
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "Cập nhật người dùng thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật người dùng"));
  }
};
export const approveUserAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { link } = req.body; // Link để đưa vào nội dung email
    const user = await User.findById(id);

    // Kiểm tra nếu người dùng không tồn tại
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }

    // Kiểm tra nếu tài khoản đã được kích hoạt
    if (user.active) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Tài khoản đã được duyệt trước đó"));
    }

    // Duyệt tài khoản (đặt active = true)
    user.active = true;
    await user.save();

    // Gửi email cho người dùng
    const recipientEmail = user.email;

    // Cấu hình transporter cho Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false, // true cho 465, false cho các cổng khác
      auth: {
        user: process.env.EMAIL_USER, // Email của bạn
        pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng của bạn
      },
    });

    // Nội dung email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Email người gửi
      to: recipientEmail, // Email người nhận
      subject: "Tài khoản của bạn đã được duyệt",
      html: `
        <p>Xin chào ${user.fullName || "bạn"},</p>
        <p>Chúng tôi vui mừng thông báo rằng tài khoản của bạn đã được duyệt thành công.</p>
        <p>Giờ đây, bạn có thể đăng nhập và sử dụng dịch vụ của chúng tôi.</p>
        <p>Nhấn vào liên kết dưới đây để truy cập trang tài khoản của bạn:</p>
        <p><a href="${link}">Truy cập tài khoản</a></p>
        <p>Cảm ơn bạn đã đăng ký sử dụng dịch vụ của chúng tôi.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ hỗ trợ</p>
      `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Duyệt tài khoản thành công và gửi email thông báo"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi duyệt tài khoản và gửi email"));
  }
};
// Xóa người dùng
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }

    user.isDelete = true;
    await user.save();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Xóa người dùng thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi xóa người dùng"));
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Kiểm tra nếu người dùng đã gửi `currentPassword` và `newPassword`
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "Vui lòng nhập đầy đủ thông tin mật khẩu")
        );
    }

    // Tìm người dùng theo `id`
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy người dùng"));
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Mật khẩu hiện tại không chính xác"));
    }

    // Băm và lưu mật khẩu mới
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json(new ApiResponse(200, null, "Đổi mật khẩu thành công"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Lỗi khi đổi mật khẩu"));
  }
};
