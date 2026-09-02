import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherCommunication from './pages/teacher/Communication';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherHomework from './pages/teacher/Homework';
import TeacherExams from './pages/teacher/Exams';
import TeacherLessons from './pages/teacher/Lessons';
import TeacherSchedule from './pages/teacher/Schedule';
import TeacherResources from './pages/teacher/Resources';
import StudentDashboard from './pages/student/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Placeholder from './pages/Placeholder';
import AttendanceTracker from './pages/AttendanceTracker';
import AcademicCalendar from './pages/AcademicCalendar';
import SchoolAdminDashboard from './pages/admin/Dashboard';
import TeacherManagement from './pages/admin/TeacherManagement';
import StudentManagement from './pages/admin/StudentManagement';
import ClassConfig from './pages/admin/ClassConfig';
import ExamsManagement from './pages/admin/ExamsManagement';
import AdminReports from './pages/admin/Reports';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminResources from './pages/admin/Resources';
import AdminSecurity from './pages/admin/Security';
import AdminFeedbackManagement from './pages/admin/FeedbackManagement';
import TeacherFeedbackReceived from './pages/teacher/FeedbackReceived';
import TeacherStudentFeedback from './pages/teacher/StudentFeedback';
import CompanyOverview from './pages/company/Overview';
import CompanyOnboarding from './pages/company/Onboarding';
import CompanySubscriptions from './pages/company/Subscriptions';
import CompanySettings from './pages/company/Settings';
import CompanyNotifications from './pages/company/Notifications';
import CompanySupport from './pages/company/Support';
import CompanyAnalytics from './pages/company/Analytics';
import NaacDashboard from "./pages/naac/NaacDashboard";
import MasterChecklist from "./pages/naac/MasterChecklist";
import EvidenceRepository from "./pages/naac/EvidenceRepository";
import EnterpriseAnalytics from "./pages/naac/EnterpriseAnalytics";
import CompanyAudit from './pages/company/Audit';
import SchoolGroup from './pages/SchoolGroup';

function App() {
  // Initialize dark mode preference from localStorage
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Layout with sidebar & header */}
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/school-group" element={<SchoolGroup />} />
              <Route path="/academic-calendar" element={<AcademicCalendar />} />
              
              {/* Company Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedAdminType="company" />}>
                <Route path="/company" element={<Navigate to="/company/overview" replace />} />
                <Route path="/company/overview" element={<CompanyOverview />} />
                <Route path="/company/onboarding" element={<CompanyOnboarding />} />
                <Route path="/company/subscriptions" element={<CompanySubscriptions />} />
                <Route path="/company/settings" element={<CompanySettings />} />
                <Route path="/company/notifications" element={<CompanyNotifications />} />
                <Route path="/company/support" element={<CompanySupport />} />
                <Route path="/company/analytics" element={<CompanyAnalytics />} />
                <Route path="/company/audit" element={<CompanyAudit />} />
              </Route>

              {/* School Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} allowedAdminType="school" />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<SchoolAdminDashboard />} />
                <Route path="/admin/teacher-management" element={<TeacherManagement />} />
                <Route path="/admin/student-management" element={<StudentManagement />} />
                <Route path="/admin/class-config" element={<ClassConfig />} />
                <Route path="/admin/exams-management" element={<ExamsManagement />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                <Route path="/admin/resources" element={<AdminResources />} />
                <Route path="/admin/security" element={<AdminSecurity />} />
                <Route path="/admin/feedback" element={<AdminFeedbackManagement />} />
              </Route>

              {/* Teacher Routes */}
              <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/teacher/attendance" element={<TeacherAttendance />} />
                <Route path="/teacher/homework" element={<TeacherHomework />} />
                <Route path="/teacher/exams" element={<TeacherExams />} />
                <Route path="/teacher/communication" element={<TeacherCommunication />} />
                <Route path="/teacher/lessons" element={<TeacherLessons />} />
                <Route path="/teacher/schedule" element={<TeacherSchedule />} />
                <Route path="/teacher/resources" element={<TeacherResources />} />
          <Route path="/teacher/feedback-received" element={<TeacherFeedbackReceived />} />
          <Route path="/teacher/student-feedback" element={<TeacherStudentFeedback />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student/*" element={<StudentDashboard />} />
              </Route>
              {/* NAAC Platform Integration Routes */}
              <Route path="/naac/dashboard" element={<NaacDashboard />} />
              <Route path="/naac/master-checklist" element={<MasterChecklist />} />
              <Route path="/documents/repository" element={<EvidenceRepository />} />
              <Route path="/documents/upload" element={<EvidenceRepository />} />
              <Route path="/documents/search" element={<EvidenceRepository />} />
              <Route path="/documents/archive" element={<EvidenceRepository />} />
              <Route path="/documents/version-history" element={<EvidenceRepository />} />
              <Route path="/documents/search-advanced" element={<EvidenceRepository />} />
              <Route path="/documents/expiry-tracker" element={<EvidenceRepository />} />
              <Route path="/documents/audit-log" element={<EvidenceRepository />} />
              <Route path="/analytics/enterprise" element={<EnterpriseAnalytics />} />

              {/* Dynamic Sub-Paths pointing to unified NaacDashboard layout */}
              {[
                "/admin/eligibility", "/admin/approvals", "/admin/institutional-documents",
                "/admin/governance", "/admin/governing-body", "/admin/policies", "/admin/strategic-plan",
                "/iqac/dashboard", "/iqac/aqar", "/iqac/meetings", "/iqac/initiatives", "/iqac/evidence",
                "/faculty/performance", "/faculty/fdp", "/faculty/publications", "/faculty/workload", "/faculty/appraisal",
                "/student/feedback", "/student/scholarships", "/student/placements", "/student/mentoring", "/admin/student-support",
                "/research/publications", "/research/patents", "/research/projects", "/research/extension", "/research/collaborations",
                "/infrastructure/library", "/infrastructure/labs", "/infrastructure/ict", "/infrastructure/safety",
                "/academics/calendar", "/academics/result-analysis", "/academics/co-po", "/academics/attainment", "/academics/performance",
                "/faculty/api-score", "/faculty/promotion-history", "/faculty/achievements",
                "/student/progression", "/student/competitive-exams", "/student/alumni", "/student/internships", "/student/achievements",
                "/research/consultancy", "/research/grants", "/research/mou", "/research/funding", "/research/outcomes",
                "/infrastructure/library-analytics", "/infrastructure/lab-maintenance", "/infrastructure/licenses", "/infrastructure/incidents", "/infrastructure/safety-audits",
                "/naac/readiness", "/naac/gap-analysis", "/naac/risk-alerts", "/naac/trends"
              ].map(path => (
                <Route key={path} path={path} element={<NaacDashboard />} />
              ))}
            </Route>

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
