import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import dashboardRoutes from "./routes/dashboard-routes/dashboard.routers";
import customerRoutes from "./routes/customer-routes/customer.routes";
import cookieParser from "cookie-parser";
import { fileUploadMiddleware } from "./middleware/files.upload.middleware";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://ecomzfrontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUploadMiddleware);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
connectDB();

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully!" });
});

//ROUTES
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal Server Error",
    });
  }
);

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

const PORT = process.env.PORT || 3000;
const baseUrl = process.env.BACKEND_BASE_URL || "http://localhost:3000";

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${baseUrl}${PORT}`);
});
