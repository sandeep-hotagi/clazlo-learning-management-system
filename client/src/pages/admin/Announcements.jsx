import { useState } from 'react';
import { Bell, Plus, AlertTriangle, Info, Calendar } from 'lucide-react';

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: 'School Closed for Winter Break', message: 'The school will remain closed from Dec 20 to Jan 5. Have a safe holiday!', date: '2026-12-15', priority: 'Normal' },
  { id: 2, title: 'Urgent: Water Supply Issue', message: 'Due to a maintenance issue, water supply will be cut off in the science block today.', date: '2026-04-25', priority: 'Urgent' },
];

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">School Announcements</h1>
          <p className="text-slate-500 text-sm mt-1">Broadcast important information to teachers, students, and parents.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20">
          <Plus size={18} /> New Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {announcements.map(ann => (
          <div key={ann.id} className={`p-6 rounded-3xl shadow-sm border ${ann.priority === 'Urgent' ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-900/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${ann.priority === 'Urgent' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
                {ann.priority === 'Urgent' ? <AlertTriangle size={24} /> : <Info size={24} />}
              </div>
              <div>
                <h3 className={`text-lg font-bold ${ann.priority === 'Urgent' ? 'text-rose-900 dark:text-rose-300' : 'text-slate-900 dark:text-white'}`}>
                  {ann.title}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ann.priority === 'Urgent' ? 'bg-rose-200 text-rose-800 dark:bg-rose-800 dark:text-rose-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'} uppercase tracking-wider`}>
                    {ann.priority} Priority
                  </span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Calendar size={12} /> {ann.date}
                  </span>
                </div>
              </div>
            </div>
            <p className={`text-sm leading-relaxed ${ann.priority === 'Urgent' ? 'text-rose-800 dark:text-rose-200/80' : 'text-slate-600 dark:text-slate-300'}`}>
              {ann.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
