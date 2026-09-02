import { useState } from 'react';
import { Calendar as CalendarIcon, Monitor, Beaker, Plus, CheckCircle2, Clock } from 'lucide-react';

const RESOURCES = [
  { id: 1, name: 'Physics Lab', type: 'Lab', capacity: 30, status: 'Available', icon: Beaker },
  { id: 2, name: 'Main Projector Room', type: 'Equipment', capacity: 50, status: 'Booked', icon: Monitor },
  { id: 3, name: 'Chemistry Lab', type: 'Lab', capacity: 25, status: 'Available', icon: Beaker },
];

export default function ResourcesAndFacilities() {
  const [resources, setResources] = useState(RESOURCES);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resource & Facility Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage classrooms, labs, and equipment availability.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20">
          <Plus size={18} /> Add Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(res => (
          <div key={res.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col hover:border-indigo-500 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <res.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{res.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{res.type} • Cap: {res.capacity}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {res.status === 'Available' ? (
                  <>
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Available</span>
                  </>
                ) : (
                  <>
                    <Clock size={18} className="text-amber-500" />
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Booked</span>
                  </>
                )}
              </div>
              
              <button className="px-4 py-2 text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl transition-colors">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mini Calendar View for Bookings */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <CalendarIcon className="text-indigo-500" /> Availability Calendar
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center font-bold text-xs uppercase tracking-wider text-slate-500 pb-2">{day}</div>
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className={`aspect-square rounded-xl border flex items-center justify-center font-semibold text-sm ${i % 4 === 0 ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800' : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:border-indigo-500 transition-colors cursor-pointer'}`}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
