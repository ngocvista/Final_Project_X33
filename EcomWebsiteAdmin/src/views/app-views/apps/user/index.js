import {
  Table,
  Button,
  Popconfirm,
  Pagination,
  Input,
  message,
  Spin,
  Card,
  Modal,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllUsers, deleteUser, approveUserAccount } from "services/userService"; // Import service cho user
import { debounce } from "lodash";
import CreateUserModal from "./CreateUserModal"; // Modal cho tạo mới user
import EditUserModal from "./EditUserModal"; // Modal cho chỉnh sửa user

export default function UserManagement() {
  const [users, setUsers] = useState([]); // State lưu trữ danh sách user
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading cho bảng
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [editUserData, setEditUserData] = useState(null); // Dữ liệu để chỉnh sửa user
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Trạng thái của modal tạo mới user
  const [isEditOpen, setIsEditOpen] = useState(false); // Trạng thái của modal chỉnh sửa user
  const [pendingSalerModalVisible, setPendingSalerModalVisible] =
    useState(false); // Trạng thái của modal danh sách saler đang đợi duyệt
  const [pendingSalerList, setPendingSalerList] = useState([]); // Danh sách saler đang đợi duyệt
  const limit = 5; // Số lượng user trên mỗi trang

  // Hàm lấy người dùng
  const fetchUsers = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await getAllUsers(page, limit, search, null, true); // Gọi API lấy user
        setUsers(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy người dùng.");
      } finally {
        setLoading(false); // Dừng loading
      }
    },
    [currentPage, limit]
  );

  // Hàm lấy danh sách saler đang đợi duyệt
  const fetchPendingSalers = async () => {
    setLoading(true); // Bắt đầu loading cho danh sách saler
    try {
      const data = await getAllUsers(1, 1000, "", "SELLER", false); // Gọi API lấy danh sách saler đang đợi duyệt
      setPendingSalerList(data.content); // Lưu danh sách saler vào state
    } catch (error) {
      message.error("Lỗi khi lấy danh sách saler đang đợi duyệt.");
    } finally {
      setLoading(false); // Dừng loading
    }
  };

  // Hàm debounce tìm kiếm
  const debouncedFetchUsers = useCallback(
    debounce((value) => {
      setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
      fetchUsers(value, 1); // Gọi hàm lấy user với trang 1
    }, 800),
    [fetchUsers]
  );

  // Lấy người dùng khi trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    fetchUsers(searchTerm, currentPage); // Gọi lại khi trang hoặc từ khóa tìm kiếm thay đổi
  }, [fetchUsers, currentPage]);

  // Hàm xóa người dùng
  const confirmDeleteUser = async (userId) => {
    try {
      await deleteUser(userId); // Gọi API xóa user
      message.success("Đã xóa người dùng.");
      fetchUsers(); // Lấy lại danh sách user sau khi xóa
    } catch (error) {
      message.error("Lỗi khi xóa người dùng.");
    }
  };
  const activeUserSaller = async (userId) => {
    try {
      // Gọi API duyệt tài khoản
      const link = `http://localhost:3001/auth/login`; // Link dẫn người dùng đến trang tài khoản
      await approveUserAccount(userId, link); // Gọi API approve user
      message.success("Đã duyệt tài khoản thành công.");

      // Lấy lại danh sách user và danh sách pending salers
      fetchUsers();
      fetchPendingSalers();
    } catch (error) {
      message.error("Lỗi khi duyệt người dùng");
    }
  };
  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Hàm xử lý khi click vào nút "Sửa"
  const handleEditClick = (record) => {
    setEditUserData(record); // Lưu trữ dữ liệu user để chỉnh sửa
    setIsEditOpen(true); // Mở modal chỉnh sửa
  };

  // Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: "Tên Người Dùng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Ảnh Đại Diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (text) => (
        <img
          src={text || "https://via.placeholder.com/50"}
          alt="User"
          width={50}
          height={50}
          style={{ borderRadius: "10%" }}
        />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Vai Trò",
      dataIndex: "role",
      key: "role",
      render: (text) => {
        switch (text) {
          case "ADMIN":
            return "Quản trị viên";
          case "STAFF":
            return "Nhân viên";
          case "CUSTOMER":
            return "Khách hàng";
          case "SELLER":
            return "Người bán hàng";
          default:
            return text; // Nếu không khớp, trả về giá trị gốc
        }
      },
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
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => confirmDeleteUser(record._id)}
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
  const columnsSaller = [
    {
      title: "Tên Người Dùng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Ảnh Đại Diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (text) => (
        <img
          src={text || "https://via.placeholder.com/50"}
          alt="User"
          width={50}
          height={50}
          style={{ borderRadius: "10%" }}
        />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Vai Trò",
      dataIndex: "role",
      key: "role",
      render: (text) => {
        switch (text) {
          case "ADMIN":
            return "Quản trị viên";
          case "STAFF":
            return "Nhân viên";
          case "CUSTOMER":
            return "Khách hàng";
          case "SELLER":
            return "Người bán hàng";
          default:
            return text; // Nếu không khớp, trả về giá trị gốc
        }
      },
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center", // Canh giữa cột Hành Động
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Popconfirm
            title="Bạn có chắc muốn duyệt tài khoản người dùng này?"
            onConfirm={() => activeUserSaller(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button size="small" style={{ marginLeft: "10px" }}>
              Duyệt tài khoản
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <Card>
      <div>
        {/* Ô tìm kiếm và nút thêm mới user */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Tìm kiếm người dùng..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
              debouncedFetchUsers(e.target.value); // Gọi hàm tìm kiếm
            }}
            style={{ width: "70%" }}
          />
          <div style={{ display: "flex" }}>
            <Button
              type="primary"
              onClick={() => setIsCreateOpen(true)}
              style={{ marginRight: "10px" }}
            >
              Thêm Mới Người Dùng
            </Button>
            <Button
              type="default"
              onClick={() => {
                fetchPendingSalers(); // Lấy danh sách saler đang đợi duyệt
                setPendingSalerModalVisible(true); // Mở modal danh sách saler
              }}
            >
              Duyệt Tài Khoản Bán Hàng
            </Button>
          </div>
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Bảng user */}
            <Table
              columns={columns}
              dataSource={users}
              pagination={false}
              rowKey={(record) => record.userId}
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
      <CreateUserModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshUsers={fetchUsers}
      />
      <EditUserModal
        visible={isEditOpen}
        userData={editUserData}
        refreshUsers={fetchUsers}
        onCancel={() => setIsEditOpen(false)}
      />

      {/* Modal Duyệt Tài Khoản Bán Hàng */}
      <Modal
        title="Danh Sách Người Bán Đang Đợi Duyệt"
        visible={pendingSalerModalVisible}
        onCancel={() => setPendingSalerModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={columnsSaller}
          dataSource={pendingSalerList}
          pagination={false}
          rowKey={(record) => record._id}
        />
      </Modal>
    </Card>
  );
}
