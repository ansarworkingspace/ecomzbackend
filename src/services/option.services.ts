import { getPaginatedResults } from "../helper/pagination.helper";
import Option from "../models/Option.model";
import { ServiceResult } from "../types/api.types";

// List Options with search and pagination
export const listOptionsService = async (
  query: any
): Promise<ServiceResult> => {
  try {
    const searchFields = ["optionName", "values"];
    const result = await getPaginatedResults(Option, query, searchFields);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Error in listOptionsService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while fetching options",
        statusCode: 500,
      },
    };
  }
};

// Add Option
export const addOptionService = async (
  optionData: any
): Promise<ServiceResult> => {
  try {
    const { optionName, values, isActive } = optionData;

    // Check if option already exists
    const existingOption = await Option.findOne({
      optionName: { $regex: new RegExp(`^${optionName.trim()}$`, "i") },
    });

    if (existingOption) {
      return {
        success: false,
        error: {
          code: "OPTION_EXISTS",
          message: "Option with this name already exists",
          statusCode: 409,
        },
      };
    }

    // Clean and validate values
    const cleanValues = values
      .map((value: string) => value.trim())
      .filter((value: string) => value.length > 0);

    if (cleanValues.length === 0) {
      return {
        success: false,
        error: {
          code: "INVALID_VALUES",
          message: "At least one valid value is required",
          statusCode: 400,
        },
      };
    }

    const option = new Option({
      optionName: optionName.trim(),
      values: cleanValues,
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedOption = await option.save();

    return {
      success: true,
      data: savedOption,
    };
  } catch (error: any) {
    console.error("Error in addOptionService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while adding option",
        statusCode: 500,
      },
    };
  }
};

// Edit Option
export const editOptionService = async (
  id: string,
  optionData: any
): Promise<ServiceResult> => {
  try {
    const option = await Option.findById(id);

    if (!option) {
      return {
        success: false,
        error: {
          code: "OPTION_NOT_FOUND",
          message: "Option not found",
          statusCode: 404,
        },
      };
    }

    // Check if name already exists (excluding current option)
    if (optionData.optionName) {
      const existingOption = await Option.findOne({
        optionName: {
          $regex: new RegExp(`^${optionData.optionName.trim()}$`, "i"),
        },
        _id: { $ne: id },
      });

      if (existingOption) {
        return {
          success: false,
          error: {
            code: "OPTION_EXISTS",
            message: "Option with this name already exists",
            statusCode: 409,
          },
        };
      }
    }

    // Update fields
    const updateData: any = {};
    if (optionData.optionName)
      updateData.optionName = optionData.optionName.trim();
    if (optionData.values) {
      const cleanValues = optionData.values
        .map((value: string) => value.trim())
        .filter((value: string) => value.length > 0);

      if (cleanValues.length === 0) {
        return {
          success: false,
          error: {
            code: "INVALID_VALUES",
            message: "At least one valid value is required",
            statusCode: 400,
          },
        };
      }

      updateData.values = cleanValues;
    }
    if (optionData.isActive !== undefined)
      updateData.isActive = optionData.isActive;

    const updatedOption = await Option.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return {
      success: true,
      data: updatedOption,
    };
  } catch (error: any) {
    console.error("Error in editOptionService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while updating option",
        statusCode: 500,
      },
    };
  }
};

// Delete Option
export const deleteOptionService = async (
  id: string
): Promise<ServiceResult> => {
  try {
    const option = await Option.findById(id);

    if (!option) {
      return {
        success: false,
        error: {
          code: "OPTION_NOT_FOUND",
          message: "Option not found",
          statusCode: 404,
        },
      };
    }

    await Option.findByIdAndUpdate(id, {
      isActive: false,
    });

    return {
      success: true,
      data: { message: "Option deleted successfully" },
    };
  } catch (error: any) {
    console.error("Error in deleteOptionService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while deleting option",
        statusCode: 500,
      },
    };
  }
};
