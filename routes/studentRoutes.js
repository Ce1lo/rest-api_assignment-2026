const express = require('express');
const Student = require('../models/Student');
const router = express.Router();
const mongoose = require('mongoose');

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
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { score } = req.body;

        // Kiểm tra xem :id có đúng chuẩn ObjectId của MongoDB (24 ký tự hex) hay không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID sinh viên không hợp lệ." });
        }

        // Kiểm tra điểm số có được truyền lên và có nằm trong khoảng [0.0 - 10.0] hay không
        if (score === undefined || typeof score !== 'number' || score < 0 || score > 10) {
            return res.status(400).json({ error: "Điểm số không hợp lệ. Điểm phải nằm trong khoảng từ 0.0 đến 10.0." });
        }

        // Tìm và cập nhật điểm của sinh viên
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { score },
            { new: true, runValidators: true }
        );

        // Nếu không tìm thấy sinh viên tương ứng
        if (!updatedStudent) {
            return res.status(404).json({ error: "Không tìm thấy sinh viên với ID này." });
        }

        // Thành công trả về 200 kèm thông tin sinh viên sau khi cập nhật
        return res.status(200).json(updatedStudent);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});


// Xóa
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem :id có đúng chuẩn ObjectId của MongoDB hay không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID sinh viên không hợp lệ." });
        }

        // Tìm và xóa sinh viên theo ID
        const deletedStudent = await Student.findByIdAndDelete(id);

        // Nếu không tìm thấy sinh viên tương ứng
        if (!deletedStudent) {
            return res.status(404).json({ error: "Không tìm thấy sinh viên với ID này." });
        }

        // Thành công trả về 200
        return res.status(200).json({ message: "Xóa sinh viên thành công.", student: deletedStudent });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;
