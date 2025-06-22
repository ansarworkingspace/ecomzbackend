import express from "express";
import {
  authenticateToken,
  requireAdmin,
} from "../../middleware/auth.middleware";
import { handleValidationErrors } from "../../validator/user.validator";
import {
  createProductValidator,
  deleteProductValidator,
  listProductValidator,
  viewProductValidator,
} from "../../validator/product.validator";
import {
  addProductController,
  deleteProductController,
  listProductsController,
  viewProductController,
} from "../../controllers/product.controller";

const router = express.Router();

// List Products (with search and pagination)
router.get(
  "/products/list",
  authenticateToken,
  requireAdmin,
  listProductValidator,
  handleValidationErrors,
  listProductsController
);

// View specific product with full details
router.get(
  "/products/view/:id",
  authenticateToken,
  requireAdmin,
  viewProductValidator,
  handleValidationErrors,
  viewProductController
);

// Add Product with variants
router.post(
  "/products/add",
  authenticateToken,
  requireAdmin,
  createProductValidator,
  handleValidationErrors,
  addProductController
);

// Delete Product (soft delete)
router.delete(
  "/products/delete/:id",
  authenticateToken,
  requireAdmin,
  deleteProductValidator,
  handleValidationErrors,
  deleteProductController
);

export default router;
