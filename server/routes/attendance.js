const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");

const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const User = require("../models/User");

router.use(authMiddleware);

/*
=========================================
1. GET ATTENDANCE BY CLASS AND DATE
=========================================
*/
router.get("/:classId/:date", async (req, res) => {
  try {
    const { classId, date } = req.params;
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found." });
    }

    const attendance = await Attendance.findOne({
      classId,
      date: queryDate,
    }).populate("records.studentId", "name studentCode rollNumber gender");

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
2. MARK / SAVE / EDIT ATTENDANCE
=========================================
*/
router.post("/", async (req, res) => {
  try {
    const { classId, date, records } = req.body;

    if (!classId || !date || !records) {
      return res.status(400).json({
        message: "classId, date, and records are required",
      });
    }

    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found." });
    }

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    // Check if record exists for today
    let attendance = await Attendance.findOne({ classId, date: queryDate });

    if (attendance) {
      attendance.records = records;
    } else {
      attendance = new Attendance({
        classId,
        teacherId: req.user.id,
        date: queryDate,
        records,
      });
    }

    await attendance.save();

    // Notify administrators
    try {
      const { createNotification } = require("../utils/notify");
      const admins = await User.find({ role: { $in: ["admin", "company-admin"] } });
      for (const admin of admins) {
        await createNotification(
          admin._id,
          "Attendance Marked",
          `Attendance marked for Class "${classObj.name}" on ${queryDate.toLocaleDateString()}.`
        );
      }
    } catch (nErr) {
      console.error("Failed to notify admins on attendance mark:", nErr);
    }

    // Trigger Socket.io real-time broadcast
    if (req.io) {
      req.io.emit("attendanceUpdated", { classId, date: queryDate });
      req.io.emit("attendanceMarked", { classId, date: queryDate });
    }

    res.status(201).json({
      success: true,
      message: "Attendance records saved successfully.",
      attendance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
3. UPDATE ATTENDANCE BY ID
=========================================
*/
router.put("/:id", async (req, res) => {
  try {
    const { records } = req.body;
    if (!records) {
      return res.status(400).json({ message: "records list is required" });
    }

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    attendance.records = records;
    await attendance.save();

    if (req.io) {
      req.io.emit("attendanceUpdated", { classId: attendance.classId, date: attendance.date });
    }

    res.json({ success: true, message: "Attendance updated successfully.", attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
4. GET CLASS ATTENDANCE HISTORY
=========================================
*/
router.get("/history/:classId", async (req, res) => {
  try {
    const history = await Attendance.find({ classId: req.params.classId })
      .populate("records.studentId", "name studentCode rollNumber")
      .sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
