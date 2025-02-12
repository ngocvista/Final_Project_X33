import React, { useState } from "react";
import { SocialMediaData } from "../../Other/SocialMediaData";
import { FiBarChart2 } from "react-icons/fi";
import { BsHeart } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AddToCart,
  MakeIsInCartTrue,
} from "../../../redux/actions/cartActions";
import {
  AddToWishlist,
  MakeIsInWishlistTrueInWishlist,
} from "../../../redux/actions/wishlistActions";
import {
  AddToCompare,
  MakeIsInCompareTrueInCompare,
} from "../../../redux/actions/compareActions";
import { toast } from "react-toastify";
import { RootState } from "../../../redux/reducers/index";
import Rating from "../../Other/Rating";
import { formatCurrency } from "../../../utils/currencyFormatter";

// Định nghĩa kiểu dữ liệu cho biến thể
interface Variation {
  _id: number;
  attributeName: string;
  attributeValue: string;
  price: number;
  quantity: number;
}

const ProductInfo: React.FC<any> = ({ product }) => {
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    product?.variations ? product?.variations[0] : null
  ); // Biến thể được chọn mặc định là cái đầu tiên
  const cartState = useSelector((state: RootState) => state.cart);
  const wishlistState = useSelector((state: RootState) => state.wishlist);
  const compareState = useSelector((state: RootState) => state.compare);
  const cart = cartState.cart;
  const wishlist = wishlistState.wishlist;
  const compare = compareState.compare;
  const dispatch = useDispatch();

  cart.map(
    (cartProduct: any) =>
      cartProduct._id === product._id && (product.isInCart = true)
  );
  wishlist.map(
    (wishlistProduct: any) =>
      wishlistProduct._id === product._id && (product.isInWishlist = true)
  );
  compare.map(
    (compareProduct: any) =>
      compareProduct._id === product._id && (product.isInCompare = true)
  );

  // Xử lý khi chọn biến thể
  const handleVariationChange = (variation: Variation) => {
    setSelectedVariation(variation);
  };

  const displayedPrice = selectedVariation?.price
    ? selectedVariation.price * (1 - product.discount / 100) // Nếu có biến thể, tính theo giá biến thể và discount
    : product.price
    ? product.price * (1 - product.discount / 100)
    : 0; // Nếu không có biến thể, tính theo giá sản phẩm và discount

  // Group variations by attributeName
  const groupedVariations = product?.variations?.reduce(
    (acc: any, variation: Variation) => {
      if (!acc[variation.attributeName]) {
        acc[variation.attributeName] = [];
      }
      acc[variation.attributeName].push(variation);
      return acc;
    },
    {}
  );

  return (
    <div className="product-info">
      {/* ===== Tiêu đề và xếp hạng ===== */}
      <div className="title-and-rating">
        <h5>{product?.productName}</h5>
        <p className="d-flex">
          <Rating value={product?.avgRating} />
          <small className="review-count text-muted">
            ({product?.reviewCount} đánh giá)
          </small>
        </p>
      </div>
      <div className="price-and-description">
        <div className="price">
          {/* Nếu có discount và có giá cũ (từ selectedVariation hoặc product.price), hiển thị giá cũ */}
          {(selectedVariation?.price || product?.price) &&
            product?.discount && (
              <p className="old-price d-flex">
                <del>
                  {formatCurrency(selectedVariation?.price ?? product.price)}
                </del>
              </p>
            )}

          {/* Hiển thị giá mới sau khi đã tính discount */}
          <p className="new-price">
            {formatCurrency(
              selectedVariation?.price
                ? displayedPrice
                : product?.discount
                ? product.price * (1 - product.discount / 100)
                : product.price
            )}
          </p>
        </div>
      </div>

      {/* ===== Biến thể (Variations) ===== */}
      <div className="variations">
        {/* Render variations grouped by attributeName */}
        {Object.keys(groupedVariations).map((attributeName) => (
          <div key={attributeName} className="variation-group mt-3">
            <p className="attribute-name">
              <strong>{attributeName}:</strong>
            </p>
            <div className="variation-options d-flex flex-wrap mt-2">
              {groupedVariations[attributeName].map((variation: Variation) => (
                <div
                  key={variation._id}
                  className={`variation-option ${
                    selectedVariation?._id === variation._id ? "selected" : ""
                  }`}
                  onClick={() => handleVariationChange(variation)}
                  style={{
                    border:
                      selectedVariation?._id === variation._id
                        ? "2px solid red"
                        : "1px solid grey",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    margin: "5px",
                    textAlign: "center",
                    width: "100px", // Adjust width to make them look nice
                  }}
                >
                  <p>{variation.attributeValue}</p>
                </div>
              ))}
            </div>
            {/* Divider between different attribute groups */}
            <hr style={{ width: "100%", margin: "10px 0" }} />
          </div>
        ))}
      </div>

      {/* ===== Số lượng và nút thêm vào giỏ hàng ===== */}
      <div className="quantity-and-buttons">
        <div className="top-btns">
          <div className="quantity-wrapper top-btn">
            <div className="quantity-area d-flex align-items-center">
              <button className="minus-btn" disabled>
                −
              </button>
              <input type="text" readOnly value={1} />
              <button className="plus-btn" disabled>
                +
              </button>
            </div>
          </div>
          <div className="add-to-cart-btn top-btn">
            {/* Nút thêm vào giỏ hàng */}
            <button
              type="button"
              style={{
                backgroundColor: "#d91f28",
              }}
              title="Thêm vào giỏ hàng"
              onClick={() => {
                dispatch(
                  AddToCart({
                    ...product,
                    selectedAttribute: selectedVariation?.attributeValue, // Lưu giá trị biến thể được chọn
                    selectedPrice: selectedVariation?.price, // Lưu giá của biến thể được chọn
                  })
                );
                dispatch(MakeIsInCartTrue(product._id));
                toast.success(
                  '"' +
                    product.productName +
                    '" đã được thêm vào giỏ hàng với lựa chọn "' +
                    selectedVariation?.attributeValue +
                    '"'
                );
              }}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
          <div className="small-btns d-flex">
            <div className="wishlist-btn top-btn">
              {product.isInWishlist ? (
                <button
                  type="button"
                  title="Đã thêm vào Wishlist"
                  className="disabledBtn"
                  disabled
                >
                  <BsHeart />
                </button>
              ) : (
                <button
                  type="button"
                  title="Thêm vào Wishlist"
                  onClick={() => {
                    dispatch(AddToWishlist(product));
                    dispatch(MakeIsInWishlistTrueInWishlist(product._id));
                    toast.success(
                      '"' + product.productName + '" đã được thêm vào Wishlist.'
                    );
                  }}
                >
                  <BsHeart />
                </button>
              )}
            </div>
            <div className="compare-btn top-btn">
              {product.isInCompare ? (
                <button
                  type="button"
                  title="Đã thêm vào so sánh"
                  className="disabledBtn"
                  disabled
                >
                  <FiBarChart2 />
                </button>
              ) : (
                <button
                  type="button"
                  title="Thêm vào so sánh"
                  onClick={() => {
                    dispatch(AddToCompare(product));
                    dispatch(MakeIsInCompareTrueInCompare(product._id));
                    toast.success(
                      '"' + product.productName + '" đã được thêm vào so sánh.'
                    );
                  }}
                >
                  <FiBarChart2 />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== SKU, Danh mục, Thương hiệu ===== */}
      <div className="sku-tags-and-categories">
        <div className="sku">
          <span>SKU:</span>
          <p>{product._id}</p>
        </div>
        <div className="brand">
          <span>Danh mục: {product.category?.categoryName}</span>
          <p></p>
        </div>
        <div className="brand">
          <span>Thương hiệu: {product.brand?.brandName}</span>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
