import { getPaginatedResults } from "../helper/pagination.helper";
import Order from "../models/Order.model";
import Product from "../models/Product.model";
import UserModel from "../models/User.model";
import Variant from "../models/Variant.model";
import { ServiceResult } from "../types/api.types";
import mongoose from "mongoose";

// Generate unique order number
const generateOrderNumber = async (): Promise<string> => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const datePrefix = `ORD${year}${month}${day}`;

  // Find the last order number for today
  const lastOrder = await Order.findOne({
    orderNumber: { $regex: `^${datePrefix}` },
  }).sort({ orderNumber: -1 });

  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  return `${datePrefix}${sequence.toString().padStart(4, "0")}`;
};

// List Orders with search and pagination
export const listOrdersService = async (query: any): Promise<ServiceResult> => {
  try {
    const searchFields = [
      "orderNumber",
      "shippingAddress.fullName",
      "shippingAddress.phone",
    ];

    // Build additional filters
    const result = await getPaginatedResults(Order, query, searchFields);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Error in listOrdersService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while fetching orders",
        statusCode: 500,
      },
    };
  }
};

// View specific order with full details
export const viewOrderService = async (id: string): Promise<ServiceResult> => {
  try {
    const order = await Order.findById(id)
      .populate("customerId", "name email phone")
      .populate("items.productId", "name category")
      .populate("items.variantId", "sku images selectedOptions")
      .lean();

    if (!order) {
      return {
        success: false,
        error: {
          code: "ORDER_NOT_FOUND",
          message: "Order not found",
          statusCode: 404,
        },
      };
    }

    return {
      success: true,
      data: order,
    };
  } catch (error: any) {
    console.error("Error in viewOrderService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while fetching order details",
        statusCode: 500,
      },
    };
  }
};

// Add Order
export const addOrderService = async (
  orderData: any
): Promise<ServiceResult> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customerId,
      items,
      subtotal,
      shippingCost = 0,
      tax = 0,
      discount = 0,
      totalAmount,
      paymentMethod = "cod",
      paymentStatus = "pending",
      shippingAddress,
      status = "placed",
      expectedDeliveryDate,
    } = orderData;

    // Validate customer exists
    const customerExists = await mongoose
      .model("User")
      .findById(customerId)
      .session(session);
    if (!customerExists) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        error: {
          code: "CUSTOMER_NOT_FOUND",
          message: "Customer not found",
          statusCode: 404,
        },
      };
    }

    // Validate products and variants, check stock
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return {
          success: false,
          error: {
            code: "PRODUCT_NOT_FOUND",
            message: `Product with ID ${item.productId} not found`,
            statusCode: 404,
          },
        };
      }

      const variant = await Variant.findById(item.variantId).session(session);
      if (!variant) {
        await session.abortTransaction();
        session.endSession();
        return {
          success: false,
          error: {
            code: "VARIANT_NOT_FOUND",
            message: `Variant with ID ${item.variantId} not found`,
            statusCode: 404,
          },
        };
      }

      // Check stock availability
      if (variant.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return {
          success: false,
          error: {
            code: "INSUFFICIENT_STOCK",
            message: `Insufficient stock for ${item.productName} (SKU: ${item.sku}). Available: ${variant.quantity}, Requested: ${item.quantity}`,
            statusCode: 400,
          },
        };
      }

      // Update variant quantity
      await Variant.findByIdAndUpdate(
        item.variantId,
        { $inc: { quantity: -item.quantity } },
        { session }
      );
    }

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create status history
    const statusHistory = [
      {
        status,
        timestamp: new Date(),
        note: "Order created",
      },
    ];

    // Create order
    const order = new Order({
      orderNumber,
      customerId,
      items,
      subtotal,
      shippingCost,
      tax,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus,
      shippingAddress,
      status,
      statusHistory,
      expectedDeliveryDate: expectedDeliveryDate
        ? new Date(expectedDeliveryDate)
        : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    });

    const savedOrder = await order.save({ session });

    if (shippingAddress)
      await UserModel.findByIdAndUpdate(
        customerId,
        { addresses: [shippingAddress] },
        { session }
      );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      data: savedOrder,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in addOrderService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while creating order",
        statusCode: 500,
      },
    };
  }
};

// Update Order Status
export const updateOrderStatusService = async (
  id: string,
  statusData: any
): Promise<ServiceResult> => {
  try {
    const { status, note } = statusData;

    const order = await Order.findById(id);

    if (!order) {
      return {
        success: false,
        error: {
          code: "ORDER_NOT_FOUND",
          message: "Order not found",
          statusCode: 404,
        },
      };
    }

    // Validate status transition (optional business logic)
    const validTransitions: { [key: string]: string[] } = {
      placed: ["confirmed", "cancelled"],
      confirmed: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [], // No further transitions
      cancelled: [], // No further transitions
    };

    if (!validTransitions[order.status].includes(status)) {
      return {
        success: false,
        error: {
          code: "INVALID_STATUS_TRANSITION",
          message: `Cannot change status from '${order.status}' to '${status}'`,
          statusCode: 400,
        },
      };
    }

    // Add to status history
    const statusHistoryEntry = {
      status,
      timestamp: new Date(),
      note: note || `Status changed to ${status}`,
    };

    const updateFields: any = {
      status,
      $push: { statusHistory: statusHistoryEntry },
    };

    if (statusData.expectedDeliveryDate) {
      updateFields.expectedDeliveryDate = new Date(
        statusData.expectedDeliveryDate
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).populate("customerId", "name email phone");

    return {
      success: true,
      data: updatedOrder,
    };
  } catch (error: any) {
    console.error("Error in updateOrderStatusService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while updating order status",
        statusCode: 500,
      },
    };
  }
};

// Delete Order
export const deleteOrderService = async (
  id: string
): Promise<ServiceResult> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(id).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        error: {
          code: "ORDER_NOT_FOUND",
          message: "Order not found",
          statusCode: 404,
        },
      };
    }

    // Only allow deletion of cancelled or placed orders
    if (!["cancelled", "placed"].includes(order.status)) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        error: {
          code: "CANNOT_DELETE_ORDER",
          message: "Only cancelled or placed orders can be deleted",
          statusCode: 400,
        },
      };
    }

    // Restore stock if order is being deleted
    if (order.status !== "cancelled") {
      for (const item of order.items) {
        await Variant.findByIdAndUpdate(
          item.variantId,
          { $inc: { quantity: item.quantity } },
          { session }
        );
      }
    }

    await Order.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      data: { message: "Order deleted successfully" },
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in deleteOrderService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while deleting order",
        statusCode: 500,
      },
    };
  }
};
