import { getPaginatedResults } from "../helper/pagination.helper";
import Product from "../models/Product.model";
import Variant from "../models/Variant.model";
import { ServiceResult } from "../types/api.types";
import mongoose from "mongoose";

// List Products with search and pagination
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

// View specific product with full details including variants
export const viewProductService = async (
  id: string
): Promise<ServiceResult> => {
  try {
    // Check if product exists
    const product = await Product.findById(id)
      .populate("category", "name")
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

    // Fetch all variants for this product
    const variants = await Variant.find({ productId: id })
      .populate("selectedOptions.optionId", "optionName")
      .lean();

    const productWithVariants = {
      ...product,
      variants: variants,
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

// Add Product with variants
export const addProductService = async (
  productData: any
): Promise<ServiceResult> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      description,
      category,
      isFeatured,
      mainImage,
      status,
      variants,
    } = productData;

    // Check if product with same name already exists
    const existingProduct = await Product.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    }).session(session);

    if (existingProduct) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        error: {
          code: "PRODUCT_EXISTS",
          message: "Product with this name already exists",
          statusCode: 409,
        },
      };
    }

    // Check for duplicate SKUs within variants
    const skus = variants.map((variant: any) => variant.sku.trim());
    const uniqueSkus = [...new Set(skus)];
    if (skus.length !== uniqueSkus.length) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        error: {
          code: "DUPLICATE_SKU",
          message: "Duplicate SKUs found within variants",
          statusCode: 400,
        },
      };
    }

    // Check if any SKU already exists in database
    const existingVariants = await Variant.find({
      sku: { $in: uniqueSkus },
    }).session(session);

    if (existingVariants.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        error: {
          code: "SKU_EXISTS",
          message: `SKU '${existingVariants[0].sku}' already exists`,
          statusCode: 409,
        },
      };
    }

    // Create product
    const product = new Product({
      name: name.trim(),
      description: description?.trim(),
      category,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      mainImage,
      status: status || "active",
    });

    const savedProduct = await product.save({ session });

    // Create variants
    const variantPromises = variants.map((variantData: any) => {
      const variant = new Variant({
        productId: savedProduct._id,
        sku: variantData.sku.trim(),
        price: variantData.price,
        salePrice: variantData.salePrice,
        cost: variantData.cost,
        quantity: variantData.quantity || 0,
        lowStockThreshold: variantData.lowStockThreshold || 0,
        images: variantData.images || [],
        description: variantData.description?.trim(),
        dimensions: variantData.dimensions,
        selectedOptions: variantData.selectedOptions || [],
        isActive:
          variantData.isActive !== undefined ? variantData.isActive : true,
      });
      return variant.save({ session });
    });

    const savedVariants = await Promise.all(variantPromises);

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      data: {
        product: savedProduct,
        variants: savedVariants,
      },
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in addProductService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while adding product",
        statusCode: 500,
      },
    };
  }
};

// Delete Product (soft delete)
export const deleteProductService = async (
  id: string
): Promise<ServiceResult> => {
  try {
    const product = await Product.findById(id);

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

    // Soft delete by setting status to inactive
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { status: "inactive" },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      data: {
        message: "Product deleted successfully",
        product: updatedProduct,
      },
    };
  } catch (error: any) {
    console.error("Error in deleteProductService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while deleting product",
        statusCode: 500,
      },
    };
  }
};
