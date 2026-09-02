import { useState, useEffect } from 'react';
import { Award, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ParentExams() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await axios.get(`${API_URL}/parent/results`);
        setResults(res.data);
      } catch (err) {
        console.error('Failed to load child exam results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Header */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-500">Academic Progress</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Exam Results Monitoring</h1>
              <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">Track and monitor academic marks, grades, and teacher remarks for your child.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-3 text-sm font-medium text-indigo-700 dark:bg-slate-800 dark:text-sky-300">
              <Award className="h-5 w-5" />
              Report Cards
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <Loader2 className="animate-spin mr-2" /> Loading Exam Results...
          </div>
        ) : (
          <div className="grid gap-6">
            {results.map((res) => {
              const dateStr = new Date(res.createdAt).toLocaleDateString();
              const isPassing = res.marksObtained >= (res.totalMarks * 0.4);
              return (
                <div key={res._id} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${isPassing ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'}`}>
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{res.subject} ({res.examType})</h3>
                      <p className="text-sm text-slate-500">Student: <span className="font-semibold text-slate-700 dark:text-slate-300">{res.studentId?.name || 'N/A'}</span></p>
                      <p className="text-xs text-slate-400">Class: {res.classId?.name || 'N/A'} - Date: {dateStr}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Score</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{res.marksObtained} / {res.totalMarks}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Grade</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${isPassing ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                        {res.grade}
                      </span>
                    </div>
                  </div>

                  {res.remarks && (
                    <div className="md:max-w-xs bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-750 text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Teacher Remarks:</span>
                      {res.remarks}
                    </div>
                  )}
                </div>
              );
            })}

            {results.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <AlertCircle className="mx-auto text-slate-400 mb-2" />
                No exam results published for your children yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
