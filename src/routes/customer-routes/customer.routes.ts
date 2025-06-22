import express from "express";
import {
  createOrderValidator,
  listOrdersValidator,
  listProductsValidator,
  viewOrderValidator,
  viewProductValidator,
} from "../../validator/customer.validator";
import { handleValidationErrors } from "../../validator/user.validator";
import {
  addOrderController,
  fetchAddressesController,
  listCustomerOrdersController,
  listProductsController,
  viewCustomerOrderController,
  viewProductController,
} from "../../controllers/customer.controller";
import { authenticateToken } from "../../middleware/auth.middleware";
import { listCategoryValidator } from "../../validator/category.validator";
import { listCategoriesController } from "../../controllers/category.controller";

const router = express.Router();

// List Products (with search, pagination, filtering)
router.get(
  "/products/list",
  listProductsValidator,
  handleValidationErrors,
  listProductsController
);

// View specific product with variants
router.get(
  "/products/view/:id",
  viewProductValidator,
  handleValidationErrors,
  viewProductController
);

// Fetch user addresses (requires authentication)
router.get("/addresses", authenticateToken, fetchAddressesController);

// place Order
router.post(
  "/place-order/add",
  authenticateToken,
  createOrderValidator,
  handleValidationErrors,
  addOrderController
);

// List customer orders (requires authentication)
router.get(
  "/orders/list",
  authenticateToken,
  listOrdersValidator,
  handleValidationErrors,
  listCustomerOrdersController
);

// View specific customer order (requires authentication)
router.get(
  "/orders/view/:id",
  authenticateToken,
  viewOrderValidator,
  handleValidationErrors,
  viewCustomerOrderController
);

// List Categories (with search and pagination)
router.get(
  "/category/list",
  authenticateToken,
  listCategoryValidator,
  handleValidationErrors,
  listCategoriesController
);

export default router;
