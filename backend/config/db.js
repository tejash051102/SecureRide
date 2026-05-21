import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    if (process.env.MONGO_URI?.startsWith("mongodb+srv://")) {
      console.error("Check your internet connection, Atlas Network Access IP whitelist, and cluster hostname.");
    }
    process.exit(1);
  }
}
