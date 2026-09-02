const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
  },
  type: {
    type: String,
    enum: ["academic", "event", "admin", "cca", "visit", "holiday", "exam"],
    default: "event",
  },
  location: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
