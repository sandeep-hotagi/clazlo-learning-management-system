const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Homework = require("../models/Homework");
const HomeworkSubmission = require("../models/HomeworkSubmission");
const Class = require("../models/Class");
const User = require("../models/User");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.use(authMiddleware);

/*
=========================================
1. CREATE HOMEWORK
=========================================
*/
router.post("/", async (req, res) => {
  try {
    const { subject, title, description, classId, dueDate } = req.body;

    if (!subject || !title || !classId || !dueDate) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const teacher = await User.findById(req.user.id);
    const targetClass = await Class.findById(classId);
    if (!targetClass) {
      return res.status(404).json({ message: "Class not found." });
    }

    // Role check and class ownership validation
    if (req.user.role === "teacher") {
      const teacherClasses = await Class.find({ teacherId: req.user.id });
      const isAssigned = targetClass.teacherId && targetClass.teacherId.toString() === req.user.id;
      if (!isAssigned && teacherClasses.length > 0) {
        return res.status(403).json({ message: "You are not assigned to this class." });
      }
      if (teacher && teacher.subjects && teacher.subjects.length > 0 && !teacher.subjects.includes(subject)) {
        return res.status(403).json({ message: `You are not assigned to teach ${subject}.` });
      }
    }

    // Save Homework Metadata
    const homework = new Homework({
      subject,
      title,
      description: description || "",
      classId,
      teacherId: req.user.id,
      dueDate: new Date(dueDate),
    });

    await homework.save();

    // Automatically assign the homework to every student in that class
    const studentSubmissions = [];
    if (targetClass.students && targetClass.students.length > 0) {
      const { createNotification } = require("../utils/notify");
      
      for (const studentId of targetClass.students) {
        const submission = new HomeworkSubmission({
          homeworkId: homework._id,
          studentId,
          teacherId: req.user.id,
          classId,
          status: "Pending",
          submittedFile: "",
          submittedAt: null,
          marks: null,
          feedback: "",
          reviewedAt: null,
        });
        await submission.save();
        studentSubmissions.push(submission);

        // Send Notification
        await createNotification(
          studentId,
          "New Homework Assigned",
          `Homework "${title}" has been assigned for ${subject}.`
        );
      }
    }

    // Notify administrators
    try {
      const { createNotification } = require("../utils/notify");
      const admins = await User.find({ role: { $in: ["admin", "company-admin"] } });
      const teacherObj = await User.findById(req.user.id);
      for (const admin of admins) {
        await createNotification(
          admin._id,
          "Homework Created",
          `Teacher "${teacherObj?.name || 'Teacher'}" created homework "${title}" for class "${targetClass.name}".`
        );
      }
    } catch (nErr) {
      console.error("Failed to notify admins on homework creation:", nErr);
    }

    // Trigger Socket.io real-time broadcast
    if (req.io) {
      req.io.emit("homeworkCreated", { homeworkId: homework._id, classId });
      req.io.emit("homeworkAssigned", { classId, homeworkId: homework._id });
    }

    res.status(201).json({
      success: true,
      message: "Homework created and assigned successfully.",
      homework,
      submissionsCreated: studentSubmissions.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
2. GET HOMEWORKS BY CLASS ID
=========================================
*/
router.get("/class/:classId", async (req, res) => {
  try {
    const homeworks = await Homework.find({ classId: req.params.classId })
      .populate("teacherId", "name")
      .sort({ createdAt: -1 });
    res.json(homeworks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
3. GET HOMEWORKS BY TEACHER ID
=========================================
*/
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const homeworks = await Homework.find({ teacherId: req.params.teacherId })
      .populate("classId", "name section")
      .sort({ createdAt: -1 });
    res.json(homeworks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
4. GET HOMEWORK SUBMISSIONS BY STUDENT ID
=========================================
*/
router.get("/student/:studentId", async (req, res) => {
  try {
    const submissions = await HomeworkSubmission.find({ studentId: req.params.studentId })
      .populate({
        path: "homeworkId",
        populate: {
          path: "teacherId",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
5. GET ALL SUBMISSIONS FOR A HOMEWORK (For Teacher review)
=========================================
*/
router.get("/:homeworkId/submissions", async (req, res) => {
  try {
    const submissions = await HomeworkSubmission.find({ homeworkId: req.params.homeworkId })
      .populate("studentId", "name studentCode rollNumber")
      .sort({ status: 1 }); // Submitted/Reviewed first or sorted alphabetically
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
6. SUBMIT HOMEWORK (Student action)
=========================================
*/
router.post("/:homeworkId/submit", async (req, res) => {
  try {
    const { fileUrl, submittedText } = req.body;
    if (!fileUrl && !submittedText) {
      return res.status(400).json({ message: "Submission file URL or text answer is required." });
    }

    const homework = await Homework.findById(req.params.homeworkId);
    if (!homework) {
      return res.status(404).json({ message: "Homework not found." });
    }

    // Check deadline
    if (homework.dueDate && new Date() > homework.dueDate) {
      return res.status(400).json({ message: "Cannot submit homework after the due date." });
    }

    let submission = await HomeworkSubmission.findOne({
      homeworkId: req.params.homeworkId,
      studentId: req.user.id,
    });

    if (submission) {
      // Check if resubmission is allowed
      if (submission.status !== "Pending" && !homework.allowResubmission) {
        return res.status(400).json({ message: "Resubmission is not allowed for this homework." });
      }
    } else {
      // Fallback: create record dynamically if missing
      submission = new HomeworkSubmission({
        homeworkId: req.params.homeworkId,
        studentId: req.user.id,
        teacherId: homework.teacherId,
        classId: homework.classId,
      });
    }

    if (fileUrl !== undefined) submission.submittedFile = fileUrl;
    if (submittedText !== undefined) submission.submittedText = submittedText;
    submission.submittedAt = new Date();
    submission.status = "Submitted";

    await submission.save();

    // Notify the teacher
    try {
      const { createNotification } = require("../utils/notify");
      const studentObj = await User.findById(req.user.id);
      await createNotification(
        homework.teacherId,
        "Homework Submitted",
        `Student "${studentObj?.name || 'Student'}" submitted homework: "${homework.title}".`
      );
    } catch (notifErr) {
      console.error(notifErr);
    }

    // Broadcast trigger
    if (req.io) {
      req.io.emit("homeworkSubmitted", {
        studentId: req.user.id,
        homeworkId: homework._id,
      });
    }

    res.json({ success: true, message: "Homework submitted successfully.", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
6.5 SUBMIT HOMEWORK VIA SUBMISSION ID (Multer Action)
=========================================
*/
router.post("/:submissionId/submit", upload.single("file"), async (req, res) => {
  try {
    const submission = await HomeworkSubmission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission record not found." });
    }

    // Check ownership
    if (submission.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to submit this homework." });
    }

    const homework = await Homework.findById(submission.homeworkId);

    // Check deadline
    if (homework && homework.dueDate && new Date() > homework.dueDate) {
      return res.status(400).json({ message: "Cannot submit homework after the due date." });
    }

    if (submission.status !== "Pending" && homework && !homework.allowResubmission) {
      return res.status(400).json({ message: "Resubmission is not allowed for this homework." });
    }

    let fileUrl = submission.submittedFile;
    if (req.file) {
      fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
    }

    submission.submittedFile = fileUrl;
    if (req.body.submittedText !== undefined) {
      submission.submittedText = req.body.submittedText;
    }
    submission.submittedAt = new Date();
    submission.status = "Submitted";

    await submission.save();

    // Notify the teacher
    try {
      const { createNotification } = require("../utils/notify");
      const studentObj = await User.findById(req.user.id);
      await createNotification(
        submission.teacherId,
        "Homework Submitted",
        `Student "${studentObj?.name || 'Student'}" submitted homework: "${homework?.title || 'Homework'}".`
      );
    } catch (notifErr) {
      console.error(notifErr);
    }

    // Broadcast trigger
    if (req.io) {
      req.io.emit("homeworkSubmitted", {
        homeworkId: submission.homeworkId,
        studentId: req.user.id,
      });
    }

    res.json({ success: true, message: "Homework submitted successfully.", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
7. REVIEW & GRADE SUBMISSION (Teacher action)
=========================================
*/
router.put("/submission/:submissionId/review", async (req, res) => {
  try {
    const { marks, feedback, status } = req.body;

    const submission = await HomeworkSubmission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    submission.marks = marks !== undefined ? Number(marks) : submission.marks;
    submission.feedback = feedback !== undefined ? feedback : submission.feedback;
    submission.status = status || "Reviewed";
    submission.reviewedAt = new Date();

    await submission.save();

    // Notify student
    try {
      const homework = await Homework.findById(submission.homeworkId);
      const { createNotification } = require("../utils/notify");
      await createNotification(
        submission.studentId,
        "Homework Evaluated",
        `Your homework "${homework?.title || 'Task'}" has been graded: ${marks} marks.`
      );
    } catch (notifErr) {
      console.error(notifErr);
    }

    // Broadcast trigger
    if (req.io) {
      req.io.emit("gradesPublished", { studentId: submission.studentId });
      req.io.emit("homeworkReviewed", {
        submissionId: submission._id,
        studentId: submission.studentId
      });
    }

    res.json({ success: true, message: "Submission graded successfully.", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
8. DELETE HOMEWORK
=========================================
*/
router.delete("/:id", async (req, res) => {
  try {
    const homework = await Homework.findById(req.params.id);
    if (!homework) {
      return res.status(404).json({ message: "Homework not found." });
    }

    // Delete all linked submissions
    await HomeworkSubmission.deleteMany({ homeworkId: req.params.id });
    await Homework.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Homework and associated submissions deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
9. GET ALL HOMEWORKS (For Admin view)
=========================================
*/
router.get("/", async (req, res) => {
  try {
    const homeworks = await Homework.find()
      .populate("classId", "name section")
      .populate("teacherId", "name")
      .sort({ createdAt: -1 });
    res.json(homeworks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
10. GET ALL SUBMISSIONS (For Admin view)
=========================================
*/
router.get("/submissions/all", async (req, res) => {
  try {
    const submissions = await HomeworkSubmission.find()
      .populate("studentId", "name studentCode rollNumber")
      .populate("classId", "name section")
      .populate("teacherId", "name")
      .populate("homeworkId", "title subject")
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
