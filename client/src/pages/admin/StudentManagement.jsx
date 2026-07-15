import { useState } from 'react';
import { Search, Download, Eye, X, AlertCircle } from 'lucide-react';

const MOCK_STUDENTS = [
  { id: 1, name: 'Emma Watson', class: '10th - A', marks: 95, attendance: '98%', status: 'Excellent', weak: false },
  { id: 2, name: 'John Doe', class: '10th - B', marks: 45, attendance: '75%', status: 'Needs Improvement', weak: true },
  { id: 3, name: 'Lucas Smith', class: '9th - A', marks: 88, attendance: '92%', status: 'Good', weak: false },
  { id: 4, name: 'Sophia Davis', class: '10th - A', marks: 38, attendance: '60%', status: 'Critical', weak: true },
];

export default function StudentManagement() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 relative">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Student Management</h1>
          <p className="text-slate-500 text-sm mt-1">View student performance, attendance, and details.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-600/20">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Class</th>
                <th className="py-4 px-6">Marks (Avg)</th>
                <th className="py-4 px-6">Attendance</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_STUDENTS.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {student.name}
                        {student.weak && (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 px-2 py-0.5 rounded-full">
                            <AlertCircle size={10} /> Weak
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-400">{student.class}</td>
                  <td className="py-4 px-6">
                    <span className={`font-bold ${student.weak ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {student.marks}%
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-400">{student.attendance}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => setSelectedStudent(student)}
                      className="flex items-center justify-end gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 ml-auto"
                    >
                      <Eye size={16} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel for Student Details */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedStudent(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Profile</h2>
              <button onClick={() => setSelectedStudent(null)} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-20 w-20 rounded-2xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-2xl font-bold">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h3>
                  <p className="text-slate-500 font-medium">{selectedStudent.class}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Average Marks</p>
                  <p className={`text-2xl font-black ${selectedStudent.weak ? 'text-rose-600' : 'text-emerald-600'}`}>{selectedStudent.marks}%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Attendance</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedStudent.attendance}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Academic Status</h4>
                <div className={`p-4 rounded-2xl border ${selectedStudent.weak ? 'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/50 text-rose-700 dark:text-rose-400' : 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400'}`}>
                  <p className="font-semibold">{selectedStudent.status}</p>
                  <p className="text-sm mt-1 opacity-80">
                    {selectedStudent.weak 
                      ? 'This student requires additional attention and tutoring. Parents should be notified.' 
                      : 'This student is performing well above the average class requirements.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
