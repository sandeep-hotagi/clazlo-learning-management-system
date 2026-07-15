import { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Award, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TOP_STUDENTS = [
  { id: 1, name: 'Emma Watson', score: 98, trend: 'up' },
  { id: 2, name: 'Noah Smith', score: 95, trend: 'up' },
  { id: 3, name: 'Olivia Davis', score: 94, trend: 'down' },
  { id: 4, name: 'Liam Johnson', score: 92, trend: 'up' },
  { id: 5, name: 'Ava Wilson', score: 90, trend: 'down' },
];

export default function Reports() {
  const [classFilter, setClassFilter] = useState('All Classes');
  const [examFilter, setExamFilter] = useState('Final Exams');

  // Bar Chart Data
  const barData = {
    labels: ['Math', 'Science', 'English', 'History', 'Geography'],
    datasets: [
      {
        label: 'Subject-wise Class Average (%)',
        data: [78, 85, 82, 75, 88],
        backgroundColor: 'rgba(99, 102, 241, 0.8)', // Indigo-500
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { min: 0, max: 100 }
    }
  };

  // Doughnut Chart Data
  const doughnutData = {
    labels: ['Passed', 'Failed'],
    datasets: [
      {
        data: [85, 15],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Emerald-500
          'rgba(244, 63, 94, 0.8)'   // Rose-500
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Performance</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1 max-w-md">Analytics and insights on student performance across subjects and exams.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Filter size={16} className="text-slate-400" />
            <select 
              value={classFilter} 
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option>All Classes</option>
              <option>10th Grade</option>
              <option>9th Grade</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Filter size={16} className="text-slate-400" />
            <select 
              value={examFilter} 
              onChange={(e) => setExamFilter(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option>Final Exams</option>
              <option>Midterms</option>
              <option>Mock Tests</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Class Average Performance</h2>
          <div className="h-72 flex items-center justify-center">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Pass/Fail Ratio */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Pass / Fail Ratio</h2>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="h-48 w-48 relative">
              <Doughnut data={doughnutData} options={{ cutout: '75%' }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-emerald-500">85%</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Passed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Leaderboard */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Award className="text-amber-500" /> Top 5 Students Leaderboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {TOP_STUDENTS.map((student, idx) => (
            <div key={student.id} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-indigo-500 transition-colors">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
              <div className="flex justify-between items-start mb-4">
                <span className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-black text-slate-500 dark:text-slate-400">
                  #{idx + 1}
                </span>
                {student.trend === 'up' ? (
                  <ArrowUpRight size={18} className="text-emerald-500" />
                ) : (
                  <ArrowDownRight size={18} className="text-rose-500" />
                )}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white truncate">{student.name}</h3>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">{student.score}%</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
