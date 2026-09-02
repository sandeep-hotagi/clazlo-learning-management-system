const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate quiz attempts by same student
quizAttemptSchema.index(
  {
    quizId: 1,
    studentId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
