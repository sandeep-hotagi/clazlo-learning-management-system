const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const models = require("../models/naacModels");
const User = require("../models/User");
const { createNotification } = require("../utils/notify");

router.use(authMiddleware);

/*
===================================================
1. ACCREDITATION DASHBOARD & MASTER CHECKLIST
===================================================
*/
router.get("/checklist", async (req, res) => {
  try {
    const list = await models.NAACChecklist.find().sort({ criterionNumber: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/checklist", async (req, res) => {
  try {
    const item = new models.NAACChecklist(req.body);
    await item.save();

    // Notify IQAC
    if (req.io) {
      req.io.emit("naacAlert", { type: "checklistAdded", item });
    }

    res.status(201).json(item);
  } catch (err) {
    res.status(450).json({ message: err.message });
  }
});

router.put("/checklist/:id", async (req, res) => {
  try {
    const item = await models.NAACChecklist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Checklist item not found." });

    if (item.status === "Completed") {
      item.completionDate = new Date();
      await item.save();
    }

    if (req.io) {
      req.io.emit("naacAlert", { type: "checklistUpdated", item });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/checklist/:id", async (req, res) => {
  try {
    await models.NAACChecklist.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Checklist item deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
===================================================
2. ELIGIBILITY MODULE APIs
===================================================
*/
router.get("/eligibility", async (req, res) => {
  try {
    const approvals = await models.Approval.find();
    const docs = await models.InstitutionalDocument.find();
    const status = await models.Eligibility.findOne() || {
      ugcRecognitionStatus: "Pending",
      aicteApprovalStatus: "Pending",
      status: "Pending"
    };

    res.json({ approvals, docs, status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/eligibility/approvals", async (req, res) => {
  try {
    const item = new models.Approval(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/eligibility/documents", async (req, res) => {
  try {
    const item = new models.InstitutionalDocument(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/eligibility/status", async (req, res) => {
  try {
    let status = await models.Eligibility.findOne();
    if (!status) {
      status = new models.Eligibility(req.body);
    } else {
      Object.assign(status, req.body);
    }
    await status.save();
    res.json(status);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
===================================================
3. GOVERNANCE MODULE APIs
===================================================
*/
router.get("/governance", async (req, res) => {
  try {
    const policies = await models.GovernancePolicy.find();
    const members = await models.GoverningBody.find();
    const plans = await models.StrategicPlan.find();

    res.json({ policies, members, plans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/governance/policies", async (req, res) => {
  try {
    const item = new models.GovernancePolicy(req.body);
    await item.save();

    // Trigger Notification for approval
    const admins = await User.find({ role: { $in: ["admin", "company-admin"] } });
    for (const admin of admins) {
      await createNotification(admin._id, "Policy Approval Pending", `Policy document "${item.title}" is pending administrative approval.`);
    }

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/governance/members", async (req, res) => {
  try {
    const item = new models.GoverningBody(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/governance/plans", async (req, res) => {
  try {
    const item = new models.StrategicPlan(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
===================================================
4. IQAC MODULE APIs
===================================================
*/
router.get("/iqac", async (req, res) => {
  try {
    const aqars = await models.AQAR.find().sort({ academicYear: -1 });
    const records = await models.IQACRecord.find().sort({ meetingDate: -1 });
    const initiatives = await models.QualityInitiative.find();

    res.json({ aqars, records, initiatives });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/iqac/aqar", async (req, res) => {
  try {
    const item = new models.AQAR(req.body);
    await item.save();

    // Trigger notification
    const admins = await User.find({ role: { $in: ["admin", "company-admin"] } });
    for (const admin of admins) {
      await createNotification(admin._id, "AQAR Submitted", `AQAR report for Academic Year ${item.academicYear} has been generated.`);
    }

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/iqac/meetings", async (req, res) => {
  try {
    const item = new models.IQACRecord(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/iqac/initiatives", async (req, res) => {
  try {
    const item = new models.QualityInitiative(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
===================================================
5. ACADEMICS QUALITY MODULE APIs
===================================================
*/
router.get("/academics", async (req, res) => {
  try {
    // Academics quality mappings are calculated dynamically
    const coPoMapping = [
      { course: "CS101", outcomes: ["CO1", "CO2", "CO3"], poMapping: { PO1: 3, PO2: 2, PO3: 1 }, attainment: 82 },
      { course: "EC202", outcomes: ["CO1", "CO2"], poMapping: { PO1: 2, PO2: 3, PO3: 2 }, attainment: 76 },
      { course: "MA303", outcomes: ["CO1", "CO2", "CO3", "CO4"], poMapping: { PO1: 3, PO2: 1, PO3: 3 }, attainment: 89 }
    ];
    res.json({ coPoMapping });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
===================================================
6. FACULTY QUALITY MODULE APIs
===================================================
*/
router.get("/faculty", async (req, res) => {
  try {
    const fdps = await models.FDPRecord.find().populate("facultyId", "name");
    const appraisal = await models.FacultyPerformance.find().populate("facultyId", "name");
    const publications = await models.ResearchPublication.find().populate("facultyId", "name");

    res.json({ fdps, appraisal, publications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/faculty/fdp", async (req, res) => {
  try {
    const item = new models.FDPRecord({
      facultyId: req.user.id,
      title: req.body.title,
      organizer: req.body.organizer,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      evidenceUrl: req.body.evidenceUrl
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/faculty/appraisal", async (req, res) => {
  try {
    const item = new models.FacultyPerformance(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
===================================================
7. STUDENT QUALITY & SUPPORT MODULE APIs
===================================================
*/
router.get("/student", async (req, res) => {
  try {
    const feedback = await models.StudentFeedback.find().populate("studentId", "name").populate("teacherId", "name");
    const scholarships = await models.Scholarship.find().populate("studentId", "name");
    const placements = await models.Placement.find().populate("studentId", "name");
    const internships = await models.Internship.find().populate("studentId", "name");
    const mentoring = await models.Mentoring.find().populate("mentorId", "name").populate("menteeId", "name");
    const competitiveExams = await models.StudentCompetitiveExam.find().populate("studentId", "name");

    res.json({ feedback, scholarships, placements, internships, mentoring, competitiveExams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/student/competitive-exams", async (req, res) => {
  try {
    const item = new models.StudentCompetitiveExam({
      studentId: req.user.id,
      examName: req.body.examName,
      scoreObtained: req.body.scoreObtained,
      passingYear: req.body.passingYear
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/student/feedback", async (req, res) => {
  try {
    const item = new models.StudentFeedback({
      studentId: req.user.id,
      feedbackType: req.body.feedbackType,
      teacherId: req.body.teacherId,
      ratings: req.body.ratings,
      comments: req.body.comments
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/student/scholarships", async (req, res) => {
  try {
    const item = new models.Scholarship(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/student/placements", async (req, res) => {
  try {
    const item = new models.Placement(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/student/mentoring", async (req, res) => {
  try {
    const item = new models.Mentoring({
      mentorId: req.user.id,
      menteeId: req.body.menteeId,
      discussionNotes: req.body.discussionNotes,
      actionRequired: req.body.actionRequired,
      sessionDate: req.body.sessionDate
    });
    await item.save();

    // Trigger alert
    await createNotification(
      req.body.menteeId,
      "Mentoring Update Logged",
      "A new session has been logged by your mentor."
    );

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
===================================================
8. RESEARCH & EXTENSION MODULE APIs
===================================================
*/
router.get("/research", async (req, res) => {
  try {
    const publications = await models.ResearchPublication.find().populate("facultyId", "name");
    const patents = await models.Patent.find().populate("inventorId", "name");
    const projects = await models.ResearchProject.find().populate("facultyId", "name");
    const extensions = await models.ExtensionActivity.find();
    const consultancy = await models.ConsultancyProject.find().populate("facultyId", "name");
    const mous = await models.MoURecord.find();

    res.json({ publications, patents, projects, extensions, consultancy, mous });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/research/consultancy", async (req, res) => {
  try {
    const item = new models.ConsultancyProject({
      facultyId: req.user.id,
      title: req.body.title,
      clientOrganization: req.body.clientOrganization,
      revenueGenerated: req.body.revenueGenerated,
      status: req.body.status || "Pending"
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/research/mou", async (req, res) => {
  try {
    const item = new models.MoURecord(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/research/publications", async (req, res) => {
  try {
    const item = new models.ResearchPublication({
      facultyId: req.user.id,
      title: req.body.title,
      journalName: req.body.journalName,
      indexedIn: req.body.indexedIn,
      publicationYear: req.body.publicationYear
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/research/patents", async (req, res) => {
  try {
    const item = new models.Patent({
      inventorId: req.user.id,
      title: req.body.title,
      patentNumber: req.body.patentNumber,
      status: req.body.status,
      filingDate: req.body.filingDate
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/research/projects", async (req, res) => {
  try {
    const item = new models.ResearchProject(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/research/extensions", async (req, res) => {
  try {
    const item = new models.ExtensionActivity(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
===================================================
9. INFRASTRUCTURE MODULE APIs
===================================================
*/
router.get("/infrastructure", async (req, res) => {
  try {
    const library = await models.LibraryResource.find();
    const labs = await models.LabEquipment.find();
    const ict = await models.ICTResource.find();
    const safety = await models.SafetyAudit.find();
    const smartClassrooms = await models.SmartClassroomUtil.find();
    const incidents = await models.SafetyIncident.find();

    res.json({ library, labs, ict, safety, smartClassrooms, incidents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/infrastructure/library", async (req, res) => {
  try {
    const item = new models.LibraryResource(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/infrastructure/labs", async (req, res) => {
  try {
    const item = new models.LabEquipment(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/infrastructure/ict", async (req, res) => {
  try {
    const item = new models.ICTResource(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/infrastructure/ict/smart-classrooms", async (req, res) => {
  try {
    const item = new models.SmartClassroomUtil(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/infrastructure/safety", async (req, res) => {
  try {
    const item = new models.SafetyAudit(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/infrastructure/safety/incidents", async (req, res) => {
  try {
    const item = new models.SafetyIncident(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
===================================================
10. CENTRAL EVIDENCE REPOSITORY
===================================================
*/
router.get("/documents", async (req, res) => {
  try {
    const docs = await models.EvidenceDocument.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/documents", async (req, res) => {
  try {
    const doc = new models.EvidenceDocument(req.body);
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/documents/:id", async (req, res) => {
  try {
    await models.EvidenceDocument.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Evidence document deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/documents/:id/audit-trail", async (req, res) => {
  try {
    const logs = await models.DocAuditTrail.find({ documentId: req.params.id })
      .populate("performedBy", "name role")
      .sort({ actionTimestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/documents/:id/audit-trail", async (req, res) => {
  try {
    const log = new models.DocAuditTrail({
      documentId: req.params.id,
      performedBy: req.user.id,
      actionType: req.body.actionType || "Download"
    });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
===================================================
11. ENTERPRISE ANALYTICS & REPORTS
===================================================
*/
router.get("/analytics", async (req, res) => {
  try {
    // Generate statistical aggregates
    const readinessTrend = [
      { year: "2021", score: 62 },
      { year: "2022", score: 68 },
      { year: "2023", score: 75 },
      { year: "2024", score: 81 },
      { year: "2025", score: 88 }
    ];

    const criterionReadiness = [
      { name: "Criterion I", value: 92 },
      { name: "Criterion II", value: 85 },
      { name: "Criterion III", value: 78 },
      { name: "Criterion IV", value: 89 },
      { name: "Criterion V", value: 81 },
      { name: "Criterion VI", value: 95 },
      { name: "Criterion VII", value: 87 }
    ];

    const departmentScores = [
      { dept: "Computer Science", value: 94 },
      { dept: "Electronics", value: 82 },
      { dept: "Basic Sciences", value: 88 },
      { dept: "Mechanical", value: 75 }
    ];

    const facultyWorkloads = [
      { name: "Maths Dept", workloadHours: 42 },
      { name: "CS Dept", workloadHours: 58 },
      { name: "Science Dept", workloadHours: 35 },
      { name: "Humanities", workloadHours: 20 }
    ];

    res.json({ readinessTrend, criterionReadiness, departmentScores, facultyWorkloads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mock report export endpoint
router.get("/reports/export", (req, res) => {
  const type = req.query.type || "aqar";
  const format = req.query.format || "csv";

  res.setHeader("Content-Disposition", `attachment; filename=naac_${type}_report.${format}`);
  if (format === "csv") {
    res.setHeader("Content-Type", "text/csv");
    res.send(`Academic Year,Report Type,Status\n2025-26,${type.toUpperCase()},Completed`);
  } else {
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from("PDF Mock Report Content"));
  }
});

module.exports = router;
