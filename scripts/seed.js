import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Student from "../models/Student.js";

dotenv.config();
const students = [
  { name: "Nguyễn Văn An", studentCode: "DEMO001", score: 5 },
  { name: "Trần Thị Bình", studentCode: "DEMO002", score: 7 },
  { name: "Lê Minh Châu", studentCode: "DEMO003", score: 8.5 },
  { name: "Phạm Gia Duy", studentCode: "DEMO004", score: 6 },
  { name: "Hoàng Mai Linh", studentCode: "DEMO005", score: 9 },
];

const seed = async () => {
  try {
    await connectDB();
    await Student.init();
    // Chỉ thêm sinh viên chưa có: không xóa collection, không ghi đè điểm đã sửa.
    for (const student of students) {
      await Student.updateOne(
        { studentCode: student.studentCode },
        { $setOnInsert: student },
        { upsert: true, runValidators: true },
      );
    }
    const data = await Student.find({
      studentCode: { $in: students.map((student) => student.studentCode) },
    }).sort({ studentCode: 1 });
    console.table(
      data.map((student) => ({
        id: student._id.toString(),
        name: student.name,
        studentCode: student.studentCode,
        score: student.score,
      })),
    );
    console.log("Seed hoàn tất. Các bản ghi đã có được giữ nguyên.");
  } catch {
    console.error(
      "Seed thất bại. Kiểm tra cấu hình Atlas và dữ liệu/index của collection students.",
    );
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
