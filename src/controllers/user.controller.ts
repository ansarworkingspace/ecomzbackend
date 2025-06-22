import { Request, Response } from "express";
import { registerUserService } from "../services/user.services";
import { ApiResponse } from "../types/api.types";

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
