import { getPaginatedResults } from "../helper/pagination.helper";
import Category from "../models/Category.model";
import { ServiceResult } from "../types/api.types";

// List Categories with search and pagination
export const listCategoriesService = async (
  query: any
): Promise<ServiceResult> => {
  try {
    const searchFields = ["name", "description"];
    const result = await getPaginatedResults(Category, query, searchFields);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Error in listCategoriesService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while fetching categories",
        statusCode: 500,
      },
    };
  }
};

// Add Category
export const addCategoryService = async (
  categoryData: any
): Promise<ServiceResult> => {
  try {
    const { name, description, image, isActive } = categoryData;

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingCategory) {
      return {
        success: false,
        error: {
          code: "CATEGORY_EXISTS",
          message: "Category with this name already exists",
          statusCode: 409,
        },
      };
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim() || "",
      image: image || "",
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedCategory = await category.save();

    return {
      success: true,
      data: savedCategory,
    };
  } catch (error: any) {
    console.error("Error in addCategoryService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while adding category",
        statusCode: 500,
      },
    };
  }
};

// Edit Category
export const editCategoryService = async (
  id: string,
  categoryData: any
): Promise<ServiceResult> => {
  try {
    const category = await Category.findById(id);

    if (!category) {
      return {
        success: false,
        error: {
          code: "CATEGORY_NOT_FOUND",
          message: "Category not found",
          statusCode: 404,
        },
      };
    }

    // Check if name already exists (excluding current category)
    if (categoryData.name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${categoryData.name.trim()}$`, "i") },
        _id: { $ne: id },
      });

      if (existingCategory) {
        return {
          success: false,
          error: {
            code: "CATEGORY_EXISTS",
            message: "Category with this name already exists",
            statusCode: 409,
          },
        };
      }
    }

    // Update fields
    const updateData: any = {};
    if (categoryData.name) updateData.name = categoryData.name.trim();
    if (categoryData.description !== undefined)
      updateData.description = categoryData.description.trim();
    if (categoryData.image !== undefined) updateData.image = categoryData.image;
    if (categoryData.isActive !== undefined)
      updateData.isActive = categoryData.isActive;

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return {
      success: true,
      data: updatedCategory,
    };
  } catch (error: any) {
    console.error("Error in editCategoryService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while updating category",
        statusCode: 500,
      },
    };
  }
};

// Delete Category
export const deleteCategoryService = async (
  id: string
): Promise<ServiceResult> => {
  try {
    const category = await Category.findById(id);

    if (!category) {
      return {
        success: false,
        error: {
          code: "CATEGORY_NOT_FOUND",
          message: "Category not found",
          statusCode: 404,
        },
      };
    }

    await Category.findByIdAndUpdate(id, { isActive: false });

    return {
      success: true,
      data: { message: "Category deleted successfully" },
    };
  } catch (error: any) {
    console.error("Error in deleteCategoryService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while deleting category",
        statusCode: 500,
      },
    };
  }
};


