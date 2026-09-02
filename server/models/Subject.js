const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  grade: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Subject", SubjectSchema);