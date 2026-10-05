const express = require('express');
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
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { score } = req.body;

        // Kiểm tra MongoDB ObjectId: đúng 24 ký tự hexadecimal
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        // Kiểm tra score
        if (
            typeof score !== 'number' ||
            score < 0 ||
            score > 10
        ) {
            return res.status(400).json({
                success: false,
                message: 'Điểm phải là số từ 0 đến 10'
            });
        }

        const student = await Student.findByIdAndUpdate(
            id,
            { score },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sinh viên'
            });
        }

        return res.status(200).json({
            success: true,
            data: student
        });

    } catch (error) {
        next(error);
    }
});

// Xóa
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sinh viên'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Xóa sinh viên thành công',
            data: student
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;
