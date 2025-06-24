import { body, query, param } from "express-validator";

export const listProductsValidator = [
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

  query("category")
    .optional()
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ObjectId"),

  query("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean value"),

  query("minPrice")
    .optional()
    .isNumeric()
    .withMessage("Minimum price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),

  query("maxPrice")
    .optional()
    .isNumeric()
    .withMessage("Maximum price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),

  query("sortBy")
    .optional()
    .isIn(["name", "price", "createdAt"])
    .withMessage("Sort by must be 'name', 'price', or 'createdAt'"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be 'asc' or 'desc'"),
];

export const viewProductValidator = [
  param("id")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),
];

export const createOrderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),

  body("items.*.productId")
    .notEmpty()
    .withMessage("Product ID is required for each item")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),

  body("items.*.variantId")
    .notEmpty()
    .withMessage("Variant ID is required for each item")
    .isMongoId()
    .withMessage("Variant ID must be a valid MongoDB ObjectId"),

  body("items.*.productName")
    .notEmpty()
    .withMessage("Product name is required for each item")
    .isLength({ min: 1, max: 100 })
    .withMessage("Product name must be between 1 and 100 characters")
    .trim(),

  body("items.*.sku")
    .notEmpty()
    .withMessage("SKU is required for each item")
    .isLength({ min: 1, max: 50 })
    .withMessage("SKU must be between 1 and 50 characters")
    .trim(),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("items.*.price")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),

  body("items.*.salePrice")
    .optional()
    .isNumeric()
    .withMessage("Sale price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Sale price must be greater than or equal to 0"),

  body("items.*.totalPrice")
    .isNumeric()
    .withMessage("Total price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Total price must be greater than or equal to 0"),

  body("subtotal")
    .isNumeric()
    .withMessage("Subtotal must be a number")
    .isFloat({ min: 0 })
    .withMessage("Subtotal must be greater than or equal to 0"),

  body("shippingCost")
    .optional()
    .isNumeric()
    .withMessage("Shipping cost must be a number")
    .isFloat({ min: 0 })
    .withMessage("Shipping cost must be greater than or equal to 0"),

  body("tax")
    .optional()
    .isNumeric()
    .withMessage("Tax must be a number")
    .isFloat({ min: 0 })
    .withMessage("Tax must be greater than or equal to 0"),

  body("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Discount must be greater than or equal to 0"),

  body("totalAmount")
    .isNumeric()
    .withMessage("Total amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be greater than or equal to 0"),

  body("paymentMethod")
    .optional()
    .isIn(["cod"])
    .withMessage("Payment method must be 'cod'"),

  body("paymentStatus")
    .optional()
    .isIn(["pending", "paid", "failed"])
    .withMessage("Payment status must be 'pending', 'paid', or 'failed'"),

  // Shipping Address Validation
  body("shippingAddress")
    .isObject()
    .withMessage("Shipping address is required"),

  body("shippingAddress.fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .trim(),

  body("shippingAddress.phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("shippingAddress.addressLine1")
    .notEmpty()
    .withMessage("Address line 1 is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Address line 1 must be between 5 and 200 characters")
    .trim(),

  body("shippingAddress.addressLine2")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Address line 2 must not exceed 200 characters")
    .trim(),

  body("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters")
    .trim(),

  body("shippingAddress.state")
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters")
    .trim(),

  body("shippingAddress.pincode")
    .notEmpty()
    .withMessage("Pincode is required")
    .isPostalCode("any")
    .withMessage("Please provide a valid pincode"),

  body("shippingAddress.country")
    .notEmpty()
    .withMessage("Country is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Country must be between 2 and 50 characters")
    .trim(),

  body("status")
    .optional()
    .isIn(["placed", "confirmed", "shipped", "delivered", "cancelled"])
    .withMessage(
      "Status must be 'placed', 'confirmed', 'shipped', 'delivered', or 'cancelled'"
    ),

  body("expectedDeliveryDate")
    .optional()
    .isISO8601()
    .withMessage("Expected delivery date must be a valid date"),
];

export const listOrdersValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

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
