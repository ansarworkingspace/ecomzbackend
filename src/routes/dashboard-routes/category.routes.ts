import express from "express";

import {
  listCategoriesController,
  addCategoryController,
  editCategoryController,
  deleteCategoryController,
} from "../../controllers/category.controller";
import {
  authenticateToken,
  requireAdmin,
} from "../../middleware/auth.middleware";
import {
  createCategoryValidator,
  listCategoryValidator,
  updateCategoryValidator,
} from "../../validator/category.validator";
import { handleValidationErrors } from "../../validator/user.validator";

const router = express.Router();

// List Categories (with search and pagination)
router.get(
  "/category/list",
  authenticateToken,
  requireAdmin,
  listCategoryValidator,
  handleValidationErrors,
  listCategoriesController
);

// Add Category
router.post(
  "/category/add",
  authenticateToken,
  requireAdmin,
  createCategoryValidator,
  handleValidationErrors,
  addCategoryController
);

// Edit Category
router.put(
  "/category/edit/:id",
  authenticateToken,
  requireAdmin,
  updateCategoryValidator,
  handleValidationErrors,
  editCategoryController
);

// Delete Category
router.delete(
  "/category/delete/:id",
  authenticateToken,
  requireAdmin,
  deleteCategoryController
);

export default router;
