import bcrypt from "bcrypt";
import User from "../models/User.model";
import { ServiceResult } from "../types/api.types";
import { clearTokenCookie, generateToken } from "../utils/jwt.utils";

interface LoginData {
  email: string;
  password: string;
}

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

    const savedUser: any = await user.save();

    // Generate JWT token
    const tokenPayload = {
      userId: savedUser._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = generateToken(tokenPayload);

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
      token: token,
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

export const loginUserService = async (
  loginData: LoginData
): Promise<ServiceResult> => {
  try {
    const { email, password } = loginData;

    // Check if user exists
    const user: any = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    }).select("+password");

    if (!user) {
      return {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
          statusCode: 401,
        },
      };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
          statusCode: 401,
        },
      };
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = generateToken(tokenPayload);

    // Prepare response data (exclude sensitive information)
    const loginResponse = {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
        addresses: user.addresses,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };

    return {
      success: true,
      data: loginResponse,
    };
  } catch (error: any) {
    console.error("Error in loginUserService:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred while logging in user",
        statusCode: 500,
      },
    };
  }
};

export const logoutService = async (res: any): Promise<ServiceResult> => {
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
