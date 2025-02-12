import React from "react";
import ProductCard from "../../ProductCard/ProductCard";
import Pagination from "./Pagination";
import { RiEqualizerLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { ShowSidebarFilter } from "../../../redux/actions/primaryActions";

const ProductsSide: React.FC<any> = ({
  products,
  totalPagesNum,
  currentPage,
  setCurrentPage,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
}) => {
  const productsPerPage = 12;
  const dispatch = useDispatch();

  const handleFilterBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(ShowSidebarFilter(true));
  };

  return (
    <div className="products-side">
      <div className="products-header d-flex">
        <div className="products-found d-flex align-items-center">
          <span>{products.length}</span>
          <p className="m-0">Sản phẩm</p>
        </div>
        <div className="sorting">
          <label className="m-0">Sắp xếp theo:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="productName">Tên sản phẩm (A-Z)</option>
            <option value="price">Giá</option>
          </select>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            className="ml-2"
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>
        <button
          type="button"
          className="filter-btn"
          onClick={handleFilterBtnClick}
        >
          <span>
            <RiEqualizerLine />
          </span>
          <p>Bộ lọc</p>
        </button>
      </div>

      <div className="products">
        <div className="row">
          {products.map((product: any) => (
            <div
              key={product._id}
              className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 col-sm-6"
            >
              <div className="item">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Pagination
        pages={totalPagesNum}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default ProductsSide;
