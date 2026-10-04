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

        // Validate ObjectId format (24 ký tự hex)
        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
            return res.status(400).json({ success: false, message: 'ID không hợp lệ.' });
        }

        const { score } = req.body;

        // Validate score
        if (score === undefined || score === null || typeof score !== 'number' || score < 0 || score > 10) {
            return res.status(400).json({ success: false, message: 'Điểm không hợp lệ. Điểm phải là số trong khoảng [0, 10].' });
        }

        const updated = await Student.findByIdAndUpdate(
            id,
            { score },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên.' });
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
});

// Xóa
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format (24 ký tự hex)
        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
            return res.status(400).json({ success: false, message: 'ID không hợp lệ.' });
        }

        const deleted = await Student.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên.' });
        }

        res.status(200).json({ success: true, message: 'Xóa sinh viên thành công.', data: deleted });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
