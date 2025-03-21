import {
  Table,
  Button,
  Popconfirm,
  Pagination,
  Input,
  message,
  Spin,
  Card,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllBrands, deleteBrand } from "services/brandService";
import { debounce } from "lodash";
import CreateBrandModal from "./CreateBrandModal";
import EditBrandModal from "./EditBrandModal";

export default function BrandManagement() {
  const [brands, setBrands] = useState([]); // State lưu trữ danh sách thương hiệu
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading cho bảng
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [editBrandData, setEditBrandData] = useState(null); // Dữ liệu để chỉnh sửa thương hiệu
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Trạng thái của modal tạo mới thương hiệu
  const [isEditOpen, setIsEditOpen] = useState(false); // Trạng thái của modal chỉnh sửa thương hiệu
  const limit = 5; // Số lượng thương hiệu trên mỗi trang

  // Hàm lấy thương hiệu
  const fetchBrands = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await getAllBrands(page, limit, search); // Gọi API lấy thương hiệu
        setBrands(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy thương hiệu.");
      } finally {
        setLoading(false); // Dừng loading
      }
    },
    [currentPage, limit]
  );

  // Hàm debounce tìm kiếm
  const debouncedFetchBrands = useCallback(
    debounce((value) => {
      setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
      fetchBrands(value, 1); // Gọi hàm lấy thương hiệu với trang 1
    }, 800),
    [fetchBrands]
  );

  // Lấy thương hiệu khi trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    fetchBrands(searchTerm, currentPage); // Gọi lại khi trang hoặc từ khóa tìm kiếm thay đổi
  }, [fetchBrands, currentPage]);

  // Hàm xóa thương hiệu
  const confirmDeleteBrand = async (brandId) => {
    try {
      await deleteBrand(brandId); // Gọi API xóa thương hiệu
      message.success("Đã xóa thương hiệu.");
      fetchBrands(); // Lấy lại thương hiệu sau khi xóa
    } catch (error) {
      message.error("Lỗi khi xóa thương hiệu.");
    }
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Hàm xử lý khi click vào nút "Sửa"
  const handleEditClick = (record) => {
    setEditBrandData(record); // Lưu trữ dữ liệu thương hiệu để chỉnh sửa
    setIsEditOpen(true); // Mở modal chỉnh sửa
  };

  // Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: "Tên Thương Hiệu",
      dataIndex: "brandName",
      key: "brandName",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img
          src={text || "https://via.placeholder.com/50"}
          alt="Thương hiệu"
          width={80}
          height={50}
          style={{ borderRadius: "10%" }}
        />
      ),
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center", // Canh giữa cột Hành Động
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEditClick(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa thương hiệu này?"
            onConfirm={() => confirmDeleteBrand(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button size="small" style={{ marginLeft: "10px" }}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div>
        {/* Ô tìm kiếm và nút thêm mới thương hiệu */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Tìm kiếm thương hiệu..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
              debouncedFetchBrands(e.target.value); // Gọi hàm tìm kiếm
            }}
            style={{ width: "75%" }}
          />
          <Button type="primary" onClick={() => setIsCreateOpen(true)}>
            Thêm Mới Thương Hiệu
          </Button>
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Bảng thương hiệu */}
            <Table
              columns={columns}
              dataSource={brands}
              pagination={false}
              rowKey={(record) => record._id}
            />

            {/* Phân trang */}
            <Pagination
              current={currentPage}
              total={totalPages * limit}
              pageSize={limit}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        )}
      </div>
      <CreateBrandModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshBrands={fetchBrands} // Hàm cập nhật danh sách thương hiệu
      />
      <EditBrandModal
        visible={isEditOpen}
        brandData={editBrandData}
        refreshBrands={fetchBrands} // Hàm cập nhật danh sách thương hiệu
        onCancel={() => setIsEditOpen(false)}
      />
    </Card>
  );
}
