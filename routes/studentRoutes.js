import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// Có sẵn: lấy danh sách và _id thật để thực hành.
router.get("/", async (req, res, next) => {
  try {
    const students = await Student.find().sort({ studentCode: 1 });
    res.status(200).json({
      success: true,
      message: "Lay danh sach hoc sinh thanh cong",
      data: students,
    });
  } catch (error) {
    next(error);
  }
});

// Cập nhật điểm thi - PATCH /api/students/:id
const updateStudentById = async (req, res, next) => {
  try {
    const updateStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updateStudent)
      return res.status(404).json({
        success: false,
        message: "Khong tim thay hoc sinh",
      });

    res.status(200).json({
      success: true,
      message: "Cap nhat hoc sinh thanh cong",
      data: { updateStudent },
    });
  } catch (err) {
    next(err);
  }
};
router.patch("/:id", updateStudentById);

// Xoa doi tuong - DELETE api/students/:id
const deleteStudentById = async (req, res, next) => {
  try {
    const deleteStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deleteStudent)
      return res.status(404).json({
        success: false,
        message: "Khong tim thay hoc sinh",
      });

    res.status(200).json({
      success: true,
      message: "Da xoa hoc sinh thanh cong",
      data: { deleteStudent },
    });
  } catch (err) {
    next(err);
  }
};
router.delete("/:id", deleteStudentById);

export default router;
