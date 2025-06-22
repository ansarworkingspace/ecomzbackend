import { Request, Response } from "express";
import {
  loginUserService,
  registerUserService,
} from "../services/user.services";
import { ApiResponse } from "../types/api.types";
import { setTokenCookie } from "../utils/jwt.utils";

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
