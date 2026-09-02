import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Award, Filter, ArrowUpRight, ArrowDownRight, BookOpen, Clock, CheckCircle, Search, ExternalLink, Clipboard, ListTodo } from 'lucide-react';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TOP_STUDENTS = [
  { id: 1, name: 'Emma Watson', score: 98, trend: 'up' },
  { id: 2, name: 'Noah Smith', score: 95, trend: 'up' },
  { id: 3, name: 'Olivia Davis', score: 94, trend: 'down' },
  { id: 4, name: 'Liam Johnson', score: 92, trend: 'up' },
  { id: 5, name: 'Ava Wilson', score: 90, trend: 'down' },
];

export default function Reports() {
  const { socket } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'homework', 'assignments'
  const [classFilter, setClassFilter] = useState('All Classes');
  const [examFilter, setExamFilter] = useState('Final Exams');

  // Performance Analytics Data
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Homework Tracking States
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [classFilterHw, setClassFilterHw] = useState('All');

  // Assignments Tracking States
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const loadAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await axios.get(`${API_URL}/admin/reports/analytics`, getHeaders());
      setAnalyticsData(res.data);
    } catch (e) {
      console.error("Failed to load analytics:", e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (socket) {
      const handleRefresh = () => {
        if (activeTab === 'homework') {
          loadSubmissions();
        } else if (activeTab === 'assignments') {
          loadAssignmentSubmissions();
        } else {
          loadAnalytics();
        }
      };
      
      socket.on("homeworkSubmitted", handleRefresh);
      socket.on("assignmentSubmitted", handleRefresh);
      socket.on("homeworkCreated", handleRefresh);
      socket.on("assignmentCreated", handleRefresh);
      socket.on("gradesPublished", handleRefresh);
      socket.on("assignmentReviewed", handleRefresh);
      socket.on("studentRegistered", handleRefresh);
      socket.on("studentLoggedIn", handleRefresh);

      return () => {
        socket.off("homeworkSubmitted", handleRefresh);
        socket.off("assignmentSubmitted", handleRefresh);
        socket.off("homeworkCreated", handleRefresh);
        socket.off("assignmentCreated", handleRefresh);
        socket.off("gradesPublished", handleRefresh);
        socket.off("assignmentReviewed", handleRefresh);
        socket.off("studentRegistered", handleRefresh);
        socket.off("studentLoggedIn", handleRefresh);
      };
    }
  }, [socket, activeTab]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalytics();
    } else if (activeTab === 'homework') {
      loadSubmissions();
    } else if (activeTab === 'assignments') {
      loadAssignmentSubmissions();
    }
  }, [activeTab]);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const res = await axios.get(`${API_URL}/homework/submissions/all`, getHeaders());
      setSubmissions(res.data);
    } catch (e) {
      console.error("Failed to load admin homework submissions:", e);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const loadAssignmentSubmissions = async () => {
    setLoadingAssignments(true);
    try {
      const res = await axios.get(`${API_URL}/assignment/submissions/all`, getHeaders());
      setAssignmentSubmissions(res.data);
    } catch (e) {
      console.error("Failed to load admin assignment submissions:", e);
    } finally {
      setLoadingAssignments(false);
    }
  };

  // Bar Chart Data
  const barData = {
    labels: analyticsData?.subjectWiseAverage?.labels || ['Math', 'Science', 'English', 'Hindi', 'Social Science'],
    datasets: [
      {
        label: 'Subject-wise Class Average (%)',
        data: analyticsData?.subjectWiseAverage?.data || [78, 85, 82, 75, 88],
        backgroundColor: 'rgba(99, 102, 241, 0.8)', // Indigo-500
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { min: 0, max: 100 }
    }
  };

  // Doughnut Chart Data
  const doughnutData = {
    labels: ['Passed', 'Failed'],
    datasets: [
      {
        data: analyticsData?.passFailRatio || [85, 15],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Emerald-500
          'rgba(244, 63, 94, 0.8)'   // Rose-500
        ],
        borderWidth: 0,
      },
    ],
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter(sub => {
    const student = sub.studentId;
    const homework = sub.homeworkId;
    const classObj = sub.classId;

    if (!student || !homework) return false;

    // Search query matches student name or ID
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.studentCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = subjectFilter === 'All' || homework.subject === subjectFilter;
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
    const matchesClass = classFilterHw === 'All' || classObj?.name === classFilterHw;

    return matchesSearch && matchesSubject && matchesStatus && matchesClass;
  });

  // Filter Assignment Submissions
  const filteredAssignmentSubmissions = assignmentSubmissions.filter(sub => {
    const student = sub.studentId;
    const assignment = sub.assignmentId;
    const classObj = sub.classId;

    if (!student || !assignment) return false;

    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.studentCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = subjectFilter === 'All' || assignment.subject === subjectFilter;
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
    const matchesClass = classFilterHw === 'All' || classObj?.name === classFilterHw;

    return matchesSearch && matchesSubject && matchesStatus && matchesClass;
  });

  // Unique filters lists
  const activeSubmissionsList = activeTab === 'homework' ? submissions : assignmentSubmissions;
  const subjectsList = Array.from(new Set(activeSubmissionsList.map(s => s.homeworkId?.subject || s.assignmentId?.subject).filter(Boolean)));
  const classesList = Array.from(new Set(activeSubmissionsList.map(s => s.classId?.name).filter(Boolean)));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Performance</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1 max-w-md">Comprehensive analysis tools for class metrics, results, and academic tasks.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Performance Analytics
          </button>
          <button
            onClick={() => setActiveTab('homework')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'homework' ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Homework Tracking
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'assignments' ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Assignment Tracking
          </button>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        /* ANALYTICS VIEW */
        <div className="space-y-6">
          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Class Average Performance</h2>
                <div className="flex gap-2">
                  <select 
                    value={classFilter} 
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl outline-none"
                  >
                    <option>All Classes</option>
                    <option>Class 7</option>
                    <option>Class 8</option>
                    <option>Class 9</option>
                    <option>Class 10</option>
                  </select>
                </div>
              </div>
              <div className="h-72 flex items-center justify-center">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>

            <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Pass / Fail Ratio</h2>
              <div className="flex-1 flex items-center justify-center relative">
                <div className="h-48 w-48 relative">
                  <Doughnut data={doughnutData} options={{ cutout: '75%' }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-emerald-500">
                      {analyticsData?.passFailRatio?.[0] !== undefined ? `${analyticsData.passFailRatio[0]}%` : "85%"}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Passed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Leaderboard */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Award className="text-amber-500" /> Top 5 Students Leaderboard
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(analyticsData?.leaderboard || TOP_STUDENTS).map((student, idx) => (
                <div key={student.id || idx} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-indigo-500 transition-colors">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex justify-between items-start mb-4">
                    <span className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-black text-slate-500 dark:text-slate-400">
                      #{idx + 1}
                    </span>
                    {student.trend === 'up' ? (
                      <ArrowUpRight size={18} className="text-emerald-500" />
                    ) : (
                      <ArrowDownRight size={18} className="text-rose-500" />
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{student.name}</h3>
                  <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">{student.score}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* TASKS SUBMISSIONS TRACKING LIST (Homework or Assignment) */
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-xs text-slate-850 dark:text-white placeholder-slate-400 w-full"
              />
            </div>

            {/* Class Filter */}
            <select
              value={classFilterHw}
              onChange={(e) => setClassFilterHw(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
            >
              <option value="All">All Classes</option>
              {classesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
            >
              <option value="All">All Subjects</option>
              {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Submitted">Submitted</option>
              <option value="Reviewed">Reviewed</option>
            </select>
          </div>

          {/* Submissions Roster Logs Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            {(activeTab === 'homework' ? loadingSubmissions : loadingAssignments) ? (
              <div className="p-12 text-center text-slate-500">
                <Loader2 className="animate-spin mr-2 inline" /> Loading student task logs...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Student</th>
                      <th className="py-4 px-6">Class Room</th>
                      <th className="py-4 px-6">Task Title</th>
                      <th className="py-4 px-6">Subject</th>
                      <th className="py-4 px-6">Solution File</th>
                      <th className="py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {(activeTab === 'homework' ? filteredSubmissions : filteredAssignmentSubmissions).map((sub) => {
                      const task = sub.homeworkId || sub.assignmentId || {};
                      return (
                        <tr key={sub._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                          <td className="py-4 px-6">
                            <p className="font-bold text-slate-900 dark:text-white">{sub.studentId?.name || 'Unknown'}</p>
                            <p className="text-xs text-slate-500">{sub.studentId?.studentCode || '-'}</p>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-655 dark:text-slate-400">
                            {sub.classId?.name || sub.grade || '-'}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-850 dark:text-slate-200">
                            {task.title || '-'}
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-500">{task.subject || '-'}</td>
                          <td className="py-4 px-6">
                            {sub.submittedFile ? (
                              <a href={sub.submittedFile} target="_blank" rel="noreferrer" className="text-blue-500 underline flex items-center gap-1 hover:text-blue-600 transition-colors">
                                <ExternalLink size={14} /> Open file
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium">Not submitted</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                              sub.status === 'Approved' || sub.status === 'Reviewed' ? 'bg-emerald-100 text-emerald-800' :
                              sub.status === 'Submitted' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-550'
                            }`}>{sub.status}</span>
                          </td>
                        </tr>
                      );
                    })}

                    {(activeTab === 'homework' ? filteredSubmissions : filteredAssignmentSubmissions).length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                          No matching task submission records found in the database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
