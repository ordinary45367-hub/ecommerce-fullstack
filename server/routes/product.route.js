import express from "express";
import {
  getProducts,
  getProductsById,
  createProducts,
  updateProducts,
  deleteProducts,
} from "../controllers/product.controller.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductsById);
router.post("/", protect, createProducts);
router.patch("/:id", protect, updateProducts);
router.delete("/:id", protect, deleteProducts);

export default router;
