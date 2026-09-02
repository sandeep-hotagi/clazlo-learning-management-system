const express = require("express");
const router = express.Router();

const { authMiddleware, roleMiddleware } = require("../middleware/auth");

const User = require("../models/User");
const Class = require("../models/Class");
const Attendance = require("../models/Attendance");
const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Homework = require("../models/Homework");
const Result = require("../models/Result");
const Subject = require("../models/Subject");
const Message = require("../models/Message");
const Timetable = require("../models/Timetable");
const Exam = require("../models/Exam");

router.use(authMiddleware);
router.use(roleMiddleware(["student"]));

/*
=========================================
STUDENT PROFILE
=========================================
*/
router.get("/profile", async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select("-password");
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
UPDATE STUDENT PROFILE
=========================================
*/
router.put("/profile", async (req, res) => {
  try {
    const { name, gender, dob, address, phone } = req.body;
    const student = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    student.name = name !== undefined ? name : student.name;
    student.gender = gender !== undefined ? gender : student.gender;
    student.dob = dob !== undefined ? dob : student.dob;
    student.address = address !== undefined ? address : student.address;
    student.phone = phone !== undefined ? phone : student.phone;

    await student.save();

    if (req.io) {
      req.io.emit("studentProfileUpdated", {
        studentId: student._id,
        name: student.name,
        gender: student.gender,
        dob: student.dob,
        address: student.address,
        phone: student.phone
      });
    }

    res.json({ success: true, message: "Profile updated successfully.", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
ATTENDANCE
=========================================
*/
router.get("/attendance", async (req, res) => {
  try {
    const studentId = req.user.id;
    const attendances = await Attendance.find({ "records.studentId": studentId });
    const formatted = attendances.map(att => {
      const rec = att.records.find(r => r.studentId.toString() === studentId);
      return {
        date: att.date.toISOString().split('T')[0],
        status: rec.status
      };
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
SUBJECTS
=========================================
*/
router.get("/subjects", async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    const subjects = await Subject.find({ grade: student.grade });
    const transformed = subjects.map(s => {
      const obj = s.toObject();
      obj.teacherId = { name: s.teacher };
      return obj;
    });
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



/*
=========================================
MY ASSIGNMENT SUBMISSIONS
=========================================
*/
router.get("/my-assignments", async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({ studentId: req.user.id }).populate("assignmentId");
    const result = submissions.map(sub => {
      const ass = sub.assignmentId || {};
      return {
        assignmentId: ass._id,
        title: ass.title || "Assignment Task",
        subject: ass.subject || "General Studies",
        dueDate: ass.dueDate,
        marks: sub.marks,
        remarks: sub.feedback || sub.remarks || "",
        status: sub.status,
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
MESSAGES (REAL TIME PERSISTENCE)
=========================================
*/
router.get("/messages", async (req, res) => {
  try {
    const studentClass = await Class.findOne({ students: req.user.id });
    if (!studentClass) return res.json([]);
    const messages = await Message.find({ classId: studentClass._id })
      .populate("senderId", "name role")
      .sort({ createdAt: 1 });
    
    // Format to match UI ChatBox compatibility
    const formatted = messages.map(msg => ({
      id: msg._id,
      sender: msg.senderId?.name || "System",
      senderRole: msg.senderId?.role || "admin",
      text: msg.message,
      time: new Date(msg.createdAt).toLocaleTimeString(),
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/messages", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Message cannot be empty." });

    const studentClass = await Class.findOne({ students: req.user.id });
    if (!studentClass) return res.status(400).json({ message: "No class associated with student." });

    const message = new Message({
      senderId: req.user.id,
      classId: studentClass._id,
      message: text
    });
    await message.save();

    const sender = await User.findById(req.user.id);
    const data = {
      id: message._id,
      sender: sender.name,
      senderRole: sender.role,
      text: message.message,
      time: new Date().toLocaleTimeString()
    };

    res.json({ success: true, message: "Message sent successfully.", data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
EXAM RESULTS
=========================================
*/
router.get("/exam-results", async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user.id });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/results", async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user.id });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
TIMETABLE
=========================================
*/
router.get("/timetable", async (req, res) => {
  try {
    const studentClass = await Class.findOne({ students: req.user.id });
    if (!studentClass) return res.json({ slots: [] });

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[new Date().getDay()];
    let timetable = await Timetable.findOne({ classId: studentClass._id, day: currentDay });
    if (!timetable) {
      timetable = await Timetable.findOne({ classId: studentClass._id, day: "Monday" });
    }

    if (!timetable) {
      return res.json({ slots: [] });
    }

    const formattedSlots = timetable.slots.map(slot => ({
      timeSlot: slot.time,
      subject: slot.subject,
      roomNo: "Room 101"
    }));

    res.json({ slots: formattedSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;