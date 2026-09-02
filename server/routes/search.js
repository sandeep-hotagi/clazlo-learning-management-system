const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");

const User = require("../models/User");
const Class = require("../models/Class");
const Homework = require("../models/Homework");
const Assignment = require("../models/Assignment");
const Exam = require("../models/Exam");
const Notice = require("../models/Notice");

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim() === "") {
      return res.json({
        students: [],
        teachers: [],
        classes: [],
        homework: [],
        assignments: [],
        exams: [],
        notices: []
      });
    }

    const searchRegex = new RegExp(query.trim(), "i");

    // Perform queries in parallel
    const [students, teachers, classes, homework, assignments, exams, notices] = await Promise.all([
      // 1. Students search
      User.find({ role: "student", name: searchRegex }).select("name studentCode grade").limit(5),
      
      // 2. Teachers search
      User.find({ role: "teacher", name: searchRegex }).select("name subjects phone").limit(5),

      // 3. Classes search
      Class.find({ name: searchRegex }).select("name section").limit(5),

      // 4. Homework search
      Homework.find({ $or: [{ title: searchRegex }, { subject: searchRegex }] }).select("title subject classId").limit(5),

      // 5. Assignments search
      Assignment.find({ $or: [{ title: searchRegex }, { subject: searchRegex }] }).select("title subject grade").limit(5),

      // 6. Exams search
      Exam.find({ title: searchRegex }).select("title classId date").limit(5),

      // 7. Notices search
      Notice.find({ title: searchRegex }).select("title content date").limit(5),
    ]);

    res.json({
      students,
      teachers,
      classes,
      homework,
      assignments,
      exams,
      notices
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
