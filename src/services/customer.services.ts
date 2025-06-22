import Product from "../models/Product.model";
import Variant from "../models/Variant.model";
import User from "../models/User.model";
import { ServiceResult } from "../types/api.types";
import { getPaginatedResults } from "../helper/pagination.helper";
import { generateOrderNumber } from "../helper/order.helper";
import mongoose from "mongoose";
import OrderModel from "../models/Order.model";
import UserModel from "../models/User.model";
import { clearTokenCookie } from "../utils/jwt.utils";

// List Products for customers (basic product schema only)
export const listProductsService = async (
  query: any
): Promise<ServiceResult> => {
  try {
    const searchFields = ["name", "description"];

    const result = await getPaginatedResults(Product, query, searchFields);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Error in listProductsService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while fetching products",
        statusCode: 500,
      },
    };
  }
};

// View specific product with variants (excluding admin data)
export const viewProductService = async (
  id: string
): Promise<ServiceResult> => {
  try {
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return {
        success: false,
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: "Product not found",
          statusCode: 404,
        },
      };
    }

    // Check if product is active
    if (product.status !== "active") {
      return {
        success: false,
        error: {
          code: "PRODUCT_NOT_AVAILABLE",
          message: "Product is not available",
          statusCode: 404,
        },
      };
    }

    // Get variants excluding admin-related fields
    const variants = await Variant.find({
      productId: id,
      isActive: true,
    })
      .select("-cost -lowStockThreshold -createdAt -updatedAt") // Exclude admin fields
      .lean();

    const productWithVariants = {
      ...product,
      variants,
    };

    return {
      success: true,
      data: productWithVariants,
    };
  } catch (error: any) {
    console.error("Error in viewProductService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message:
          "Internal server error occurred while fetching product details",
        statusCode: 500,
      },
    };
  }
};

// Fetch user addresses
export const fetchAddressesService = async (
  userId: string
): Promise<ServiceResult> => {
  try {
    const user = await User.findById(userId).select("addresses").lean();

    if (!user) {
      return {
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
          statusCode: 404,
        },
      };
    }

    return {
      success: true,
      data: user.addresses || [],
    };
  } catch (error: any) {
    console.error("Error in fetchAddressesService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while fetching addresses",
        statusCode: 500,
      },
    };
  }
};

// place Order
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
    const order = new OrderModel({
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

// List customer's orders
export const listCustomerOrdersService = async (
  userId: string,
  query: any
): Promise<ServiceResult> => {
  try {
    const searchFields = ["orderNumber"];

    const additionalFilters: any = {
      customerId: userId,
    };

    // Build additional filters
    const result = await getPaginatedResults(
      OrderModel,
      query,
      searchFields,
      additionalFilters
    );
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Error in listCustomerOrdersService:", error);
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

// View specific customer order
export const viewCustomerOrderService = async (
  userId: string,
  orderId: string
): Promise<ServiceResult> => {
  try {
    const order = await OrderModel.findOne({
      _id: orderId,
      customerId: userId, // Ensure order belongs to this customer
    })
      .populate("items.productId", "name category mainImage")
      .populate("items.variantId", "images selectedOptions")
      .lean();

    if (!order) {
      return {
        success: false,
        error: {
          code: "ORDER_NOT_FOUND",
          message:
            "Order not found or you don't have permission to view this order",
          statusCode: 404,
        },
      };
    }

    return {
      success: true,
      data: order,
    };
  } catch (error: any) {
    console.error("Error in viewCustomerOrderService:", error);
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

export const logoutService = async (
  userId: string,
  token: string,
  res: any
): Promise<ServiceResult> => {
  try {
    // ✅ Correct usage: pass `res` only
    clearTokenCookie(res);

    return {
      success: true,
      data: "User logged out successfully",
    };
  } catch (error: any) {
    console.error("Error in logoutService:", error);
    return {
      success: false,
      error: {
        code: "LOGOUT_ERROR",
        message: "Failed to logout user",
        statusCode: 500,
      },
    };
  }
};
