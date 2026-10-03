const express = require('express');
const mongoose = require('mongoose'); // Thêm mongoose để validate _id
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

        // 1. Kiểm tra _id có phải là ObjectId hợp lệ của MongoDB không (24 ký tự hex)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Định dạng ID không hợp lệ' });
        }

        // 2. Kiểm tra dữ liệu điểm gửi lên (phải là số, từ 0.0 đến 10.0)
        if (score === undefined || typeof score !== 'number' || score < 0 || score > 10) {
            return res.status(400).json({ success: false, message: 'Dữ liệu điểm không hợp lệ (phải từ 0 đến 10)' });
        }

        // 3. Tìm và cập nhật điểm của sinh viên
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { score: score },
            { new: true } // Trả về document sau khi đã update
        );

        // 4. Trả về 404 nếu ID đúng định dạng nhưng không tìm thấy sinh viên
        if (!updatedStudent) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên' });
        }

        // 5. Trả về 200 khi cập nhật thành công
        res.status(200).json({ success: true, data: updatedStudent });
    } catch (error) {
        next(error);
    }
});

// Xóa: DELETE /api/students/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Kiểm tra _id có phải là ObjectId hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Định dạng ID không hợp lệ' });
        }

        // 2. Tìm và xóa sinh viên
        const deletedStudent = await Student.findByIdAndDelete(id);

        // 3. Trả về 404 nếu không tìm thấy sinh viên
        if (!deletedStudent) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên' });
        }

        // 4. Trả về 200 khi xóa thành công
        res.status(200).json({ success: true, message: 'Xóa sinh viên thành công' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;