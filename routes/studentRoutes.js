const express = require('express');
const mongoose = require('mongoose'); // Bổ sung thư viện mongoose để check ID
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

// Cập nhật điểm thi (PATCH)
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { score } = req.body;

        // 1. Kiểm tra định dạng ID MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không đúng định dạng" });
        }

        // 2. Kiểm tra nghiệp vụ: Điểm từ 0.0 đến 10.0
        if (score === undefined || typeof score !== 'number' || score < 0 || score > 10) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ. Điểm phải từ 0.0 đến 10.0" });
        }

        // 3. Tìm và cập nhật sinh viên
        const updatedStudent = await Student.findByIdAndUpdate(
            id, 
            { score: score }, 
            { new: true } // Trả về document sau khi đã update
        );

        // 4. Không tìm thấy sinh viên
        if (!updatedStudent) {
            return res.status(404).json({ message: "Không tìm thấy sinh viên" });
        }

        // 5. Cập nhật thành công
        return res.status(200).json(updatedStudent);

    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// Xóa (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Kiểm tra định dạng ID MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không đúng định dạng" });
        }

        // 2. Tìm và xóa sinh viên
        const deletedStudent = await Student.findByIdAndDelete(id);

        // 3. Không tìm thấy sinh viên
        if (!deletedStudent) {
            return res.status(404).json({ message: "Không tìm thấy sinh viên" });
        }

        // 4. Xóa thành công
        return res.status(200).json({ message: "Xóa sinh viên thành công" });

    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

module.exports = router;