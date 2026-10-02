const express = require('express');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const router = express.Router();

// Kiểm tra ObjectId hợp lệ 24 ký tự hex
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);

// Lấy danh sách sinh viên
router.get('/', async (req, res, next) => {
    try {
        const students = await Student.find().sort({ studentCode: 1 });
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        next(error);
    }
});

// Cập nhật điểm thi: PATCH /api/students/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Kiểm tra định dạng ID
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'ID không hợp lệ.' });
        }

        const { score } = req.body;

        // 2. Kiểm tra dữ liệu score: phải là số từ 0.0 đến 10.0
        if (typeof score !== 'number' || Number.isNaN(score) || score < 0 || score > 10) {
            return res.status(400).json({ 
                success: false, 
                message: 'Điểm thi không hợp lệ. Điểm phải là số trong khoảng [0.0 - 10.0].' 
            });
        }

        // 3. Cập nhật chỉ trường score vào database
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { score },
            { new: true, runValidators: true }
        );

        // 4. Nếu không tìm thấy sinh viên
        if (!updatedStudent) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên.' });
        }

        // 5. Cập nhật thành công
        res.status(200).json({
            success: true,
            message: 'Cập nhật điểm thành công.',
            data: updatedStudent
        });
    } catch (error) {
        next(error);
    }
});

// Xóa sinh viên: DELETE /api/students/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Kiểm tra định dạng ID
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'ID không hợp lệ.' });
        }

        // 2. Tìm và xóa sinh viên
        const deletedStudent = await Student.findByIdAndDelete(id);

        // 3. Nếu không tìm thấy
        if (!deletedStudent) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên.' });
        }

        // 4. Xóa thành công
        res.status(200).json({
            success: true,
            message: 'Xóa sinh viên thành công.'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
