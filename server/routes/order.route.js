import express from "express";
const router = express.Router();
import protect from "../middleware/authMiddleware.js";
import {
  getAllOrder,
  getMyorder,
  updateOrder,
  createOrder,
} from "../controllers/order.controller.js";
router.route("/").get(protect, getAllOrder).post(protect, createOrder);
router.get("/my-orders", protect, getMyorder);
router.patch("/:id/:status", protect, updateOrder);
export default router;
