import { Request, Response } from "express";
import { ApiResponse } from "../types/api.types";
import {
  listProductsService,
  viewProductService,
  addProductService,
  deleteProductService,
} from "../services/product.services";

// List Products
export const listProductsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await listProductsService(req.query);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Failed to fetch products",
        timestamp: new Date().toISOString(),
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "Products fetched successfully",
      data: result.data,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: "An unexpected error occurred",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      timestamp: new Date().toISOString(),
    };

    res.status(500).json(response);
  }
};

// View Product
export const viewProductController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await viewProductService(id);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Failed to fetch product details",
        timestamp: new Date().toISOString(),
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "Product details fetched successfully",
      data: result.data,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: "An unexpected error occurred",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      timestamp: new Date().toISOString(),
    };

    res.status(500).json(response);
  }
};

// Add Product
export const addProductController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await addProductService(req.body);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Failed to add product",
        timestamp: new Date().toISOString(),
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "Product added successfully",
      data: result.data,
      timestamp: new Date().toISOString(),
    };

    res.status(201).json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: "An unexpected error occurred",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      timestamp: new Date().toISOString(),
    };

    res.status(500).json(response);
  }
};

// Delete Product
export const deleteProductController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await deleteProductService(id);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Failed to delete product",
        timestamp: new Date().toISOString(),
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "Product deleted successfully",
      data: result.data,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: "An unexpected error occurred",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      timestamp: new Date().toISOString(),
    };

    res.status(500).json(response);
  }
};
