import { useState } from 'react';
import { Shield, Key, Users, History, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Security() {
  const [toggles, setToggles] = useState({
    twoFactor: true,
    emailAlerts: false,
    sessionTimeout: true
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="text-indigo-600 dark:text-indigo-400" /> Security & Admin Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage platform security, passwords, and user roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Security Preferences */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
            <Shield size={20} className="text-indigo-500" /> Global Security Preferences
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500 mt-0.5">Require 2FA for all admin logins.</p>
              </div>
              <button onClick={() => handleToggle('twoFactor')} className={`text-4xl transition-colors ${toggles.twoFactor ? 'text-indigo-600 dark:text-indigo-500' : 'text-slate-300 dark:text-slate-700'}`}>
                {toggles.twoFactor ? <ToggleRight strokeWidth={1.5} /> : <ToggleLeft strokeWidth={1.5} />}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Email Security Alerts</p>
                <p className="text-xs text-slate-500 mt-0.5">Notify super admin on new logins.</p>
              </div>
              <button onClick={() => handleToggle('emailAlerts')} className={`text-4xl transition-colors ${toggles.emailAlerts ? 'text-indigo-600 dark:text-indigo-500' : 'text-slate-300 dark:text-slate-700'}`}>
                {toggles.emailAlerts ? <ToggleRight strokeWidth={1.5} /> : <ToggleLeft strokeWidth={1.5} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Session Timeout</p>
                <p className="text-xs text-slate-500 mt-0.5">Auto-logout after 30 minutes of inactivity.</p>
              </div>
              <button onClick={() => handleToggle('sessionTimeout')} className={`text-4xl transition-colors ${toggles.sessionTimeout ? 'text-indigo-600 dark:text-indigo-500' : 'text-slate-300 dark:text-slate-700'}`}>
                {toggles.sessionTimeout ? <ToggleRight strokeWidth={1.5} /> : <ToggleLeft strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>

        {/* Password Management */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
            <Key size={20} className="text-indigo-500" /> Change Password
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-600/20 mt-2">
              Update Password
            </button>
          </div>
        </div>

        {/* Role Management */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
            <Users size={20} className="text-indigo-500" /> Role Management
          </h2>
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Admin Access</p>
                <p className="text-xs text-slate-500">Full system control</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-xs font-bold uppercase">Active</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Teacher Access</p>
                <p className="text-xs text-slate-500">Limited to class management</p>
              </div>
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">Configure</button>
            </div>
          </div>
        </div>

        {/* Login History */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
            <History size={20} className="text-indigo-500" /> Recent Login History
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">MacBook Pro - Chrome</p>
                <p className="text-xs text-slate-500">IP: 192.168.1.1</p>
              </div>
              <span className="text-slate-400">2 mins ago</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">iPhone 14 - Safari</p>
                <p className="text-xs text-slate-500">IP: 10.0.0.5</p>
              </div>
              <span className="text-slate-400">Yesterday</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
