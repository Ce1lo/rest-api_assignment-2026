import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Thiếu MONGO_URI. Hãy tạo .env từ .env.example.");
  }
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("Đã kết nối MongoDB.");
};

export default connectDB;
