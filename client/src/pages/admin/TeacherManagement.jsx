import { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, User, Star } from 'lucide-react';

const MOCK_TEACHERS = [
  { id: 1, name: 'Alice Johnson', subject: 'Mathematics', experience: '5 Years', performance: 92, photo: 'A' },
  { id: 2, name: 'Michael Smith', subject: 'Physics', experience: '8 Years', performance: 88, photo: 'M' },
  { id: 3, name: 'Sarah Williams', subject: 'Chemistry', experience: '3 Years', performance: 95, photo: 'S' },
  { id: 4, name: 'David Brown', subject: 'Biology', experience: '10 Years', performance: 90, photo: 'D' },
];

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Teacher Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage school teaching staff, performance, and details.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} /> Add Teacher
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search teachers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-slate-900 dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:border-slate-700">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-6">Profile</th>
                <th className="py-4 px-6">Subject / Tags</th>
                <th className="py-4 px-6">Experience</th>
                <th className="py-4 px-6">Performance (Avg)</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {teachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map(teacher => (
                <tr key={teacher.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                        {teacher.photo}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{teacher.name}</p>
                        <p className="text-xs text-slate-500">ID: TCH-{teacher.id}00</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {teacher.subject}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                    {teacher.experience}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{teacher.performance}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Add New Teacher</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <input type="text" className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                <input type="text" className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors">Cancel</button>
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">Save Teacher</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
