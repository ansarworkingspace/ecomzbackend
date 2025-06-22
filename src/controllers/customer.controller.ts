import { Request, Response } from "express";
import { ApiResponse } from "../types/api.types";
import {
  listProductsService,
  viewProductService,
  fetchAddressesService,
  addOrderService,
  viewCustomerOrderService,
  listCustomerOrdersService,
} from "../services/customer.services";

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

// Fetch Addresses
export const fetchAddressesController = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        message: "User authentication required",
        timestamp: new Date().toISOString(),
      };

      res.status(401).json(response);
      return;
    }

    const result = await fetchAddressesService(userId);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Failed to fetch addresses",
        timestamp: new Date().toISOString(),
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "Addresses fetched successfully",
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

// place Order
export const addOrderController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await addOrderService(req.body);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Failed to create order",
        timestamp: new Date().toISOString(),
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "Order created successfully",
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

// List Customer Orders
export const listCustomerOrdersController = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        message: "User authentication required",
        timestamp: new Date().toISOString(),
      };

      res.status(401).json(response);
      return;
    }

    const result = await listCustomerOrdersService(userId, req.query);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Failed to fetch orders",
        timestamp: new Date().toISOString(),
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "Orders fetched successfully",
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

// View Customer Order
export const viewCustomerOrderController = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        message: "User authentication required",
        timestamp: new Date().toISOString(),
      };

      res.status(401).json(response);
      return;
    }

    const result = await viewCustomerOrderService(userId, id);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Failed to fetch order details",
        timestamp: new Date().toISOString(),
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "Order details fetched successfully",
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
