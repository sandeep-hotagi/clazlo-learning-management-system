// Centralized demo data for Clazlo LMS
// All fields are fictional but internally consistent across the app.

export const demoStudents = [
  {
    _id: "64a1f0a1b2c3d4e5f6a7b8c9",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    enrolledCourses: ["64c1e2f3a4b5c6d7e8f9a0b1"],
  },
  {
    _id: "64a1f0a2b2c3d4e5f6a7b8c0",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    enrolledCourses: ["64c1e2f3a4b5c6d7e8f9a0b2"],
  },
];

export const demoTeachers = [
  {
    _id: "64b2e0d1c3d4e5f6a7b8c9d0",
    name: "Amit Verma",
    email: "amit.verma@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    subjects: ["Mathematics", "Physics"],
  },
  {
    _id: "64b2e0d2c3d4e5f6a7b8c9d1",
    name: "Sneha Gupta",
    email: "sneha.gupta@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
    subjects: ["Chemistry", "Biology"],
  },
];

export const demoCourses = [
  {
    _id: "64c1e2f3a4b5c6d7e8f9a0b1",
    title: "Intro to Physics",
    code: "PHY101",
    teacherId: demoTeachers[0]._id,
    description: "Fundamental concepts of mechanics, waves, and thermodynamics.",
  },
  {
    _id: "64c1e2f3a4b5c6d7e8f9a0b2",
    title: "Organic Chemistry",
    code: "CHE201",
    teacherId: demoTeachers[1]._id,
    description: "Study of carbon‑based compounds and reaction mechanisms.",
  },
];

export const demoAssignments = [
  {
    _id: "64d3a4b5c6d7e8f9a0b1c2d3",
    title: "Physics Homework 1",
    courseId: demoCourses[0]._id,
    dueDate: "2024-12-01T23:59:00Z",
    maxScore: 20,
  },
  {
    _id: "64d3a4b5c6d7e8f9a0b1c2d4",
    title: "Chemistry Lab Report",
    courseId: demoCourses[1]._id,
    dueDate: "2024-12-05T23:59:00Z",
    maxScore: 25,
  },
];

export const demoFeedbacks = [
  {
    _id: "64e5f6a7b8c9d0e1f2a3b4c5",
    fromUser: { _id: "64a1f0a1b2c3d4e5f6a7b8c9", name: "Rahul Sharma", email: "rahul.sharma@example.com" },
    fromRole: "student",
    toUser: { _id: "64b2e0d1c3d4e5f6a7b8c9d0", name: "Amit Verma", email: "amit.verma@example.com" },
    toRole: "teacher",
    course: { _id: "64c1e2f3a4b5c6d7e8f9a0b1", title: "Intro to Physics", code: "PHY101" },
    rating: 5,
    teachingQuality: 5,
    communication: 5,
    subjectKnowledge: 5,
    explanationClarity: 4,
    comment: "Prof. Verma explains complex thermodynamic principles with very clear real-world examples. Fantastic interactive lectures!",
    createdAt: "2026-08-28T10:15:00Z",
  },
  {
    _id: "64e5f6a7b8c9d0e1f2a3b4c6",
    fromUser: { _id: "64a1f0a2b2c3d4e5f6a7b8c0", name: "Priya Patel", email: "priya.patel@example.com" },
    fromRole: "student",
    toUser: { _id: "64b2e0d2c3d4e5f6a7b8c9d1", name: "Sneha Gupta", email: "sneha.gupta@example.com" },
    toRole: "teacher",
    course: { _id: "64c1e2f3a4b5c6d7e8f9a0b2", title: "Organic Chemistry", code: "CHE201" },
    rating: 4,
    teachingQuality: 4,
    communication: 4,
    subjectKnowledge: 5,
    explanationClarity: 4,
    comment: "Sneha Ma'am is extremely knowledgeable. Lab demonstrations are very engaging and easy to follow.",
    createdAt: "2026-08-30T14:20:00Z",
  },
  {
    _id: "64e5f6a7b8c9d0e1f2a3b4c7",
    fromUser: { _id: "64b2e0d1c3d4e5f6a7b8c9d0", name: "Amit Verma", email: "amit.verma@example.com" },
    fromRole: "teacher",
    toUser: { _id: "64a1f0a1b2c3d4e5f6a7b8c9", name: "Rahul Sharma", email: "rahul.sharma@example.com" },
    toRole: "student",
    course: { _id: "64c1e2f3a4b5c6d7e8f9a0b1", title: "Intro to Physics", code: "PHY101" },
    rating: 5,
    participation: 5,
    attendance: 5,
    assignmentPerformance: 5,
    behaviour: 5,
    comment: "Rahul demonstrates outstanding problem-solving aptitude and active participation in class discussions. Keep up the high standard!",
    createdAt: "2026-09-01T09:30:00Z",
  },
  {
    _id: "64e5f6a7b8c9d0e1f2a3b4c8",
    fromUser: { _id: "64b2e0d2c3d4e5f6a7b8c9d1", name: "Sneha Gupta", email: "sneha.gupta@example.com" },
    fromRole: "teacher",
    toUser: { _id: "64a1f0a2b2c3d4e5f6a7b8c0", name: "Priya Patel", email: "priya.patel@example.com" },
    toRole: "student",
    course: { _id: "64c1e2f3a4b5c6d7e8f9a0b2", title: "Organic Chemistry", code: "CHE201" },
    rating: 4,
    participation: 4,
    attendance: 5,
    assignmentPerformance: 4,
    behaviour: 5,
    comment: "Priya is consistent with assignments and shows great diligence in organic reaction mechanism exercises.",
    createdAt: "2026-09-01T11:45:00Z",
  }
];

export const getStudentById = (id) => demoStudents.find((s) => s._id === id);
export const getTeacherById = (id) => demoTeachers.find((t) => t._id === id);
export const getCourseById = (id) => demoCourses.find((c) => c._id === id);
export const getAssignmentsByCourse = (courseId) => demoAssignments.filter((a) => a.courseId === courseId);
export const getFeedbacksForUser = (userId, role) => demoFeedbacks.filter((f) => (f.toUser._id || f.toUser) === userId && f.toRole === role);
