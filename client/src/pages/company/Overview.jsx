import { useState } from 'react';
import { School, Users, DollarSign, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

export default function PlatformOverview() {
  const stats = [
    { label: 'Total Schools', value: '1,284', icon: School, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Students', value: '145.2K', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Monthly Revenue', value: '$105K', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Growth Rate', value: '42%', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Platform Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening with Clazlo today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} dark:bg-slate-800 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recent Onboardings</h3>
          <div className="space-y-4">
            {[
              { name: 'St. Xavier Global', location: 'Delhi, India', date: '2 hours ago' },
              { name: 'Greenwood Academy', location: 'London, UK', date: '5 hours ago' },
              { name: 'Oakridge International', location: 'New York, USA', date: 'Yesterday' },
            ].map((school, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <School size={20} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{school.name}</p>
                    <p className="text-xs text-slate-500">{school.location}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{school.date}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center justify-center gap-2">
            View all schools <ArrowRight size={16} />
          </button>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">System Status</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">API Gateway</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-md">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Database Cluster</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-md">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Analytics Engine</span>
              </div>
              <span className="text-xs font-bold text-amber-600 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-md">High Load</span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
            <div className="flex gap-3">
              <Calendar className="text-indigo-600 shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Scheduled Maintenance</p>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-1">Version 2.5 update scheduled for April 28th, 02:00 AM UTC.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
