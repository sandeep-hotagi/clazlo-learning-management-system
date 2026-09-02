const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const User = require('./models/User');
const Class = require('./models/Class');
const Subject = require('./models/Subject');
const Event = require('./models/Event');
const Notice = require('./models/Notice');
const Timetable = require('./models/Timetable');
const Exam = require('./models/Exam');
const Result = require('./models/Result');
const Homework = require('./models/Homework');
const HomeworkSubmission = require('./models/HomeworkSubmission');
const Assignment = require('./models/Assignment');
const AssignmentSubmission = require('./models/AssignmentSubmission');
const Quiz = require('./models/Quiz');
const QuizAttempt = require('./models/QuizAttempt');
const Message = require('./models/Message');
const Attendance = require('./models/Attendance');
const Feedback = require('./models/Feedback');
const naacModels = require('./models/naacModels');

dotenv.config();

const firstNamesMale = [
  'Aarav', 'Kabir', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Krishna', 'Ishan', 'Shaurya',
  'Yash', 'Rohan', 'Ayaan', 'Atharv', 'Dev', 'Parth', 'Reyansh', 'Arnav', 'Ansh', 'Dhruv'
];

const firstNamesFemale = [
  'Diya', 'Ananya', 'Aanya', 'Pihu', 'Aaradhya', 'Avani', 'Myra', 'Ira', 'Kiara', 'Anvi',
  'Riya', 'Sneha', 'Pooja', 'Neha', 'Tanvi', 'Shreya', 'Ishita', 'Divya', 'Aditi', 'Kavya'
];

const lastNames = [
  'Sharma', 'Patel', 'Kumar', 'Nair', 'Iyer', 'Rao', 'Singh', 'Sundaram', 'Verma', 'Reddy',
  'Gupta', 'Mehta', 'Joshi', 'Das', 'Choudhury', 'Gowda', 'Naik', 'Shetty', 'Bhat'
];

