import { useState } from 'react';
import { ShieldAlert, Search, Filter, Download, User } from 'lucide-react';

const MOCK_LOGS = [
  { id: 'LOG-1092', action: 'Admin updated plan for Springfield High to Pro', user: 'SuperAdmin1', ip: '192.168.1.10', timestamp: '2026-04-25 09:12:45' },
  { id: 'LOG-1091', action: 'School added: Lakeside Prep', user: 'SysAdmin2', ip: '10.0.0.5', timestamp: '2026-04-24 14:30:00' },
  { id: 'LOG-1090', action: 'Failed login attempt (3x)', user: 'Unknown', ip: '142.250.190.46', timestamp: '2026-04-24 11:22:10' },
  { id: 'LOG-1089', action: 'API key regenerated', user: 'SuperAdmin1', ip: '192.168.1.10', timestamp: '2026-04-23 16:05:00' },
];

export default function AuditCompliance() {
  const [logs, setLogs] = useState(MOCK_LOGS);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="text-indigo-600 dark:text-indigo-400" /> Audit & Compliance
          </h1>
          <p className="text-slate-500 text-sm mt-1">Immutable activity logs for enterprise-level security monitoring.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-semibold transition-colors border border-slate-200 dark:border-slate-700 shadow-sm">
          <Download size={18} /> Export Logs
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Action ID, IP, or User..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:border-slate-700 w-full sm:w-auto justify-center">
            <Filter size={16} /> Filter by Action
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Action / Event</th>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors group">
                  <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                    <span className="block text-xs mb-1">{log.id}</span>
                    {log.timestamp}
                  </td>
                  <td className="py-4 px-6 text-slate-900 dark:text-slate-200 font-semibold max-w-sm truncate">
                    {log.action}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <User size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      {log.user}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                    {log.ip}
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
