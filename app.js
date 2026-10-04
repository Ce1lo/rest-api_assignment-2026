import express from "express";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Student API đang hoạt động" });
});
app.use("/api/students", studentRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Không tìm thấy endpoint." });
});

// Middleware lỗi phải có đủ 4 tham số.
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ success: false, message: "JSON không hợp lệ." });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: "Dữ liệu không hợp lệ." });
  }
  console.error("Lỗi xử lý request:", error.name);
  res.status(500).json({ success: false, message: "Lỗi máy chủ." });
});

export default app;
