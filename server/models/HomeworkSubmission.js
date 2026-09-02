const mongoose = require("mongoose");

const homeworkSubmissionSchema = new mongoose.Schema(
  {
    homeworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Homework",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Submitted", "Reviewed", "Approved", "Rejected"],
      default: "Pending",
    },

    submittedFile: {
      type: String,
      default: "",
    },

    submittedText: {
      type: String,
      default: "",
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    marks: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate submissions by the same student for the same homework
homeworkSubmissionSchema.index(
  {
    homeworkId: 1,
    studentId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("HomeworkSubmission", homeworkSubmissionSchema);
