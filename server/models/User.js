const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Details
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    role: {
      type: String,
      enum: [
        "teacher",
        "student",
        "admin",
        "company-admin",
      ],
      required: true,
    },

    gender: {
      type: String,
    },

    dob: {
      type: String,
    },

    address: {
      type: String,
    },

    rollNumber: {
      type: String,
    },

    employeeId: {
      type: String,
    },

    // Student Grade/Class
    grade: {
      type: String,
      default: "10th",
    },

    // Teacher Login
    teacherId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // Student Login
    studentCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // Parent Login
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // Password
    password: {
      type: String,
      required: true,
    },

    // Tracking & Status
    lastLogin: {
      type: Date,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    loginHistory: [
      {
        date: { type: Date, default: Date.now },
        ipAddress: { type: String, default: "" }
      }
    ],

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      default: null,
    },

    studentId: {
      type: String,
    },

    assignedTeacherIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    assignedClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],

    // Teacher Subjects
    subjects: [
      {
        type: String,
      },
    ],

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);