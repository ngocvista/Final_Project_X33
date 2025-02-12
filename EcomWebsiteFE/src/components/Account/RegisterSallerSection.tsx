import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signup } from "../../services/authService";

const RegisterSallerSection: React.FC = () => {
  const [signupLoading, setSignupLoading] = useState(false); // Trạng thái loading cho nút đăng ký
  const history = useHistory();

  // Schema xác thực đầu vào
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Tên đầy đủ là bắt buộc"),
    username: Yup.string().required("Tên đăng nhập là bắt buộc"),
    password: Yup.string()
      .required("Mật khẩu là bắt buộc")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    email: Yup.string()
      .required("Email là bắt buộc")
      .email("Email không hợp lệ"),
    phoneNumber: Yup.string().required("Số điện thoại là bắt buộc"),
    termsAccepted: Yup.bool().oneOf(
      [true],
      "Bạn phải đồng ý với các điều khoản"
    ), // Thêm xác thực checkbox
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  // Hàm xử lý đăng ký
  const handleSignup = async (data: any) => {
    const { fullName, username, password, email, phoneNumber } = data;
    const userInfo = {
      username,
      password,
      email,
      phoneNumber, // Số điện thoại
      role: "SELLER", // Đặt role là CUSTOMER
      address: null, // Đặt địa chỉ là null
      fullName, // Tên đầy đủ
      isDelete: true, // Tên đầy đủ
    };

    setSignupLoading(true); // Bật trạng thái loading cho nút đăng ký
    try {
      const response = await signup(userInfo);
      const { message: apiMessage } = response;

      if (apiMessage.includes("Username đã tồn tại")) {
        toast.error("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.");
      } else if (apiMessage.includes("Email đã tồn tại")) {
        toast.error("Email đã tồn tại. Vui lòng chọn email khác.");
      } else if (apiMessage.includes("Số điện thoại đã tồn tại")) {
        toast.error("Số điện thoại đã tồn tại. Vui lòng chọn số khác.");
      } else if (apiMessage.includes("Đăng ký người dùng thành công. Vui lòng chờ quản trị viên phê duyệt tài khoản.")) {
        toast.success(
          "Đăng ký người dùng thành công. Vui lòng chờ quản trị viên phê duyệt tài khoản."
        );
        history.push("/");
      } else {
        toast.error("Có lỗi xảy ra khi thêm người dùng.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setSignupLoading(false); // Tắt trạng thái loading sau khi hoàn tất
    }
  };

  return (
    <section id="register">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-8 offset-xl-3 offset-lg-3 offset-md-2">
            <div className="links d-flex justify-content-center">
              <Link to="/register-saller" className="text-dark">
                Đăng ký tài khoản bán hàng
              </Link>
            </div>
            <div className="register-area account-wrapper">
              <h6>Đăng ký tài khoản bán hàng</h6>
              <form onSubmit={handleSubmit(handleSignup)}>
                <div className="inputs-wrapper w-100">
                  <input
                    type="text"
                    className={`w-100 ${errors.fullName ? "error-border" : ""}`}
                    placeholder="Tên đầy đủ"
                    {...register("fullName")}
                  />
                  {errors.fullName && <p>{errors.fullName.message}</p>}
                </div>
                <div className="inputs-wrapper w-100">
                  <input
                    type="text"
                    className={`w-100 ${errors.username ? "error-border" : ""}`}
                    placeholder="Tên đăng nhập"
                    {...register("username")}
                  />
                  {errors.username && <p>{errors.username.message}</p>}
                </div>
                <div className="inputs-wrapper w-100">
                  <input
                    type="password"
                    className={`w-100 ${errors.password ? "error-border" : ""}`}
                    placeholder="Mật khẩu"
                    {...register("password")}
                  />
                  {errors.password && <p>{errors.password.message}</p>}
                </div>
                <div className="inputs-wrapper w-100">
                  <input
                    type="text"
                    className={`w-100 ${errors.password ? "error-border" : ""}`}
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors.password && <p>{errors.password.message}</p>}
                </div>
                <div className="inputs-wrapper w-100">
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    className={`w-100 ${
                      errors.phoneNumber ? "error-border" : ""
                    }`}
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
                </div>
                {/* Thêm checkbox xác nhận */}
                <div className="inputs-wrapper w-100">
                  <label>
                    <input
                      type="checkbox"
                      className={`checkbox ${
                        errors.termsAccepted ? "error-border" : ""
                      }`}
                      style={{ marginRight: "10px" }}
                      {...register("termsAccepted")}
                    />
                    Tôi đồng ý với{" "}
                    <Link to="/terms">Điều khoản và Chính sách</Link>
                  </label>
                  {errors.termsAccepted && (
                    <p>{errors.termsAccepted.message}</p>
                  )}
                </div>

                {/* Dòng lưu ý */}
                <div className="note-wrapper w-100">
                  <p style={{ fontSize: "14px", color: "#888" }}>
                    Lưu ý: Bạn sẽ nhận được cuộc gọi xác nhận tài khoản trước
                    khi tài khoản được duyệt.
                  </p>
                </div>

                <div className="submit-btn login">
                  <input
                    type="submit"
                    style={{ color: "#ffffff" }}
                    className="w-100"
                    value={signupLoading ? "Đang xử lý..." : "Đăng ký"}
                    disabled={signupLoading}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterSallerSection;
