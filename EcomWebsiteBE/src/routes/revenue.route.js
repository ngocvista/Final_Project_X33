import express from "express";
import {
  getRevenueSummary,
  getDailyOrderAndRevenue,
} from "../controllers/revenue.controller.js";

const revenueRouter = express.Router();

revenueRouter.get("/summary", getRevenueSummary);
revenueRouter.get("/daily", getDailyOrderAndRevenue);

export default revenueRouter;
