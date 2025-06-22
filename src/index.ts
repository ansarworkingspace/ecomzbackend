import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";

dotenv.config();
const app = express();


// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
const baseUrl = process.env.BACKEND_BASE_URL;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${baseUrl}${PORT}`);
});
