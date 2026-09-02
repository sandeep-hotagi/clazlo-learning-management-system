const mongoose = require("mongoose");
const { Schema } = mongoose;

// 1. Eligibility Schema
const eligibilitySchema = new Schema({
  ugcRecognitionStatus: { type: String, default: "Pending" }, // UGC Section 2(f) & 12(B)
  aicteApprovalStatus: { type: String, default: "Pending" },
  iqacEstablishmentDate: { type: Date },
  status: { type: String, enum: ["Completed", "In Progress", "Pending"], default: "Pending" },
  evidenceUrl: { type: String, default: "" },
  remarks: { type: String, default: "" }
}, { timestamps: true });

// 2. Approval Schema
const approvalSchema = new Schema({
  bodyName: { type: String, required: true }, // e.g. UGC, AICTE, Affiliating University
  approvalYear: { type: String, required: true },
  expiryDate: { type: Date },
  status: { type: String, enum: ["Completed", "In Progress", "Pending"], default: "Pending" },
  evidenceUrl: { type: String, default: "" }
}, { timestamps: true });

// 3. InstitutionalDocument Schema
const institutionalDocumentSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, default: "General" }, // e.g. Land Document, Building Plan, Fire Safety
  uploadDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Completed", "In Progress", "Pending"], default: "Pending" },
  evidenceUrl: { type: String, default: "" }
}, { timestamps: true });

// 4. GovernancePolicy Schema
const governancePolicySchema = new Schema({
  title: { type: String, required: true },
  scope: { type: String, default: "Institutional" },
  approvalStatus: { type: String, enum: ["Draft", "Under Review", "Approved", "Expired"], default: "Draft" },
  evidenceUrl: { type: String, default: "" }
}, { timestamps: true });

// 5. GoverningBody Schema
const governingBodySchema = new Schema({
  memberName: { type: String, required: true },
  designation: { type: String, required: true }, // e.g. Chairperson, Secretary
  termStartDate: { type: Date },
  termEndDate: { type: Date },
  attendancePercentage: { type: Number, default: 100 }
}, { timestamps: true });

// 6. StrategicPlan Schema
const strategicPlanSchema = new Schema({
  title: { type: String, required: true },
  durationYears: { type: String, default: "5 Years" },
  targetGoal: { type: String, default: "" },
  progressPercentage: { type: Number, default: 0 },
  status: { type: String, enum: ["Completed", "In Progress", "Pending"], default: "Pending" }
}, { timestamps: true });

// 7. IQACRecord Schema
const iqacRecordSchema = new Schema({
  meetingTitle: { type: String, required: true },
  meetingDate: { type: Date, required: true },
  agenda: { type: String, default: "" },
  resolutions: { type: String, default: "" },
  actionTakenReport: { type: String, default: "" },
  evidenceUrl: { type: String, default: "" }
}, { timestamps: true });

// 8. AQAR Schema
const aqarSchema = new Schema({
  academicYear: { type: String, required: true },
  submissionStatus: { type: String, enum: ["Completed", "In Progress", "Pending"], default: "Pending" },
  submissionDate: { type: Date },
  evidenceUrl: { type: String, default: "" }
}, { timestamps: true });

// 9. QualityInitiative Schema
const qualityInitiativeSchema = new Schema({
  title: { type: String, required: true },
  objective: { type: String, default: "" },
  targetDate: { type: Date },
  status: { type: String, enum: ["Completed", "In Progress", "Pending"], default: "Pending" },
  evidenceUrl: { type: String, default: "" }
}, { timestamps: true });

// 10. FacultyPerformance Schema
const facultyPerformanceSchema = new Schema({
  facultyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  academicYear: { type: String, required: true },
  apiScore: { type: Number, default: 0 },
  appraisalScore: { type: Number, default: 0 },
  promotionStatus: { type: String, default: "Reviewed" }
}, { timestamps: true });

// 11. FDPRecord Schema
const fdpRecordSchema = new Schema({
  facultyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true }, // FDP / Workshop title
  organizer: { type: String, default: "" },
  startDate: { type: Date },
  endDate: { type: Date },
  evidenceUrl: { type: String, default: "" } // Certificate upload
}, { timestamps: true });

// 12. StudentFeedback Schema
const studentFeedbackSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  feedbackType: { type: String, enum: ["Course", "Teacher", "Exit"], required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "User" }, // optional for Course feedback
  ratings: { type: Map, of: Number }, // Questions to ratings (1-5)
  comments: { type: String, default: "" }
}, { timestamps: true });

// 13. Scholarship Schema
const scholarshipSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  schemeName: { type: String, required: true },
  fundingAgency: { type: String, default: "Government" },
  amount: { type: Number, default: 0 },
  status: { type: String, enum: ["Completed", "In Progress", "Pending"], default: "Pending" }
}, { timestamps: true });

