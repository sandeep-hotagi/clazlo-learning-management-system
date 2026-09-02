// server/routes/feedback.js
// Routes for two‑way feedback between students and teachers.

const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const authMiddleware = require('../middleware/auth'); // assumes existing auth middleware
const roleCheck = require('../middleware/roleCheck'); // helper to enforce role, create if missing

// Helper to enforce that user has appropriate role for a route
const requireRole = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }
  next();
};

// POST student -> teacher feedback
router.post(
  '/student-to-teacher',
  authMiddleware,
  requireRole(['student']),
  async (req, res) => {
    try {
      const { toUser, course, rating, teachingQuality, communication, subjectKnowledge, explanationClarity, comment } = req.body;
      // Basic validation
      if (!toUser || !course || !rating) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      // Prevent duplicate within 24h
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const duplicate = await Feedback.findOne({
        fromUser: req.user._id,
        toUser,
        course,
        fromRole: 'student',
        toRole: 'teacher',
        createdAt: { $gte: oneDayAgo },
      });
      if (duplicate) {
        return res.status(409).json({ message: 'Feedback already submitted within 24h' });
      }
      const feedback = new Feedback({
        fromUser: req.user._id,
        fromRole: 'student',
        toUser,
        toRole: 'teacher',
        course,
        rating,
        teachingQuality,
        communication,
        subjectKnowledge,
        explanationClarity,
        comment,
      });
      await feedback.save();
      res.status(201).json(feedback);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// POST teacher -> student feedback
router.post(
  '/teacher-to-student',
  authMiddleware,
  requireRole(['teacher']),
  async (req, res) => {
    try {
      const { toUser, course, rating, participation, attendance, assignmentPerformance, behaviour, comment } = req.body;
      if (!toUser || !course || !rating) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const duplicate = await Feedback.findOne({
        fromUser: req.user._id,
        toUser,
        course,
        fromRole: 'teacher',
        toRole: 'student',
        createdAt: { $gte: oneDayAgo },
      });
      if (duplicate) {
        return res.status(409).json({ message: 'Feedback already submitted within 24h' });
      }
      const feedback = new Feedback({
        fromUser: req.user._id,
        fromRole: 'teacher',
        toUser,
        toRole: 'student',
        course,
        rating,
        participation,
        attendance,
        assignmentPerformance,
        behaviour,
        comment,
      });
      await feedback.save();
      res.status(201).json(feedback);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// GET feedback submitted by current user
router.get('/my-submitted', authMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ fromUser: req.user._id })
      .populate('toUser', 'name email')
      .populate('course', 'title code');
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET feedback received by current user
router.get('/received', authMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ toUser: req.user._id })
      .populate('fromUser', 'name email')
      .populate('course', 'title code');
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all feedback for admin (school admin only)
router.get('/admin', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    // Optionally filter by query params (type, course, dates, etc.)
    const filter = {};
    if (req.query.fromRole) filter.fromRole = req.query.fromRole;
    if (req.query.toRole) filter.toRole = req.query.toRole;
    if (req.query.course) filter.course = req.query.course;
    const feedbacks = await Feedback.find(filter)
      .populate('fromUser', 'name email role')
      .populate('toUser', 'name email role')
      .populate('course', 'title code');
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE feedback (admin only)
router.delete('/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
