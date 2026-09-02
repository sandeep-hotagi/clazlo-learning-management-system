const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");

const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Class = require("../models/Class");
const User = require("../models/User");

router.use(authMiddleware);

/*
=========================================
1. CREATE ASSIGNMENT
=========================================
*/
router.post("/", async (req, res) => {
  try {
    const { title, subject, description, classId, grade, dueDate } = req.body;

    if (!subject || !title || !dueDate) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const teacher = await User.findById(req.user.id);
    let resolvedGrade = grade;
    let targetClass = null;

    if (classId) {
      targetClass = await Class.findById(classId);
      if (targetClass) {
        // Class 8 -> 8th
        const num = targetClass.name.replace(/\D/g, "");
        resolvedGrade = `${num}th`;
      }
    } else if (grade) {
      // Find class matching the grade
      const num = grade.replace(/\D/g, "");
      targetClass = await Class.findOne({ name: `Class ${num}` });
    }

    if (!targetClass && !resolvedGrade) {
      return res.status(400).json({ message: "Target Class or Grade is required." });
    }

    // Role check and validation
    if (req.user.role === "teacher") {
      const teacherClasses = await Class.find({ teacherId: req.user.id });
      if (targetClass) {
        const isAssigned = targetClass.teacherId && targetClass.teacherId.toString() === req.user.id;
        if (!isAssigned && teacherClasses.length > 0) {
          return res.status(403).json({ message: "You are not assigned to this class." });
        }
      }
      if (teacher && teacher.subjects && teacher.subjects.length > 0 && !teacher.subjects.includes(subject)) {
        return res.status(403).json({ message: `You are not assigned to teach ${subject}.` });
      }
    }

    // Save Assignment Metadata
    const assignment = new Assignment({
      title,
      subject,
      description: description || "",
      grade: resolvedGrade || "10th",
      classId: targetClass ? targetClass._id : null,
      teacherId: req.user.id,
      dueDate: new Date(dueDate),
    });

    await assignment.save();

    // Automatically assign the assignment to every student in that class/grade
    const studentSubmissions = [];
    const studentQuery = targetClass 
      ? { _id: { $in: targetClass.students } }
      : { role: "student", grade: resolvedGrade };

    const students = await User.find(studentQuery);

    if (students && students.length > 0) {
      const { createNotification } = require("../utils/notify");

      for (const student of students) {
        const submission = new AssignmentSubmission({
          assignmentId: assignment._id,
          studentId: student._id,
          teacherId: req.user.id,
          grade: resolvedGrade || "10th",
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
          student._id,
          "New Assignment Assigned",
          `Assignment "${title}" has been assigned for ${subject}.`
        );
      }
    }

    // Trigger Socket.io real-time broadcast
    if (req.io) {
      req.io.emit("assignmentCreated", { assignmentId: assignment._id, grade: resolvedGrade });
    }

    res.status(201).json({
      success: true,
      message: "Assignment created and assigned successfully.",
      assignment,
      submissionsCreated: studentSubmissions.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
2. GET ASSIGNMENTS BY TEACHER ID
=========================================
*/
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacherId: req.params.teacherId })
      .populate("classId", "name section")
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
3. GET ASSIGNMENTS SUBMISSIONS BY STUDENT ID
=========================================
*/
router.get("/student/:studentId", async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({ studentId: req.params.studentId })
      .populate({
        path: "assignmentId",
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
4. GET ALL SUBMISSIONS FOR AN ASSIGNMENT (For Teacher review)
=========================================
*/
router.get("/:assignmentId/submissions", async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({ assignmentId: req.params.assignmentId })
      .populate("studentId", "name studentCode rollNumber")
      .sort({ status: 1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
5. SUBMIT ASSIGNMENT (Student action)
=========================================
*/
router.post("/:assignmentId/submit", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ message: "Submission file URL is required." });
    }

    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    // Check deadline
    if (assignment.dueDate && new Date() > assignment.dueDate) {
      return res.status(400).json({ message: "Cannot submit assignment after the due date." });
    }

    let submission = await AssignmentSubmission.findOne({
      assignmentId: req.params.assignmentId,
      studentId: req.user.id,
    });

    if (!submission) {
      submission = new AssignmentSubmission({
        assignmentId: req.params.assignmentId,
        studentId: req.user.id,
        teacherId: assignment.teacherId,
        grade: assignment.grade,
      });
    }

    submission.submittedFile = fileUrl;
    submission.submittedAt = new Date();
    submission.status = "Submitted";

    await submission.save();

    // Notify teacher
    try {
      const { createNotification } = require("../utils/notify");
      const studentObj = await User.findById(req.user.id);
      await createNotification(
        assignment.teacherId,
        "Assignment Submitted",
        `Student "${studentObj?.name || 'Student'}" submitted assignment: "${assignment.title}".`
      );
    } catch (notifErr) {
      console.error(notifErr);
    }

    // Broadcast trigger
    if (req.io) {
      req.io.emit("assignmentSubmitted", {
        studentId: req.user.id,
        assignmentId: assignment._id,
      });
    }

    res.json({ success: true, message: "Assignment submitted successfully.", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
6. REVIEW & GRADE ASSIGNMENT SUBMISSION (Teacher action)
=========================================
*/
router.put("/submission/:submissionId/review", async (req, res) => {
  try {
    const { marks, feedback, status } = req.body;

    const submission = await AssignmentSubmission.findById(req.params.submissionId);
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
      const assignment = await Assignment.findById(submission.assignmentId);
      const { createNotification } = require("../utils/notify");
      await createNotification(
        submission.studentId,
        "Assignment Evaluated",
        `Your assignment "${assignment?.title || 'Task'}" has been graded: ${marks} marks.`
      );
    } catch (notifErr) {
      console.error(notifErr);
    }

    // Broadcast trigger
    if (req.io) {
      req.io.emit("assignmentReviewed", { studentId: submission.studentId });
    }

    res.json({ success: true, message: "Submission graded successfully.", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
7. DELETE ASSIGNMENT
=========================================
*/
router.delete("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    await AssignmentSubmission.deleteMany({ assignmentId: req.params.id });
    await Assignment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Assignment and submissions deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
8. GET ALL ASSIGNMENTS (Admin view)
=========================================
*/
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("classId", "name section")
      .populate("teacherId", "name")
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
9. GET ALL SUBMISSIONS (Admin view)
=========================================
*/
router.get("/submissions/all", async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find()
      .populate("studentId", "name studentCode rollNumber")
      .populate("classId", "name section")
      .populate("teacherId", "name")
      .populate("assignmentId", "title subject")
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