// 14. Placement Schema
const placementSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  packageLPA: { type: Number, default: 0 },
  jobTitle: { type: String, default: "" },
  offerLetterUrl: { type: String, default: "" }
}, { timestamps: true });

// 15. Internship Schema
const internshipSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  durationMonths: { type: Number, default: 3 },
  stipendAmount: { type: Number, default: 0 },
  certificateUrl: { type: String, default: "" }
}, { timestamps: true });

// 16. Mentoring Schema
const mentoringSchema = new Schema({
  mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  menteeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sessionDate: { type: Date, default: Date.now },
  discussionNotes: { type: String, default: "" },
  actionRequired: { type: String, default: "" }
}, { timestamps: true });

// 17. Alumni Schema
const alumniSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  graduationYear: { type: String, required: true },
  currentStatus: { type: String, enum: ["Employment", "Higher Education", "Entrepreneurship", "Other"], default: "Employment" },
  organizationName: { type: String, default: "" }
}, { timestamps: true });

// 18. ResearchPublication Schema
const researchPublicationSchema = new Schema({
  facultyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  journalName: { type: String, required: true },
  indexedIn: [{ type: String }], // e.g. UGC CARE, Scopus, Web of Science
  citationCount: { type: Number, default: 0 },
  publicationYear: { type: String, required: true }
}, { timestamps: true });

// 19. Patent Schema
const patentSchema = new Schema({
  inventorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  patentNumber: { type: String, default: "" },
  status: { type: String, enum: ["Filed", "Published", "Granted", "Commercialized"], default: "Filed" },
  filingDate: { type: Date }
}, { timestamps: true });

// 20. ResearchProject Schema
const researchProjectSchema = new Schema({
  facultyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  fundingAgency: { type: String, required: true },
  sanctionedAmount: { type: Number, default: 0 },
  expenditureAmount: { type: Number, default: 0 },
  durationYears: { type: Number, default: 1 },
  status: { type: String, enum: ["Completed", "In Progress", "Pending"], default: "Pending" }
}, { timestamps: true });

// 21. ExtensionActivity Schema
const extensionActivitySchema = new Schema({
  title: { type: String, required: true },
  organizingUnit: { type: String, default: "NSS / NCC" },
  numberOfStudents: { type: Number, default: 0 },
  activityDate: { type: Date },
  status: { type: String, enum: ["Completed", "In Progress", "Pending"], default: "Pending" },
  evidenceUrl: { type: String, default: "" }
}, { timestamps: true });

// 22. LibraryResource Schema
const libraryResourceSchema = new Schema({
  title: { type: String, required: true },
  resourceType: { type: String, enum: ["Book", "E-Journal", "Digital Resource", "Periodical"], required: true },
  accessNumber: { type: String, default: "" },
  usageAnalytics: { type: Number, default: 0 } // issue count
}, { timestamps: true });

// 23. LabEquipment Schema
const labEquipmentSchema = new Schema({
  equipmentName: { type: String, required: true },
  labName: { type: String, required: true },
  calibrationDate: { type: Date },
  maintenanceStatus: { type: String, enum: ["Working", "Under Maintenance", "Calibrated"], default: "Working" }
}, { timestamps: true });

// 24. ICTResource Schema
const ictResourceSchema = new Schema({
  resourceName: { type: String, required: true }, // e.g. smart classroom projector, computer system
  department: { type: String, default: "General" },
  bandwidthSpeed: { type: String, default: "100 Mbps" },
  softwareLicenseKey: { type: String, default: "" }
}, { timestamps: true });

// 25. SafetyAudit Schema
const safetyAuditSchema = new Schema({
  auditTitle: { type: String, required: true },
  auditDate: { type: Date, default: Date.now },
  incidentReported: { type: Boolean, default: false },
  checklistStatus: { type: String, default: "Verified" }
}, { timestamps: true });

// 26. EvidenceDocument Schema
const evidenceDocumentSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g. Governance, IQAC, Academics
  department: { type: String, default: "General" },
  academicYear: { type: String, default: "2025-26" },
  fileUrl: { type: String, required: true },
  version: { type: Number, default: 1 },
  downloadCount: { type: Number, default: 0 }
}, { timestamps: true });

// 27. NAACChecklist Schema
const naacChecklistSchema = new Schema({
  criterionNumber: { type: Number, required: true }, // 1 to 7
  itemDescription: { type: String, required: true },
  status: { type: String, enum: ["Completed", "In Progress", "Pending"], default: "Pending" },
  assignedDepartment: { type: String, default: "IQAC" },
  responsiblePerson: { type: String, default: "" },
  targetDate: { type: Date },
  completionDate: { type: Date },
  evidenceUrl: { type: String, default: "" },
  remarks: { type: String, default: "" }
}, { timestamps: true });

// 28. AccreditationReport Schema
const accreditationReportSchema = new Schema({
  title: { type: String, required: true },
  compiledBy: { type: String, default: "IQAC Coordinator" },
  academicYear: { type: String, required: true },
  criteriaScores: { type: Map, of: Number }, // 1 to 7 scores
  overallReadiness: { type: Number, default: 0 }
}, { timestamps: true });

