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
// router.get("/", getCarts);
router.post("/items", protect, createCarts);
// router.post("/items", createCarts);
router
  .route("/items/:itemId")
  .patch(protect, updateCarts)
  .delete(protect, deleteCarts);
// router.route("/items/:itemId").patch(updateCarts).delete(deleteCarts);
export default router;
