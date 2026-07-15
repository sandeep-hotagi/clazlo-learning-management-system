import { useState } from 'react';
import { Plus, BookOpen, Send, Calendar as CalendarIcon } from 'lucide-react';

const MOCK_EXAMS = [
  { id: 1, name: 'Term 1 Finals', type: 'Final', subjects: ['Math', 'Science', 'English'], status: 'Published' },
  { id: 2, name: 'Midterm Evaluation', type: 'Midterm', subjects: ['History', 'Geography'], status: 'Draft' },
  { id: 3, name: 'Mock Test Series 1', type: 'Mock', subjects: ['Physics', 'Chemistry'], status: 'Draft' },
];

export default function ExamsManagement() {
  const [exams, setExams] = useState(MOCK_EXAMS);

  const togglePublish = (id) => {
    setExams(exams.map(e => 
      e.id === id ? { ...e, status: e.status === 'Draft' ? 'Published' : 'Draft' } : e
    ));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">School-wide Exam Management</h1>
          <p className="text-slate-500 text-sm mt-1">Create exams, assign subjects, enter marks, and publish results.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20">
          <Plus size={18} /> Create Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <div key={exam.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{exam.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{exam.type}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Assigned Subjects</p>
              <div className="flex flex-wrap gap-2">
                {exam.subjects.map(sub => (
                  <span key={sub} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700">
                    <BookOpen size={12} className="text-indigo-500" />
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${exam.status === 'Published' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <span className={`text-sm font-bold ${exam.status === 'Published' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {exam.status}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
                  Enter Marks
                </button>
                <button 
                  onClick={() => togglePublish(exam.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    exam.status === 'Draft' 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20' 
                      : 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50'
                  }`}
                >
                  <Send size={14} />
                  {exam.status === 'Draft' ? 'Publish' : 'Unpublish'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
