import { Request, Response } from "express";
import { ApiResponse } from "../types/api.types";
import {
  listOrdersService,
  viewOrderService,
  addOrderService,
  updateOrderStatusService,
  deleteOrderService,
} from "../services/order.services";

// List Orders
export const listOrdersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await listOrdersService(req.query);

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

// View Order
export const viewOrderController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await viewOrderService(id);

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

// Add Order
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

// Update Order Status
export const updateOrderStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await updateOrderStatusService(id, req.body);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Failed to update order status",
        timestamp: new Date().toISOString(),
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "Order status updated successfully",
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

// Delete Order
export const deleteOrderController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await deleteOrderService(id);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Failed to delete order",
        timestamp: new Date().toISOString(),
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "Order deleted successfully",
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
