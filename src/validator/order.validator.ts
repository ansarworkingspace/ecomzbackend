import { body, query, param } from "express-validator";

export const updateOrderStatusValidator = [
  param("id")
    .isMongoId()
    .withMessage("Order ID must be a valid MongoDB ObjectId"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["placed", "confirmed", "shipped", "delivered", "cancelled"])
    .withMessage(
      "Status must be 'placed', 'confirmed', 'shipped', 'delivered', or 'cancelled'"
    ),

  body("note")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Note must not exceed 500 characters")
    .trim(),
];

export const listOrderValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("search")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters")
    .trim(),

  query("customerId")
    .optional()
    .isMongoId()
    .withMessage("Customer ID must be a valid MongoDB ObjectId"),

  query("status")
    .optional()
    .isIn(["placed", "confirmed", "shipped", "delivered", "cancelled"])
    .withMessage(
      "Status must be 'placed', 'confirmed', 'shipped', 'delivered', or 'cancelled'"
    ),

  query("paymentStatus")
    .optional()
    .isIn(["pending", "paid", "failed"])
    .withMessage("Payment status must be 'pending', 'paid', or 'failed'"),

  query("paymentMethod")
    .optional()
    .isIn(["cod"])
    .withMessage("Payment method must be 'cod'"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),
];

export const viewOrderValidator = [
  param("id")
    .isMongoId()
    .withMessage("Order ID must be a valid MongoDB ObjectId"),
];

export const deleteOrderValidator = [
  param("id")
    .isMongoId()
    .withMessage("Order ID must be a valid MongoDB ObjectId"),
];

