import { CreditCard, CheckCircle2, Clock, Info } from 'lucide-react';

export default function ParentPayments() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white shadow-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-700 p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Subscription & Payments Process</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Review the total subscription charge, amount paid, and remaining balance.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-100 text-sky-700 px-4 py-2 dark:bg-sky-900/30 dark:text-sky-300">
              <CreditCard size={20} />
              Payment Summary
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Total Amount</p>
              <p className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">₹3,499</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Paid Amount</p>
              <p className="mt-4 text-4xl font-bold text-blue-600 dark:text-blue-400">₹2,000</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Balance</p>
              <p className="mt-4 text-4xl font-bold text-rose-600 dark:text-rose-400">₹1,500</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 mb-4">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <span className="font-medium">All dues are fully paid.</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Next Instalment</p>
                <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">No upcoming payment</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Payment Method</p>
                <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Saved Card</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <div className="flex items-center gap-2 text-sm">
                <Info size={16} />
                All records are up to date and your fee account balance is cleared.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
