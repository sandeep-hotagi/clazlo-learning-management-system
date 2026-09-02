import { useState } from 'react';
import { CreditCard, CheckCircle2, History, ArrowUpCircle } from 'lucide-react';

const PLANS = [
  { name: 'Basic', price: '₹3499/year', features: ['Up to 500 Students', 'Basic Analytics', 'Email Support'] }
];

const SUBSCRIPTIONS = [
  { id: 1, school: 'Springfield High', plan: 'Basic', expiry: '2027-01-15', status: 'Active', payment: 'Paid' },
  { id: 2, school: 'Riverdale Academy', plan: 'Basic', expiry: '2026-05-10', status: 'Expiring Soon', payment: 'Pending' },
  { id: 3, school: 'Lakeside Prep', plan: 'Basic', expiry: '2027-11-20', status: 'Active', payment: 'Paid' },
];

export default function Subscriptions() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="text-indigo-600 dark:text-indigo-400" /> Subscription Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage billing, pricing plans, and school subscriptions.</p>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 gap-6 md:max-w-md">
        {PLANS.map(plan => (
          <div key={plan.name} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border-2 border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-6">{plan.price}</p>
            <ul className="space-y-3 mb-6">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-2.5 rounded-xl font-bold transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              Edit Plan
            </button>
          </div>
        ))}
      </div>

      {/* Subscription List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active School Subscriptions</h2>
          <button className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            <History size={16} /> View Billing History
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-6">School Name</th>
                <th className="py-4 px-6">Current Plan</th>
                <th className="py-4 px-6">Expiry Date</th>
                <th className="py-4 px-6">Payment Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SUBSCRIPTIONS.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{sub.school}</td>
                  <td className="py-4 px-6 font-semibold text-indigo-600 dark:text-indigo-400">{sub.plan}</td>
                  <td className="py-4 px-6">
                    <span className={`text-sm ${sub.status === 'Expiring Soon' ? 'text-amber-500 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                      {sub.expiry}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${sub.payment === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'}`}>
                      {sub.payment}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
