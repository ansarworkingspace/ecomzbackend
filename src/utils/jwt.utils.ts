import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET || "your-secret-key";

  const options: SignOptions = {
    expiresIn: "7d", // This is valid per jsonwebtoken docs
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const setTokenCookie = (res: Response, token: string): void => {
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    domain: "https://ecomzfrontend.vercel.app",
  });
};

export const clearTokenCookie = (res: Response): void => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    domain: "https://ecomzfrontend.vercel.app",
  });
};
