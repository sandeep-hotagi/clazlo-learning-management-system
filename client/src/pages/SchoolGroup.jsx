import { Users, Bell, Calendar } from 'lucide-react';

export default function SchoolGroup() {
  const notifications = [
    {
      id: 1,
      title: "Parent-Teacher Meeting",
      message: "Parents meeting will be held on 13/08/2027. All parents are requested to attend.",
      date: "13/08/2027",
      type: "important"
    },
    {
      id: 2,
      title: "Annual Sports Day Registration",
      message: "Registrations for the Annual Sports Day are now open. Please submit your names to the class teacher.",
      date: "25/08/2027",
      type: "normal"
    },
    {
      id: 3,
      title: "Science Fair Project Deadline",
      message: "The final date for submitting your science fair projects is coming up. Make sure to finalize your models.",
      date: "05/09/2027",
      type: "normal"
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-indigo-600 dark:text-indigo-400" /> School Group Notifications
          </h1>
          <p className="text-slate-500 text-sm mt-1">Important announcements, meetings, and updates for the entire school.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {notifications.map((note) => (
          <div key={note.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex gap-4 transition-transform hover:-translate-y-1">
            <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${note.type === 'important' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
              <Bell size={24} />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{note.title}</h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full w-fit">
                  <Calendar size={12} /> {note.date}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {note.message}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
