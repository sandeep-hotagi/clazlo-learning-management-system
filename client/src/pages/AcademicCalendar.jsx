import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Star, Bell, GraduationCap, MapPin } from 'lucide-react';

const calendarEvents = [
  { date: "2027-06-01", event: "School reopens & Goddess Saraswati Pooja", type: "academic", icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
  { date: "2027-06-06", event: "World Environment Day & Welcoming New Students", type: "event", icon: Star, color: "text-emerald-500", bg: "bg-emerald-50" },
  { date: "2027-06-08", event: "Selection of House Master & Formation of Various Committees", type: "admin", icon: Clock, color: "text-slate-500", bg: "bg-slate-50" },
  { date: "2027-06-15", event: "School Parliament Election & Selection of School Captains", type: "admin", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  { date: "2027-06-19", event: "Inauguration of Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-06-26", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-07-03", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-07-07", event: "First Parents Visit (Primary)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-07-10", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-07-14", event: "First Parents Visit (HS)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-07-17", event: "Co-Curricular Activities", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-07-24", dateEnd: "2027-07-27", event: "FA 1 Examination", type: "exam", icon: GraduationCap, color: "text-red-500", bg: "bg-red-50" },
  { date: "2027-07-31", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-08-04", event: "Second Parents Visit (Primary)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-08-07", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-08-11", event: "Second Parents Visit (HS)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-08-14", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-08-15", event: "Independence Day Celebration", type: "holiday", icon: Star, color: "text-orange-500", bg: "bg-orange-50" },
  { date: "2027-08-21", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-08-28", dateEnd: "2027-08-31", event: "FA 2 Examination", type: "exam", icon: GraduationCap, color: "text-red-500", bg: "bg-red-50" },
  { date: "2027-09-01", event: "Third Parents Visit (Primary)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-09-04", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-09-05", event: "Teachers Day Celebration", type: "event", icon: Star, color: "text-emerald-500", bg: "bg-emerald-50" },
  { date: "2027-09-08", event: "Third Parents Visit (HS)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-09-11", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-09-18", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-09-28", dateEnd: "2027-10-05", event: "SA 1 Examination", type: "exam", icon: GraduationCap, color: "text-red-500", bg: "bg-red-50" },
  { date: "2027-10-02", event: "Gandhi Jayanti Celebration", type: "holiday", icon: Star, color: "text-orange-500", bg: "bg-orange-50" },
  { date: "2027-11-01", event: "Kannada Rajyotsava", type: "holiday", icon: Star, color: "text-orange-500", bg: "bg-orange-50" },
  { date: "2027-11-03", event: "Parents Visit (Primary) & Results of SA1 (Primary)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-11-06", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-11-10", event: "Parents Visit (HS) & Results of SA1 (HS)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-11-13", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-11-14", event: "Children’s Day Celebration", type: "event", icon: Star, color: "text-emerald-500", bg: "bg-emerald-50" },
  { date: "2027-11-20", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-11-22", event: "Annual Sports Meet (Primary)", type: "event", icon: Star, color: "text-sky-500", bg: "bg-sky-50" },
  { date: "2027-11-23", event: "Annual Sports Meet (HS)", type: "event", icon: Star, color: "text-sky-500", bg: "bg-sky-50" },
  { date: "2027-11-27", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-12-01", event: "Fifth Parents Visit (Primary)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-12-04", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-12-08", event: "Fifth Parents Visit (HS)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-12-11", dateEnd: "2027-12-14", event: "FA 3 Examination", type: "exam", icon: GraduationCap, color: "text-red-500", bg: "bg-red-50" },
  { date: "2027-12-16", event: "Series Exams for 10th Class Start", type: "exam", icon: GraduationCap, color: "text-red-500", bg: "bg-red-50" },
  { date: "2027-12-18", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-01-01", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-01-05", event: "Sixth Parents Visit (Primary)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-01-08", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-01-12", event: "Sixth Parents Visit (HS)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-01-22", event: "Co-Curricular Activities (CCA)", type: "cca", icon: Bell, color: "text-violet-500", bg: "bg-violet-50" },
  { date: "2027-01-26", event: "Republic Day Celebration", type: "holiday", icon: Star, color: "text-orange-500", bg: "bg-orange-50" },
  { date: "2027-01-29", dateEnd: "2027-02-01", event: "FA 4 Examination", type: "exam", icon: GraduationCap, color: "text-red-500", bg: "bg-red-50" },
  { date: "2027-02-02", event: "Seventh Parents Visit (Primary)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-02-09", event: "Seventh Parents Visit (HS)", type: "visit", icon: MapPin, color: "text-rose-500", bg: "bg-rose-50" },
  { date: "2027-02-10", event: "Series Exams for 6th–9th Start", type: "exam", icon: GraduationCap, color: "text-red-500", bg: "bg-red-50" },
  { date: "2027-02-28", event: "National Science Day Celebration", type: "event", icon: Star, color: "text-emerald-500", bg: "bg-emerald-50" },
  { date: "2027-03-14", event: "Sem-II / Annual Exam for 6th to 9th (March 2nd Week)", type: "exam", icon: GraduationCap, color: "text-red-500", bg: "bg-red-50" },
];

export default function AcademicCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(5); // Start with June
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const sortedEvents = useMemo(() => {
    return [...calendarEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);

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
              <p className="text-slate-500 dark:text-slate-400 font-medium">Precision Scheduling for 2027 Academic Year</p>
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

        {viewMode === 'list' ? (
          <div className="space-y-8">
            {/* Month Selector */}
            <div className="flex items-center justify-between glass-card p-6 rounded-3xl">
              <button onClick={handlePrevMonth} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all active:scale-95">
                <ChevronLeft className="h-8 w-8 text-slate-600 dark:text-slate-400" />
              </button>
              <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">{months[selectedMonth]}</h2>
                <p className="text-sm font-bold text-blue-500 uppercase tracking-[0.2em]">Academic Year 2027</p>
              </div>
              <button onClick={handleNextMonth} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all active:scale-95">
                <ChevronRight className="h-8 w-8 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Events List */}
            <div className="grid gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, idx) => (
                  <div key={idx} className="group relative glass-card p-8 rounded-3xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                    <div className="flex items-start gap-8">
                      <div className={`flex-shrink-0 w-20 h-20 rounded-2xl ${event.bg} dark:bg-white/5 flex flex-col items-center justify-center border border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-all shadow-inner`}>
                        <span className={`text-2xl font-black ${event.color}`}>{new Date(event.date).getDate()}</span>
                        <span className="text-[12px] uppercase font-black text-slate-400">{months[new Date(event.date).getMonth()].slice(0, 3)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <event.icon className={`h-4 w-4 ${event.color}`} />
                          <span className={`text-xs font-bold uppercase tracking-wider ${event.color}`}>{event.type}</span>
                          {event.dateEnd && (
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                              Range: {new Date(event.date).getDate()} - {new Date(event.dateEnd).getDate()}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {event.event}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Standard School Hours
                        </p>
                      </div>
                    </div>
                  </div>
                ))
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
                    {monthEvents.map((e, eIdx) => (
                      <div key={eIdx} className="flex gap-3">
                        <span className={`text-xs font-bold w-6 h-6 rounded flex items-center justify-center ${e.bg} ${e.color} shrink-0`}>
                          {new Date(e.date).getDate()}
                        </span>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight">{e.event}</p>
                      </div>
                    ))}
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
