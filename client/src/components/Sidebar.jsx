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
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import LogoImage from '../assets/logo.png';

const sections = [
  {
    key: 'company',
    label: 'PLATFORM MANAGEMENT',
    roles: ['admin'],
    adminType: 'company',
    items: [
      { to: '/company/overview', label: 'Platform Overview', icon: LayoutGrid },
      { to: '/company/onboarding', label: 'School Onboarding', icon: Building2 },
      { to: '/company/subscriptions', label: 'Subscriptions & Payments', icon: CreditCard },
      { to: '/company/settings', label: 'System Settings', icon: Settings },
      { to: '/company/notifications', label: 'Notifications Hub', icon: Bell },
      { to: '/company/support', label: 'Support Tickets', icon: LifeBuoy },
      { to: '/company/analytics', label: 'Deep Analytics', icon: TrendingUp },
      { to: '/company/audit', label: 'Audit & Compliance', icon: ShieldCheck },
    ],
  },
  {
    key: 'school',
    label: 'SCHOOL ADMINISTRATION',
    roles: ['admin'],
    adminType: 'school',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutGrid },
      { to: '/admin/teacher-management', label: 'Teacher Management', icon: UserCheck },
      { to: '/admin/student-management', label: 'Student Management', icon: Users },
      { to: '/admin/class-config', label: 'Class Configuration', icon: BookOpen },
      { to: '/admin/exams-management', label: 'Exam Management', icon: ClipboardList },
      { to: '/admin/reports', label: 'Reports & Analytics', icon: PieChart },
      { to: '/admin/announcements', label: 'Announcements', icon: Bell },
      { to: '/admin/resources', label: 'Resources & Facilities', icon: Building2 },
      { to: '/admin/security', label: 'Security & Settings', icon: Shield },
      { to: '/admin/feedback', label: 'Feedback Management', icon: Award },
    ],
  },
  {
    key: 'teacher',
    label: 'ACADEMIC PORTAL',
    roles: ['teacher'],
    items: [
      { to: '/teacher/attendance', label: 'Daily Attendance', icon: CheckSquare },
      { to: '/teacher/homework', label: 'Homework & Tasks', icon: FileText },
      { to: '/teacher/exams', label: 'Exams & Grading', icon: ClipboardList },
      { to: '/teacher/communication', label: 'Communications', icon: MessageSquare },
      { to: '/teacher/lessons', label: 'Lesson Planner', icon: Book },
      { to: '/teacher/schedule', label: 'Daily Schedule', icon: Calendar },
      { to: '/teacher/feedback-received', label: 'Feedback Received', icon: Award },
      { to: '/teacher/student-feedback', label: 'Give Student Feedback', icon: MessageSquare },
      { to: '/teacher/resources', label: 'Digital Library', icon: LayoutGrid },
    ],
  },
  {
    key: 'student',
    label: 'STUDENT PORTAL',
    roles: ['student'],
    items: [
      { to: '/student/subjects', label: 'Subjects & Lessons', icon: Book },
      { to: '/student/homework', label: 'Homework & Tasks', icon: ClipboardList },
      { to: '/student/exams', label: 'Exams & Grades', icon: FileText },
      { to: '/student/timetable', label: 'Class Timetable', icon: Calendar },
      { to: '/student/reminders', label: 'Study Planner', icon: Bell },
      { to: '/student/performance', label: 'Performance Analytics', icon: TrendingUp },
      { to: '/student/communication', label: 'Class Chat', icon: MessageSquare },
      { to: '/student/feedback', label: 'Teacher Feedback', icon: Award },
      { to: '/student/profile', label: 'My Profile', icon: User },
    ],
  },
  {
    key: 'global',
    label: 'GLOBAL',
    roles: ['admin', 'teacher', 'student'],
    items: [
      { to: '/academic-calendar', label: 'Academic Calendar', icon: Calendar },
    ],
  },
  {
    key: 'naac',
    label: 'NAAC ACCREDITATION',
    roles: ['admin', 'teacher', 'student'],
    items: [
      { to: '/naac/dashboard', label: 'Accreditation Dashboard', icon: LayoutGrid },
      { to: '/naac/master-checklist', label: 'Master Checklist', icon: CheckSquare },
      { to: '/documents/repository', label: 'Evidence Repository', icon: Book },
      { to: '/analytics/enterprise', label: 'Enterprise Analytics', icon: PieChart },
    ],
  },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    company: true,
    school: true,
    teacher: true,
    student: true,
    naac: true,
    global: true
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col transition-all duration-300 z-40 ${
          isCollapsed ? 'lg:w-20' : 'lg:w-72'
        } ${mobileOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-white/80 dark:bg-slate-850 p-1.5 rounded-xl shadow-md border border-slate-200/50 dark:border-slate-800/50 shrink-0">
              <img src={LogoImage} alt="Clazlo" className="h-8 w-8 object-contain" />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in duration-300">
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Clazlo<span className="text-blue-600">Hub</span>
                </h1>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Education SaaS</p>
              </div>
            )}
          </div>
          
          {/* Collapse toggle in desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Links Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 custom-scrollbar">
          {filteredSections.map((section) => {
            const isExpanded = expandedSections[section.key];
            return (
              <div key={section.key}>
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between px-3 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-3 uppercase hover:text-slate-650 dark:hover:text-slate-350 transition-colors cursor-pointer outline-none"
                  >
                    <span>{section.label}</span>
                    {isExpanded ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
                  </button>
                ) : (
                  <div className="border-t border-slate-200/30 dark:border-slate-800/30 my-4" />
                )}
                
                {(!isCollapsed ? isExpanded : true) && (
                  <div className="space-y-1 animate-in slide-in-from-top-1 duration-150">
                    {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 relative group
                      ${isActive 
                        ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <item.icon size={19} className="shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate animate-in fade-in duration-200">{item.label}</span>
                    )}

                    {/* Tooltip on collapse */}
                    {isCollapsed && (
                      <div className="absolute left-16 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-slate-200/40 dark:border-slate-800/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all active:scale-95 group relative"
          >
            <LogOut size={19} className="shrink-0" />
            {!isCollapsed ? (
              <span className="animate-in fade-in duration-200">Sign Out</span>
            ) : (
              <div className="absolute left-16 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Dynamic desktop spacer to offset the sidebar width */}
      <div className={`hidden lg:block transition-all duration-300 shrink-0 ${isCollapsed ? 'w-20' : 'w-72'}`} />
    </>
  );
}
