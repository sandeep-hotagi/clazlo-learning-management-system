const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const { authMiddleware, roleMiddleware } = require("../middleware/auth");

const User = require("../models/User");
const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Attendance = require("../models/Attendance");
const Homework = require("../models/Homework");
const HomeworkSubmission = require("../models/HomeworkSubmission");
const Result = require("../models/Result");
const Notice = require("../models/Notice");
const Timetable = require("../models/Timetable");

router.use(authMiddleware);
router.use(roleMiddleware(["teacher", "admin"]));

/*
=========================================
GET TEACHER DASHBOARD METRICS
=========================================
*/
router.get("/dashboard", async (req, res) => {
  try {
    const classCount = await Class.countDocuments({ teacherId: req.user.id });
    const classes = await Class.find({ teacherId: req.user.id });
    const studentIds = new Set();
    classes.forEach(c => {
      c.students.forEach(s => studentIds.add(s.toString()));
    });
    const studentCount = studentIds.size;

    const attendances = await Attendance.find({ teacherId: req.user.id });
    let totalPresent = 0;
    let totalRecords = 0;
    attendances.forEach(att => {
      att.records.forEach(rec => {
        if (rec.status === "Present") totalPresent++;
        totalRecords++;
      });
    });
    const avgAttendance = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 85;

    const noticeCount = await Notice.countDocuments({ authorId: req.user.id });

    // Workflow statistics
    const totalHomeworkAssigned = await Homework.countDocuments({ teacherId: req.user.id });
    const totalAssignmentsCreated = await Assignment.countDocuments({ teacherId: req.user.id });

    // Query HomeworkSubmission collection
    const submissions = await HomeworkSubmission.find({ teacherId: req.user.id });
    const pendingSubmissions = submissions.filter(sub => sub.status === "Submitted").length;
    const totalActualSubmissions = submissions.filter(sub => ["Submitted", "Reviewed", "Approved", "Rejected"].includes(sub.status)).length;
    const reviewedHomework = submissions.filter(sub => ["Reviewed", "Approved", "Rejected"].includes(sub.status)).length;

    const homeworksList = await Homework.find({ teacherId: req.user.id });
    let totalExpectedSubmissions = 0;
    for (const hw of homeworksList) {
      const cls = await Class.findById(hw.classId);
      if (cls && cls.students) {
        totalExpectedSubmissions += cls.students.length;
      }
    }

    const avgSubmissionRate = totalExpectedSubmissions > 0 
      ? Math.round((totalActualSubmissions / totalExpectedSubmissions) * 100) 
      : 0;

    res.json({
      classCount,
      studentCount,
      avgAttendance: `${avgAttendance}%`,
      noticeCount,
      totalHomeworkAssigned,
      totalAssignmentsCreated,
      pendingSubmissions,
      submittedHomework: totalActualSubmissions,
      reviewedHomework,
      avgSubmissionRate: `${avgSubmissionRate}%`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
GET TEACHER PROFILE
=========================================
*/

router.get("/profile", async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id).select("-password");

    res.json(teacher);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/*
=========================================
CREATE CLASS
=========================================
*/

router.post("/classes", async (req, res) => {
  try {
    const { name, section } = req.body;

    const newClass = new Class({
      name,
      section,
      teacherId: req.user.id,
      students: [],
    });

    await newClass.save();

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: newClass,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/*
=========================================
GET ALL TEACHER CLASSES
=========================================
*/

router.get("/classes", async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { teacherId: req.user.id };
    let classes = await Class.find(query).populate("students", "-password");
    if (classes.length === 0 && req.user.role === "teacher") {
      classes = await Class.find().populate("students", "-password");
    }
    res.json(classes);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/*
=========================================
CREATE STUDENT
=========================================
*/

router.post("/students", async (req, res) => {
  try {
    const {
      name,
      password,
      classId,
    } = req.body;

    const studentCode =
      "STU" +
      Math.floor(100000 + Math.random() * 900000);

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new User({
      name,
      role: "student",
      studentCode,
      password: hashedPassword,
    });

    await student.save();

    if (classId) {
      await Class.findByIdAndUpdate(
        classId,
        {
          $push: {
            students: student._id,
          },
        }
      );
    }

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/*
=========================================
GET ALL STUDENTS
=========================================
*/

router.get("/students", async (req, res) => {
  try {
    const isTeacher = req.user.role === 'teacher';
    const classQuery = isTeacher ? { teacherId: req.user.id } : {};
    
    let classes = await Class.find(classQuery);
    if (isTeacher && classes.length === 0) {
      classes = await Class.find();
    }
    const studentIds = [];
    const classMap = new Map();
    
    classes.forEach(c => {
      c.students.forEach(s => {
        studentIds.push(s);
        classMap.set(s.toString(), { className: c.name, section: c.section });
      });
    });

    const students = await User.find({
      _id: { $in: studentIds },
      role: "student",
    }).select("-password");

    const resultsList = await Result.find({ studentId: { $in: studentIds } });
    
    const enrichedStudents = [];
    for (const s of students) {
      const sIdStr = s._id.toString();
      const cDetails = classMap.get(sIdStr) || { className: s.grade, section: 'A' };

      const submittedHomework = await HomeworkSubmission.countDocuments({
        studentId: s._id,
        status: { $in: ['Submitted', 'Reviewed', 'Approved', 'Rejected'] }
      });

      const submittedAssignments = await AssignmentSubmission.countDocuments({
        studentId: s._id,
        status: { $in: ['Submitted', 'Reviewed', 'Approved', 'Rejected'] }
      });

      const studentResults = resultsList.filter(r => r.studentId.toString() === sIdStr);
      let avgGrade = "N/A";
      if (studentResults.length > 0) {
        const totalMarks = studentResults.reduce((acc, r) => acc + r.marksObtained, 0);
        const maxMarks = studentResults.reduce((acc, r) => acc + r.totalMarks, 0);
        avgGrade = maxMarks > 0 ? `${Math.round((totalMarks / maxMarks) * 100)}%` : "N/A";
      }

      enrichedStudents.push({
        _id: s._id,
        name: s.name,
        studentCode: s.studentCode,
        rollNumber: s.rollNumber,
        gender: s.gender,
        grade: s.grade,
        className: cDetails.className,
        section: cDetails.section,
        isOnline: s.isOnline,
        lastLogin: s.lastLogin,
        homeworkStats: `${submittedHomework} Submitted`,
        assignmentStats: `${submittedAssignments} Submitted`,
        examPerformance: avgGrade
      });
    }

    res.json(enrichedStudents);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});



/*
=========================================
GET CLASS STUDENTS
=========================================
*/
router.get("/classes/:id/students", async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id).populate("students", "-password");
    if (!classObj) {
      return res.status(404).json({ message: "Class not found." });
    }
    if (req.user.role !== 'admin' && classObj.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not assigned to this class." });
    }
    res.json(classObj.students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




/*
=========================================
HOMEWORK ROUTES MIGRATED TO /api/homework
=========================================
*/

/*
=========================================
ADD RESULT
=========================================
*/

router.post("/results", async (req, res) => {

  try {

    const {

      studentId,

      classId,

      subject,

      examType,

      marksObtained,

      totalMarks,

      remarks,

    } = req.body;

    let percentage =
      (marksObtained / totalMarks) * 100;

    let grade = "";

    if (percentage >= 90)

      grade = "A+";

    else if (percentage >= 80)

      grade = "A";

    else if (percentage >= 70)

      grade = "B";

    else if (percentage >= 60)

      grade = "C";

    else

      grade = "F";

    const result = new Result({

      studentId,

      teacherId: req.user.id,

      classId,

      subject,

      examType,

      marksObtained,

      totalMarks,

      grade,

      remarks,

    });

    await result.save();

    try {
      const { createNotification } = require("../utils/notify");
      await createNotification(
        studentId,
        "Marks Published",
        `Exam results for subject "${subject}" (${examType}) have been published: Grade ${grade} (${marksObtained}/${totalMarks}).`
      );
    } catch (nErr) {
      console.error("Failed to notify student on marks publish:", nErr);
    }

    res.status(201).json({
      success: true,
      message: "Result uploaded successfully.",
      result,
    });

  }

  catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

});

/*
=========================================
GET RESULTS
=========================================
*/

router.get("/results", async (req, res) => {

  try {

    const results = await Result.find({

      teacherId: req.user.id,

    })

      .populate("studentId", "name studentCode")

      .populate("classId", "name section");

    res.json(results);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/*
=========================================
GET TIMETABLE (TEACHER SCHEDULE)
=========================================
*/
router.get("/timetable", async (req, res) => {
  try {
    const timetable = await Timetable.find({ "slots.teacherId": req.user.id })
      .populate("classId", "name section");
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
CREATE NOTICE
=========================================
*/
router.post("/notices", async (req, res) => {
  try {
    const { title, content, classId } = req.body;
    const notice = new Notice({
      title,
      content,
      classId: classId || null,
      authorId: req.user.id
    });
    await notice.save();
    res.status(201).json({ success: true, notice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/notices", async (req, res) => {
  try {
    const notices = await Notice.find({ authorId: req.user.id })
      .populate("classId", "name section");
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
DELETE HOMEWORK
=========================================
*/
router.delete("/homework/:id", async (req, res) => {
  try {
    const homework = await Homework.findOneAndDelete({
      _id: req.params.id,
      teacherId: req.user.id,
    });

    if (!homework) {
      return res.status(404).json({
        message: "Homework not found",
      });
    }

    res.json({
      success: true,
      message: "Homework deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/*
=========================================
UPDATE HOMEWORK
=========================================
*/
router.put("/homework/:id", async (req, res) => {
  try {
    const homework = await Homework.findOneAndUpdate(
      {
        _id: req.params.id,
        teacherId: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!homework) {
      return res.status(404).json({
        message: "Homework not found",
      });
    }

    res.json({
      success: true,
      homework,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/*
=========================================
VIEW ASSIGNMENT SUBMISSIONS
=========================================
*/
router.get("/assignments/:id/submissions", async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({ assignmentId: req.params.id })
      .populate("studentId", "name studentCode rollNumber");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
GRADE ASSIGNMENT
=========================================
*/
router.put("/assignments/:id/grade", async (req, res) => {
  try {
    const { studentId, marks, remarks, status } = req.body;
    const submission = await AssignmentSubmission.findOne({
      assignmentId: req.params.id,
      studentId
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    submission.marks = marks !== undefined ? Number(marks) : submission.marks;
    submission.feedback = remarks !== undefined ? remarks : submission.feedback;
    submission.status = status || "Reviewed";
    submission.reviewedAt = new Date();

    await submission.save();

    // Notify the student
    const { createNotification } = require("../utils/notify");
    const assignment = await Assignment.findById(req.params.id);
    await createNotification(
      studentId,
      "Assignment Evaluated",
      `Your assignment "${assignment?.title || 'Assignment'}" has been evaluated: Status is now "${submission.status}".`
    );

    if (req.io) {
      req.io.emit("gradesPublished", { studentId, taskId: req.params.id, type: "assignment" });
      req.io.emit("assignmentReviewed", { studentId });
    }

    res.json({
      success: true,
      message: "Assignment graded successfully.",
      submission
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;