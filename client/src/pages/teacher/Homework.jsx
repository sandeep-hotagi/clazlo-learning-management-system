import { useState } from 'react';
import { BookOpen, Plus, FileText, CheckCircle, Edit3, Trash2 } from 'lucide-react';

const INITIAL_HOMEWORK = [
  { id: 1, text: "Explain the process of photosynthesis in detail.", subject: "Biology", dueDate: "2026-04-28" },
  { id: 2, text: "State and explain Newton's Three Laws of Motion with examples.", subject: "Physics", dueDate: "2026-04-29" },
  { id: 3, text: "Solve the following quadratic equations: a) x^2 - 5x + 6 = 0 b) 2x^2 + 8x - 10 = 0", subject: "Math", dueDate: "2026-04-30" },
  { id: 4, text: "Write a 500-word essay on the main causes of World War I.", subject: "History", dueDate: "2026-05-02" },
  { id: 5, text: "Describe the different stages of the water cycle.", subject: "Geography", dueDate: "2026-05-03" }
];

const INITIAL_ASSESSMENTS = [
  { id: 1, text: "What is the powerhouse of the cell?", type: "Multiple Choice", points: 5 },
  { id: 2, text: "True or False: Water boils at 90 degrees Celsius at sea level.", type: "True/False", points: 2 },
  { id: 3, text: "What is the chemical formula for table salt?", type: "Short Answer", points: 5 },
  { id: 4, text: "Who is the author of 'Romeo and Juliet'?", type: "Short Answer", points: 5 },
  { id: 5, text: "Calculate the area of a circle with a radius of 7cm (use pi = 22/7).", type: "Problem Solving", points: 10 }
];

export default function TeacherHomework() {
  const [activeTab, setActiveTab] = useState('homework');
  const [homeworkQs, setHomeworkQs] = useState(INITIAL_HOMEWORK);
  const [assessmentQs, setAssessmentQs] = useState(INITIAL_ASSESSMENTS);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Assignments & Assessments</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-xl text-sm">
            Manage your daily homework assignments and class assessments. Create, edit, and assign tasks to your students.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5">
          <Plus size={18} />
          Create New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab('homework')}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'homework'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Homework Tasks
        </button>
        <button
          onClick={() => setActiveTab('assessment')}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'assessment'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Assessment Questions
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'homework' && (
          <div className="grid grid-cols-1 gap-4">
            {homeworkQs.map((hw) => (
              <div key={hw.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:shadow-md transition-shadow group">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{hw.subject}</span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        Due: {hw.dueDate}
                      </span>
                    </div>
                    <p className="text-slate-900 dark:text-white font-medium">{hw.text}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-center">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 rounded-lg">
                    <Edit3 size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="grid grid-cols-1 gap-4">
            {assessmentQs.map((aq) => (
              <div key={aq.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:shadow-md transition-shadow group">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{aq.type}</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {aq.points} Points
                      </span>
                    </div>
                    <p className="text-slate-900 dark:text-white font-medium">{aq.text}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-center">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 rounded-lg">
                    <Edit3 size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
