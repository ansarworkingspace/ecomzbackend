import { Request, Response } from "express";
import { registerUserService } from "../services/user.services";

// CUSTOMER REGISTER CONTROLLER
export const registerUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Basic validation
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        message: "Request body is empty",
      });
      return;
    }

    const { firstName, lastName, email, password } = req.body;

    // Check required fields
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: firstName, lastName, email, password",
      });
      return;
    }

    const response: any = await registerUserService(req.body);

    // Check if service returned an error response
    if (response.statusCode && !response.success) {
      res.status(response.statusCode).json({
        success: false,
        message: response.message,
      });
      return;
    }

    const userResponse = {
      _id: response._id,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      phone: response.phone,
      image: response.image,
      role: response.role,
      addresses: response.addresses,
      isActive: response.isActive,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal Server Error",
    });
  }
};
