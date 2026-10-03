const express = require('express');
const Student = require('../models/Student');
const mongoose = require('mongoose');
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
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { score } = req.body;

        // Kiểm tra định dạng ID MongoDB (24 ký tự hex)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }

        // Kiểm tra tính hợp lệ của score (phải là số và nằm trong khoảng [0.0 - 10.0])
        if (
            score === undefined ||
            score === null ||
            typeof score !== 'number' ||
            isNaN(score) ||
            score < 0 ||
            score > 10
        ) {
            return res.status(400).json({ message: 'Điểm thi phải là số từ 0.0 đến 10.0' });
        }

        // Cập nhật điểm thi của sinh viên
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { score },
            { new: true, runValidators: true }
        );

        // Nếu ID đúng định dạng nhưng không có sinh viên trong DB
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
        }

        // Trả về 200 kèm dữ liệu đã cập nhật
        return res.status(200).json(updatedStudent);
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Xóa
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra định dạng ID MongoDB (24 ký tự hex)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }

        // Xóa sinh viên theo _id
        const deletedStudent = await Student.findByIdAndDelete(id);

        // Nếu ID đúng định dạng nhưng không tìm thấy sinh viên
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
        }

        // Trả về 200 thông báo xóa thành công
        return res.status(200).json({
            message: 'Xóa sinh viên thành công',
            data: deletedStudent
        });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;
