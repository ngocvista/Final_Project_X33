import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByUserId,
  changeOrderStatus,
} from "../controllers/order.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/create", checkAuth, createOrder);

orderRouter.get("/all", checkAuth, getAllOrders);

orderRouter.get("/user/:userId", checkAuth, getOrdersByUserId);

orderRouter.put("/:orderId/status", checkAuth, changeOrderStatus);

export { orderRouter };
