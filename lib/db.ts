import mongoose from "mongoose";

// ========== configuration and validation ==========
const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

// ========== global type augmentation ==========
let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = {
    conn: null, // ========== stores active connection obj
    promise: null, // ========== stores connection attempt currently in progress
  };
}

export const connectDB = async () => {
  // ========== return existing connection ==========
  if (cached.conn) return cached.conn;

  // ========== establish new connection ==========
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    });
  }

  // ========== cache the result ==========
  cached.conn = await cached.promise;
  return cached.conn;
};
