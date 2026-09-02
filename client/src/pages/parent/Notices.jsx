import { useState, useEffect } from 'react';
import { BellRing, CalendarDays, Megaphone, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ParentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await axios.get(`${API_URL}/parent/notices`);
        setNotices(res.data);
      } catch (err) {
        console.error('Failed to load notices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-500">School Notices</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Latest Campus Announcements</h1>
              <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">Stay informed with the most recent school notices and class announcements for your child.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-3 text-sm font-medium text-sky-700 dark:bg-slate-800 dark:text-sky-300">
              <BellRing className="h-5 w-5" />
              Important updates
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <Loader2 className="animate-spin mr-2" /> Loading Notices...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {notices.map((notice) => {
              const noticeDate = new Date(notice.createdAt).toLocaleDateString();
              const isGlobal = !notice.classId;
              return (
                <div key={notice._id} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{notice.title}</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{noticeDate}</p>
                    </div>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-slate-800 dark:text-sky-300">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 flex-1 mb-4">{notice.content}</p>
                  <div className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">
                    {isGlobal ? 'Global Announcement' : `Class: ${notice.classId?.name || 'Class Specific'}`}
                  </div>
                </div>
              );
            })}
            {notices.length === 0 && (
              <div className="lg:col-span-2 text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-850 text-slate-500">
                No active announcements found.
              </div>
            )}
          </div>
        )}

        <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-4">
            <Megaphone className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold">Notice Board Summary</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Notices are synchronized automatically from the school administrative portal. Urgent details regarding assessments and academic calendars will appear directly on this list.</p>
        </div>
      </div>
    </div>
  );
}
