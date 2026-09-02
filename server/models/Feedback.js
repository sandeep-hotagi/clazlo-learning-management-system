// server/models/Feedback.js
// Mongoose schema for two‑way feedback between students and teachers.
// This model stores who gave the feedback, who received it, the related course,
// a star rating (1‑5) and optional detailed rating fields.

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fromRole: { type: String, enum: ['student', 'teacher'], required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toRole: { type: String, enum: ['student', 'teacher'], required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    // Optional detailed rating fields (as per spec)
    teachingQuality: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    subjectKnowledge: { type: Number, min: 1, max: 5 },
    explanationClarity: { type: Number, min: 1, max: 5 },
    participation: { type: Number, min: 1, max: 5 },
    attendance: { type: Number, min: 1, max: 5 },
    assignmentPerformance: { type: Number, min: 1, max: 5 },
    behaviour: { type: Number, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
