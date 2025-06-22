import bcrypt from "bcrypt";
import User, { IUser } from "../models/User.model";

interface ServiceResponse {
  statusCode?: number;
  message?: string;
  success?: boolean;
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  image?: string;
  role?: string;
  addresses?: any[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

//CUSTOMER REGISTER SERVICE
export const registerUserService = async (
  userData: any
): Promise<ServiceResponse> => {
  try {
    const { password, email, firstName, lastName, phone, image, role } =
      userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email?.toLowerCase() });
    if (existingUser) {
      return {
        statusCode: 409,
        message: "Email is already registered",
        success: false,
      };
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return {
        statusCode: 400,
        message: "firstName, lastName, email, and password are required",
        success: false,
      };
    }

    // Validate password
    if (password.length < 6) {
      return {
        statusCode: 400,
        message: "Password must be at least 6 characters long",
        success: false,
      };
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        message: "Please enter a valid email address",
        success: false,
      };
    }

    // Validate phone if provided
    if (phone && !/^\d{10}$/.test(phone)) {
      return {
        statusCode: 400,
        message: "Please enter a valid 10-digit phone number",
        success: false,
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

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

    // Return success response with user data
    return {
      _id: savedUser._id.toString(),
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
  } catch (error: any) {
    console.error("Error in registerUserService:", error);

    // Return internal server error response
    return {
      statusCode: 500,
      message: "Internal server error occurred while registering user",
      success: false,
    };
  }
};
