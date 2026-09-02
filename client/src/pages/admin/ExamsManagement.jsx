import { useState, useEffect } from 'react';
import { Plus, BookOpen, Send, Calendar as CalendarIcon, Loader2, Trash2, X } from 'lucide-react';
import axios from 'axios';

export default function ExamsManagement() {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState('');
  const [date, setDate] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchData = async () => {
    setLoading(true);
    try {
      const exRes = await axios.get(`${API_URL}/admin/exams`);
      setExams(exRes.data);

      const clRes = await axios.get(`${API_URL}/admin/classes`);
      setClasses(clRes.data);
    } catch (err) {
      console.error('Failed to fetch exams config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_URL}/admin/exams`, {
        title,
        classId,
        date,
        totalMarks: Number(totalMarks),
      });
      setShowModal(false);
      setTitle('');
      setClassId('');
      setDate('');
      setTotalMarks(100);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    try {
      await axios.delete(`${API_URL}/admin/exams/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete exam:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">School-wide Exam Management</h1>
          <p className="text-slate-500 text-sm mt-1">Create exams, assign classes, and manage scheduled exams.</p>
        </div>
        <button 
          onClick={() => {
            setTitle('');
            setClassId(classes[0]?._id || '');
            setDate('');
            setTotalMarks(100);
            setError('');
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} /> Create Exam
        </button>
      </div>

      {loading ? (
        <div className="p-12 flex items-center justify-center text-slate-500">
          <Loader2 className="animate-spin mr-2" /> Loading Exams...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map(exam => {
            const examDate = new Date(exam.date).toLocaleDateString();
            const className = exam.classId ? `${exam.classId.name} - Section ${exam.classId.section}` : 'N/A';
            return (
              <div key={exam._id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col relative group">
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(exam._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <CalendarIcon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{exam.title}</h3>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{className}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6 space-y-2">
                  <p className="text-xs text-slate-500"><span className="font-bold">Total Marks:</span> {exam.totalMarks}</p>
                  <p className="text-xs text-slate-500"><span className="font-bold">Exam Date:</span> {examDate}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      Scheduled
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Exam</h2>

            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Exam Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Evaluation"
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Class</label>
                <select 
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                >
                  <option value="">-- Select Class --</option>
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>{c.name} - Section {c.section}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Exam Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Marks</label>
                <input 
                  type="number" 
                  required
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Create Exam
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
