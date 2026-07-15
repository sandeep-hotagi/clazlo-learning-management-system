import { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Key, Mail, ToggleLeft, ToggleRight, Save } from 'lucide-react';

export default function Settings() {
  const [theme, setTheme] = useState('dark');
  const [toggles, setToggles] = useState({
    maintenance: false,
    publicSignups: true,
  });

  const handleToggle = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SettingsIcon className="text-indigo-600 dark:text-indigo-400" /> System Settings Navigation
          </h1>
          <p className="text-slate-500 text-sm mt-1">Configure global platform settings, API keys, and email servers.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20">
          <Save size={18} /> Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* General Settings */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">General Preferences</h2>
          
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Platform Name</label>
            <input type="text" defaultValue="Clazlo Education" className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Default Theme</p>
              <p className="text-xs text-slate-500 mt-0.5">Toggle default system appearance.</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              <button onClick={() => setTheme('light')} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}><Sun size={16}/> Light</button>
              <button onClick={() => setTheme('dark')} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}><Moon size={16}/> Dark</button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Maintenance Mode</p>
              <p className="text-xs text-slate-500 mt-0.5">Disable access for all non-admin users.</p>
            </div>
            <button onClick={() => handleToggle('maintenance')} className={`text-4xl transition-colors ${toggles.maintenance ? 'text-rose-500' : 'text-slate-300 dark:text-slate-700'}`}>
              {toggles.maintenance ? <ToggleRight strokeWidth={1.5} /> : <ToggleLeft strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
            <Key size={18} className="text-indigo-500" /> Developer API Keys
          </h2>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Live Secret Key</label>
            <div className="flex gap-2 mt-1">
              <input type="password" value="sk_live_dummy1234567890abcdef" readOnly className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 opacity-80" />
              <button className="px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold transition-colors text-slate-700 dark:text-slate-300">Reveal</button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Webhook URL</label>
            <input type="text" defaultValue="https://api.clazlo.com/webhooks/v1" className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm" />
          </div>
        </div>

        {/* Email Configuration */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
            <Mail size={18} className="text-indigo-500" /> Email Server Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SMTP Host</label>
              <input type="text" defaultValue="smtp.mailgun.org" className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SMTP Port</label>
              <input type="text" defaultValue="587" className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">From Address</label>
              <input type="text" defaultValue="noreply@clazlo.com" className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
