import { Request, Response } from "express";
import {
  loginUserService,
  logoutService,
  registerUserService,
} from "../services/user.services";
import { ApiResponse } from "../types/api.types";
import { setTokenCookie } from "../utils/jwt.utils";
import { imageUploadService } from "../helper/image.upload.helper";

export const registerUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await registerUserService(req.body);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Registration failed",
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "User registered successfully",
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

export const loginUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await loginUserService(req.body);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Login failed",
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    // Set JWT token in cookie
    setTokenCookie(res, result.data.token);

    const response: ApiResponse = {
      success: true,
      message: "User logged in successfully",
      data: {
        user: result.data.user,
        token: result.data.token,
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error in loginUserController:", error);
    const response: ApiResponse = {
      success: false,
      message: "An unexpected error occurred",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };

    res.status(500).json(response);
  }
};

export const logoutController = async (req: any, res: any) => {
  try {
    const result = await logoutService(res);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: result.error?.message || "Failed to fetch order details",
        timestamp: new Date().toISOString(),
      };

      res.status(result.error?.statusCode || 400).json(response);
      return;
    }

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    }
  } catch (error) {
    console.error("Error in logoutController:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred during logout",
        statusCode: 500,
      },
    });
  }
};

export const imageUploadController = async (req: Request, res: any) => {
  try {
    // Check if files are present
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "NO_FILES",
          message: "No files uploaded",
          statusCode: 400,
        },
      });
    }

    // Handle different file key names (files, images, etc.)
    let files: any[] = [];

    // Check for 'files' key (Postman binary data)
    if (req.files.files) {
      files = Array.isArray(req.files.files)
        ? req.files.files
        : [req.files.files];
    }
    // Check for 'images' key
    else if (req.files.images) {
      files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
    }
    // Get all files regardless of key name
    else {
      files = Object.values(req.files).flat();
    }

    // Filter out undefined files
    files = files.filter((file) => file && file.data);

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "NO_VALID_FILES",
          message: "No valid files found",
          statusCode: 400,
        },
      });
    }

    // Check file count limit
    if (files.length > 4) {
      return res.status(400).json({
        success: false,
        error: {
          code: "TOO_MANY_FILES",
          message: "Maximum 4 images allowed per upload",
          statusCode: 400,
        },
      });
    }

    const result: any = await imageUploadService(files);

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: {
          urls: result.data.urls,
          count: result.data.urls.length,
        },
        message: "Images uploaded successfully",
      });
    } else {
      return res.status(result.error.statusCode).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in imageUploadController:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred during image upload",
        statusCode: 500,
      },
    });
  }
};
