import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả thương hiệu với phân trang, tìm kiếm
export const getAllBrands = async (page = 1, limit = 1000, keyword = "") => {
  try {
    const response = await axios.get(`${API_URL}/brands`, {
      params: {
        keyword,
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching brands", error);
    throw error;
  }
};

// Hàm lấy thương hiệu theo ID
export const getBrandById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/brands/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching brand by ID", error);
    throw error;
  }
};

// Hàm tạo thương hiệu mới
export const createBrand = async (brandName, description, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("brandName", brandName);
    formData.append("description", description);
    formData.append("image", imageFile);

    const response = await axios.post(`${API_URL}/brands`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating brand", error);
    throw error;
  }
};

// Hàm cập nhật thương hiệu theo ID
export const updateBrand = async (id, brandName, description, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("brandName", brandName);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.put(`${API_URL}/brands/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating brand", error);
    throw error;
  }
};

// Hàm xóa thương hiệu theo ID
export const deleteBrand = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/brands/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting brand", error);
    throw error;
  }
};
