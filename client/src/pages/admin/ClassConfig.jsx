import { useState, useEffect } from 'react';
import { Plus, Users, GripVertical, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function ClassConfig() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTeacher, setDraggedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Class Form Fields
  const [className, setClassName] = useState('10th Grade');
  const [section, setSection] = useState('A');
  const [teacherId, setTeacherId] = useState('');
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchData = async () => {
    setLoading(true);
    try {
      const clsRes = await axios.get(`${API_URL}/admin/classes`);
      setClasses(clsRes.data);

      const tRes = await axios.get(`${API_URL}/admin/teachers`);
      setTeachers(tRes.data);
    } catch (err) {
      console.error('Failed to load class configuration data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDragStart = (e, teacher) => {
    setDraggedTeacher(teacher);
    e.dataTransfer.setData('text/plain', teacher._id);
  };

  const handleDrop = async (e, classObj) => {
    e.preventDefault();
    if (!draggedTeacher) return;

    try {
      // Assign the dragged teacher to this class
      await axios.put(`${API_URL}/admin/classes/${classObj._id}`, {
        name: classObj.name,
        section: classObj.section,
        teacherId: draggedTeacher._id,
        students: classObj.students.map(s => s._id || s),
      });
      fetchData();
    } catch (err) {
      console.error('Failed to assign teacher:', err);
    } finally {
      setDraggedTeacher(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_URL}/admin/classes`, {
        name: className,
        section,
        teacherId,
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create class');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Class & Section Config</h1>
          <p className="text-slate-500 text-sm mt-1">Create classes, divide sections, and drag-and-drop teachers.</p>
        </div>
        <button 
          onClick={() => {
            setClassName('10th Grade');
            setSection('A');
            setTeacherId(teachers[0]?._id || '');
            setError('');
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} /> Create New Class
        </button>
      </div>

      {loading ? (
        <div className="p-12 flex items-center justify-center text-slate-500">
          <Loader2 className="animate-spin mr-2" /> Loading Configs...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Available Teachers for Dragging */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users size={18} className="text-indigo-500" /> Available Teachers
            </h2>
            <p className="text-xs text-slate-500 mb-4">Drag a teacher and drop them onto a class card to assign them.</p>
            <div className="space-y-3">
              {teachers.map(teacher => (
                <div 
                  key={teacher._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, teacher)}
                  className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <GripVertical size={16} className="text-slate-400" />
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                    {teacher.name.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{teacher.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Classes Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.map((cls) => {
              const hasTeacher = !!cls.teacherId;
              const teacherName = cls.teacherId?.name || 'No Teacher Assigned';
              return (
                <div 
                  key={cls._id}
                  onDrop={(e) => handleDrop(e, cls)}
                  onDragOver={handleDragOver}
                  className={`bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border-2 transition-all ${!hasTeacher ? 'border-dashed border-rose-300 dark:border-rose-800/50 bg-rose-50/30 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-800'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        {cls.name} <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg text-sm">Sec {cls.section}</span>
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                        <Users size={14} /> {cls.students?.length || 0} Students Enrolled
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">Class Teacher</p>
                    {hasTeacher ? (
                      <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-3 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                            {teacherName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-850 dark:text-white text-sm">{teacherName}</span>
                            <p className="text-[10px] text-slate-400">Class In-charge</p>
                          </div>
                        </div>
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 border border-dashed border-rose-300 text-rose-700 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/10">
                        <AlertCircle size={14} /> Missing Teacher assignment. Drag one here.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateClass} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Class</h2>

            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Class Name / Grade</label>
                <input 
                  type="text" 
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. 10th Grade"
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Section</label>
                <input 
                  type="text" 
                  required
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="e.g. A"
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Initial Teacher Assignment</label>
                <select 
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- Assign Teacher --</option>
                  {teachers.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Create Class
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
