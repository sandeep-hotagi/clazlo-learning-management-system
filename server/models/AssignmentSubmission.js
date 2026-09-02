const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
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

    grade: {
      type: String,
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

// Prevent duplicate assignment submissions by same student
assignmentSubmissionSchema.index(
  {
    assignmentId: 1,
    studentId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);
