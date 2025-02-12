import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SortByBrand } from "../../../../redux/actions/productActions";
import { GetTitle, IsLoading } from "../../../../redux/actions/primaryActions";
import { getAllBrands } from "../../../../services/brandService";

interface BrandsProps {
  setSelectedBrand: (brandId: number | null) => void;
}

const Brands: React.FC<BrandsProps> = ({ setSelectedBrand }) => {
  const dispatch = useDispatch();
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null); // State để lưu thương hiệu đang được chọn

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        setBrands(response.content);
      } catch (error) {
        console.error("Error fetching brands", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="brands">
      <div className="brands-title">
        <h5>Thương hiệu</h5>
      </div>
      <div className="brands-list">
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <ul>
            <li
              onClick={() => {
                // Nếu đã chọn tất cả (selectedBrandId là null) thì không cho phép click lại
                if (selectedBrandId === null) return;

                setSelectedBrand(null); // Chọn tất cả thương hiệu
                setSelectedBrandId(null); // Xóa trạng thái thương hiệu đã chọn
                dispatch(GetTitle("Tất cả thương hiệu"));
                dispatch(IsLoading(true));
              }}
              style={{
                fontWeight: selectedBrandId === null ? "bold" : "normal", // In đậm khi tất cả thương hiệu được chọn
                pointerEvents: selectedBrandId === null ? "none" : "auto", // Vô hiệu hóa click khi đã chọn tất cả
                opacity: 1, // Giảm độ đậm của chữ khi không cho phép click
              }}
            >
              <label className="d-flex align-items-center">
                Tất cả thương hiệu
              </label>
            </li>
            {brands.map((brand: any) => (
              <li
                key={brand._id}
                onClick={() => {
                  // Nếu đã chọn thương hiệu này, không cho phép click lại
                  if (selectedBrandId === brand._id) return;

                  setSelectedBrand(brand._id);
                  setSelectedBrandId(brand._id); // Cập nhật thương hiệu đã chọn
                  dispatch(GetTitle(brand.brandName));
                  dispatch(SortByBrand(brand.brandName));
                  dispatch(IsLoading(true));
                }}
                style={{
                  fontWeight:
                    selectedBrandId === brand._id ? "bold" : "normal", // In đậm thương hiệu đang được chọn
                  pointerEvents:
                    selectedBrandId === brand._id ? "none" : "auto", // Vô hiệu hóa click nếu đã chọn thương hiệu
                  opacity: 1, // Giảm độ đậm nếu đã chọn
                }}
              >
                <label
                  htmlFor={brand.brandName}
                  className="d-flex align-items-center"
                >
                  {brand.brandName}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Brands;
