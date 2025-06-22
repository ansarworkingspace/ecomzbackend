import { body, query, param } from "express-validator";

export const createProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters")
    .trim(),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters")
    .trim(),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean value"),

  body("mainImage")
    .optional()
    .isString()
    .withMessage("Main image must be a string"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either 'active' or 'inactive'"),

  // Variants validation
  body("variants")
    .isArray({ min: 1 })
    .withMessage("At least one variant is required"),

  body("variants.*.sku")
    .notEmpty()
    .withMessage("SKU is required for each variant")
    .isLength({ min: 2, max: 50 })
    .withMessage("SKU must be between 2 and 50 characters")
    .trim(),

  body("variants.*.price")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),

  body("variants.*.salePrice")
    .optional()
    .isNumeric()
    .withMessage("Sale price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Sale price must be greater than or equal to 0"),

  body("variants.*.cost")
    .optional()
    .isNumeric()
    .withMessage("Cost must be a number")
    .isFloat({ min: 0 })
    .withMessage("Cost must be greater than or equal to 0"),

  body("variants.*.quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),

  body("variants.*.lowStockThreshold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Low stock threshold must be a non-negative integer"),

  body("variants.*.images")
    .optional()
    .isArray()
    .withMessage("Images must be an array"),

  body("variants.*.images.*")
    .optional()
    .isString()
    .withMessage("Each image must be a string"),

  body("variants.*.description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Variant description must not exceed 500 characters")
    .trim(),

  body("variants.*.dimensions")
    .optional()
    .isObject()
    .withMessage("Dimensions must be an object"),

  body("variants.*.dimensions.length")
    .optional()
    .isNumeric()
    .withMessage("Length must be a number"),

  body("variants.*.dimensions.width")
    .optional()
    .isNumeric()
    .withMessage("Width must be a number"),

  body("variants.*.dimensions.height")
    .optional()
    .isNumeric()
    .withMessage("Height must be a number"),

  body("variants.*.selectedOptions")
    .optional()
    .isArray()
    .withMessage("Selected options must be an array"),

  body("variants.*.selectedOptions.*.optionId")
    .optional()
    .isMongoId()
    .withMessage("Option ID must be a valid MongoDB ObjectId"),

  body("variants.*.selectedOptions.*.optionName")
    .optional()
    .isString()
    .withMessage("Option name must be a string"),

  body("variants.*.selectedOptions.*.selectedValue")
    .optional()
    .isString()
    .withMessage("Selected value must be a string"),

  body("variants.*.isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

export const listProductValidator = [
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
    .withMessage("Category must be a valid MongoDB ObjectId"),

  query("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either 'active' or 'inactive'"),

  query("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean value"),
];

export const viewProductValidator = [
  param("id")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),
];

export const deleteProductValidator = [
  param("id")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),
];
