const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");

const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const Class = require("../models/Class");
const User = require("../models/User");

router.use(authMiddleware);

/*
=========================================
1. CREATE QUIZ
=========================================
*/
router.post("/", async (req, res) => {
  try {
    const { title, subject, classId, durationMinutes, negativeMarking, questions } = req.body;

    if (!title || !subject || !classId || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Missing required fields or questions." });
    }

    const quiz = new Quiz({
      title,
      subject,
      classId,
      teacherId: req.user.id,
      durationMinutes: Number(durationMinutes) || 15,
      negativeMarking: Boolean(negativeMarking),
      questions,
    });

    await quiz.save();

    // Trigger real-time broadcast to class
    if (req.io) {
      req.io.emit("quizPublished", { quizId: quiz._id, classId });
    }

    res.status(201).json({ success: true, message: "Quiz created and published successfully.", quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
2. GET QUIZZES BY CLASS ID (For Students)
=========================================
*/
router.get("/class/:classId", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ classId: req.params.classId })
      .populate("teacherId", "name")
      .sort({ createdAt: -1 });

    // For each quiz, append if the student has attempted it
    const enriched = [];
    for (const q of quizzes) {
      const attempt = await QuizAttempt.findOne({ quizId: q._id, studentId: req.user.id });
      enriched.push({
        ...q.toObject(),
        attempted: !!attempt,
        attemptDetails: attempt || null
      });
    }

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
3. SUBMIT QUIZ ATTEMPT (Student action)
=========================================
*/
router.post("/:quizId/attempt", async (req, res) => {
  try {
    const { answers } = req.body; // e.g. { "Q1_id": "Option A" }
    
    if (!answers) {
      return res.status(400).json({ message: "Answers are required." });
    }

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    // Check if already attempted
    const existingAttempt = await QuizAttempt.findOne({ quizId: quiz._id, studentId: req.user.id });
    if (existingAttempt) {
      return res.status(400).json({ message: "You have already attempted this quiz." });
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((q) => {
      const studentAnswer = answers[q._id.toString()];
      if (studentAnswer === q.answer) {
        score += 1;
      } else if (studentAnswer !== undefined && studentAnswer !== "" && quiz.negativeMarking) {
        score -= 0.25; // Apply negative marking of -0.25 for wrong answers
      }
    });

    // Score cannot be less than 0
    if (score < 0) score = 0;

    const percentage = Math.round((score / totalQuestions) * 100);

    const attempt = new QuizAttempt({
      quizId: quiz._id,
      studentId: req.user.id,
      score,
      totalQuestions,
      percentage,
      answers,
    });

    await attempt.save();

    res.status(201).json({
      success: true,
      message: "Quiz submitted successfully.",
      score,
      totalQuestions,
      percentage,
      attempt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
4. GET LEADERBOARD FOR A QUIZ
=========================================
*/
router.get("/:quizId/leaderboard", async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ quizId: req.params.quizId })
      .populate("studentId", "name studentCode rollNumber")
      .sort({ score: -1, completedAt: 1 });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
5. GET QUIZZES BY TEACHER ID (For Teachers)
=========================================
*/
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacherId: req.params.teacherId })
      .populate("classId", "name section")
      .sort({ createdAt: -1 });

    const enriched = [];
    for (const q of quizzes) {
      const attemptsCount = await QuizAttempt.countDocuments({ quizId: q._id });
      const attempts = await QuizAttempt.find({ quizId: q._id });
      const avgScore = attempts.length > 0
        ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length * 10) / 10
        : 0;

      enriched.push({
        ...q.toObject(),
        attemptsCount,
        averageScore: avgScore
      });
    }

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
6. DELETE QUIZ
=========================================
*/
router.delete("/:id", async (req, res) => {
  try {
    await QuizAttempt.deleteMany({ quizId: req.params.id });
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Quiz deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
