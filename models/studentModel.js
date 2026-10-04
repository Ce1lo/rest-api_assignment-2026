const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    studentCode: { type: String, required: true, unique: true },
    score: { type: Number, min: 0, max: 10, default: 0 }
});

module.exports = mongoose.model('Student', studentSchema);