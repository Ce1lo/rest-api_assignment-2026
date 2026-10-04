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
        if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
            return res.status(400).json({ success: false, message: 'ID không hợp lệ.' });
        }

        const score = req.body?.score;
        if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 10) {
            return res.status(400).json({ success: false, message: 'Điểm không hợp lệ.' });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: { score } },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên.' });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        next(error);
    }
});


// Xóa
router.delete('/:id', async (req, res, next) => {
    try {
        if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
            return res.status(400).json({ success: false, message: 'ID không hợp lệ.' });
        }

        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên.' });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
