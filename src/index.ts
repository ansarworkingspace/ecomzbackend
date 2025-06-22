import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import dashboardRoutes from "./routes/dashboard-routes/category.routes";

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully!" });
});

//ROUTES
app.use("/api/users", userRoutes);
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
