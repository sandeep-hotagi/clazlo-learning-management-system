import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChatBox from '../../components/ChatBox';
import { 
  Award, Calendar, Clock, Zap, FileText, Download, 
  MessageSquare, LifeBuoy, Brain, Send, ListTodo, Plus, CheckCircle2, 
  HelpCircle, ChevronRight, Sparkles, BarChart3, AlertCircle, Upload, Eye,
  Loader2, Clipboard, User
} from 'lucide-react';
import LogoImage from '../../assets/logo.png';
import axios from "axios";
import StudentFeedback from './StudentFeedback';

export default function StudentDashboard() {
  const { user, socket } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // General Loading & Data States
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [homework, setHomework] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);

  // Active sub-page tab
  const [activeTab, setActiveTab] = useState(null);

  // File Upload states
  const [uploadProgress, setUploadProgress] = useState(null);

  // Submission overlays/drawers
  const [submittingHwId, setSubmittingHwId] = useState(null);
  const [submittingHwUrl, setSubmittingHwUrl] = useState('');
  const [submittingHwText, setSubmittingHwText] = useState('');
  const [submittingAssId, setSubmittingAssId] = useState(null);
  const [submittingAssUrl, setSubmittingAssUrl] = useState('');

  // Selected Subject Detail (Notes)
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [aiNoteTopic, setAiNoteTopic] = useState("");
  const [aiNoteContent, setAiNoteContent] = useState("");
  const [aiGeneratingNote, setAiGeneratingNote] = useState(false);

  // Reminders / Study Planner AI state
  const [studySchedule, setStudySchedule] = useState([
    { subject: 'Mathematics', priority: 'High', durationHours: 2, recommendation: 'Solve algebraic equation exercises.' },
    { subject: 'Science', priority: 'Medium', durationHours: 1, recommendation: 'Review cell structure notes.' },
  ]);
  const [plannerRecommendations, setPlannerRecommendations] = useState([
    "Take a 10-minute break after every 50 minutes of focused study.",
    "Check notices board for test dates."
  ]);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Quizzes states
  const [quizzes, setQuizzes] = useState([]);
  const [attemptingQuiz, setAttemptingQuiz] = useState(null); // Active Quiz object
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizTimer, setQuizTimer] = useState(0); // seconds remaining
  const [quizIntervalId, setQuizIntervalId] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [viewingLeaderboardId, setViewingLeaderboardId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // AI Practice test generator states
  const [practiceTopic, setPracticeTopic] = useState("");
  const [practiceSubject, setPracticeSubject] = useState("Science");
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceScore, setPracticeScore] = useState(null);
  const [generatingPractice, setGeneratingPractice] = useState(false);

  // Stats Counters
  const attendanceRate = attendanceLogs.length > 0 
    ? Math.round((attendanceLogs.filter(a => a.status === 'Present').length / attendanceLogs.length) * 100)
    : 95;
  const pendingHomeworkCount = homework.filter(h => h.status === 'Pending').length;
  const pendingAssignmentsCount = assignments.filter(a => a.status === 'Pending').length;
  const averageGradePercent = examResults.length > 0
    ? Math.round(examResults.reduce((sum, r) => sum + r.percentage, 0) / examResults.length)
    : 88;

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    // 1. Fetch Subjects
    try {
      const subRes = await axios.get(`${API_URL}/student/subjects`, config);
      setSubjects(subRes.data.map((s, idx) => ({
        id: s._id,
        name: s.name,
        instructor: s.teacherId?.name || s.teacher || 'Assigned Instructor',
        progress: s.progress || (85 - (idx * 5)),
        color: idx % 3 === 0 ? 'bg-blue-500' : idx % 3 === 1 ? 'bg-emerald-500' : 'bg-purple-500'
      })));
    } catch (e) { console.warn("Failed to load subjects"); }

    // 2. Fetch Exam Results
    try {
      const resRes = await axios.get(`${API_URL}/student/results`, config);
      setExamResults(resRes.data.map(r => ({
        subject: r.subject,
        marks: r.marksObtained,
        total: r.totalMarks,
        percentage: Math.round((r.marksObtained / r.totalMarks) * 100),
        grade: r.grade || 'B'
      })));
    } catch (e) { console.warn("Failed to load results"); }

    // 3. Fetch Timetable
    try {
      const ttRes = await axios.get(`${API_URL}/student/timetable`, config);
      if (ttRes.data && ttRes.data.slots) {
        setTimetable(ttRes.data.slots.map(slot => ({
          time: slot.timeSlot || slot.time,
          subject: slot.subject,
          room: slot.roomNo || slot.room || 'Room 101'
        })));
      }
    } catch (e) { console.warn("Failed to load timetable"); }

    // 4. Fetch Homework Submissions
    try {
      const hwRes = await axios.get(`${API_URL}/homework/student/${user.id || user._id}`, config);
      setHomework(hwRes.data);
    } catch (e) { console.warn("Failed to load homework"); }

    // 5. Fetch Assignments Submissions
    try {
      const assRes = await axios.get(`${API_URL}/assignment/student/${user.id || user._id}`, config);
      setAssignments(assRes.data.map(sub => {
        const a = sub.assignmentId || {};
        return {
          id: a._id || sub._id,
          submissionId: sub._id,
          title: a.title || "Assignment Task",
          course: a.subject || "General Studies",
          description: a.description || "",
          dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "-",
          deadlineObj: a.dueDate ? new Date(a.dueDate) : null,
          status: sub.status,
          marks: sub.marks,
          remarks: sub.feedback,
          fileUrl: sub.submittedFile
        };
      }));
    } catch (e) { console.warn("Failed to load assignments"); }

    // 6. Fetch Attendance logs
    try {
      const attRes = await axios.get(`${API_URL}/student/attendance`, config);
      setAttendanceLogs(attRes.data);
    } catch (e) { console.warn("Failed to load attendance logs"); }

    // 7. Fetch Quizzes
    if (user.classId) {
      try {
        const qRes = await axios.get(`${API_URL}/quiz/class/${user.classId}`, config);
        setQuizzes(qRes.data);
      } catch (e) { console.warn("Failed to load quizzes"); }
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle active sub-routes matching sidebar NavLinks
  useEffect(() => {
    const pathTab = location.pathname.split('/')[2];
    if (['subjects', 'homework', 'exams', 'timetable', 'reminders', 'performance', 'communication', 'profile', 'feedback'].includes(pathTab)) {
      setActiveTab(pathTab);
    } else {
      setActiveTab(null);
    }
  }, [location.pathname]);

  // Real-time synchronization
  useEffect(() => {
    if (socket && user) {
      const handleRefresh = () => {
        loadData();
      };
      
      socket.on("homeworkCreated", handleRefresh);
      socket.on("assignmentCreated", handleRefresh);
      socket.on("homeworkReviewed", handleRefresh);
      socket.on("assignmentReviewed", handleRefresh);
      socket.on("quizPublished", handleRefresh);
      socket.on("attendanceUpdated", handleRefresh);

      return () => {
        socket.off("homeworkCreated", handleRefresh);
        socket.off("assignmentCreated", handleRefresh);
        socket.off("homeworkReviewed", handleRefresh);
        socket.off("assignmentReviewed", handleRefresh);
        socket.off("quizPublished", handleRefresh);
        socket.off("attendanceUpdated", handleRefresh);
      };
    }
  }, [socket, user]);

  // Timer tick for active quiz
  useEffect(() => {
    if (quizTimer <= 0 && attemptingQuiz) {
      handleAutoSubmitQuiz();
    }
  }, [quizTimer, attemptingQuiz]);

  // File Upload Helper
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Size check: 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    setUploadProgress(20);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (type === "homework") {
        setSubmittingHwUrl(res.data.fileUrl);
      } else {
        setSubmittingAssUrl(res.data.fileUrl);
      }
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 1000);
    } catch (err) {
      alert(err.response?.data?.message || "File upload failed.");
      setUploadProgress(null);
    }
  };

  // Submit Homework Solution
  const handleHomeworkSubmit = async (hwId, solutionUrl, solutionText) => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      await axios.post(`${API_URL}/homework/${hwId}/submit`, {
        fileUrl: solutionUrl,
        submittedText: solutionText
      }, config);
      
      alert("Homework solution submitted successfully!");
      setSubmittingHwId(null);
      setSubmittingHwUrl('');
      setSubmittingHwText('');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit homework.");
    }
  };

  // Submit Assignment Solution
  const handleAssignmentSubmit = async (assId, solutionUrl) => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      await axios.post(`${API_URL}/assignment/${assId}/submit`, {
        fileUrl: solutionUrl
      }, config);
      
      alert("Assignment solution submitted successfully!");
      setSubmittingAssId(null);
      setSubmittingAssUrl('');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit assignment.");
    }
  };

  // Start Quiz
  const handleStartQuiz = (quiz) => {
    setAttemptingQuiz(quiz);
    setQuizAnswers({});
    setQuizResult(null);
    setQuizTimer(quiz.durationMinutes * 60);

    // Start timer interval
    if (quizIntervalId) clearInterval(quizIntervalId);
    const intId = setInterval(() => {
      setQuizTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setQuizIntervalId(intId);
  };

  // Auto-submit Quiz when timer reaches zero
  const handleAutoSubmitQuiz = () => {
    alert("Time is up! Auto-submitting your quiz responses.");
    handleSubmitQuizAnswers();
  };

  // Manually Submit Quiz Answers
  const handleSubmitQuizAnswers = async () => {
    if (quizIntervalId) {
      clearInterval(quizIntervalId);
      setQuizIntervalId(null);
    }
    const targetQuiz = attemptingQuiz;
    setAttemptingQuiz(null);

    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    try {
      const res = await axios.post(
        `${API_URL}/quiz/${targetQuiz._id}/attempt`,
        { answers: quizAnswers },
        config
      );
      setQuizResult(res.data);
      alert(`Quiz submitted successfully! Percentage: ${res.data.percentage}%`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit quiz attempt.");
    }
  };

  // View Leaderboard
  const handleViewLeaderboard = async (quizId) => {
    setViewingLeaderboardId(quizId);
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    try {
      const res = await axios.get(`${API_URL}/quiz/${quizId}/leaderboard`, config);
      setLeaderboard(res.data);
    } catch (e) {
      console.warn("Failed to fetch leaderboard");
    }
  };

  // Generate AI study guide notes
  const handleGenerateAINotes = async () => {
    if (!aiNoteTopic.trim()) return;
    setAiGeneratingNote(true);
    setAiNoteContent("");
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.post(`${API_URL}/ai/notes-generator`, {
        topic: aiNoteTopic,
        subject: selectedSubject,
        grade: user?.grade
      }, config);
      setAiNoteContent(res.data.notes);
    } catch (e) {
      setAiNoteContent("Failed to generate AI study guide. Please try again later.");
    } finally {
      setAiGeneratingNote(false);
    }
  };

  // Generate AI study planner schedule
  const handleGenerateAIStudyPlan = async () => {
    setGeneratingPlan(true);
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const subNames = subjects.map(s => s.name);
      const res = await axios.post(`${API_URL}/ai/study-planner`, {
        subjects: subNames
      }, config);
      setStudySchedule(res.data.studySchedule);
      setPlannerRecommendations(res.data.reminders);
      alert("AI study planner updated based on class load!");
    } catch (e) {
      alert("Failed to generate study planner schedule.");
    } finally {
      setGeneratingPlan(false);
    }
  };

  // Generate Practice AI Test
  const handleGeneratePracticeTest = async () => {
    if (!practiceTopic.trim()) return;
    setGeneratingPractice(true);
    setPracticeQuestions([]);
    setPracticeAnswers({});
    setPracticeScore(null);
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.post(`${API_URL}/ai/quiz-generator`, {
        topic: practiceTopic,
        subject: practiceSubject,
        numQuestions: 5
      }, config);
      setPracticeQuestions(res.data.questions);
    } catch (e) {
      alert("Failed to generate custom AI assessment test.");
    } finally {
      setGeneratingPractice(false);
    }
  };

  const submitPracticeTestAnswers = () => {
    let score = 0;
    practiceQuestions.forEach((q, idx) => {
      if (practiceAnswers[idx] === q.answer) {
        score += 1;
      }
    });
    setPracticeScore(score);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-55 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
        <p className="text-sm font-semibold text-slate-500">Loading student workspace portals...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Dynamic Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full">Student Workspace</span>
          <h2 className="text-3xl font-black tracking-tight mt-2">Welcome back, {user?.name || "Student"}!</h2>
          <p className="text-blue-100 text-sm font-medium">Class: {user?.grade || "Class"} ({user?.section || "A"}) • Roll No. {user?.rollNumber || "1"}</p>
        </div>
        <div className="absolute -bottom-6 -right-6 h-40 w-40 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Main Student Overview Dashboard (activeTab === null) */}
      {!activeTab && (
        <div className="space-y-8">
          {/* Dashboard KPIs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Attendance Rate</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{attendanceRate}%</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                <ListTodo size={24} />
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Homework Due</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{pendingHomeworkCount}</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Assignments Due</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{pendingAssignmentsCount}</p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Average Grade</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{averageGradePercent}%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Classes Timetable */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6 lg:col-span-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Today's Class Timetable</h3>
              <div className="space-y-4">
                {timetable.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No classes scheduled for today.</p>
                ) : (
                  timetable.map((slot, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-blue-500" />
                        <div>
                          <p className="text-sm font-bold text-slate-850 dark:text-white">{slot.subject}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">{slot.room}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-655 dark:text-slate-400">{slot.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-4">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => navigate("/student/homework")} className="p-4 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 rounded-2xl text-center space-y-2 group transition-colors">
                    <Clipboard className="mx-auto text-blue-600" size={24} />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-250">Homework</p>
                  </button>
                  <button onClick={() => navigate("/student/performance")} className="p-4 bg-purple-50 hover:bg-purple-100 dark:bg-slate-800 rounded-2xl text-center space-y-2 group transition-colors">
                    <Brain className="mx-auto text-purple-600" size={24} />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-250">Take Quiz</p>
                  </button>
                  <button onClick={() => navigate("/student/reminders")} className="p-4 bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-800 rounded-2xl text-center space-y-2 group transition-colors">
                    <Sparkles className="mx-auto text-emerald-600" size={24} />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-250">AI Planner</p>
                  </button>
                  <button onClick={() => navigate("/student/profile")} className="p-4 bg-rose-50 hover:bg-rose-100 dark:bg-slate-800 rounded-2xl text-center space-y-2 group transition-colors">
                    <User className="mx-auto text-rose-600" size={24} />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-250">My Settings</p>
                  </button>
                </div>
              </div>

              {/* Doubt Assistant Shortcut */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
                <div className="relative z-10 space-y-2">
                  <h4 className="font-black text-lg">Doubts Chatbot active!</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">Ask study doubts or request textbook notes instantly from the floating chatbot helper.</p>
                </div>
                <div className="absolute -bottom-6 -right-6 text-slate-800 opacity-20 transform group-hover:scale-110 transition-transform">
                  <MessageSquare size={120} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subjects & Lessons Navigation Tab */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Subjects & Notes Generator</h2>
            <p className="text-slate-500 text-sm mt-1">Select a course to view lessons syllabus and generate study materials.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4 lg:col-span-1">
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubject(sub.name);
                    setAiNoteTopic("");
                    setAiNoteContent("");
                  }}
                  className={`w-full text-left p-5 rounded-3xl border transition-all ${
                    selectedSubject === sub.name
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                      : 'border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-slate-350 dark:hover:border-slate-700'
                  }`}
                >
                  <h4 className="font-black text-slate-900 dark:text-white text-lg">{sub.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Instructor: {sub.instructor}</p>
                </button>
              ))}
            </div>

            {/* AI Notes Panel */}
            <div className="lg:col-span-2">
              {selectedSubject ? (
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedSubject} Study Guides</h3>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-md uppercase tracking-wider">AI Powered</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter a topic (e.g., Photosynthesis, Algebra)..."
                      value={aiNoteTopic}
                      onChange={(e) => setAiNoteTopic(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleGenerateAINotes}
                      disabled={aiGeneratingNote || !aiNoteTopic.trim()}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {aiGeneratingNote ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                      Generate Guide
                    </button>
                  </div>

                  {aiNoteContent && (
                    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-200 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      <pre className="font-sans whitespace-pre-wrap leading-relaxed text-sm">{aiNoteContent}</pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 text-center text-slate-400 dark:text-slate-500">
                  Select a course subject from the roster list to view lessons and generate custom notes.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Homework & Assignments Tracker Tab */}
      {activeTab === 'homework' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Homework Section */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Homework Tasks Tracker ({homework.length})</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {homework.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No homework assigned to you.</p>
              ) :                 homework.map((hw) => {
                  const item = hw.homeworkId || {};
                  const isPastDue = item.dueDate && new Date() > new Date(item.dueDate);
                  const canSubmit = hw.status === 'Pending' || (item.allowResubmission && !isPastDue);

                  return (
                    <div key={hw._id} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{item.subject}</span>
                          <h4 className="font-bold text-slate-850 dark:text-white mt-1">{item.title}</h4>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          hw.status === 'Submitted' ? 'bg-amber-100 text-amber-800' :
                          hw.status === 'Reviewed' || hw.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          hw.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-550'
                        }`}>{hw.status}</span>
                      </div>
                      
                      <p className="text-xs text-slate-500">{item.description}</p>
                      
                      {/* Teacher name & Due Date */}
                      <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                        <div>
                          <p>Teacher</p>
                          <p className="text-slate-700 dark:text-slate-200 normal-case mt-0.5">{item.teacherId?.name || "Instructor"}</p>
                        </div>
                        <div>
                          <p>Due Date</p>
                          <p className="text-slate-700 dark:text-slate-200 mt-0.5">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>

                      {/* Reference Attachments */}
                      {item.attachments && item.attachments.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-slate-400">Reference Materials:</p>
                          <div className="flex flex-wrap gap-2">
                            {item.attachments.map((attUrl, aIdx) => (
                              <a
                                key={aIdx}
                                href={attUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2.5 py-1 rounded-lg"
                              >
                                <Download size={12} /> Ref File #{aIdx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Marks & Feedback */}
                      {(hw.marks !== null || hw.feedback) && (
                        <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-xs">
                          {hw.marks !== null && (
                            <p className="font-bold text-emerald-800 dark:text-emerald-400">
                              Score: {hw.marks} / {item.maxMarks || 10}
                            </p>
                          )}
                          {hw.feedback && (
                            <p className="text-slate-600 dark:text-slate-350 mt-1">
                              <strong>Feedback:</strong> {hw.feedback}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {hw.status !== 'Pending' && hw.submittedFile && (
                        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl">
                          <Eye size={14} className="text-slate-400" />
                          <a href={hw.submittedFile} target="_blank" rel="noreferrer" className="text-blue-500 underline truncate block">{hw.submittedFile}</a>
                        </div>
                      )}

                      {hw.submittedText && (
                        <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl">
                          <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Your Submission Text Answer:</p>
                          <p className="text-slate-700 dark:text-slate-300 italic">"{hw.submittedText}"</p>
                        </div>
                      )}

                      {canSubmit && (
                        <div className="space-y-2 pt-2">
                          {submittingHwId === hw._id ? (
                            <div className="space-y-2">
                              <textarea
                                placeholder="Write optional text solution..."
                                value={submittingHwText}
                                onChange={(e) => setSubmittingHwText(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                                rows={2}
                              />
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="Paste optional solution URL..."
                                  value={submittingHwUrl}
                                  onChange={(e) => setSubmittingHwUrl(e.target.value)}
                                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                                <button
                                  onClick={() => handleHomeworkSubmit(item._id, submittingHwUrl, submittingHwText)}
                                  disabled={!submittingHwUrl.trim() && !submittingHwText.trim()}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                                >
                                  Submit
                                </button>
                                <button onClick={() => setSubmittingHwId(null)} className="p-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">X</button>
                              </div>
                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                  <Upload size={14} />
                                  <span>Upload File</span>
                                  <input type="file" onChange={(e) => handleFileUpload(e, "homework")} className="hidden" />
                                </label>
                                {uploadProgress && <span className="text-[10px] text-slate-400 font-bold">Uploading: {uploadProgress}%</span>}
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSubmittingHwId(hw._id);
                                setSubmittingHwUrl(hw.submittedFile || '');
                                setSubmittingHwText(hw.submittedText || '');
                              }}
                              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-850 dark:text-slate-350 text-xs font-bold rounded-xl transition-colors"
                            >
                              {hw.status === 'Pending' ? 'Submit solution' : 'Resubmit solution'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              }
            </div>
          </div>

          {/* Assignments Section */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Assignments Tracker ({assignments.length})</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {assignments.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No assignments published for your class.</p>
              ) : (
                assignments.map((ass) => (
                  <div key={ass.id} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded">{ass.course}</span>
                        <h4 className="font-bold text-slate-850 dark:text-white mt-1">{ass.title}</h4>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        ass.status === 'Submitted' ? 'bg-amber-100 text-amber-800' :
                        ass.status === 'Reviewed' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-500'
                      }`}>{ass.status}</span>
                    </div>
                    <p className="text-xs text-slate-500">{ass.description}</p>
                    
                    {ass.status !== 'Pending' && ass.fileUrl && (
                      <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-855 p-2.5 rounded-xl">
                        <Eye size={14} className="text-slate-400" />
                        <a href={ass.fileUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline truncate block">{ass.fileUrl}</a>
                      </div>
                    )}

                    {ass.status === 'Pending' && (
                      <div className="space-y-2 pt-2">
                        {submittingAssId === ass.id ? (
                          <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Paste solution URL..."
                                value={submittingAssUrl}
                                onChange={(e) => setSubmittingAssUrl(e.target.value)}
                                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              />
                              <button
                                onClick={() => handleAssignmentSubmit(ass.id, submittingAssUrl)}
                                disabled={!submittingAssUrl.trim()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                              >
                                Submit
                              </button>
                              <button onClick={() => setSubmittingAssId(null)} className="p-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">X</button>
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                <Upload size={14} />
                                <span>Upload File</span>
                                <input type="file" onChange={(e) => handleFileUpload(e, "assignment")} className="hidden" />
                              </label>
                              {uploadProgress && <span className="text-[10px] text-slate-400 font-bold">Uploading: {uploadProgress}%</span>}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSubmittingAssId(ass.id)}
                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-855 dark:text-slate-350 text-xs font-bold rounded-xl"
                          >
                            Submit solution
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exams & Grades Tab */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Exams & Term Grades</h2>
            <p className="text-slate-500 text-sm mt-1">Review your performance scores, graded marks, and academic standing.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-lg">Term Results</h3>
              {examResults.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No exam results recorded for this term.</p>
              ) : (
                <div className="space-y-3">
                  {examResults.map((result, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-850 dark:text-white">{result.subject}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Score: {result.marks} / {result.total}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">Grade {result.grade}</span>
                        <span className="text-sm font-black text-emerald-500">{result.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 h-fit">
              <h3 className="font-bold text-lg">Academic Standing Summary</h3>
              <div className="p-4 bg-blue-600 text-white rounded-2xl space-y-1">
                <p className="text-[10px] font-black uppercase opacity-80">Class Rank</p>
                <p className="text-3xl font-black">Top 15%</p>
              </div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1">
                <p className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-355">Grade Point Average</p>
                <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{averageGradePercent}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Tab */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Class Timetable</h2>
            <p className="text-slate-500 text-sm mt-1">Review your weekly schedule slots and lecture halls.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="space-y-4">
              {timetable.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No classes scheduled on the timetable.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {timetable.map((slot, idx) => (
                    <div key={idx} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded">
                          {slot.time}
                        </span>
                        <span className="text-xs text-slate-450 font-bold">{slot.room}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{slot.subject}</h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quizzes & Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Academy Test & Quizzes</h2>
            <p className="text-slate-500 text-sm mt-1">Take assigned tests or trigger AI custom mock exams.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Class quizzes list */}
            <div className="space-y-4 lg:col-span-2">
              {attemptingQuiz ? (
                // ACTIVE QUIZ RUNNING PANEL
                <div className="bg-white dark:bg-slate-900 border border-blue-500/50 p-6 rounded-3xl space-y-6 relative overflow-hidden">
                  <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">{attemptingQuiz.title}</h4>
                      <p className="text-xs text-slate-500">Duration: {attemptingQuiz.durationMinutes} mins</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-slate-400">Time Remaining</p>
                      <p className="text-2xl font-black text-blue-600">
                        {Math.floor(quizTimer / 60)}:{String(quizTimer % 60).padStart(2, '0')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {attemptingQuiz.questions.map((q, idx) => (
                      <div key={q._id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/10">
                        <p className="font-bold text-slate-800 dark:text-white text-sm">{idx + 1}. {q.question}</p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [q._id.toString()]: opt }))}
                              className={`text-left px-4 py-2.5 text-xs rounded-xl font-bold border transition-colors ${
                                quizAnswers[q._id.toString()] === opt
                                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-600'
                                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSubmitQuizAnswers}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition-colors"
                  >
                    Submit Final Quiz Answers
                  </button>
                </div>
              ) : (
                // NORMAL QUIZZES LIST
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Classroom Exams ({quizzes.length})</h3>
                  
                  {quizzes.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">No quizzes assigned to your class cohort yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {quizzes.map((q) => (
                        <div key={q._id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{q.subject}</span>
                            <h4 className="font-bold text-slate-850 dark:text-white">{q.title}</h4>
                            <p className="text-[10px] text-slate-500 font-semibold">{q.questions?.length} Questions • {q.durationMinutes} Mins</p>
                          </div>
                          
                          <div className="flex gap-2">
                            {q.attempted ? (
                              <>
                                <button
                                  onClick={() => handleViewLeaderboard(q._id)}
                                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition-all"
                                >
                                  Scoreboard
                                </button>
                                <span className="px-4 py-2 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0">
                                  <CheckCircle2 size={12} /> {q.attemptDetails?.percentage}%
                                </span>
                              </>
                            ) : (
                              <button
                                onClick={() => handleStartQuiz(q)}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
                              >
                                Start Quiz
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Leaderboard Panel Overlay */}
                  {viewingLeaderboardId && (
                    <div className="p-5 border-t border-slate-150 dark:border-slate-800 pt-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">Exam Scoreboard</h4>
                        <button onClick={() => setViewingLeaderboardId(null)} className="text-xs text-rose-500 font-bold">Close</button>
                      </div>
                      <div className="space-y-2">
                        {leaderboard.map((lead, idx) => (
                          <div key={lead._id} className="flex justify-between items-center p-3 border border-slate-100 dark:border-slate-850 rounded-xl bg-slate-50/50">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              #{idx + 1} {lead.studentId?.name || 'Student'}
                            </span>
                            <span className="text-xs font-black text-blue-600">{lead.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Custom Practice Test Maker */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Brain className="text-purple-600" />
                AI Practice Generator
              </h3>

              <div className="space-y-3">
                <label className="block text-xs font-black uppercase text-slate-450">Subject</label>
                <select
                  value={practiceSubject}
                  onChange={(e) => setPracticeSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                </select>

                <label className="block text-xs font-black uppercase text-slate-450">Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Photosynthesis, Algebra..."
                  value={practiceTopic}
                  onChange={(e) => setPracticeTopic(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />

                <button
                  onClick={handleGeneratePracticeTest}
                  disabled={generatingPractice || !practiceTopic.trim()}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {generatingPractice ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  Generate Practice Test
                </button>
              </div>

              {practiceQuestions.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                  {practiceScore === null ? (
                    <div className="space-y-4">
                      {practiceQuestions.map((q, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl space-y-2">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{idx + 1}. {q.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {q.options.map(opt => (
                              <button
                                key={opt}
                                onClick={() => setPracticeAnswers(prev => ({ ...prev, [idx]: opt }))}
                                className={`text-left px-3 py-1.5 text-[10px] rounded-lg font-bold border transition-colors ${
                                  practiceAnswers[idx] === opt ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={submitPracticeTestAnswers}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md"
                      >
                        Submit Answers
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 dark:bg-emerald-950/25 p-4 border border-emerald-100 dark:border-emerald-900 rounded-2xl text-center space-y-2">
                      <p className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300">Practice Score</p>
                      <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{practiceScore} / {practiceQuestions.length}</p>
                      <button
                        onClick={() => {
                          setPracticeQuestions([]);
                          setPracticeScore(null);
                          setPracticeTopic("");
                        }}
                        className="mt-2 text-xs font-bold bg-white text-slate-800 border border-slate-200 px-4 py-1.5 rounded-lg"
                      >
                        Reset Mock Test
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reminders & Study Planner Tab */}
      {activeTab === 'reminders' && (
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">AI Study Schedule Planner</h2>
              <p className="text-slate-500 text-sm mt-1">Generate dynamic study recommendations based on academic priority.</p>
            </div>
            <button
              onClick={handleGenerateAIStudyPlan}
              disabled={generatingPlan}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-600/20"
            >
              {generatingPlan ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              Generate Plan
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Prioritized Subjects</h3>
                <div className="space-y-3">
                  {studySchedule.map((sched, idx) => (
                    <div key={idx} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-slate-850 dark:text-white">{sched.subject}</h4>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          sched.priority === 'High' ? 'bg-rose-100 text-rose-800' :
                          sched.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-500'
                        }`}>{sched.priority} Priority</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{sched.recommendation}</p>
                      <p className="text-[10px] text-blue-650 font-bold uppercase tracking-wider">Suggested Study Slot: {sched.durationHours} Hours</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">AI Revision Rules</h3>
              <div className="space-y-3">
                {plannerRecommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl text-xs font-semibold text-slate-655 dark:text-slate-400">
                    <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={14} />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Classroom Communications Flow Tab */}
      {activeTab === 'communication' && (
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Classroom Doubts Chat</h2>
            <p className="text-slate-500 text-sm mt-1">Talk to the AI Zweifel chatbot to clarify concepts and ask homework questions.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[550px]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                  <Brain size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white">Clazo AI Dubious Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Doubts Solver Active</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <ChatBox botName="Clazo Assistant" welcomeMessage="Hi! I am your Clazo AI dudas assistant. Ask me study concepts or homework doubts directly." />
            </div>
          </div>
        </div>
      )}

      {/* Profile & Identity Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile & Settings Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Name</label>
                <p className="text-base font-bold text-slate-850 dark:text-white mt-1">{user?.name}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Student Code ID</label>
                <p className="text-base font-bold text-slate-850 dark:text-white mt-1">{user?.studentCode}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Class Cohort</label>
                <p className="text-base font-bold text-slate-850 dark:text-white mt-1">{user?.grade || "Class 10"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Mobile Contact</label>
                <p className="text-base font-bold text-slate-850 dark:text-white mt-1">{user?.phone || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Account Status</label>
                <span className="inline-block mt-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && <StudentFeedback />}

    </div>
  );
}
