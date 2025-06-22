import { body, query } from "express-validator";

export const createOptionValidator = [
  body("optionName")
    .notEmpty()
    .withMessage("Option name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Option name must be between 2 and 50 characters")
    .trim(),

  body("values")
    .isArray({ min: 1 })
    .withMessage("Values must be an array with at least one item"),

  body("values.*")
    .isString()
    .withMessage("Each value must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("Each value must be between 1 and 100 characters")
    .trim(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

export const updateOptionValidator = [
  body("optionName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Option name must be between 2 and 50 characters")
    .trim(),

  body("values")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Values must be an array with at least one item"),

  body("values.*")
    .optional()
    .isString()
    .withMessage("Each value must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("Each value must be between 1 and 100 characters")
    .trim(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

export const listOptionValidator = [
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
];
