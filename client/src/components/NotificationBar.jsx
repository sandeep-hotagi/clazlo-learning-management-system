import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, X } from 'lucide-react';
import axios from 'axios';

export default function NotificationBar() {
  const { user, socket } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/auth/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    if (socket) {
      const handleLiveNotification = (data) => {
        if (data.userId === user.id || data.userId === user._id) {
          setNotifications(prev => [data.notification, ...prev]);
        }
      };
      socket.on("notificationReceived", handleLiveNotification);
      return () => {
        socket.off("notificationReceived", handleLiveNotification);
      };
    }
  }, [user, socket]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/auth/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
      >
        <Bell size={20} className="text-slate-500" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
            <button onClick={() => setOpen(false)}><X size={16} className="text-slate-400" /></button>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-xs text-slate-500 text-center">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id} 
                  onClick={() => !n.isRead && markAsRead(n._id)}
                  className={`p-4 border-b border-slate-55 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${!n.isRead ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{n.title}</p>
                    {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{n.description}</p>
                  <p className="text-[10px] text-slate-400 mt-2">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
