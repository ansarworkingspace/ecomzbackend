import express from "express";
import {
  listOrdersController,
  viewOrderController,
  updateOrderStatusController,
  deleteOrderController,
} from "../../controllers/order.controller";
import {
  authenticateToken,
  requireAdmin,
} from "../../middleware/auth.middleware";
import {
  deleteOrderValidator,
  listOrderValidator,
  updateOrderStatusValidator,
  viewOrderValidator,
} from "../../validator/order.validator";
import { handleValidationErrors } from "../../validator/user.validator";

const router = express.Router();

// List Orders (with search and pagination)
router.get(
  "/orders/list",
  authenticateToken,
  requireAdmin,
  listOrderValidator,
  handleValidationErrors,
  listOrdersController
);

// View specific order with full details
router.get(
  "/orders/view/:id",
  authenticateToken,
  requireAdmin,
  viewOrderValidator,
  handleValidationErrors,
  viewOrderController
);

// Update Order Status
router.put(
  "/orders/status/:id",
  authenticateToken,
  requireAdmin,
  updateOrderStatusValidator,
  handleValidationErrors,
  updateOrderStatusController
);

// Delete Order
router.delete(
  "/orders/delete/:id",
  authenticateToken,
  requireAdmin,
  deleteOrderValidator,
  handleValidationErrors,
  deleteOrderController
);

export default router;
