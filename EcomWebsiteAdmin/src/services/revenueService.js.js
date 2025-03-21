import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tổng doanh thu với phân trang và lọc theo sellerId
export const getRevenueSummary = async (sellerId = "") => {
  try {
    const response = await axios.get(`${API_URL}/revenue/summary`, {
      params: {
        sellerId // Thêm sellerId vào params nếu có
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching revenue summary", error);
    throw error;
  }
};


// Bổ sung hàm để lấy doanh thu hàng ngày theo startDate và endDate
export const getDailyRevenue = async (startDate, endDate, sellerId = "") => {
  try {
    const response = await axios.get(`${API_URL}/revenue/daily`, {
      params: {
        startDate,
        endDate,
        sellerId
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching daily revenue", error);
    throw error;
  }
};
