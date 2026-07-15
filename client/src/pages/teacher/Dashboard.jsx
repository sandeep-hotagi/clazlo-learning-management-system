import { useState } from 'react';
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
  Plus
} from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Classes', value: '12', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Students', value: '340', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg Attendance', value: '82%', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Announcements', value: '4', icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back, {user?.name}!</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's an overview of your teaching schedule and student progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
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
      
      <ChatBox botName="Clazlo Assistant" welcomeMessage="Hello! I'm here to help you with your classes. How can I assist you today?" />
    </div>
  );
}
