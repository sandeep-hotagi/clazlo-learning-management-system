import { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle2, CheckSquare } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'System', title: 'Database Backup Completed', message: 'The nightly database backup finished successfully at 03:00 AM.', date: '2 mins ago', read: false },
  { id: 2, type: 'Subscription', title: 'Subscription Expiring', message: 'Riverdale Academy subscription expires in 5 days.', date: '1 hour ago', read: false },
  { id: 3, type: 'Error', title: 'Payment Gateway Failure', message: 'Stripe API returned a 500 error during a checkout session.', date: 'Yesterday', read: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="text-indigo-600 dark:text-indigo-400" /> Platform Notifications
          </h1>
          <p className="text-slate-500 text-sm mt-1">System alerts, errors, and subscription updates.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-semibold transition-colors"
        >
          <CheckSquare size={18} /> Mark all as read
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.map(n => (
          <div key={n.id} className={`p-6 transition-colors ${!n.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
            <div className="flex gap-4">
              <div className={`shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center
                ${n.type === 'Error' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' : 
                  n.type === 'Subscription' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 
                  'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30'}`
              }>
                {n.type === 'Error' ? <AlertTriangle size={24} /> : n.type === 'Subscription' ? <Info size={24} /> : <CheckCircle2 size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold text-lg ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                    {n.title} {!n.read && <span className="inline-block h-2 w-2 bg-indigo-500 rounded-full ml-2 align-middle"></span>}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">{n.date}</span>
                </div>
                <p className={`mt-1 text-sm ${!n.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}`}>{n.message}</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">{n.type}</span>
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors">
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
