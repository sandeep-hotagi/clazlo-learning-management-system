import { useState } from 'react';
import { Award, Save, Search, Download, TrendingUp } from 'lucide-react';

const DUMMY_STUDENTS = [
  { id: 1, name: 'Sandeep', rollNo: '101' },
  { id: 2, name: 'Darshan', rollNo: '102' },
  { id: 3, name: 'Santosh', rollNo: '103' },
  { id: 4, name: 'Rakesh', rollNo: '104' },
  { id: 5, name: 'Vishal', rollNo: '105' },
  { id: 6, name: 'Kiran', rollNo: '106' },
  { id: 7, name: 'Basavraj', rollNo: '107' },
  { id: 8, name: 'Nitin', rollNo: '108' },
  { id: 9, name: 'Shivu', rollNo: '109' },
  { id: 10, name: 'Sangu', rollNo: '110' },
];

export default function TeacherExams() {
  const [scores, setScores] = useState(
    DUMMY_STUDENTS.reduce((acc, student) => {
      // Initialize with random scores between 60 and 95 for realism, or empty string
      acc[student.id] = Math.floor(Math.random() * (95 - 60 + 1) + 60);
      return acc;
    }, {})
  );

  const handleScoreChange = (studentId, value) => {
    const numericValue = value === '' ? '' : Number(value);
    if (numericValue === '' || (numericValue >= 0 && numericValue <= 100)) {
      setScores(prev => ({
        ...prev,
        [studentId]: numericValue
      }));
    }
  };

  const handleSave = () => {
    alert('Science subject scores saved successfully!');
  };

  const calculateAverage = () => {
    const validScores = Object.values(scores).filter(s => s !== '');
    if (validScores.length === 0) return 0;
    const sum = validScores.reduce((a, b) => a + b, 0);
    return (sum / validScores.length).toFixed(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Exams & Grading Workflow</h1>
              <p className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-wider mt-1">Science Subject</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-3 max-w-xl text-sm">
            Enter the final term scores for the Science subject. Marks should be out of 100.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <TrendingUp size={18} className="text-emerald-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Class Average</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{calculateAverage()} / 100</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="flex w-full sm:w-auto items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5"
          >
            <Save size={18} />
            Save Marks
          </button>
        </div>
      </div>

      {/* Grading Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 text-slate-900 dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hidden sm:flex">
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-6 w-24">Roll No.</th>
                <th className="py-4 px-6">Student Information</th>
                <th className="py-4 px-6 text-center w-64">Science Score (Out of 100)</th>
                <th className="py-4 px-6 text-center w-48">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DUMMY_STUDENTS.map(student => {
                const score = scores[student.id];
                let grade = '-';
                let gradeColor = 'text-slate-500';
                
                if (score !== '') {
                  if (score >= 90) { grade = 'A+'; gradeColor = 'text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full'; }
                  else if (score >= 80) { grade = 'A'; gradeColor = 'text-blue-500 font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full'; }
                  else if (score >= 70) { grade = 'B'; gradeColor = 'text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full'; }
                  else if (score >= 60) { grade = 'C'; gradeColor = 'text-amber-500 font-bold bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full'; }
                  else if (score >= 50) { grade = 'D'; gradeColor = 'text-orange-500 font-bold bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full'; }
                  else { grade = 'F'; gradeColor = 'text-rose-500 font-bold bg-rose-50 dark:bg-rose-900/30 px-3 py-1 rounded-full'; }
                }

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono text-sm">
                      #{student.rollNo}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold shadow-sm">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-slate-900 dark:text-white font-bold block">{student.name}</span>
                          <span className="text-slate-500 dark:text-slate-400 text-xs">Science Student</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={score}
                          onChange={(e) => handleScoreChange(student.id, e.target.value)}
                          className="w-24 px-3 py-2 text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="--"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block min-w-[40px] text-center ${gradeColor}`}>
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
