import { useState } from 'react';
import { Plus, Upload, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const MOCK_SCHOOLS = [
  { id: 1, name: 'Springfield High', status: 'Approved', step: 3, date: '2026-04-20' },
  { id: 2, name: 'Riverdale Academy', status: 'Pending', step: 2, date: '2026-04-24' },
  { id: 3, name: 'Lakeside Prep', status: 'Rejected', step: 1, date: '2026-04-18' },
];

export default function SchoolOnboarding() {
  const [schools, setSchools] = useState(MOCK_SCHOOLS);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">School Onboarding Workflow</h1>
          <p className="text-slate-500 text-sm mt-1">Manage new school registrations and verification processes.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} /> Add New School
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6 animate-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Register New School</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">School Name</label>
              <input type="text" className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact Email</label>
              <input type="email" className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
          </div>
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Upload Verification Documents</label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
              <Upload size={24} className="mb-2" />
              <p className="text-sm font-semibold">Click or drag files here to upload</p>
              <p className="text-xs mt-1">PDF, DOCX up to 10MB</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors">Cancel</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">Submit Registration</button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-6">School Details</th>
                <th className="py-4 px-6 w-1/2">Onboarding Progress</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {schools.map(school => (
                <tr key={school.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900 dark:text-white">{school.name}</p>
                    <p className="text-xs text-slate-500">Registered: {school.date}</p>
                  </td>
                  <td className="py-4 px-6">
                    {/* Stepper UI */}
                    <div className="flex items-center">
                      <div className="flex flex-col items-center">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                        <span className="text-[10px] uppercase font-bold text-emerald-600 mt-1">Register</span>
                      </div>
                      <div className={`flex-1 h-1 mx-2 rounded-full ${school.step >= 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                      <div className="flex flex-col items-center">
                        {school.step >= 2 ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-slate-300" />}
                        <span className={`text-[10px] uppercase font-bold mt-1 ${school.step >= 2 ? 'text-emerald-600' : 'text-slate-400'}`}>Verify</span>
                      </div>
                      <div className={`flex-1 h-1 mx-2 rounded-full ${school.step >= 3 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                      <div className="flex flex-col items-center">
                        {school.step >= 3 ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-slate-300" />}
                        <span className={`text-[10px] uppercase font-bold mt-1 ${school.step >= 3 ? 'text-emerald-600' : 'text-slate-400'}`}>Activate</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${school.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                      ${school.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                      ${school.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : ''}
                    `}>
                      <span className={`h-2 w-2 rounded-full ${school.status === 'Approved' ? 'bg-emerald-500' : school.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                      {school.status}
                    </span>
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
