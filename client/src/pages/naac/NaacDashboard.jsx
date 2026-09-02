import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ShieldCheck, 
  Award, 
  BookOpen, 
  UserCheck, 
  Users, 
  TrendingUp, 
  Building2, 
  FileText, 
  Download, 
  Plus, 
  AlertCircle,
  BarChart2,
  Calendar,
  Lock,
  Edit2,
  FileCheck,
  TrendingDown,
  Layers
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from "recharts";

export default function NaacDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve active module based on url path
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes("eligibility") || path.includes("approvals") || path.includes("institutional-documents")) return "eligibility";
    if (path.includes("governance") || path.includes("governing-body") || path.includes("policies") || path.includes("strategic-plan")) return "governance";
    if (path.includes("iqac") || path.includes("aqar") || path.includes("meetings") || path.includes("initiatives") || path.includes("evidence")) return "iqac";
    if (path.includes("academics")) return "academics";
    if (path.includes("faculty")) return "faculty";
    if (path.includes("student")) return "student";
    if (path.includes("research")) return "research";
    if (path.includes("infrastructure")) return "infrastructure";
    if (path.includes("readiness") || path.includes("gap-analysis") || path.includes("risk-alerts") || path.includes("trends")) return "readiness";
    return "dashboard"; // default
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [subTab, setSubTab] = useState("general");

  // Sync tab state with url changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSubTab("general");
    if (tab === "dashboard") navigate("/naac/dashboard");
    else if (tab === "eligibility") navigate("/admin/eligibility");
    else if (tab === "governance") navigate("/admin/governance");
    else if (tab === "iqac") navigate("/iqac/dashboard");
    else if (tab === "academics") navigate("/academics/co-po");
    else if (tab === "faculty") navigate("/faculty/workload");
    else if (tab === "student") navigate("/student/progression");
    else if (tab === "research") navigate("/research/consultancy");
    else if (tab === "infrastructure") navigate("/infrastructure/library-analytics");
    else if (tab === "readiness") navigate("/naac/readiness");
  };

  // State holders for dynamic database items
  const [eligibilityData, setEligibilityData] = useState({ approvals: [], docs: [], status: {} });
  const [governanceData, setGovernanceData] = useState({ policies: [], members: [], plans: [] });
  const [iqacData, setIqacData] = useState({ aqars: [], records: [], initiatives: [] });
  const [academicsData, setAcademicsData] = useState({ coPoMapping: [] });
  const [facultyData, setFacultyData] = useState({ fdps: [], appraisal: [], publications: [] });
  const [studentData, setStudentData] = useState({ feedback: [], scholarships: [], placements: [], internships: [], mentoring: [], competitiveExams: [] });
  const [researchData, setResearchData] = useState({ publications: [], patents: [], projects: [], extensions: [], consultancy: [], mous: [] });
  const [infraData, setInfraData] = useState({ library: [], labs: [], ict: [], safety: [], smartClassrooms: [], incidents: [] });
  
  const [loading, setLoading] = useState(true);

  // Form input states
  const [fdpTitle, setFdpTitle] = useState("");
  const [fdpOrganizer, setFdpOrganizer] = useState("");
  const [policyTitle, setPolicyTitle] = useState("");
  const [publicationTitle, setPublicationTitle] = useState("");
  const [publicationJournal, setPublicationJournal] = useState("");
  
  // New input states
  const [examName, setExamName] = useState("GATE");
  const [examScore, setExamScore] = useState("");
  const [mouPartner, setMouPartner] = useState("");
  const [mouDuration, setMouDuration] = useState("3");
  const [consultancyTitle, setConsultancyTitle] = useState("");
  const [consultancyClient, setConsultancyClient] = useState("");
  const [consultancyRevenue, setConsultancyRevenue] = useState("");
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentSeverity, setIncidentSeverity] = useState("Low");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const [elRes, govRes, iqacRes, acRes, facRes, stuRes, resRes, infRes] = await Promise.all([
        axios.get(`${API_URL}/naac/eligibility`, config),
        axios.get(`${API_URL}/naac/governance`, config),
        axios.get(`${API_URL}/naac/iqac`, config),
        axios.get(`${API_URL}/naac/academics`, config),
        axios.get(`${API_URL}/naac/faculty`, config),
        axios.get(`${API_URL}/naac/student`, config),
        axios.get(`${API_URL}/naac/research`, config),
        axios.get(`${API_URL}/naac/infrastructure`, config)
      ]);

      setEligibilityData(elRes.data);
      setGovernanceData(govRes.data);
      setIqacData(iqacRes.data);
      setAcademicsData(acRes.data);
      setFacultyData(facRes.data);
      setStudentData(stuRes.data);
      setResearchData(resRes.data);
      setInfraData(infRes.data);
    } catch (err) {
      console.warn("Failed to load live NAAC records, displaying fallback structure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleAddCompetitiveExam = async (e) => {
    e.preventDefault();
    if (!examScore) return;
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.post(`${API_URL}/naac/student/competitive-exams`, {
        examName,
        scoreObtained: examScore,
        passingYear: "2025"
      }, config);
      setExamScore("");
      loadData();
      alert("Competitive exam progress record saved.");
    } catch (err) {
      alert("Action failed: " + err.message);
    }
  };

  const handleAddMou = async (e) => {
    e.preventDefault();
    if (!mouPartner) return;
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.post(`${API_URL}/naac/research/mou`, {
        institutionPartner: mouPartner,
        durationYears: Number(mouDuration),
        status: "Active"
      }, config);
      setMouPartner("");
      loadData();
      alert("MoU partnership recorded successfully.");
    } catch (err) {
      alert("Action failed: " + err.message);
    }
  };

  const handleAddConsultancy = async (e) => {
    e.preventDefault();
    if (!consultancyTitle) return;
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.post(`${API_URL}/naac/research/consultancy`, {
        title: consultancyTitle,
        clientOrganization: consultancyClient,
        revenueGenerated: Number(consultancyRevenue),
        status: "Completed"
      }, config);
      setConsultancyTitle("");
      setConsultancyClient("");
      setConsultancyRevenue("");
      loadData();
      alert("Consultancy project generated revenue saved.");
    } catch (err) {
      alert("Action failed: " + err.message);
    }
  };

  const handleAddIncident = async (e) => {
    e.preventDefault();
    if (!incidentTitle) return;
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.post(`${API_URL}/naac/infrastructure/safety/incidents`, {
        incidentTitle,
        severityLevel: incidentSeverity,
        resolutionStatus: "Pending"
      }, config);
      setIncidentTitle("");
      loadData();
      alert("Safety incident logged on dashboard.");
    } catch (err) {
      alert("Action failed: " + err.message);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="text-blue-600" /> NAAC Compliance Suite
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Accreditation Readiness & Institution ERP</p>
        </div>
      </div>

      {/* Tabs Row Selector */}
      <div className="flex overflow-x-auto gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 custom-scrollbar">
        {[
          { id: "dashboard", label: "Dashboard", icon: BarChart2 },
          { id: "readiness", label: "Readiness Check", icon: Layers },
          { id: "eligibility", label: "Eligibility & UGC", icon: ShieldCheck },
          { id: "governance", label: "Governance & Policies", icon: Lock },
          { id: "academics", label: "Academics Outcomes", icon: BookOpen },
          { id: "faculty", label: "Faculty & Workloads", icon: UserCheck },
          { id: "student", label: "Student Progression", icon: Users },
          { id: "research", label: "Research & MoUs", icon: TrendingUp },
          { id: "infrastructure", label: "Infrastructure Safety", icon: Building2 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => changeTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* VIEW: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Criterion I – Curricular Aspects", value: 92 },
                  { name: "Criterion II – Teaching & Learning", value: 85 },
                  { name: "Criterion III – Research & Extensions", value: 78 },
                  { name: "Criterion IV – Learning Resources", value: 89 },
                  { name: "Criterion V – Student Progression", value: 81 },
                  { name: "Criterion VI – Leadership Management", value: 95 },
                  { name: "Criterion VII – Values & Best Practices", value: 87 }
                ].map((crit, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h3 className="text-xs font-black uppercase text-slate-400">{crit.name}</h3>
                    <div className="flex justify-between items-end">
                      <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{crit.value}%</span>
                      <span className="text-[10px] font-bold text-emerald-500">Active</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: `${crit.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: ADVANCED NAAC READINESS */}
          {activeTab === "readiness" && (
            <div className="space-y-6">
              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                {["readiness", "gap", "risk", "trends"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubTab(sub)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${
                      subTab === sub ? "bg-slate-250 dark:bg-slate-800 text-blue-600" : "text-slate-500"
                    }`}
                  >
                    {sub} View
                  </button>
                ))}
              </div>

              {subTab === "readiness" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Criterion Readiness Completion</h3>
                  <div className="space-y-4">
                    {[
                      { criterion: "Criterion I: Curricular Aspects", value: 92 },
                      { criterion: "Criterion II: Teaching-Learning & Evaluation", value: 85 },
                      { criterion: "Criterion III: Research, Innovations & Extension", value: 78 },
                      { criterion: "Criterion IV: Infrastructure & Learning Resources", value: 89 },
                      { criterion: "Criterion V: Student Support & Progression", value: 81 }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span>{item.criterion}</span>
                          <span>{item.value}% Ready</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {subTab === "gap" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Accreditation Evidence Gap Analysis</h3>
                  <div className="space-y-3">
                    {[
                      { title: "Criterion 3.2.1: Seed Money for Research Projects", status: "Missing Link", severity: "High" },
                      { title: "Criterion 5.3.1: Placement Records Offer Letters", status: "Verification Pending", severity: "Medium" },
                      { title: "Criterion 4.1.3: Smart Classroom Weekly Logs", status: "Out of Date", severity: "Low" }
                    ].map((gap, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div>
                          <p className="font-bold text-xs">{gap.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Status: {gap.status}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                          gap.severity === "High" ? "bg-rose-500/10 text-rose-500" :
                          gap.severity === "Medium" ? "bg-yellow-500/10 text-yellow-500" :
                          "bg-blue-500/10 text-blue-500"
                        }`}>{gap.severity} Risk</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {subTab === "risk" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Accreditation Risks & Alerts</h3>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex gap-3">
                    <AlertCircle className="text-yellow-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-yellow-800 dark:text-yellow-400">AQAR 2025-26 Pending Files</h4>
                      <p className="text-xs text-yellow-700 dark:text-yellow-350 mt-1">
                        Syllabus version comparisons are missing for Computer Science. Please configure alignment outputs.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {subTab === "trends" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Accreditation Score Trends</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { year: "2021", score: 62 },
                        { year: "2022", score: 68 },
                        { year: "2023", score: 75 },
                        { year: "2024", score: 81 },
                        { year: "2025", score: 88 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:stroke-slate-850" />
                        <XAxis dataKey="year" stroke="#888888" fontSize={10} />
                        <YAxis stroke="#888888" fontSize={10} domain={[0, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: ACADEMICS OUTCOMES */}
          {activeTab === "academics" && (
            <div className="space-y-6">
              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                {["copo", "calendar", "results"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubTab(sub)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${
                      subTab === sub ? "bg-slate-250 dark:bg-slate-800 text-blue-600" : "text-slate-550"
                    }`}
                  >
                    {sub} View
                  </button>
                ))}
              </div>

              {subTab === "copo" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">CO-PO Attainment Calculation Matrix</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-500">
                      <thead className="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Course Code</th>
                          <th className="py-3 px-4">PO1 (Knowledge)</th>
                          <th className="py-3 px-4">PO2 (Design)</th>
                          <th className="py-3 px-4">PO3 (Ethics)</th>
                          <th className="py-3 px-4">Direct Attainment (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-bold text-slate-800 dark:text-slate-200">
                        <tr>
                          <td className="py-3.5 px-4">CS101</td>
                          <td className="py-3.5 px-4 text-blue-600">3 (High)</td>
                          <td className="py-3.5 px-4 text-blue-600">2 (Med)</td>
                          <td className="py-3.5 px-4 text-slate-400">1 (Low)</td>
                          <td className="py-3.5 px-4 text-emerald-500">82%</td>
                        </tr>
                        <tr>
                          <td className="py-3.5 px-4">EC202</td>
                          <td className="py-3.5 px-4 text-blue-600">2 (Med)</td>
                          <td className="py-3.5 px-4 text-blue-600">3 (High)</td>
                          <td className="py-3.5 px-4 text-blue-600">2 (Med)</td>
                          <td className="py-3.5 px-4 text-emerald-500">76%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {subTab === "calendar" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Academic Events Schedule</h3>
                  <div className="space-y-3">
                    {[
                      { title: "Mid-Semester Examinations", date: "Oct 12, 2026" },
                      { title: "Consolidated Attendance Roster Audit", date: "Nov 05, 2026" },
                      { title: "CO-PO Attainment Calculation Deadline", date: "Dec 18, 2026" }
                    ].map((evt, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <span className="text-xs font-bold">{evt.title}</span>
                        <span className="text-[10px] text-indigo-500 font-extrabold">{evt.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {subTab === "results" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Semester-wise Result Comparison</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "Sem I", passRate: 84, classAvg: 72 },
                        { name: "Sem II", passRate: 88, classAvg: 78 },
                        { name: "Sem III", passRate: 91, classAvg: 81 },
                        { name: "Sem IV", passRate: 89, classAvg: 76 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:stroke-slate-850" />
                        <XAxis dataKey="name" stroke="#888888" fontSize={10} />
                        <YAxis stroke="#888888" fontSize={10} domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="passRate" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Pass Rate (%)" />
                        <Bar dataKey="classAvg" fill="#10b981" radius={[4, 4, 0, 0]} name="Class Average (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: FACULTY & WORKLOADS */}
          {activeTab === "faculty" && (
            <div className="space-y-6">
              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                {["workload", "appraisal", "fdp"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubTab(sub)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${
                      subTab === sub ? "bg-slate-250 dark:bg-slate-800 text-blue-600" : "text-slate-550"
                    }`}
                  >
                    {sub} View
                  </button>
                ))}
              </div>

              {subTab === "workload" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="font-bold text-lg">Weekly Hours Balance</h3>
                    <div className="space-y-3">
                      {[
                        { department: "Mathematics", currentHours: 42, threshold: 45 },
                        { department: "Computer Science", currentHours: 58, threshold: 50 },
                        { department: "Science", currentHours: 35, threshold: 45 }
                      ].map((work, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span>{work.department}</span>
                            <span className={work.currentHours > work.threshold ? "text-rose-500 font-extrabold" : "text-slate-400"}>
                              {work.currentHours} / {work.threshold} Hours
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${work.currentHours > work.threshold ? "bg-rose-500" : "bg-blue-600"}`} style={{ width: `${Math.min((work.currentHours / work.threshold) * 100, 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h3 className="font-bold text-lg">Automatic Workload Indicators</h3>
                    <p className="text-xs text-slate-550 dark:text-slate-400">
                      Workload thresholds are calculated based on registered timetables and department structures.
                    </p>
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-400">
                      Workload balance index: 88.5% (Stable)
                    </div>
                  </div>
                </div>
              )}

              {subTab === "appraisal" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Faculty Appraisals & API Scores</h3>
                  <div className="space-y-3">
                    {facultyData.appraisal.map((ap, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div>
                          <p className="font-bold text-xs">{ap.facultyId?.name || "Faculty Member"}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Academic Year: {ap.academicYear}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">API Index: {ap.apiScore}</p>
                          <p className="text-[9px] text-slate-400 font-bold">Appraisal: {ap.appraisalScore}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {subTab === "fdp" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">FDP & Certifications</h3>
                  <div className="space-y-3">
                    {facultyData.fdps.map((fd, idx) => (
                      <div key={idx} className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <p className="font-bold text-xs">{fd.title}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-black mt-0.5">Organizer: {fd.organizer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: STUDENT PROGRESSION */}
          {activeTab === "student" && (
            <div className="space-y-6">
              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                {["exams", "progression", "internships"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubTab(sub)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${
                      subTab === sub ? "bg-slate-250 dark:bg-slate-800 text-blue-600" : "text-slate-550"
                    }`}
                  >
                    {sub} View
                  </button>
                ))}
              </div>

              {subTab === "exams" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 h-fit">
                    <h3 className="font-bold text-lg">Log Exam Progress</h3>
                    <form onSubmit={handleAddCompetitiveExam} className="space-y-3">
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Select Exam</label>
                        <select 
                          value={examName} 
                          onChange={(e) => setExamName(e.target.value)}
                          className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none cursor-pointer"
                        >
                          <option value="GATE">GATE</option>
                          <option value="GRE">GRE</option>
                          <option value="CAT">CAT</option>
                          <option value="TOEFL">TOEFL</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Score Obtained</label>
                        <input 
                          type="text" 
                          required 
                          value={examScore}
                          onChange={(e) => setExamScore(e.target.value)}
                          placeholder="e.g. 98.4 Percentile" 
                          className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none"
                        />
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700">Save Progress</button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="font-bold text-lg">Competitive Examinations Passed</h3>
                    <div className="space-y-3">
                      {studentData.competitiveExams.map((ex, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                          <div>
                            <p className="font-bold text-xs">{ex.studentId?.name || "Student"}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Exam: {ex.examName}</p>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-black">{ex.scoreObtained}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {subTab === "progression" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Student Placements & Alumni Progression</h3>
                  <div className="space-y-3">
                    {studentData.placements.map((pl, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div>
                          <p className="font-bold text-xs">{pl.studentId?.name || "Student"}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Company: {pl.companyName} | Designation: {pl.designation}</p>
                        </div>
                        <span className="text-xs font-bold text-indigo-500">{pl.packageLPA} LPA</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {subTab === "internships" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Internships Completion</h3>
                  <div className="space-y-3">
                    {studentData.internships.map((int, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div>
                          <p className="font-bold text-xs">{int.studentId?.name || "Student"}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Company: {int.companyName} | Duration: {int.durationWeeks} Weeks</p>
                        </div>
                        <span className="text-xs font-bold text-indigo-500">{int.projectTitle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: RESEARCH & MoUs */}
          {activeTab === "research" && (
            <div className="space-y-6">
              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                {["consultancy", "mou", "publications"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubTab(sub)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${
                      subTab === sub ? "bg-slate-250 dark:bg-slate-800 text-blue-600" : "text-slate-550"
                    }`}
                  >
                    {sub} View
                  </button>
                ))}
              </div>

              {subTab === "consultancy" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 h-fit">
                    <h3 className="font-bold text-lg">Log Consultancy Revenue</h3>
                    <form onSubmit={handleAddConsultancy} className="space-y-3">
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Project Title</label>
                        <input 
                          type="text" 
                          required 
                          value={consultancyTitle}
                          onChange={(e) => setConsultancyTitle(e.target.value)}
                          placeholder="e.g. ERP System Consulting" 
                          className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Client Organization</label>
                        <input 
                          type="text" 
                          required 
                          value={consultancyClient}
                          onChange={(e) => setConsultancyClient(e.target.value)}
                          placeholder="e.g. Acme Corporation" 
                          className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Revenue Generated ($)</label>
                        <input 
                          type="number" 
                          required 
                          value={consultancyRevenue}
                          onChange={(e) => setConsultancyRevenue(e.target.value)}
                          placeholder="e.g. 15000" 
                          className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none"
                        />
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700">Record Consultancy</button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="font-bold text-lg">Consultancy Projects & Revenue</h3>
                    <div className="space-y-3">
                      {researchData.consultancy.map((con, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                          <div>
                            <p className="font-bold text-xs">{con.title}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Client: {con.clientOrganization} | Coordinator: {con.facultyId?.name}</p>
                          </div>
                          <span className="text-xs font-bold text-indigo-500">${con.revenueGenerated}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {subTab === "mou" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 h-fit">
                    <h3 className="font-bold text-lg">Record MoU / Partnership</h3>
                    <form onSubmit={handleAddMou} className="space-y-3">
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Partner Institution</label>
                        <input 
                          type="text" 
                          required 
                          value={mouPartner}
                          onChange={(e) => setMouPartner(e.target.value)}
                          placeholder="e.g. MIT University" 
                          className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Duration (Years)</label>
                        <input 
                          type="number" 
                          required 
                          value={mouDuration}
                          onChange={(e) => setMouDuration(e.target.value)}
                          placeholder="e.g. 3" 
                          className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none"
                        />
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700">Record MoU</button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="font-bold text-lg">MoU & Institutional Collaboration Agreements</h3>
                    <div className="space-y-3">
                      {researchData.mous.map((m, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                          <div>
                            <p className="font-bold text-xs">{m.institutionPartner}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Signing Date: {new Date(m.signingDate).toLocaleDateString()} | Duration: {m.durationYears} Years</p>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-black">Active</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {subTab === "publications" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Research Publications</h3>
                  <div className="space-y-3">
                    {researchData.publications.map((pb, idx) => (
                      <div key={idx} className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <p className="font-bold text-xs">{pb.title}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-black mt-0.5">Journal: {pb.journalName} | Indexed In: {pb.indexedIn}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: INFRASTRUCTURE SAFETY */}
          {activeTab === "infrastructure" && (
            <div className="space-y-6">
              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                {["library", "calibrations", "safety"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubTab(sub)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${
                      subTab === sub ? "bg-slate-250 dark:bg-slate-800 text-blue-600" : "text-slate-550"
                    }`}
                  >
                    {sub} View
                  </button>
                ))}
              </div>

              {subTab === "library" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Library Usage & Borrow Stats</h3>
                  <div className="space-y-3">
                    {infraData.library.map((lib, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <span className="text-xs font-bold">{lib.title}</span>
                        <span className="text-xs font-black text-indigo-500">{lib.usageAnalytics} Borrows</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {subTab === "calibrations" && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Equipment Calibrations</h3>
                  <div className="space-y-3">
                    {infraData.labs.map((eq, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div>
                          <p className="font-bold text-xs">{eq.equipmentName}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Lab: {eq.labName}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-500">{eq.maintenanceStatus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {subTab === "safety" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 h-fit">
                    <h3 className="font-bold text-lg">Log Safety Incident</h3>
                    <form onSubmit={handleAddIncident} className="space-y-3">
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Incident Title</label>
                        <input 
                          type="text" 
                          required 
                          value={incidentTitle}
                          onChange={(e) => setIncidentTitle(e.target.value)}
                          placeholder="e.g. Lab Fire Extinguisher Refill Alert" 
                          className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Severity Level</label>
                        <select 
                          value={incidentSeverity} 
                          onChange={(e) => setIncidentSeverity(e.target.value)}
                          className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none cursor-pointer"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700">Log Incident</button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="font-bold text-lg">Safety Incidents Logs</h3>
                    <div className="space-y-3">
                      {infraData.incidents.map((inc, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                          <div>
                            <p className="font-bold text-xs">{inc.incidentTitle}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Reported Date: {new Date(inc.reportedDate).toLocaleDateString()} | Severity: {inc.severityLevel}</p>
                          </div>
                          <span className="px-2.5 py-1 bg-rose-500/10 text-rose-500 rounded-lg text-xs font-black">{inc.resolutionStatus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
