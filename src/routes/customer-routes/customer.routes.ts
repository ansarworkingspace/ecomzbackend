import express from "express";
import {
    createOrderValidator,
  listProductsValidator,
  viewProductValidator,
} from "../../validator/customer.validator";
import { handleValidationErrors } from "../../validator/user.validator";
import {
    addOrderController,
  fetchAddressesController,
  listProductsController,
  viewProductController,
} from "../../controllers/customer.controller";
import { authenticateToken } from "../../middleware/auth.middleware";

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




export default router;
