import { BellRing, CalendarDays, Megaphone } from 'lucide-react';

const notices = [
  {
    id: 1,
    title: 'School Holiday - Ugadi',
    date: 'April 23, 2026',
    description: 'School remains holiday due to Ugadi celebrations. All classes are suspended for the day.',
  },
  {
    id: 2,
    title: 'School Holiday - Diwali',
    date: 'November 4, 2026',
    description: 'School remains holiday due to Diwali festival. Enjoy the break and study safely.',
  },
  {
    id: 3,
    title: 'Staff Meeting Reminder',
    date: 'April 20, 2026',
    description: 'All teachers are requested to attend the staff meeting at 3:30 PM in the main hall.',
  },
];

export default function ParentNotices() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-500">School Notices</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Latest Campus Announcements</h1>
              <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">Stay informed with the most recent school notices and holiday updates.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-3 text-sm font-medium text-sky-700 dark:bg-slate-800 dark:text-sky-300">
              <BellRing className="h-5 w-5" />
              Important updates
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {notices.map((notice) => (
            <div key={notice.id} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{notice.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{notice.date}</p>
                </div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-slate-800 dark:text-sky-300">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300">{notice.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-4">
            <Megaphone className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold">Notice Board Summary</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Recent notices include upcoming holidays, staff reminders, and critical school announcements. Share these updates with students and parents promptly.</p>
        </div>
      </div>
    </div>
  );
}
