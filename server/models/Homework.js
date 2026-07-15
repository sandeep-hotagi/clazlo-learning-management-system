const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deadline: { type: Date, required: true },
  attachments: [{ type: String }], // URLs to cloudinary/firebase
  submissions: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String },
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Submitted', 'Graded', 'Late'], default: 'Submitted' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Homework', homeworkSchema);
