import { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Star, Bell, GraduationCap, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';

const typeToIcon = {
  academic: GraduationCap,
  event: Star,
  admin: Clock,
  cca: Bell,
  visit: MapPin,
  holiday: Star,
  exam: GraduationCap
};

const typeToColor = {
  academic: { color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  event: { color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  admin: { color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-800/50" },
  cca: { color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
  visit: { color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
  holiday: { color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  exam: { color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" }
};

export default function AcademicCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await axios.get(`${API_URL}/auth/events`);
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to load academic events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events]);

  const filteredEvents = useMemo(() => {
    return sortedEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === selectedMonth;
    });
  }, [selectedMonth, sortedEvents]);

  const handlePrevMonth = () => setSelectedMonth(prev => (prev === 0 ? 11 : prev - 1));
  const handleNextMonth = () => setSelectedMonth(prev => (prev === 11 ? 0 : prev + 1));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 ring-1 ring-white/20">
              <CalendarIcon className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Academic <span className="text-blue-500">Calendar</span></h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Precision Scheduling for Current Academic Year</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-1.5 shadow-sm border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white dark:bg-blue-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white dark:bg-blue-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                Yearly List
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-slate-500">
            <Loader2 className="animate-spin mr-2" /> Loading Calendar Events...
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-8">
            {/* Month Selector */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <button onClick={handlePrevMonth} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all active:scale-95">
                <ChevronLeft className="h-8 w-8 text-slate-600 dark:text-slate-400" />
              </button>
              <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">{months[selectedMonth]}</h2>
                <p className="text-sm font-bold text-blue-500 uppercase tracking-[0.2em]">Academic Calendar Board</p>
              </div>
              <button onClick={handleNextMonth} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all active:scale-95">
                <ChevronRight className="h-8 w-8 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Events List */}
            <div className="grid gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, idx) => {
                  const style = typeToColor[event.type] || { color: "text-slate-600", bg: "bg-slate-50" };
                  const Icon = typeToIcon[event.type] || Star;
                  return (
                    <div key={idx} className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                      <div className="flex items-start gap-8">
                        <div className={`flex-shrink-0 w-20 h-20 rounded-2xl ${style.bg} flex flex-col items-center justify-center border border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-all shadow-inner`}>
                          <span className={`text-2xl font-black ${style.color}`}>{new Date(event.date).getDate()}</span>
                          <span className="text-[12px] uppercase font-black text-slate-400">{months[new Date(event.date).getMonth()].slice(0, 3)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`h-4 w-4 ${style.color}`} />
                            <span className={`text-xs font-bold uppercase tracking-wider ${style.color}`}>{event.type}</span>
                            {event.location && (
                              <span className="text-xs bg-slate-100 dark:bg-slate-850 text-slate-500 px-2 py-0.5 rounded-full">
                                {event.location}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {event.description || "Standard School Hours & Activities"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No events scheduled for this month.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {months.map((month, mIdx) => {
              const monthEvents = sortedEvents.filter(e => new Date(e.date).getMonth() === mIdx);
              if (monthEvents.length === 0) return null;
              return (
                <div key={month} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">{month}</h3>
                  <div className="space-y-3">
                    {monthEvents.map((e, eIdx) => {
                      const style = typeToColor[e.type] || { color: "text-slate-600", bg: "bg-slate-50" };
                      return (
                        <div key={eIdx} className="flex gap-3">
                          <span className={`text-xs font-bold w-6 h-6 rounded flex items-center justify-center ${style.bg} ${style.color} shrink-0`}>
                            {new Date(e.date).getDate()}
                          </span>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight">{e.title}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
