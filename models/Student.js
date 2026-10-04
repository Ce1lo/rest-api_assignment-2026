import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    studentCode: { type: String, required: true, trim: true, unique: true },
    score: { type: Number, required: true, min: 0, max: 10 },
  },
  { timestamps: true },
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
