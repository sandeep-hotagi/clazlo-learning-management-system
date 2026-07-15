const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  totalMarks: { type: Number, required: true },
  results: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    marksObtained: { type: Number, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
