import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const statusStyles = {
  achieved: { label: 'Present', bg: 'bg-emerald-500', border: 'border-emerald-400' },
  missed: { label: 'Absent', bg: 'bg-rose-500', border: 'border-rose-400' },
  paused: { label: 'Late', bg: 'bg-amber-500', border: 'border-amber-400' },
  holiday: { label: 'Holiday', bg: 'bg-indigo-500', border: 'border-indigo-400' },
};

function buildMonthAttendance(year, month, apiData = []) {
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const statusMap = {};
  apiData.forEach(item => {
    const itemDate = new Date(item.date);
    if (itemDate.getFullYear() === year && itemDate.getMonth() === month) {
      const day = itemDate.getDate();
      let localStatus = 'achieved';
      if (item.status === 'Absent') localStatus = 'missed';
      if (item.status === 'Late') localStatus = 'paused';
      statusMap[day] = localStatus;
    }
  });

  return Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1;
    // Default to Present (achieved) if no record, Sundays are missed/holiday
    const isSunday = new Date(year, month, day).getDay() === 0;
    const status = statusMap[day] || (isSunday ? 'holiday' : 'achieved');
    return { day, status };
  }).map((item, index) => ({
    ...item,
    weekDay: (firstDay + index) % 7,
  }));
}

export default function AttendanceTracker() {
  const { user } = useAuth();
  const [currentDate] = useState(new Date());
  const [view, setView] = useState('Daily');
  const [attendanceData, setAttendanceData] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Load children list if Parent
  useEffect(() => {
    const loadChildren = async () => {
      if (user?.role === 'parent') {
        try {
          const res = await axios.get(`${API_URL}/parent/children`);
          setChildren(res.data);
          if (res.data.length > 0) {
            setSelectedChildId(res.data[0]._id);
          }
        } catch (err) {
          console.error('Failed to load children:', err);
        }
      }
    };
    loadChildren();
  }, [user]);

  // Load Attendance records
  useEffect(() => {
    const loadAttendance = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/student/attendance`;
        if (user?.role === 'parent') {
          if (!selectedChildId) {
            setLoading(false);
            return;
          }
          url = `${API_URL}/parent/attendance/${selectedChildId}`;
        }
        const res = await axios.get(url);
        setAttendanceData(res.data);
      } catch (err) {
        console.warn('Failed to load live attendance, using offline defaults.', err);
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, [user, selectedChildId]);

  const monthName = useMemo(
    () => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate),
    [currentDate]
  );
  const year = currentDate.getFullYear();

  const monthAttendance = useMemo(
    () => buildMonthAttendance(year, currentDate.getMonth(), attendanceData),
    [currentDate, year, attendanceData]
  );

  const totals = useMemo(() => {
    return monthAttendance.reduce(
      (acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      },
      { achieved: 0, missed: 0, paused: 0, holiday: 0 }
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
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
        
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 rounded-2xl">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Attendance Tracking Panel</p>
              <h1 className="text-2xl font-bold text-slate-950 dark:text-white">{monthName} {year}</h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {user?.role === 'parent' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Child:</span>
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {children.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
              <Sparkles className="h-4 w-4 text-sky-500" />
              Live Sync
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="animate-spin mr-2" /> Synching Attendance...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
            <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Current Month Attendance</h2>
                <p className="text-sm text-slate-500">Visual overview of attendance status for the current month.</p>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-3">
                {weekdayLabels.map((day) => (
                  <div key={day} className="py-2 rounded-xl bg-slate-50 dark:bg-slate-800">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {gridCells.map((cell, index) => (
                  <div key={index} className="min-h-[52px] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-center">
                    {cell ? (
                      <div className={`flex h-12 w-12 flex-col items-center justify-center rounded-2xl border ${statusStyles[cell.status]?.border} ${statusStyles[cell.status]?.bg} text-white text-sm font-semibold`}>
                        <span>{cell.day}</span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Legend</h3>
                <div className="space-y-3">
                  {Object.entries(statusStyles).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className={`inline-flex h-4 w-4 rounded-full border ${value.border} ${value.bg}`} />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{value.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Summary</h3>
                <div className="space-y-3">
                  {Object.entries(totals).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-955 px-4 py-3">
                      <span className="capitalize text-sm text-slate-700 dark:text-slate-300">{statusStyles[key]?.label || key}</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{value} days</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
