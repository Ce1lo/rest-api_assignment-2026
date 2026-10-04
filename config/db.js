const mongoose = require('mongoose');

async function connectDB() {
    if (!process.env.MONGO_URI) {
        throw new Error('Thiếu MONGO_URI. Hãy tạo .env từ .env.example.');
    }
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000, tls: true });
    console.log('Đã kết nối MongoDB.');
}

module.exports = connectDB;
