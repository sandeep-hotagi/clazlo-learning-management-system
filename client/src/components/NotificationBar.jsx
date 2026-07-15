import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, X } from 'lucide-react';

export default function NotificationBar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    const mock = [
      { id: 1, title: 'System Update', description: 'Clazlo v2.4 is now live.', time: '2 mins ago' },
      { id: 2, title: 'New Message', description: 'You have a new message from a student.', time: '1 hour ago' },
      { id: 3, title: 'Exam Reminder', description: 'Maths exam starts in 2 days.', time: '3 hours ago' },
    ];
    setNotifications(mock);
  }, [user]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
      >
        <Bell size={20} className="text-slate-500" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
            <button onClick={() => setOpen(false)}><X size={16} className="text-slate-400" /></button>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{n.title}</p>
                <p className="text-xs text-slate-500 mt-1">{n.description}</p>
                <p className="text-[10px] text-slate-400 mt-2">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
