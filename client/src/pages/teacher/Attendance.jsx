import { useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Save, Search, Filter } from 'lucide-react';

const DUMMY_STUDENTS = [
  { id: 1, name: 'Sandeep', rollNo: '101' },
  { id: 2, name: 'darshan ', rollNo: '102' },
  { id: 3, name: 'santosh', rollNo: '103' },
  { id: 4, name: 'rakesh', rollNo: '104' },
  { id: 5, name: 'vishal', rollNo: '105' },
  { id: 6, name: 'kiran', rollNo: '106' },
  { id: 7, name: 'basavraj', rollNo: '107' },
  { id: 8, name: 'nitin', rollNo: '108' },
  { id: 9, name: 'shivu', rollNo: '109' },
  { id: 10, name: 'sangu', rollNo: '110' },
];

export default function TeacherAttendance() {
  const [attendance, setAttendance] = useState(
    DUMMY_STUDENTS.reduce((acc, student) => {
      acc[student.id] = 'present'; // default
      return acc;
    }, {})
  );

  const [date] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = () => {
    // Mock save action
    alert('Attendance saved successfully!');
  };

  const summary = {
    present: Object.values(attendance).filter(status => status === 'present').length,
    absent: Object.values(attendance).filter(status => status === 'absent').length,
    late: Object.values(attendance).filter(status => status === 'late').length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Daily Attendance Marking</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{date}</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-4 max-w-xl text-sm">
            Please mark the attendance for Class 10th - Section A. Ensure all records are accurate before saving.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <div className="px-4 py-2 rounded-lg text-sm font-semibold bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600">
              {DUMMY_STUDENTS.length} Students
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Save size={18} />
            Submit Records
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-5 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider">Present</p>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{summary.present}</p>
          </div>
        </div>

        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-5 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-rose-600 dark:text-rose-400 text-sm font-bold uppercase tracking-wider">Absent</p>
            <p className="text-2xl font-black text-rose-700 dark:text-rose-300">{summary.absent}</p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-5 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-amber-600 dark:text-amber-400 text-sm font-bold uppercase tracking-wider">Late</p>
            <p className="text-2xl font-black text-amber-700 dark:text-amber-300">{summary.late}</p>
          </div>
        </div>
      </div>

      {/* Student List */}
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
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-6 w-24">Roll No.</th>
                <th className="py-4 px-6">Student Information</th>
                <th className="py-4 px-6 text-center w-96">Attendance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DUMMY_STUDENTS.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono text-sm">
                    #{student.rollNo}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-slate-900 dark:text-white font-bold block">{student.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-xs">Student ID: STU{student.id}000{student.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`flex-1 flex justify-center items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${attendance[student.id] === 'present'
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                          }`}
                      >
                        <CheckCircle2 size={16} className={attendance[student.id] === 'present' ? 'text-white' : ''} />
                        <span>Present</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`flex-1 flex justify-center items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${attendance[student.id] === 'absent'
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                          }`}
                      >
                        <XCircle size={16} className={attendance[student.id] === 'absent' ? 'text-white' : ''} />
                        <span>Absent</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`flex-1 flex justify-center items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${attendance[student.id] === 'late'
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                          }`}
                      >
                        <Clock size={16} className={attendance[student.id] === 'late' ? 'text-white' : ''} />
                        <span>Late</span>
                      </button>
                    </div>
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