// 29. ConsultancyProject Schema
const consultancyProjectSchema = new Schema({
  facultyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  clientOrganization: { type: String, required: true },
  revenueGenerated: { type: Number, default: 0 },
  status: { type: String, enum: ["Completed", "In Progress", "Pending"], default: "Pending" }
}, { timestamps: true });

// 30. MoURecord Schema
const mouRecordSchema = new Schema({
  institutionPartner: { type: String, required: true },
  signingDate: { type: Date, default: Date.now },
  durationYears: { type: Number, default: 3 },
  activitiesConducted: [{ type: String }],
  status: { type: String, enum: ["Active", "Expired"], default: "Active" }
}, { timestamps: true });

// 31. StudentCompetitiveExam Schema
const studentCompetitiveExamSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  examName: { type: String, required: true }, // e.g. GATE, GRE, CAT, TOEFL
  scoreObtained: { type: String, required: true },
  passingYear: { type: String, required: true }
}, { timestamps: true });

// 32. SmartClassroomUtil Schema
const smartClassroomUtilSchema = new Schema({
  classroomName: { type: String, required: true },
  utilizationHoursWeekly: { type: Number, default: 0 },
  projectorStatus: { type: String, default: "Functional" }
}, { timestamps: true });

// 33. SafetyIncident Schema
const safetyIncidentSchema = new Schema({
  incidentTitle: { type: String, required: true },
  reportedDate: { type: Date, default: Date.now },
  description: { type: String, default: "" },
  severityLevel: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  resolutionStatus: { type: String, enum: ["Resolved", "Under Investigation", "Pending"], default: "Pending" }
}, { timestamps: true });

// 34. DocAuditTrail Schema
const docAuditTrailSchema = new Schema({
  documentId: { type: Schema.Types.ObjectId, ref: "EvidenceDocument", required: true },
  performedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  actionType: { type: String, enum: ["Upload", "Edit", "Download", "Delete"], required: true },
  actionTimestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = {
  Eligibility: mongoose.model("Eligibility", eligibilitySchema),
  Approval: mongoose.model("Approval", approvalSchema),
  InstitutionalDocument: mongoose.model("InstitutionalDocument", institutionalDocumentSchema),
  GovernancePolicy: mongoose.model("GovernancePolicy", governancePolicySchema),
  GoverningBody: mongoose.model("GoverningBody", governingBodySchema),
  StrategicPlan: mongoose.model("StrategicPlan", strategicPlanSchema),
  IQACRecord: mongoose.model("IQACRecord", iqacRecordSchema),
  AQAR: mongoose.model("AQAR", aqarSchema),
  QualityInitiative: mongoose.model("QualityInitiative", qualityInitiativeSchema),
  FacultyPerformance: mongoose.model("FacultyPerformance", facultyPerformanceSchema),
  FDPRecord: mongoose.model("FDPRecord", fdpRecordSchema),
  StudentFeedback: mongoose.model("StudentFeedback", studentFeedbackSchema),
  Scholarship: mongoose.model("Scholarship", scholarshipSchema),
  Placement: mongoose.model("Placement", placementSchema),
  Internship: mongoose.model("Internship", internshipSchema),
  Mentoring: mongoose.model("Mentoring", mentoringSchema),
  Alumni: mongoose.model("Alumni", alumniSchema),
  ResearchPublication: mongoose.model("ResearchPublication", researchPublicationSchema),
  Patent: mongoose.model("Patent", patentSchema),
  ResearchProject: mongoose.model("ResearchProject", researchProjectSchema),
  ExtensionActivity: mongoose.model("ExtensionActivity", extensionActivitySchema),
  LibraryResource: mongoose.model("LibraryResource", libraryResourceSchema),
  LabEquipment: mongoose.model("LabEquipment", labEquipmentSchema),
  ICTResource: mongoose.model("ICTResource", ictResourceSchema),
  SafetyAudit: mongoose.model("SafetyAudit", safetyAuditSchema),
  EvidenceDocument: mongoose.model("EvidenceDocument", evidenceDocumentSchema),
  NAACChecklist: mongoose.model("NAACChecklist", naacChecklistSchema),
  AccreditationReport: mongoose.model("AccreditationReport", accreditationReportSchema),
  ConsultancyProject: mongoose.model("ConsultancyProject", consultancyProjectSchema),
  MoURecord: mongoose.model("MoURecord", mouRecordSchema),
  StudentCompetitiveExam: mongoose.model("StudentCompetitiveExam", studentCompetitiveExamSchema),
  SmartClassroomUtil: mongoose.model("SmartClassroomUtil", smartClassroomUtilSchema),
  SafetyIncident: mongoose.model("SafetyIncident", safetyIncidentSchema),
  DocAuditTrail: mongoose.model("DocAuditTrail", docAuditTrailSchema)
};
