import { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BarChart3, Filter, Users, Activity, TrendingDown } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
);

export default function DeepAnalytics() {
  const [schoolFilter, setSchoolFilter] = useState('All Schools');
  
  const featureUsageData = {
    labels: ['Attendance Tracker', 'Exam Grading', 'Homework Assignment', 'Resources Hub', 'Messaging'],
    datasets: [
      {
        label: 'Weekly Usage Interactions',
        data: [15400, 8200, 12000, 4500, 9800],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 6
      }
    ]
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="text-indigo-600 dark:text-indigo-400" /> Deep Analytics Review
          </h1>
          <p className="text-slate-500 text-sm mt-1">Granular insights into feature adoption, drop-offs, and user states.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <Filter size={16} className="text-slate-400" />
          <select 
            value={schoolFilter} 
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option>All Schools</option>
            <option>Springfield High</option>
            <option>Riverdale Academy</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center">
          <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
            <Users size={28} />
          </div>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white">82%</h3>
          <p className="text-slate-500 font-semibold mt-1">Active User Rate</p>
          <p className="text-xs text-emerald-500 font-bold mt-2">+5% from last month</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center">
          <div className="h-16 w-16 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
            <TrendingDown size={28} />
          </div>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white">12.4%</h3>
          <p className="text-slate-500 font-semibold mt-1">Onboarding Drop-off</p>
          <p className="text-xs text-rose-500 font-bold mt-2">Needs investigation</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center">
          <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
            <Activity size={28} />
          </div>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white">3.2M</h3>
          <p className="text-slate-500 font-semibold mt-1">API Requests / Day</p>
          <p className="text-xs text-indigo-500 font-bold mt-2">Stable server load</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Feature Usage Distribution</h2>
        <div className="h-80 w-full">
          <Bar data={featureUsageData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

    </div>
  );
}
