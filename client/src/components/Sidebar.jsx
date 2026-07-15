import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutGrid, 
  Building2, 
  CreditCard, 
  Settings, 
  Bell, 
  LifeBuoy, 
  TrendingUp, 
  ShieldCheck,
  UserCheck,
  Users,
  BookOpen,
  ClipboardList,
  Calendar,
  Shield,
  CheckSquare,
  Award,
  MessageSquare,
  Book,
  User,
  LogOut,
  Menu,
  X,
  PieChart,
  FileText
} from 'lucide-react';
import LogoImage from '../assets/logo.png';

const sections = [
  {
    key: 'company',
    label: 'COMPANY DASHBOARD',
    roles: ['admin'],
    adminType: 'company',
    items: [
      { to: '/company/overview', label: 'Platform Overview Journey', icon: LayoutGrid },
      { to: '/company/onboarding', label: 'School Onboarding Workflow', icon: Building2 },
      { to: '/company/subscriptions', label: 'Subscription & Payments Process', icon: CreditCard },
      { to: '/company/settings', label: 'System Settings Navigation', icon: Settings },
      { to: '/company/notifications', label: 'Platform Notifications Handling', icon: Bell },
      { to: '/company/support', label: 'Support Ticket Management', icon: LifeBuoy },
      { to: '/company/analytics', label: 'Deep Analytics Review', icon: TrendingUp },
      { to: '/company/audit', label: 'Audit & Compliance Journey', icon: ShieldCheck },
    ],
  },
  {
    key: 'school',
    label: 'SCHOOL ADMIN DASHBOARD',
    roles: ['admin'],
    adminType: 'school',
    items: [
      { to: '/admin/teacher-management', label: 'Teacher Management Journey', icon: UserCheck },
      { to: '/admin/student-management', label: 'Student Management & Enrollment', icon: Users },
      { to: '/admin/class-config', label: 'Class & Section Configuration', icon: BookOpen },
      { to: '/admin/exams-management', label: 'School-wide Exam Management', icon: ClipboardList },
      { to: '/admin/reports', label: 'Reports & Performance Analytics', icon: PieChart },
      { to: '/admin/announcements', label: 'School Announcements Workflow', icon: Bell },
      { to: '/admin/resources', label: 'Resource & Facility Management', icon: Building2 },
      { to: '/admin/security', label: 'Security & Admin Settings', icon: Shield },
    ],
  },
  {
    key: 'teacher',
    label: 'TEACHER DASHBOARD',
    roles: ['teacher'],
    items: [
      { to: '/teacher/attendance', label: 'Daily Attendance Marking', icon: CheckSquare },
      { to: '/teacher/homework', label: 'Homework Assignment Workflow', icon: FileText },
      { to: '/teacher/exams', label: 'Exams & Grading Workflow', icon: ClipboardList },
      { to: '/teacher/communication', label: 'Classroom Communication Flow', icon: MessageSquare },
      { to: '/teacher/lessons', label: 'Lesson Planning Navigation', icon: Book },
      { to: '/teacher/schedule', label: 'Timetable & Schedule Access', icon: Calendar },
      { to: '/teacher/resources', label: 'Digital Resource Sharing', icon: LayoutGrid },
    ],
  },
  {
    key: 'student',
    label: 'STUDENT DASHBOARD',
    roles: ['student'],
    items: [
      { to: '/student/subjects', label: 'Subjects & Lessons Navigation', icon: Book },
      { to: '/student/homework', label: 'Homework Tracker Usage', icon: ClipboardList },
      { to: '/student/exams', label: 'Exams & Results Viewing', icon: FileText },
      { to: '/student/timetable', label: 'Daily Timetable Access', icon: Calendar },
      { to: '/student/reminders', label: 'Study Reminder Setup', icon: Bell },
      { to: '/student/performance', label: 'Self-Performance Tracking', icon: TrendingUp },
      { to: '/student/communication', label: 'Class Communication Flow', icon: MessageSquare },
      { to: '/student/profile', label: 'Profile & Identity Management', icon: User },
    ],
  },
  {
    key: 'parent',
    label: 'PARENT DASHBOARD',
    roles: ['parent'],
    items: [
      { to: '/parent/attendance', label: 'Attendance Tracking Journey', icon: CheckSquare },
      { to: '/parent/exams', label: 'Exam Results Monitoring', icon: FileText },
      { to: '/parent/communication', label: 'Teacher Communication Workflow', icon: MessageSquare },
      { to: '/parent/notices', label: 'School Notices Viewing', icon: Bell },
      { to: '/parent/performance', label: 'Student Performance Insights', icon: PieChart },
      { to: '/parent/payments', label: 'Fee Payment & Tracking', icon: CreditCard },
      { to: '/parent/family', label: 'Family Profile Management', icon: Users },
      { to: '/parent/events', label: 'School Event Calendar', icon: Calendar },
    ],
  },
  {
    key: 'global',
    label: 'GLOBAL RESOURCES',
    roles: ['admin', 'teacher', 'student', 'parent'],
    items: [
      { to: '/academic-calendar', label: 'Academic Calendar 2027', icon: Calendar },
    ],
  },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredSections = sections.filter(section => {
    if (!user) return false;
    const hasRole = section.roles.includes(user.role);
    if (!hasRole) return false;
    if (section.adminType && user.adminType !== section.adminType) return false;
    return true;
  });

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 z-40 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header/Logo Area */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800">
              <img src={LogoImage} alt="Clazlo" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                Clazlo<span className="text-blue-600">Hub</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          {filteredSections.map((section) => (
            <div key={section.key} className="mb-8">
              <h2 className="px-4 text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                {section.label}
              </h2>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <item.icon size={20} strokeWidth={2} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      {/* Sidebar spacer for desktop to prevent overlapping */}
      <div className="hidden lg:block w-72 flex-shrink-0" />
    </>
  );
}
