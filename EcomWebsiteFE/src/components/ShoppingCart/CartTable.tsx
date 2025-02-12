import React, { useState } from "react";
import { ICartProps } from "../../types/types";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/currencyFormatter"; // Hàm format tiền tệ
import { toast } from "react-toastify";
import {
  DeleteFromCart,
  IncreaseProductCount,
  DecreaseProductCount,
} from "../../redux/actions/cartActions";
import { MakeIsInCartFalse } from "../../redux/actions/productActions";
import { WishlistProductIsInCartFalse } from "../../redux/actions/wishlistActions";
import { CompareProductIsInCartFalse } from "../../redux/actions/compareActions";
import { useDispatch } from "react-redux";
import { checkStockProduct } from "../../services/productService"; // Assuming this service exists

const CartTable: React.FC<ICartProps> = (props) => {
  const { cart } = props;
  const [size] = useState<number>(1);
  const dispatch = useDispatch();

  // Combine products with the same _id and calculate total quantity
  const combinedCart = cart.reduce((acc: any[], product: any) => {
    const existingProduct = acc.find(
      (item) =>
        item._id === product._id &&
        item.selectedAttribute === product.selectedAttribute
    );
    if (existingProduct) {
      existingProduct.count += product.count; // Combine quantities
    } else {
      acc.push({ ...product }); // Add new product to the list
    }
    return acc;
  }, []);

  // Calculate the total count for each product by _id (ignore selectedAttribute)
  const totalQuantityById = cart.reduce(
    (acc: Record<string, number>, product: any) => {
      acc[product._id] = (acc[product._id] || 0) + product.count;
      return acc;
    },
    {}
  );

  // Check stock availability for a product
  const checkStockAndUpdate = async (product: any, action: string) => {
    try {
      // Calculate total quantity of all products with the same _id
      const totalQuantity = totalQuantityById[product._id];

      const response = await checkStockProduct([
        { productId: product._id, quantity: totalQuantity },
      ]);

      if (response) {
        const stock = response.payload[0].availableStock;

        if (action === "increase" && totalQuantity + 1 > stock) {
          toast.error(`Không đủ tồn kho cho sản phẩm "${product.productName}"`);
        } else if (action === "decrease" && product.count <= 1) {
          return; // Prevent decreasing if the count is 1
        } else {
          // Proceed with updating the cart
          if (action === "increase") {
            dispatch(IncreaseProductCount(product));
          } else if (action === "decrease") {
            dispatch(DecreaseProductCount(product));
          }
        }
      } else {
        toast.error("Lỗi khi kiểm tra tồn kho, vui lòng thử lại.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi kiểm tra tồn kho, vui lòng thử lại.");
    }
  };

  return (
    <div className="cart-table">
      <table className="w-100">
        {/* ======= Tiêu đề bảng ======= */}
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
            <th>Xóa</th>
          </tr>
        </thead>
        {/* ======= Nội dung bảng ======= */}
        <tbody>
          {combinedCart.map((product: any) => {
            // Tính giá sau khi giảm giá
            const discountedPrice = product.selectedPrice
              ? product.selectedPrice * (1 - product.discount / 100)
              : product.price * (1 - product.discount / 100);

            return (
              <tr key={product._id + product.selectedAttribute}>
                <td>
                  <div className="product-img-title d-flex align-items-center">
                    {/* ======= Ảnh sản phẩm ======= */}
                    <div className="product-img">
                      <Link to={`/product-details/${product._id}`}>
                        <img
                          className="img-fluid"
                          src={product.images[0]?.imageUrl}
                          alt={product.productName}
                        />
                      </Link>
                    </div>
                    {/* ======= Tên sản phẩm ======= */}
                    <div className="product-title">
                      <h6>
                        <Link
                          style={{ color: "#d91f28" }}
                          to={`/product-details/${product._id}`}
                        >
                          {product.productName}
                        </Link>
                      </h6>

                      {/* Display the selected attribute below the product name */}
                      <p
                        style={{
                          color: "#777",
                          fontSize: "14px",
                          margin: "5px 0",
                        }}
                      >
                        Lựa chọn:{" "}
                        {product.selectedAttribute
                          ? product.selectedAttribute
                          : "Không có"}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  {/* ======= Giá sản phẩm ======= */}
                  <div className="product-price">
                    {product.discount ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {/* Giá gốc gạch ngang */}
                        <p
                          style={{
                            margin: "0",
                            color: "gray",
                            textDecoration: "line-through",
                            marginRight: "10px", // Tạo khoảng cách giữa giá gốc và giá đã giảm
                          }}
                        >
                          {formatCurrency(
                            product.selectedPrice || product.price,
                            "VND"
                          )}{" "}
                          đ
                        </p>
                        {/* Giá sau khi giảm */}
                        <p
                          style={{
                            margin: "0",
                            color: "red",
                            fontWeight: "bold",
                          }}
                        >
                          {formatCurrency(discountedPrice, "VND")} đ
                        </p>
                      </div>
                    ) : (
                      <p style={{ margin: "0", fontWeight: "bold" }}>
                        {formatCurrency(product.selectedPrice || product.price)}
                      </p>
                    )}
                  </div>
                </td>

                <td>
                  {/* ======= Số lượng ======= */}
                  <div
                    className="quantity-wrapper"
                    style={{
                      display: "flex", // Đặt phần tử con theo hàng ngang
                      alignItems: "center", // Căn giữa theo chiều dọc
                      justifyContent: "center", // Căn giữa theo chiều ngang
                    }}
                  >
                    {/* Nút giảm số lượng */}
                    <button
                      type="button"
                      onClick={() => checkStockAndUpdate(product, "decrease")}
                      disabled={product.count === 1} // Vô hiệu hóa nếu số lượng là 1
                      style={{
                        backgroundColor: product.count === 1 ? "#ccc" : "#ccc",
                        color: "#000",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        fontSize: "16px",
                        cursor: product.count === 1 ? "not-allowed" : "pointer",
                        marginRight: "5px",
                        width: "40px", // Đặt kích thước cố định cho nút
                        height: "40px",
                      }}
                    >
                      -
                    </button>

                    {/* Hiển thị số lượng sản phẩm */}
                    <div className="quantity-area d-flex align-items-center">
                      <input
                        type="text"
                        size={size}
                        readOnly
                        value={product.count}
                      />
                    </div>

                    {/* Nút tăng số lượng */}
                    <button
                      type="button"
                      onClick={() => checkStockAndUpdate(product, "increase")}
                      style={{
                        backgroundColor: "#d91f28",
                        color: "#ffffff",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        fontSize: "16px",
                        cursor: "pointer",
                        marginLeft: "10px",
                        width: "40px", // Đặt kích thước cố định cho nút
                        height: "40px",
                      }}
                    >
                      +
                    </button>
                  </div>
                </td>

                <td>
                  {/* ======= Tổng tiền ======= */}
                  <p className="total-price m-0">
                    {formatCurrency(discountedPrice * product.count)}
                  </p>
                </td>
                <td>
                  {/* ======= Nút xóa ======= */}
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      dispatch(
                        DeleteFromCart({
                          _id: product._id,
                          selectedAttribute: product.selectedAttribute,
                        })
                      );
                      dispatch(MakeIsInCartFalse(product._id));
                      dispatch(WishlistProductIsInCartFalse(product._id));
                      dispatch(CompareProductIsInCartFalse(product._id));
                      toast.error(
                        '"' +
                          product.productName +
                          '" đã được xoá khỏi giỏ hàng.'
                      );
                    }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
