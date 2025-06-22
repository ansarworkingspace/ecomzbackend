import express from "express";
import {
  authenticateToken,
  requireAdmin,
} from "../../middleware/auth.middleware";
import {
  createOptionValidator,
  listOptionValidator,
  updateOptionValidator,
} from "../../validator/option.validator";
import { handleValidationErrors } from "../../validator/user.validator";
import {
  addOptionController,
  deleteOptionController,
  editOptionController,
  listOptionsController,
} from "../../controllers/option.controller";
const router = express.Router();

// List Options (with search and pagination)
router.get(
  "/options/list",
  authenticateToken,
  requireAdmin,
  listOptionValidator,
  handleValidationErrors,
  listOptionsController
);

// Add Option
router.post(
  "/options/add",
  authenticateToken,
  requireAdmin,
  createOptionValidator,
  handleValidationErrors,
  addOptionController
);

// Edit Option
router.put(
  "/options/edit/:id",
  authenticateToken,
  requireAdmin,
  updateOptionValidator,
  handleValidationErrors,
  editOptionController
);

// Delete Option
router.delete(
  "/options/delete/:id",
  authenticateToken,
  requireAdmin,
  deleteOptionController
);

export default router;
