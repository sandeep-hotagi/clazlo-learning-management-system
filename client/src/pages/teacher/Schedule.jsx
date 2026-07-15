import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const SCHEDULE = [
  {
    id: 1,
    time: '09:00 AM - 10:00 AM',
    classRoom: 'Class A',
    subject: ' Chemistry',
    type: 'Theory',
    room: 'Room 101'
  },
  {
    id: 2,
    time: '11:00 AM - 12:00 PM',
    classRoom: 'Class B',
    subject: ' Physics',
    type: 'Lab Session',
    room: 'Physics Lab'
  },
  {
    id: 3,
    time: '01:00 PM - 02:00 PM',
    classRoom: 'Class C',
    subject: ' Biology',
    type: 'Theory',
    room: 'Room 104'
  },
  {
    id: 4,
    time: '03:00 PM - 04:00 PM',
    classRoom: 'Class d',
    subject: ' Maths',
    type: 'Theory',
    room: 'Room 104'
  }
];

export default function TeacherSchedule() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Timetable & Schedule Access</h1>
              <p className="text-indigo-600 dark:text-indigo-400 text-sm font-bold tracking-wider mt-1">{currentDate}</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-3 max-w-xl text-sm">
            Here is your teaching schedule for today. Please be on time for all assigned classes.
          </p>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
        <div className="space-y-6">
          {SCHEDULE.map((session, index) => (
            <div key={session.id} className="relative flex gap-6">

              {/* Timeline Line */}
              {index !== SCHEDULE.length - 1 && (
                <div className="absolute top-10 left-[27px] bottom-[-24px] w-[2px] bg-indigo-100 dark:bg-indigo-900/30"></div>
              )}

              {/* Time Badge */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 relative z-10">
                  <Clock size={20} className="mb-0.5" />
                </div>
              </div>

              {/* Session Card */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-1 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 uppercase tracking-wider">
                        {session.time}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${session.type === 'Theory'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                        }`}>
                        {session.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{session.subject}</h3>
                  </div>

                  <div className="flex flex-row sm:flex-col gap-4 sm:gap-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <Users size={16} className="text-indigo-500" />
                      <span className="font-semibold">{session.classRoom}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <MapPin size={16} className="text-rose-500" />
                      <span className="font-medium">{session.room}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
