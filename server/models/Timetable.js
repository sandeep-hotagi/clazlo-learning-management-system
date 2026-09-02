const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { _id: false });

const timetableSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true,
  },
  slots: [slotSchema],
}, { timestamps: true });

module.exports = mongoose.model("Timetable", timetableSchema);
