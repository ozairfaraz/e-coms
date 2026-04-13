import mongoose from "mongoose";
import { config } from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
};

export default connectDB;
