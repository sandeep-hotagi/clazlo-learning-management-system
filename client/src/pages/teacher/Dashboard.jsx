import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChatBox from '../../components/ChatBox';
import { 
   BookOpen, 
   Users, 
   Calendar, 
   MessageSquare, 
   BarChart3, 
   TrendingUp, 
   Clock,
   Plus,
   Loader2
} from 'lucide-react';
import axios from 'axios';

export default function TeacherDashboard() {
  const { user, socket } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`${API_URL}/teacher/dashboard`, config);
      const data = res.data;
      setStats([
        { label: 'Classes', value: data.classCount.toString(), icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/teacher/schedule' },
        { label: 'Total Students', value: data.studentCount.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', path: '/teacher/attendance' },
        { label: 'Avg Attendance', value: data.avgAttendance, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/teacher/attendance' },
        { label: 'Announcements', value: data.noticeCount.toString(), icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-50', path: '/teacher/communication' },
      ]);
    } catch (err) {
      console.error('Failed to load teacher stats:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`${API_URL}/teacher/students`, config);
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to load teacher students roster:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchStudents()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleUpdate = () => {
        fetchStats();
        fetchStudents();
      };
      
      socket.on("studentRegistered", handleUpdate);
      socket.on("studentLoggedIn", handleUpdate);
      socket.on("homeworkSubmitted", handleUpdate);
      socket.on("assignmentSubmitted", handleUpdate);
      socket.on("attendanceMarked", handleUpdate);
      socket.on("studentProfileUpdated", handleUpdate);
      socket.on("statusChanged", handleUpdate);
      
      return () => {
        socket.off("studentRegistered", handleUpdate);
        socket.off("studentLoggedIn", handleUpdate);
        socket.off("homeworkSubmitted", handleUpdate);
        socket.off("assignmentSubmitted", handleUpdate);
        socket.off("attendanceMarked", handleUpdate);
        socket.off("studentProfileUpdated", handleUpdate);
        socket.off("statusChanged", handleUpdate);
      };
    }
  }, [socket]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back, {user?.name}!</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's an overview of your teaching schedule and student progress.</p>
      </div>

      {loading ? (
        <div className="p-12 flex items-center justify-center text-slate-500">
          <Loader2 className="animate-spin mr-2" /> Loading Dashboard...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats && stats.map((stat) => (
              <div 
                key={stat.label} 
                onClick={() => stat.path && navigate(stat.path)}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md hover:scale-[1.02] hover:border-indigo-500 active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} dark:bg-slate-800 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Classes */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Upcoming Classes Today</h3>
                <button className="text-indigo-600 text-sm font-bold flex items-center gap-1">
                  <Plus size={16} /> Add Class
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Grade 10 - Mathematics', time: '14:00', students: 45, status: 'In 20m' },
                  { name: 'Grade 11 - Physics', time: '16:30', students: 42, status: 'Later' },
                ].map((cls, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{cls.name}</p>
                        <p className="text-xs text-slate-500">{cls.students} students</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{cls.time}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls.status === 'In 20m' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}>
                        {cls.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { message: 'New submission from John Doe', time: '2 hours ago', type: 'assignment' },
                  { message: '5 students marked absent in 11-A', time: '4 hours ago', type: 'attendance' },
                  { message: 'Final grades published for 10-B', time: 'Yesterday', type: 'exam' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{activity.message}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assigned Students Roster */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Assigned Students Directory</h3>
              <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full">
                {students.length} Total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Roll No</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Student ID</th>
                    <th className="py-4 px-6">Class / Sec</th>
                    <th className="py-4 px-6 text-center">Homework</th>
                    <th className="py-4 px-6 text-center">Assignments</th>
                    <th className="py-4 px-6 text-center">Exam Average</th>
                    <th className="py-4 px-6">Last Login</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-400">#{student.rollNumber || 'N/A'}</td>
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{student.name}</td>
                      <td className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-400">{student.studentCode}</td>
                      <td className="py-4 px-6 font-medium text-slate-550 dark:text-slate-400">
                        {student.className} - {student.section}
                      </td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400 font-semibold">{student.homeworkStats}</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400 font-semibold">{student.assignmentStats}</td>
                      <td className="py-4 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400">{student.examPerformance}</td>
                      <td className="py-4 px-6 text-slate-550 dark:text-slate-400 text-xs">
                        {student.lastLogin ? new Date(student.lastLogin).toLocaleString() : 'Never logged in'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          student.isOnline 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${student.isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {student.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ChatBox botName="Clazlo Assistant" welcomeMessage="Hello! I'm here to help you with your classes. How can I assist you today?" />
    </div>
  );
}
