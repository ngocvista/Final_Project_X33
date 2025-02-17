import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "./email.controller.js";

export const register = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, role, address, fullName } =
      req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !username ||
      !password ||
      !email ||
      !phoneNumber ||
      !role ||
      !fullName
    ) {
      return res
        .status(400)
        .send(new ApiResponse(400, null, "Thiếu các trường bắt buộc"));
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .send(new ApiResponse(400, null, "Định dạng email không hợp lệ"));
    }

    // Kiểm tra sự tồn tại của email và số điện thoại
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(409)
        .send(new ApiResponse(409, null, "Người dùng với email đã tồn tại"));
    }

    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
      return res
        .status(409)
        .send(
          new ApiResponse(409, null, "Người dùng với số điện thoại đã tồn tại")
        );
    }

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Đặt active thành false nếu vai trò là STAFF, CUSTOMER hoặc SELLER
    const isActive = role === "STAFF" || role === "SELLER" ? false : true;

    // Tạo người dùng mới
    const createdUser = await User.create({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      role,
      address,
      fullName,
      active: isActive,
    });

    const userResponse = await User.findById(createdUser._id).select(
      "-password -__v"
    );

    res
      .status(201)
      .send(
        new ApiResponse(
          201,
          { user: userResponse },
          "Đăng ký người dùng thành công. Vui lòng chờ quản trị viên phê duyệt tài khoản."
        )
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(new ApiResponse(500, error, "Đăng ký người dùng thất bại"));
  }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!username || !password) {
      return res
        .status(400)
        .send(new ApiResponse(400, null, "Thiếu các trường bắt buộc"));
    }

    // Tìm người dùng theo username
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .send(
          new ApiResponse(
            404,
            null,
            "Không tồn tại người dùng với username này, vui lòng đăng ký trước!"
          )
        );
    }

    // Kiểm tra trạng thái kích hoạt
    if (!user.active) {
      return res
        .status(403)
        .send(
          new ApiResponse(
            403,
            null,
            "Tài khoản chưa được kích hoạt. Vui lòng chờ quản trị viên phê duyệt."
          )
        );
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .send(
          new ApiResponse(401, null, "Thông tin đăng nhập không chính xác")
        );
    }

    // Tạo token truy cập với payload chứa thông tin user
    const jwtToken = user.generateAccessToken();

    // Tạo đối tượng userResponse với các trường cần thiết
    const userResponse = {
      userId: user._id,
      username: user.username,
      password: user.password,
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      avatar: user.avatar,
      resetPasswordToken: user.resetPasswordToken,
      role: user.role,
      address: user.address,
      isDelete: user.isDelete,
      enabled: !user.isDelete,
      authorities: [], // Mảng quyền hạn, nếu cần
      accountNonLocked: true,
      accountNonExpired: true,
      credentialsNonExpired: true,
    };

    // Trả về phản hồi theo định dạng yêu cầu
    res.status(200).send({
      statusCode: 200,
      payload: [{ jwtToken }, userResponse],
      message: "Đăng nhập thành công",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(new ApiResponse(500, error, "Đăng nhập thất bại"));
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra sự tồn tại của email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send(
          new ApiResponse(404, null, "Không tìm thấy người dùng với email này")
        );
    }

    // Tạo token reset mật khẩu
    const resetToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h", // Token hết hạn sau 1 giờ
    });

    // Lưu token vào user model để xác minh sau này
    user.resetPasswordToken = resetToken;
    await user.save();

    // Gửi email reset mật khẩu (sử dụng email service)
    await sendResetPasswordEmail(user.email, resetToken);

    res
      .status(200)
      .send(
        new ApiResponse(
          200,
          null,
          "Token đặt lại mật khẩu đã được gửi tới email của bạn"
        )
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(
        new ApiResponse(
          500,
          error,
          "Đã xảy ra lỗi khi yêu cầu đặt lại mật khẩu"
        )
      );
  }
};

// Endpoint: Đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Xác minh token reset mật khẩu
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;

    // Tìm người dùng và kiểm tra token hợp lệ
    const user = await User.findById(userId);
    if (!user || user.resetPasswordToken !== token) {
      return res
        .status(400)
        .send(new ApiResponse(400, null, "Token không hợp lệ hoặc đã hết hạn"));
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu và xóa token reset
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    await user.save();

    res
      .status(200)
      .send(
        new ApiResponse(
          200,
          null,
          "Mật khẩu của bạn đã được cập nhật thành công"
        )
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(new ApiResponse(500, error, "Đặt lại mật khẩu thất bại"));
  }
};
