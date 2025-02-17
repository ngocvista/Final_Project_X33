import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import moment from "moment";

// Hàm để tính toán tổng doanh thu trong khoảng thời gian cho sản phẩm của seller
const calculateTotalRevenue = async (start, end, sellerId = null) => {
  const matchConditions = {
    date: { $gte: start, $lt: end },
    status: 'Đã giao hàng' // Chỉ tính doanh thu cho các đơn hàng đã giao hàng
  };

  const result = await Order.aggregate([
    { $match: matchConditions },
    {
      $lookup: {
        from: 'orderdetails',
        localField: 'orderDetails',
        foreignField: '_id',
        as: 'orderDetailsData'
      }
    },
    { $unwind: '$orderDetailsData' },
    {
      $lookup: {
        from: 'products',
        localField: 'orderDetailsData.product',
        foreignField: '_id',
        as: 'productData'
      }
    },
    { $unwind: '$productData' },
    ...(sellerId ? [{ $match: { 'productData.sellerId': new mongoose.Types.ObjectId(sellerId) } }] : []),
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $multiply: ['$orderDetailsData.price', '$orderDetailsData.quantity'] } }
      }
    },
  ]);

  return result.length > 0 ? result[0].totalRevenue : 0;
};

// Lấy tóm tắt doanh thu
export const getRevenueSummary = async (req, res) => {
  try {
    const { sellerId } = req.query; // Lấy sellerId từ query nếu có

    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();
    const yesterdayStart = moment().subtract(1, "days").startOf("day").toDate();
    const yesterdayEnd = moment().subtract(1, "days").endOf("day").toDate();
    const monthStart = moment().startOf("month").toDate();
    const lastMonthStart = moment().subtract(1, "month").startOf("month").toDate();
    const lastMonthEnd = moment().subtract(1, "month").endOf("month").toDate();
    const yearStart = moment().startOf("year").toDate();
    const lastYearStart = moment().subtract(1, "year").startOf("year").toDate();
    const lastYearEnd = moment().subtract(1, "year").endOf("year").toDate();

    // Tính toán doanh thu cho sản phẩm của seller
    const todayRevenue = await calculateTotalRevenue(todayStart, todayEnd, sellerId);
    const yesterdayRevenue = await calculateTotalRevenue(yesterdayStart, yesterdayEnd, sellerId);
    const monthlyRevenue = await calculateTotalRevenue(monthStart, todayEnd, sellerId);
    const lastMonthRevenue = await calculateTotalRevenue(lastMonthStart, lastMonthEnd, sellerId);
    const yearlyRevenue = await calculateTotalRevenue(yearStart, todayEnd, sellerId);
    const lastYearRevenue = await calculateTotalRevenue(lastYearStart, lastYearEnd, sellerId);

    // Thống kê tổng sản phẩm, đơn hàng và người dùng
    const productQuery = { isDelete: false };
    if (sellerId) {
      productQuery.sellerId = sellerId;
    }

    const totalProducts = await Product.countDocuments(productQuery);
    const totalOrders = await Order.countDocuments({ status: 'Đã giao hàng' }); // Chỉ lấy các đơn hàng đã giao hàng
    const totalUsers = await User.countDocuments({ isDelete: false });

    // Tính toán phần trăm tăng trưởng
    const todayIncreasePercentage =
      yesterdayRevenue > 0
        ? ((todayRevenue - yesterdayRevenue) * 100) / yesterdayRevenue
        : 0;
    const monthlyIncreasePercentage =
      lastMonthRevenue > 0
        ? ((monthlyRevenue - lastMonthRevenue) * 100) / lastMonthRevenue
        : 0;
    const yearlyIncreasePercentage =
      lastYearRevenue > 0
        ? ((yearlyRevenue - lastYearRevenue) * 100) / lastYearRevenue
        : 0;

    res.status(200).json({
      todayRevenue,
      yesterdayRevenue,
      todayIncreasePercentage,
      monthlyRevenue,
      lastMonthRevenue,
      monthlyIncreasePercentage,
      yearlyRevenue,
      lastYearRevenue,
      yearlyIncreasePercentage,
      totalProducts,
      totalOrders,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching revenue summary:", error);
    res.status(500).json({ message: "Failed to fetch revenue summary" });
  }
};

export const getDailyOrderAndRevenue = async (req, res) => {
  try {
    const { startDate, endDate, sellerId } = req.query;
    const start = moment(startDate).startOf("day").toDate();
    const end = moment(endDate).endOf("day").toDate();

    // Cấu hình match điều kiện cho sellerId nếu có
    const matchConditions = {
      date: { $gte: start, $lte: end },
      status: "Đã giao hàng", // Chỉ tính đơn hàng đã giao hàng
    };

    // Nếu có sellerId thì lọc thêm theo sellerId
    if (sellerId) {
      // Tìm các sản phẩm của seller
      const productsOfSeller = await Product.find({ sellerId }).select("_id");

      // In ra để kiểm tra sản phẩm của seller
      console.log("Products of Seller:", productsOfSeller);

      // Nếu không có sản phẩm nào của seller, trả về ngay
      if (productsOfSeller.length === 0) {
        return res.status(200).json({ series: [], categories: [] });
      }

      // Lọc các đơn hàng chỉ chứa sản phẩm của seller
      // matchConditions["orderDetails"] = {
      //   $elemMatch: {
      //     product: { $in: productsOfSeller.map((p) => p._id) }, // Lọc theo sản phẩm của sellerId
      //   },
      // };
    }

    // Thực hiện aggregation
    const results = await Order.aggregate([
      { $match: matchConditions },
      {
        $lookup: {
          from: "orderdetails",
          localField: "orderDetails",
          foreignField: "_id",
          as: "orderDetailsData",
        },
      },
      { $unwind: "$orderDetailsData" },
      {
        $lookup: {
          from: "products",
          localField: "orderDetailsData.product",
          foreignField: "_id",
          as: "productData",
        },
      },
      { $unwind: "$productData" },
      ...(sellerId
        ? [
            {
              $match: {
                "productData.sellerId": new mongoose.Types.ObjectId(sellerId),
              },
            },
          ]
        : []),
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $add: ["$date", 7 * 60 * 60 * 1000] }, // Chuyển date sang UTC+7
            },
          },
          orderCount: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $multiply: ["$orderDetailsData.price", "$orderDetailsData.quantity"],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // In ra kết quả để debug
    console.log("Results:", results);

    if (!results || results.length === 0) {
      return res.status(200).json({ series: [], categories: [] });
    }

    const categories = results.map((r) => r._id);
    const orderCounts = results.map((r) => r.orderCount);
    const revenues = results.map((r) => r.totalRevenue);

    res.status(200).json({
      series: [
        { name: "Số sản phẩm", data: orderCounts },
        { name: "Doanh thu", data: revenues },
      ],
      categories,
    });
  } catch (error) {
    console.error("Error fetching daily order and revenue:", error);
    res.status(500).json({ message: "Failed to fetch daily order and revenue" });
  }
};




