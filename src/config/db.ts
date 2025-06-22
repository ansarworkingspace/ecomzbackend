import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: done`);
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
