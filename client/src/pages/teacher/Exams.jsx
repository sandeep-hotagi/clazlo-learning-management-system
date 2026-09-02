import { useState, useEffect } from 'react';
import { Award, Save, Search, TrendingUp, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function TeacherExams() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Exam Details Form
  const [subject, setSubject] = useState('Science');
  const [examType, setExamType] = useState('Final Exams');
  const [totalMarks, setTotalMarks] = useState(100);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/teacher/classes`);
      setClasses(res.data);
      if (res.data.length > 0) {
        handleSelectClass(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load teacher classes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    const list = cls.students || [];
    setStudents(list);

    // Initialise scores to empty/0
    const initialScores = {};
    const initialRemarks = {};
    list.forEach(s => {
      initialScores[s._id] = 80; // default initial score
      initialRemarks[s._id] = '';
    });
    setScores(initialScores);
    setRemarks(initialRemarks);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleScoreChange = (studentId, value) => {
    const numericValue = value === '' ? '' : Number(value);
    if (numericValue === '' || (numericValue >= 0 && numericValue <= totalMarks)) {
      setScores(prev => ({
        ...prev,
        [studentId]: numericValue
      }));
    }
  };

  const handleRemarkChange = (studentId, value) => {
    setRemarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const calculateAverage = () => {
    const validScores = Object.values(scores).filter(s => s !== '');
    if (validScores.length === 0) return 0;
    const sum = validScores.reduce((a, b) => a + b, 0);
    return (sum / validScores.length).toFixed(1);
  };

  const handleSave = async () => {
    if (!selectedClass) return;
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      // Send sequential POST requests for all students
      const promises = students.map(student => {
        const marksObtained = scores[student._id] || 0;
        const studentRemarks = remarks[student._id] || '';
        return axios.post(`${API_URL}/teacher/results`, {
          studentId: student._id,
          classId: selectedClass._id,
          subject,
          examType,
          marksObtained,
          totalMarks: Number(totalMarks),
          remarks: studentRemarks,
        });
      });

      await Promise.all(promises);
      setSuccessMsg('All student marks uploaded and saved successfully!');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit exam results.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Exams & Grading Workflow</h1>
              <p className="text-slate-550 dark:text-slate-400 text-sm font-medium">Select a class, input exam parameters, and save student results.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Target Class</label>
              <select
                value={selectedClass?._id || ''}
                onChange={(e) => {
                  const cls = classes.find(c => c._id === e.target.value);
                  if (cls) handleSelectClass(cls);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.name} - Section {c.section}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Subject</label>
              <input 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Exam Type</label>
              <input 
                type="text" 
                value={examType} 
                onChange={(e) => setExamType(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Max Marks</label>
              <input 
                type="number" 
                value={totalMarks} 
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white w-20 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <TrendingUp size={18} className="text-emerald-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Class Average</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{calculateAverage()} / {totalMarks}</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving || students.length === 0}
            className="flex w-full sm:w-auto items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Publish Marks
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-2xl font-bold flex items-center gap-2">
          <CheckCircle2 /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-100 border border-rose-200 text-rose-800 rounded-2xl font-bold flex items-center gap-2">
          <AlertCircle /> {errorMsg}
        </div>
      )}

      {/* Grading Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center text-slate-500">
            <Loader2 className="animate-spin mr-2" /> Loading Students...
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No students found in this class.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Roll No</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Marks Obtained</th>
                <th className="py-4 px-6">Remarks / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student, idx) => (
                <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-450 dark:text-slate-400">#{idx + 101}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-905 dark:text-white">{student.name}</p>
                    <p className="text-xs text-slate-500">Code: {student.studentCode}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={scores[student._id] ?? ''}
                        onChange={(e) => handleScoreChange(student._id, e.target.value)}
                        className="w-20 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-sm font-semibold text-slate-400">/ {totalMarks}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <input 
                      type="text" 
                      value={remarks[student._id] || ''}
                      onChange={(e) => handleRemarkChange(student._id, e.target.value)}
                      placeholder="e.g. Excellent conceptual clarity"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