const seed = async (mongoUri = null) => {
  try {
    let dbUri = mongoUri || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clazlo';
    let mongoServer = null;
    
    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 2000 });
      } catch (connErr) {
        if (!mongoUri) {
          console.warn('⚠️ Local MongoDB connection failed, spinning up temporary In-Memory MongoDB...');
          const { MongoMemoryServer } = require('mongodb-memory-server');
          mongoServer = await MongoMemoryServer.create();
          dbUri = mongoServer.getUri();
          await mongoose.connect(dbUri);
        } else {
          throw connErr;
        }
      }
    }
    console.log('Connected to DB for seeding:', dbUri);

    // Clear all collections
    await User.deleteMany({});
    await Class.deleteMany({});
    await Subject.deleteMany({});
    await Event.deleteMany({});
    await Notice.deleteMany({});
    await Timetable.deleteMany({});
    await Exam.deleteMany({});
    await Result.deleteMany({});
    await Homework.deleteMany({});
    await HomeworkSubmission.deleteMany({});
    await Assignment.deleteMany({});
    await AssignmentSubmission.deleteMany({});
    await Quiz.deleteMany({});
    await QuizAttempt.deleteMany({});
    await Message.deleteMany({});
    await Attendance.deleteMany({});
    await Feedback.deleteMany({});
    console.log('Cleared all collections.');

    // Common passwords
    const salt = await bcrypt.genSalt(10);
    const standardPass = await bcrypt.hash('Student@123', salt);
    const adminPass = await bcrypt.hash('Admin@123', salt);
    const teacherPass = await bcrypt.hash('Teacher@123', salt);
    const studentPass = await bcrypt.hash('Student@123', salt);

    // =========================================
    // 1. SEED ADMIN
    // =========================================
    const admin = new User({
      name: 'School Admin',
      email: 'admin@school.com',
      role: 'admin',
      phone: '9876543210',
      password: adminPass
    });
    await admin.save();
    console.log('Seeded Admin account.');

    // =========================================
    // 2. SEED TEACHERS
    // =========================================
    const mathsTeacher = new User({
      name: 'Maths Teacher',
      email: 'maths_teacher@school.com',
      role: 'teacher',
      teacherId: 'T1001',
      phone: '9876543211',
      employeeId: 'EMP201',
      password: teacherPass,
      subjects: ['Mathematics']
    });
    await mathsTeacher.save();

    const scienceTeacher = new User({
      name: 'Science Teacher',
      email: 'science_teacher@school.com',
      role: 'teacher',
      teacherId: 'T1002',
      phone: '9876543212',
      employeeId: 'EMP202',
      password: teacherPass,
      subjects: ['Science']
    });
    await scienceTeacher.save();

    const englishTeacher = new User({
      name: 'English Teacher',
      email: 'english_teacher@school.com',
      role: 'teacher',
      teacherId: 'T1003',
      phone: '9876543213',
      employeeId: 'EMP203',
      password: teacherPass,
      subjects: ['English']
    });
    await englishTeacher.save();

    const class7Teacher = new User({
      name: 'Class 7 General Teacher',
      email: 'class7_teacher@school.com',
      role: 'teacher',
      teacherId: 'T1004',
      phone: '9876543214',
      employeeId: 'EMP204',
      password: teacherPass,
      subjects: ['Hindi', 'Social Science']
    });
    await class7Teacher.save();

    console.log('Seeded Teachers (Maths, Science, English, Class 7).');

    // =========================================
    // 3. SEED CLASSES
    // =========================================
    const classes = [];
    
    const class7 = new Class({ name: 'Class 7', section: 'A', teacherId: class7Teacher._id, students: [] });
    await class7.save();
    classes.push(class7);

    const class8 = new Class({ name: 'Class 8', section: 'A', teacherId: mathsTeacher._id, students: [] });
    await class8.save();
    classes.push(class8);

    const class9 = new Class({ name: 'Class 9', section: 'A', teacherId: scienceTeacher._id, students: [] });
    await class9.save();
    classes.push(class9);

    const class10 = new Class({ name: 'Class 10', section: 'A', teacherId: englishTeacher._id, students: [] });
    await class10.save();
    classes.push(class10);

    console.log('Seeded Classes (7, 8, 9, 10).');

    // =========================================
    // 4. SEED STUDENTS (5 students per class = 20 students)
    // =========================================
    const students = [];
    const targetClassMaps = [
      { classObj: class7, gradeStr: '7th', codePrefix: 'STU70' },
      { classObj: class8, gradeStr: '8th', codePrefix: 'STU80' },
      { classObj: class9, gradeStr: '9th', codePrefix: 'STU90' },
      { classObj: class10, gradeStr: '10th', codePrefix: 'STU10' },
    ];

    let overallStudentCount = 0;

    for (const { classObj, gradeStr, codePrefix } of targetClassMaps) {
      for (let r = 1; r <= 15; r++) {
        overallStudentCount++;
        const isSpecial = (gradeStr === '10th' && r === 1); // student1@school.com

        const gender = r % 2 === 0 ? 'Male' : 'Female';
        const firstName = gender === 'Male' 
          ? firstNamesMale[overallStudentCount % firstNamesMale.length] 
          : firstNamesFemale[overallStudentCount % firstNamesFemale.length];
        const lastName = lastNames[overallStudentCount % lastNames.length];
        
        const studentName = isSpecial ? 'Student One' : `${firstName} ${lastName}`;
        const studentEmail = isSpecial ? 'student1@school.com' : `student${overallStudentCount}@school.com`;
        const code = isSpecial ? 'S2001' : `${codePrefix}${r}`;
        const rollNumStr = String(r);

        const student = new User({
          name: studentName,
          email: studentEmail,
          role: 'student',
          studentCode: code,
          rollNumber: rollNumStr,
          gender,
          dob: `2013-05-${String((r % 25) + 1).padStart(2, '0')}`,
          address: `Flat ${10 + r}, Park Road, Indiranagar, Bengaluru`,
          password: isSpecial ? studentPass : standardPass,
          grade: gradeStr,
          classId: classObj._id,
        });

        await student.save();
        students.push(student);

        // Link student to class roster
        classObj.students.push(student._id);
      }
      await classObj.save();
    }
    console.log('Seeded 60 Students (15 per class).');

    // =========================================
    // 5. SEED SUBJECTS FOR GRADES
    // =========================================
    const teachersMap = {
      '7th': class7Teacher,
      '8th': mathsTeacher,
      '9th': scienceTeacher,
      '10th': englishTeacher,
    };

    for (const grade of ['7th', '8th', '9th', '10th']) {
      const activeTeacher = teachersMap[grade];
      for (const subjName of activeTeacher.subjects) {
        const sub = new Subject({
          name: subjName,
          teacher: activeTeacher.name,
          grade: grade,
          progress: Math.floor(70 + Math.random() * 20)
        });
        await sub.save();
      }
    }
    console.log('Seeded Subjects for all classes.');

    // =========================================
    // 6. SEED ATTENDANCE FOR THE LAST 30 DAYS
    // =========================================
    console.log('Seeding attendance history for target classes (last 30 days)...');
    const today = new Date();
    const statuses = ['Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Absent', 'Late', 'Present']; 

    for (let d = 30; d >= 1; d--) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - d);
      currentDate.setHours(0, 0, 0, 0);
      
      if (currentDate.getDay() === 0) continue; // Skip Sundays

      for (const cls of classes) {
        if (cls.students.length === 0) continue;

        const records = cls.students.map(studentId => {
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          return { studentId, status };
        });

        const attendance = new Attendance({
          classId: cls._id,
          teacherId: cls.teacherId,
          date: currentDate,
          records
        });
        await attendance.save();
      }
    }
    console.log('Seeded 30 days of attendance.');

    // =========================================
    // 7. SEED HOMEWORK AND SUBMISSIONS
    // =========================================
    for (const cls of classes) {
      const classTeacher = await User.findById(cls.teacherId);
      const activeSubject = classTeacher.subjects[0]; // pick first subject of class teacher
      
      for (let h = 1; h <= 5; h++) {
        const homework = new Homework({
          title: `${activeSubject} Homework ${h}`,
          description: `Complete exercise problems for ${activeSubject} chapter ${h}.`,
          subject: activeSubject,
          classId: cls._id,
          teacherId: cls.teacherId,
          dueDate: new Date(Date.now() + h * 24 * 60 * 60 * 1000),
          allowResubmission: true,
          maxMarks: 10,
          attachments: []
        });
        await homework.save();

        // Auto-create submissions
        for (const studentId of cls.students) {
          const submission = new HomeworkSubmission({
            homeworkId: homework._id,
            studentId,
            teacherId: cls.teacherId,
            classId: cls._id,
            status: 'Pending',
            submittedFile: '',
            submittedAt: null,
            marks: null,
            feedback: '',
            reviewedAt: null
          });
          await submission.save();
        }
      }
    }
    console.log('Seeded Homework and Submissions.');

    // =========================================
    // 8. SEED ASSIGNMENTS & ASSIGNMENT SUBMISSIONS
    // =========================================
    for (const cls of classes) {
      const classTeacher = await User.findById(cls.teacherId);
      const activeSubject = classTeacher.subjects[0];
      const gradeStr = cls.name.replace(/\D/g, '') + 'th';

      for (let a = 1; a <= 3; a++) {
        const assignment = new Assignment({
          title: `${activeSubject} Assignment ${a}`,
          subject: activeSubject,
          description: `Write a short research proposal for ${activeSubject} project ${a}.`,
          grade: gradeStr,
          classId: cls._id,
          dueDate: new Date(Date.now() + a * 5 * 24 * 60 * 60 * 1000),
          teacherId: cls.teacherId
        });
        await assignment.save();

        // Seed individual AssignmentSubmission records
        for (const studentId of cls.students) {
          const submission = new AssignmentSubmission({
            assignmentId: assignment._id,
            studentId,
            teacherId: cls.teacherId,
            grade: gradeStr,
            status: "Pending",
            submittedFile: "",
            submittedAt: null,
            marks: null,
            feedback: "",
            reviewedAt: null
          });
          await submission.save();
        }
      }
    }
    console.log('Seeded Assignments & Submissions.');

    // =========================================
    // 9. SEED QUIZZES
    // =========================================
    for (const cls of classes) {
      const classTeacher = await User.findById(cls.teacherId);
      const activeSubject = classTeacher.subjects[0];

      const quiz = new Quiz({
        title: `${activeSubject} Pop Quiz`,
        subject: activeSubject,
        classId: cls._id,
        teacherId: cls.teacherId,
        durationMinutes: 10,
        negativeMarking: false,
        questions: [
          {
            question: `What is a core principle of ${activeSubject}?`,
            options: ['Basic Concept A', 'Concept B', 'Concept C', 'Concept D'],
            answer: 'Basic Concept A'
          },
          {
            question: `Identify the correct statement in ${activeSubject}:`,
            options: ['Statement 1 is correct', 'Statement 2 is correct', 'Statement 3 is correct', 'Statement 4 is correct'],
            answer: 'Statement 1 is correct'
          }
        ]
      });
      await quiz.save();
    }
    console.log('Seeded Quizzes.');

    // =========================================
    // 10. SEED EXAMS & RESULTS
    // =========================================
    const examNames = ['Unit Test 1', 'Mid-Term Exam', 'Unit Test 2', 'Final Exam'];

    for (const cls of classes) {
      const classTeacher = await User.findById(cls.teacherId);
      const activeSubject = classTeacher.subjects[0];

      for (let e = 0; e < examNames.length; e++) {
        const exam = new Exam({
          title: examNames[e],
          classId: cls._id,
          date: new Date(Date.now() - (e + 1) * 30 * 24 * 60 * 60 * 1000),
          totalMarks: 100,
          results: cls.students.map(sId => ({ studentId: sId, marksObtained: Math.floor(60 + Math.random() * 35) }))
        });
        await exam.save();

        const mappedExamType = 
          examNames[e].includes('Unit Test') ? 'Unit Test' :
          examNames[e].includes('Mid-Term') ? 'Mid Term' :
          'Final Exam';

        // Seed individual Results records for persistence
        for (const studentId of cls.students) {
          const marksObtained = Math.floor(50 + Math.random() * 45);
          const totalMarks = 100;
          const percentage = (marksObtained / totalMarks) * 100;
          
          let resultGrade = 'D';
          if (percentage >= 90) resultGrade = 'A+';
          else if (percentage >= 80) resultGrade = 'A';
          else if (percentage >= 70) resultGrade = 'B';
          else if (percentage >= 60) resultGrade = 'C';

          const result = new Result({
            studentId,
            teacherId: cls.teacherId,
            classId: cls._id,
            subject: activeSubject,
            examType: mappedExamType,
            marksObtained,
            totalMarks,
            grade: resultGrade,
            percentage,
            remarks: 'Good progress'
          });
          await result.save();
        }
      }
    }
    console.log('Seeded Exams and Results.');

    // =========================================
    // 11. SEED NOTICES
    // =========================================
    const notice = new Notice({
      title: 'Annual Sports Meet 2026',
      content: 'The Annual Sports Meet will be held next Friday. All students are invited to participate.',
      date: new Date(),
      authorId: admin._id
    });
    await notice.save();
    console.log('Seeded Notice.');

    // =========================================
    // 12. SEED TIMETABLES
    // =========================================
    for (const cls of classes) {
      const classTeacher = await User.findById(cls.teacherId);
      const activeSubject = classTeacher.subjects[0];

      const timetable = new Timetable({
        classId: cls._id,
        day: 'Monday',
        slots: [
          { timeSlot: '09:00 - 10:00', time: '09:00 - 10:00', subject: activeSubject, teacherId: cls.teacherId },
          { timeSlot: '10:00 - 11:00', time: '10:00 - 11:00', subject: activeSubject, teacherId: cls.teacherId },
          { timeSlot: '11:15 - 12:15', time: '11:15 - 12:15', subject: activeSubject, teacherId: cls.teacherId }
        ]
      });
      await timetable.save();
    }
    console.log('Seeded Timetables.');

    // =========================================
    // 13. SEED NAAC ACCREDITATION DATA
    // =========================================
    console.log('Seeding NAAC regulatory & checklist records...');

    // A. Eligibility status
    const eligibility = new naacModels.Eligibility({
      ugcRecognitionStatus: "Completed",
      aicteApprovalStatus: "Completed",
      iqacEstablishmentDate: new Date("2020-06-15"),
      status: "Completed",
      evidenceUrl: "http://localhost:5000/uploads/ugc_certificate.pdf",
      remarks: "Fully recognized under 2(f) and 12(B)"
    });
    await eligibility.save();

    // B. Regulatory approvals
    await naacModels.Approval.create([
      { bodyName: "UGC Board", approvalYear: "2024", expiryDate: new Date("2029-12-31"), status: "Completed" },
      { bodyName: "AICTE Council", approvalYear: "2025", expiryDate: new Date("2026-06-30"), status: "Completed" }
    ]);

    // C. Institutional Documents
    await naacModels.InstitutionalDocument.create([
      { title: "Land Allotment Deed", category: "Land", status: "Completed", evidenceUrl: "http://localhost:5000/uploads/land_deed.pdf" },
      { title: "Building Occupancy Certificate", category: "Building", status: "Completed", evidenceUrl: "http://localhost:5000/uploads/occupancy.pdf" }
    ]);

    // D. Governance
    await naacModels.GovernancePolicy.create([
      { title: "Academic Integrity Policy", scope: "Institutional", approvalStatus: "Approved" },
      { title: "Anti-Ragging Charter", scope: "Student Support", approvalStatus: "Approved" }
    ]);

    await naacModels.GoverningBody.create([
      { memberName: "Dr. Albus Dumbledore", designation: "Chairperson", termStartDate: new Date("2023-01-01"), termEndDate: new Date("2027-12-31"), attendancePercentage: 96 },
      { memberName: "Prof. Minerva McGonagall", designation: "Secretary", termStartDate: new Date("2023-01-01"), termEndDate: new Date("2027-12-31"), attendancePercentage: 100 }
    ]);

    await naacModels.StrategicPlan.create([
      { title: "Vision 2030 Research Growth Plan", durationYears: "5 Years", targetGoal: "Increase publications by 200%", progressPercentage: 65, status: "In Progress" }
    ]);

    // E. IQAC Meetings
    await naacModels.IQACRecord.create({
      meetingTitle: "IQAC First Quarter General Body Meet",
      meetingDate: new Date(),
      agenda: "Review criterion-wise evidence data collection.",
      resolutions: "Appoint criterion leaders.",
      actionTakenReport: "Criterion leaders successfully appointed."
    });

    // F. AQARs
    await naacModels.AQAR.create([
      { academicYear: "2024-25", submissionStatus: "Completed", submissionDate: new Date() },
      { academicYear: "2025-26", submissionStatus: "In Progress" }
    ]);

    // G. Quality Initiatives
    await naacModels.QualityInitiative.create([
      { title: "FDP on Outcome Based Education", objective: "Train faculty on CO-PO mapping", status: "Completed" }
    ]);

    // H. Library & Labs stock
    await naacModels.LibraryResource.create([
      { title: "Introduction to Algorithms", resourceType: "Book", usageAnalytics: 145 },
      { title: "IEEE transactions on Software Engineering", resourceType: "E-Journal", usageAnalytics: 320 }
    ]);

    await naacModels.LabEquipment.create([
      { equipmentName: "Digital Logic Trainer Kits", labName: "Hardware Lab", maintenanceStatus: "Calibrated" }
    ]);

    await naacModels.SafetyAudit.create([
      { auditTitle: "Annual Fire Safety Verification 2025", checklistStatus: "Verified" }
    ]);

    // I. NAAC Master Checklist
    await naacModels.NAACChecklist.create([
      { criterionNumber: 1, itemDescription: "Map Course Outcomes to Program Outcomes for all courses", status: "Completed", assignedDepartment: "IQAC", responsiblePerson: "Dr. Jane Smith", targetDate: new Date(), remarks: "CO-PO attainment calculated" },
      { criterionNumber: 2, itemDescription: "Upload FDP Certificates for 2025-26", status: "In Progress", assignedDepartment: "Computer Science", responsiblePerson: "Dr. John Doe", targetDate: new Date() },
      { criterionNumber: 6, itemDescription: "Publish Governing Body resolutions on portal", status: "Pending", assignedDepartment: "Administration", responsiblePerson: "Sec. McGonagall", targetDate: new Date() }
    ]);

    // J. Consultancy Projects
    await naacModels.ConsultancyProject.create([
      { facultyId: mathsTeacher._id, title: "Data Cryptography Consulting", clientOrganization: "National Cryptographic Lab", revenueGenerated: 12000, status: "Completed" },
      { facultyId: scienceTeacher._id, title: "Environmental Bio-reactor Design", clientOrganization: "GreenTech Systems", revenueGenerated: 35000, status: "In Progress" }
    ]);

    // K. MoUs
    await naacModels.MoURecord.create([
      { institutionPartner: "MIT Robotics Department", signingDate: new Date("2024-03-01"), durationYears: 5, activitiesConducted: ["Joint Workshop on Automation", "Research Paper Co-publication"], status: "Active" },
      { institutionPartner: "Microsoft India Research Labs", signingDate: new Date("2025-01-15"), durationYears: 3, activitiesConducted: ["AI Summer School Internship program"], status: "Active" }
    ]);

    // L. Student Competitive Exams
    await naacModels.StudentCompetitiveExam.create([
      { studentId: students[0]._id, examName: "GATE", scoreObtained: "99.2 Percentile", passingYear: "2025" },
      { studentId: students[1]._id, examName: "GRE", scoreObtained: "328/340", passingYear: "2025" }
    ]);

    // M. Smart Classroom Utilization
    await naacModels.SmartClassroomUtil.create([
      { classroomName: "Smart Classroom 1 (Room 304)", utilizationHoursWeekly: 34, projectorStatus: "Functional" },
      { classroomName: "Smart Classroom 2 (Room 402)", utilizationHoursWeekly: 28, projectorStatus: "Functional" }
    ]);

    // N. Safety Incidents
    await naacModels.SafetyIncident.create([
      { incidentTitle: "Lab Chemical Storage Ventilation Leak", reportedDate: new Date(), severityLevel: "Medium", resolutionStatus: "Resolved" },
      { incidentTitle: "Fire Hydrant Refill Verification Alert", reportedDate: new Date(), severityLevel: "Low", resolutionStatus: "Pending" }
    ]);

    // O. Two-Way Feedbacks
    if (students.length > 0 && classes.length > 0) {
      await Feedback.create([
        {
          fromUser: students[0]._id,
          fromRole: 'student',
          toUser: englishTeacher._id,
          toRole: 'teacher',
          course: classes[3]._id,
          rating: 5,
          teachingQuality: 5,
          communication: 5,
          subjectKnowledge: 5,
          explanationClarity: 4,
          comment: "English Teacher makes literature and grammar extremely engaging. Excellent feedback on essay submissions!",
        },
        {
          fromUser: englishTeacher._id,
          fromRole: 'teacher',
          toUser: students[0]._id,
          toRole: 'student',
          course: classes[3]._id,
          rating: 5,
          participation: 5,
          attendance: 5,
          assignmentPerformance: 5,
          behaviour: 5,
          comment: "Student One demonstrates outstanding analytical skills in critical reading and always submits high quality homework on time.",
        }
      ]);
      console.log('Seeded Two-Way Student and Teacher Feedbacks.');
    }

    console.log('Seeded NAAC regulatory & checklist records.');

    console.log('🎉 Database Seeding Completed Successfully!');
    if (mongoServer) {
      await mongoose.disconnect();
      await mongoServer.stop();
    }
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  }
};

// Auto-run if executed directly
if (require.main === module) {
  seed().then(() => process.exit(0));
}

module.exports = seed;
