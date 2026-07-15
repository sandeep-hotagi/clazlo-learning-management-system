import { useState } from 'react';
import { Plus, Users, GripVertical, CheckCircle2 } from 'lucide-react';

const INITIAL_CLASSES = [
  { id: 1, name: '10th Grade', section: 'A', studentCount: 45, assignedTeacher: null },
  { id: 2, name: '10th Grade', section: 'B', studentCount: 42, assignedTeacher: 'Alice Johnson' },
  { id: 3, name: '9th Grade', section: 'A', studentCount: 38, assignedTeacher: 'David Brown' },
];

const TEACHERS = ['Alice Johnson', 'Michael Smith', 'Sarah Williams', 'David Brown'];

export default function ClassConfig() {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [draggedTeacher, setDraggedTeacher] = useState(null);

  const handleDragStart = (e, teacher) => {
    setDraggedTeacher(teacher);
    e.dataTransfer.setData('text/plain', teacher);
  };

  const handleDrop = (e, classId) => {
    e.preventDefault();
    if (!draggedTeacher) return;

    setClasses(classes.map(c => 
      c.id === classId ? { ...c, assignedTeacher: draggedTeacher } : c
    ));
    setDraggedTeacher(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Class & Section Config</h1>
          <p className="text-slate-500 text-sm mt-1">Create classes, divide sections, and drag-and-drop teachers.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20">
          <Plus size={18} /> Create New Class
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Available Teachers for Dragging */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Users size={18} className="text-indigo-500" /> Available Teachers
          </h2>
          <p className="text-xs text-slate-500 mb-4">Drag a teacher and drop them onto a class card to assign them.</p>
          <div className="space-y-3">
            {TEACHERS.map(teacher => (
              <div 
                key={teacher}
                draggable
                onDragStart={(e) => handleDragStart(e, teacher)}
                className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
              >
                <GripVertical size={16} className="text-slate-400" />
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                  {teacher.charAt(0)}
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{teacher}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Classes Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <div 
              key={cls.id}
              onDrop={(e) => handleDrop(e, cls.id)}
              onDragOver={handleDragOver}
              className={`bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border-2 transition-all ${!cls.assignedTeacher ? 'border-dashed border-rose-300 dark:border-rose-800/50 bg-rose-50/30 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {cls.name} <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg text-sm">Sec {cls.section}</span>
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                    <Users size={14} /> {cls.studentCount} Students Enrolled
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">Class Teacher</p>
                {cls.assignedTeacher ? (
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                        {cls.assignedTeacher.charAt(0)}
                      </div>
                      <span className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">{cls.assignedTeacher}</span>
                    </div>
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-sm font-medium">No teacher assigned</p>
                    <p className="text-xs mt-1">Drop teacher here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
