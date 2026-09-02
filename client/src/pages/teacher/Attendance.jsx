import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Save, Loader2, AlertCircle, BarChart3, FileText, Download } from 'lucide-react';
import axios from 'axios';

export default function TeacherAttendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Tab switching state
  const [activeSubTab, setActiveSubTab] = useState('mark'); // 'mark' or 'reports'
  const [historyLogs, setHistoryLogs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [dateStr] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/teacher/classes`, getHeaders());
      setClasses(res.data);
      if (res.data.length > 0) {
        handleSelectClass(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch teacher classes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSelectClass = async (cls) => {
    setSelectedClass(cls);
    setLoading(true);
    let list = [];
    try {
      const rosterRes = await axios.get(`${API_URL}/classes/${cls._id}/students`, getHeaders());
      list = rosterRes.data || [];
    } catch (rErr) {
      console.error('Failed to fetch class students:', rErr);
      list = cls.students || [];
    }
    setStudents(list);

    // Initialise all to Present
    const initial = {};
    list.forEach(s => {
      initial[s._id] = 'Present';
    });

    // Check if attendance already exists for today to allow editing
    try {
      const todayIso = new Date().toISOString().split('T')[0];
      const res = await axios.get(`${API_URL}/attendance/${cls._id}/${todayIso}`, getHeaders());
      if (res.data && res.data.records) {
        res.data.records.forEach(rec => {
          initial[rec.studentId._id || rec.studentId] = rec.status;
        });
      }
    } catch (err) {
      console.log('No prior attendance found or failed to load:', err);
    }

    setAttendance(initial);
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(false);

    // If on reports tab, load history
    if (activeSubTab === 'reports') {
      loadHistory(cls._id);
    }
  };

  const loadHistory = async (clsId) => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${API_URL}/attendance/history/${clsId}`, getHeaders());
      setHistoryLogs(res.data);
    } catch (e) {
      console.warn("Failed to load history logs");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass && activeSubTab === 'reports') {
      loadHistory(selectedClass._id);
    }
  }, [activeSubTab, selectedClass]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = async () => {
    if (!selectedClass) return;
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status,
      }));

      await axios.post(`${API_URL}/attendance`, {
        classId: selectedClass._id,
        date: new Date(),
        records,
      }, getHeaders());

      setSuccessMsg('Attendance records marked and saved successfully!');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save attendance records.');
    } finally {
      setSaving(false);
    }
  };

  // Export CSV Helper
  const handleExportCSV = () => {
    if (historyLogs.length === 0) {
      alert("No attendance records available to export.");
      return;
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Student Name,Roll Number,Status\n";

    historyLogs.forEach(log => {
      const logDate = new Date(log.date).toLocaleDateString();
      log.records.forEach(rec => {
        const studentName = rec.studentId?.name || "N/A";
        const rollNumber = rec.studentId?.rollNumber || "-";
        csvContent += `"${logDate}","${studentName}","${rollNumber}","${rec.status}"\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedClass?.name || 'Class'}_attendance_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate statistics from history logs
  const calculateStats = () => {
    if (historyLogs.length === 0) return { avg: 100, present: 0, absent: 0, late: 0 };
    let totalRecordsCount = 0;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;

    historyLogs.forEach(log => {
      log.records.forEach(rec => {
        totalRecordsCount++;
        if (rec.status === 'Present') presentCount++;
        else if (rec.status === 'Absent') absentCount++;
        else if (rec.status === 'Late') lateCount++;
      });
    });

    const avg = totalRecordsCount > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalRecordsCount) * 100) : 100;
    return { avg, present: presentCount, absent: absentCount, late: lateCount };
  };

  const stats = calculateStats();

  const summary = {
    present: Object.values(attendance).filter(status => status === 'Present').length,
    absent: Object.values(attendance).filter(status => status === 'Absent').length,
    late: Object.values(attendance).filter(status => status === 'Late').length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Daily Attendance Workspace</h1>
              <p className="text-slate-550 dark:text-slate-400 text-sm font-medium">{dateStr}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Select Class:</span>
            <select
              value={selectedClass?._id || ''}
              onChange={(e) => {
                const cls = classes.find(c => c._id === e.target.value);
                if (cls) handleSelectClass(cls);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
            >
              <option value="" disabled>Choose class...</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name} - Section {c.section}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setActiveSubTab('mark')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'mark'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Mark Roster
            </button>
            <button
              onClick={() => setActiveSubTab('reports')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'reports'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Analytics & History
            </button>
          </div>

          {activeSubTab === 'mark' ? (
            <button
              onClick={handleSave}
              disabled={saving || students.length === 0}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 text-xs"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Submit Records
            </button>
          ) : (
            <button
              onClick={handleExportCSV}
              disabled={historyLogs.length === 0}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 text-xs disabled:opacity-50"
            >
              <Download size={16} />
              Export CSV Report
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-2xl font-bold flex items-center gap-2 text-sm">
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-100 border border-rose-200 text-rose-800 rounded-2xl font-bold flex items-center gap-2 text-sm">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {activeSubTab === 'mark' ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-5 rounded-2xl flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-emerald-650 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider">Present</p>
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{summary.present}</p>
              </div>
            </div>

            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-5 rounded-2xl flex items-center gap-4">
              <div className="h-12 w-12 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center">
                <XCircle size={24} />
              </div>
              <div>
                <p className="text-rose-650 dark:text-rose-400 text-sm font-bold uppercase tracking-wider">Absent</p>
                <p className="text-2xl font-black text-rose-700 dark:text-rose-300">{summary.absent}</p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-5 rounded-2xl flex items-center gap-4">
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-amber-655 dark:text-amber-450 text-sm font-bold uppercase tracking-wider">Late</p>
                <p className="text-2xl font-black text-amber-700 dark:text-amber-300">{summary.late}</p>
              </div>
            </div>
          </div>

          {/* Roster Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            {loading ? (
              <div className="p-12 flex items-center justify-center text-slate-500">
                <Loader2 className="animate-spin mr-2" /> Loading Students Roster...
              </div>
            ) : students.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No students found in this class.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Roll No</th>
                      <th className="py-4 px-6">Student ID</th>
                      <th className="py-4 px-6">Student Name</th>
                      <th className="py-4 px-6">Gender</th>
                      <th className="py-4 px-6 text-center">Present</th>
                      <th className="py-4 px-6 text-center">Absent</th>
                      <th className="py-4 px-6 text-center">Late</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-450 dark:text-slate-400">#{student.rollNumber || 'N/A'}</td>
                        <td className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-400">{student.studentCode}</td>
                        <td className="py-4 px-6 font-bold text-slate-905 dark:text-white">{student.name}</td>
                        <td className="py-4 px-6 text-slate-500">{student.gender || 'N/A'}</td>
                        
                        <td className="py-4 px-6 text-center">
                          <input 
                            type="radio"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id] === 'Present'}
                            onChange={() => handleStatusChange(student._id, 'Present')}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-6 text-center">
                          <input 
                            type="radio"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id] === 'Absent'}
                            onChange={() => handleStatusChange(student._id, 'Absent')}
                            className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-6 text-center">
                          <input 
                            type="radio"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id] === 'Late'}
                            onChange={() => handleStatusChange(student._id, 'Late')}
                            className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300 cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        // REPORTS & HISTORY TAB
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl text-center space-y-2">
              <BarChart3 className="mx-auto text-blue-600" size={32} />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Class Average Attendance</p>
              <p className="text-3xl font-black text-blue-650 dark:text-blue-400">{stats.avg}%</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl text-center space-y-2">
              <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Days Recorded</p>
              <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{historyLogs.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl text-center space-y-2">
              <XCircle className="mx-auto text-rose-600" size={32} />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Absences Flagged</p>
              <p className="text-3xl font-black text-rose-700 dark:text-rose-350">{stats.absent}</p>
            </div>
          </div>

          {/* History log lists */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            {historyLoading ? (
              <div className="p-12 text-center text-slate-500">
                <Loader2 className="animate-spin mr-2 inline" /> Loading attendance history records...
              </div>
            ) : historyLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No past attendance records found in the database.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-505 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Present Count</th>
                      <th className="py-4 px-6">Absent Count</th>
                      <th className="py-4 px-6">Late Count</th>
                      <th className="py-4 px-6">Daily Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {historyLogs.map((log) => {
                      const p = log.records.filter(r => r.status === 'Present').length;
                      const a = log.records.filter(r => r.status === 'Absent').length;
                      const l = log.records.filter(r => r.status === 'Late').length;
                      const total = log.records.length;
                      const percent = total > 0 ? Math.round(((p + l * 0.5) / total) * 100) : 100;
                      return (
                        <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-850 dark:text-white">
                            {new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="py-4 px-6 text-emerald-600 font-bold">{p}</td>
                          <td className="py-4 px-6 text-rose-600 font-bold">{a}</td>
                          <td className="py-4 px-6 text-amber-500 font-bold">{l}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 text-xs rounded-lg font-bold ${
                              percent >= 90 ? 'bg-emerald-100 text-emerald-800' :
                              percent >= 75 ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>{percent}%</span>
                          </td>
                        </tr>
                      );
                    })}
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
