const express = require('express');
const mongoose = require('mongoose');
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

// Cập nhật điểm thi: PATCH /api/students/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { score } = req.body;

        // 1. Kiểm tra ID có đúng định dạng MongoDB Hex 24 ký tự không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID sinh viên không hợp lệ'
            });
        }

        // 2. Kiểm tra score: phải tồn tại, là số, không NaN và nằm trong thang [0.0 - 10.0]
        if (
            score === undefined ||
            typeof score !== 'number' ||
            isNaN(score) ||
            score < 0 ||
            score > 10
        ) {
            return res.status(400).json({
                success: false,
                message: 'Điểm thi không hợp lệ, điểm phải là số từ 0.0 đến 10.0'
            });
        }

        // 3. Cập nhật trường score trong cơ sở dữ liệu
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { score },
            { new: true, runValidators: true }
        );

        // 4. Nếu ID đúng chuẩn nhưng không tìm thấy sinh viên
        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sinh viên'
            });
        }

        // 5. Trả về mã 200 khi thành công
        return res.status(200).json({
            success: true,
            message: 'Cập nhật điểm thi thành công',
            data: updatedStudent
        });
    } catch (error) {
        next(error);
    }
});

// Xóa: DELETE /api/students/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Kiểm tra ID có đúng định dạng MongoDB Hex 24 ký tự không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID sinh viên không hợp lệ'
            });
        }

        // 2. Thực hiện xóa sinh viên theo ID
        const deletedStudent = await Student.findByIdAndDelete(id);

        // 3. Nếu ID đúng chuẩn nhưng không có sinh viên để xóa
        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sinh viên'
            });
        }

        // 4. Trả về mã 200 khi xóa thành công
        return res.status(200).json({
            success: true,
            message: 'Xóa sinh viên thành công',
            data: deletedStudent
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;