import express from "express";
const router = express.Router();
import protect from "../middleware/authMiddleware.js";
import {
  getCarts,
  createCarts,
  updateCarts,
  deleteCarts,
} from "../controllers/cart.controller.js";
router.get("/", protect, getCarts);
router.post("/items", protect, createCarts);
router
  .route("/items/:id")
  .patch(protect, updateCarts)
  .delete(protect, deleteCarts);
export default router;
