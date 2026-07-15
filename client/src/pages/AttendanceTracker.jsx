import { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const statusStyles = {
  achieved: { label: 'Achieved', bg: 'bg-emerald-500', border: 'border-emerald-400' },
  missed: { label: 'Missed', bg: 'bg-slate-200', border: 'border-slate-300' },
  holiday: { label: 'Holiday', bg: 'bg-rose-500', border: 'border-rose-400' },
  paused: { label: 'Paused', bg: 'bg-violet-500', border: 'border-violet-400' },
  freeze: { label: 'Freeze', bg: 'bg-sky-500', border: 'border-sky-400' },
};

function buildMonthAttendance(year, month) {
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  return Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1;
    if (day % 15 === 0) return { day, status: 'holiday' };
    if (day % 11 === 0) return { day, status: 'freeze' };
    if (day % 9 === 0) return { day, status: 'paused' };
    if ([7, 14, 21, 28].includes(day)) return { day, status: 'missed' };
    return { day, status: 'achieved' };
  }).map((item, index) => ({
    ...item,
    weekDay: (firstDay + index) % 7,
  }));
}

export default function AttendanceTracker() {
  const [currentDate] = useState(new Date());
  const [view, setView] = useState('Daily');

  const monthName = useMemo(
    () => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate),
    [currentDate]
  );
  const year = currentDate.getFullYear();

  const monthAttendance = useMemo(
    () => buildMonthAttendance(year, currentDate.getMonth()),
    [currentDate, year]
  );

  const totals = useMemo(() => {
    return monthAttendance.reduce(
      (acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      },
      { achieved: 0, missed: 0, holiday: 0, paused: 0, freeze: 0 }
    );
  }, [monthAttendance]);

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const gridCells = useMemo(() => {
    const firstDay = new Date(year, currentDate.getMonth(), 1).getDay();
    const blanks = Array.from({ length: firstDay }, () => null);
    return [...blanks, ...monthAttendance];
  }, [currentDate, monthAttendance, year]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 px-4 py-3 shadow-sm border border-slate-200 dark:border-slate-700">
              <CalendarIcon className="h-5 w-5 text-sky-600" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Attendance Tracking</p>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{monthName} {year}</h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 px-3 py-2 shadow-sm">
              <button
                type="button"
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${view === 'Daily' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
                onClick={() => setView('Daily')}
              >
                Daily
              </button>
              <button
                type="button"
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${view === 'Weekly' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
                onClick={() => setView('Weekly')}
              >
                Weekly
              </button>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-3 py-2 shadow-sm">
              <button type="button" className="rounded-full bg-white/10 p-2 hover:bg-white/15 transition"><ChevronLeft size={16} /></button>
              <span className="text-sm font-medium">{monthName}</span>
              <button type="button" className="rounded-full bg-white/10 p-2 hover:bg-white/15 transition"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Current Month Attendance</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Visual overview of attendance status for the current month.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Sparkles className="h-4 w-4 text-sky-500" />
                Live view
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-3">
              {weekdayLabels.map((day) => (
                <div key={day} className="py-2 rounded-xl bg-slate-50 dark:bg-slate-800">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {gridCells.map((cell, index) => (
                <div key={index} className="min-h-[52px] rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-center">
                  {cell ? (
                    <div className={`flex h-12 w-12 flex-col items-center justify-center rounded-2xl border ${statusStyles[cell.status].border} ${statusStyles[cell.status].bg} text-white text-sm font-semibold`}>
                      <span>{cell.day}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Legend</h3>
              <div className="space-y-3">
                {Object.entries(statusStyles).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className={`inline-flex h-4 w-4 rounded-full border ${value.border} ${value.bg}`} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{value.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Monthly Summary</h3>
              <div className="space-y-3">
                {Object.entries(totals).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-950 px-4 py-3">
                    <span className="capitalize text-sm text-slate-700 dark:text-slate-300">{statusStyles[key]?.label || key}</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
