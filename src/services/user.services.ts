import bcrypt from "bcrypt";
import User from "../models/User.model";
import { ServiceResult } from "../types/api.types";

export const registerUserService = async (
  userData: any
): Promise<ServiceResult> => {
  try {
    const { password, email, firstName, lastName, phone, image, role } =
      userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email?.toLowerCase(),
    }).select("_id email");

    if (existingUser) {
      return {
        success: false,
        error: {
          code: "USER_EXISTS",
          message: "Email is already registered",
          statusCode: 409,
        },
      };
    }

    // Hash password with higher salt rounds for production
    const saltRounds = process.env.NODE_ENV === "production" ? 12 : 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone || "",
      image: image || "",
      role: role || "customer",
      addresses: [],
      isActive: true,
    });

    const savedUser = await user.save();

    // Remove sensitive data
    const userResponse = {
      _id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      phone: savedUser.phone,
      image: savedUser.image,
      role: savedUser.role,
      addresses: savedUser.addresses,
      isActive: savedUser.isActive,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    return {
      success: true,
      data: userResponse,
    };
  } catch (error: any) {
    console.error("Error in registerUserService:", error);

    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while registering user",
        statusCode: 500,
      },
    };
  }
};
