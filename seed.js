const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/studentModel');

dotenv.config();

const sampleStudents = [
    { name: "Nguyễn Văn An", studentCode: "B22DCCN001", score: 8.5 },
    { name: "Trần Thị Bình", studentCode: "B22DCCN002", score: 9.0 },
    { name: "Lê Hoài Nam", studentCode: "B22DCCN003", score: 7.5 }
];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Kết nối DB thành công để seed dữ liệu!');
        
        await Student.deleteMany({}); // Xóa dữ liệu cũ nếu có
        await Student.insertMany(sampleStudents);
        
        console.log('Đã nạp dữ liệu mẫu thành công!');
        process.exit();
    } catch (error) {
        console.error('Lỗi seed dữ liệu:', error);
        process.exit(1);
    }
}

seedDB();