<<<<<<< HEAD
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dữ liệu mẫu lưu thẳng trong RAM để test không cần MongoDB
let students = [
    { _id: "65f2c9b12345678901234567", name: "Nguyễn Văn An", studentCode: "B22DCCN001", score: 8.5 },
    { _id: "65f2c9b12345678901234568", name: "Trần Thị Bình", studentCode: "B22DCCN002", score: 9.0 }
];

// 1. GET /api/students - Lấy danh sách
app.get('/api/students', (req, res) => {
    return res.status(200).json(students);
});

// 2. PATCH /api/students/:id - Cập nhật điểm
app.patch('/api/students/:id', (req, res) => {
    const { id } = req.params;
    const { score } = req.body;

    const student = students.find(s => s._id === id);
    if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }

    student.score = score;
    return res.status(200).json(student);
});

// 3. DELETE /api/students/:id - Xóa sinh viên
app.delete('/api/students/:id', (req, res) => {
    const { id } = req.params;
    const index = students.findIndex(s => s._id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }

    const deleted = students.splice(index, 1);
    return res.status(200).json({ message: 'Xóa sinh viên thành công', student: deleted[0] });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
});
=======
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

async function start() {
    try {
        await connectDB();
        const port = process.env.PORT || 5000;
        app.listen(port, () => console.log(`Server: http://localhost:${port}`));
    } catch {
        console.error('Không thể khởi động. Kiểm tra MONGO_URI, tài khoản DB và Network Access của Atlas.');
        process.exitCode = 1;
    }
}

start();
>>>>>>> 45c42613717c6bda639e300c358828a851d6d173
