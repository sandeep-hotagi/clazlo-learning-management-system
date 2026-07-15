import { Users, BarChart3, AlertTriangle } from 'lucide-react';

export default function ParentFamily() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Family Profile</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Parent & Student Overview</h1>
              <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">Review parent contact details, student performance, and behaviour notes in one place.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-300">
              <Users className="h-5 w-5 text-sky-500" />
              Family details
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-4">
              <Users className="h-5 w-5 text-sky-500" />
              <h2 className="text-lg font-semibold">Parent Details</h2>
            </div>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Parent Name</p>
                <p className="mt-1 text-lg font-semibold">xyzzz</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Relationship</p>
                <p className="mt-1 text-lg font-semibold">Mother</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Contact</p>
                <p className="mt-1 text-lg font-semibold">+91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-4">
              <BarChart3 className="h-5 w-5 text-sky-500" />
              <h2 className="text-lg font-semibold">Student Performance</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-100 dark:bg-slate-950 p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Overall progress</p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">88%</p>
              </div>
              <div className="rounded-3xl bg-slate-100 dark:bg-slate-950 p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Term average</p>
                <p className="mt-2 text-3xl font-bold text-sky-600 dark:text-sky-400">91%</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold">Behaviour Notes</h2>
            </div>
            <div className="rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700 p-4 text-slate-700 dark:text-slate-200">
              <p className="text-sm font-medium">Misbihaving issues</p>
              <p className="mt-2 text-sm leading-6">The student has shown occasional inattentiveness during class and needs reminders to respect classroom norms.</p>
            </div>
            <div className="rounded-3xl bg-slate-100 dark:bg-slate-950 p-4 text-slate-700 dark:text-slate-300">
              <p className="text-sm font-medium">Action Plan</p>
              <p className="mt-2 text-sm leading-6">Monitor class behaviour closely and schedule a parent-teacher discussion next week.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
