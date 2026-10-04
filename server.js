import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();
const start = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
  } catch {
    console.error(
      "Không thể khởi động. Kiểm tra MONGO_URI, tài khoản DB và Network Access của Atlas.",
    );
    process.exitCode = 1;
  }
};

start();
