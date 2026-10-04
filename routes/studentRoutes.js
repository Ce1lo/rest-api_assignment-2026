const express = require('express');
<<<<<<< HEAD
const router = express.Router();
const Student = require('../models/studentModel');

// Ví dụ API GET: Lấy danh sách sinh viên
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// (Bạn sẽ viết thêm các API PATCH, DELETE, POST... vào đây)

module.exports = router;
=======
const Student = require('../models/Student');
const router = express.Router();

// Có sẵn: lấy danh sách và _id thật để thực hành.
router.get('/', async (req, res, next) => {
    try {
        const students = await Student.find().sort({ studentCode: 1 });
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        next(error);
    }
});

// Cập nhật điểm thi


// Xóa


module.exports = router;
>>>>>>> 45c42613717c6bda639e300c358828a851d6d173
