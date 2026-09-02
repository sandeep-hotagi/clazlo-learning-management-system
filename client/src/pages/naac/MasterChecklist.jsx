import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckSquare, Plus, Upload, Trash2, Shield, Calendar, Award } from "lucide-react";

export default function MasterChecklist() {
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form input states
  const [critNum, setCritNum] = useState(1);
  const [desc, setDesc] = useState("");
  const [dept, setDept] = useState("IQAC");
  const [responsible, setResponsible] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const loadChecklist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`${API_URL}/naac/checklist`, config);
      setChecklist(res.data);
    } catch (err) {
      console.warn("Failed to load NAAC checklist items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChecklist();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!desc) return;
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await axios.post(`${API_URL}/naac/checklist`, {
        criterionNumber: Number(critNum),
        itemDescription: desc,
        assignedDepartment: dept,
        responsiblePerson: responsible,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        status: "Pending"
      }, config);

      setDesc("");
      setResponsible("");
      setTargetDate("");
      loadChecklist();
      alert("New checklist task created and assigned.");
    } catch (err) {
      alert("Action failed: " + err.message);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.put(`${API_URL}/naac/checklist/${id}`, { status }, config);
      loadChecklist();
    } catch (err) {
      alert("Action failed: " + err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this checklist task?")) return;
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`${API_URL}/naac/checklist/${id}`, config);
      loadChecklist();
    } catch (err) {
      alert("Action failed: " + err.message);
    }
  };

  // Dynamic computations
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter((t) => t.status === "Completed").length;
  const inProgressTasks = checklist.filter((t) => t.status === "In Progress").length;
  const overallReadiness = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Criterion-wise readiness
  const getCriterionReadiness = (num) => {
    const criterionTasks = checklist.filter((t) => t.criterionNumber === num);
    const total = criterionTasks.length;
    const completed = criterionTasks.filter((t) => t.status === "Completed").length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="text-blue-600" /> Master NAAC Checklist
        </h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Accreditation Process & Roadmap Management</p>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="text-xs font-black uppercase text-slate-400">Overall Readiness</h3>
          <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{overallReadiness}%</p>
          <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${overallReadiness}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="text-xs font-black uppercase text-slate-400">Checklist Summary</h3>
          <p className="text-sm font-bold text-slate-650 dark:text-slate-350">
            Total Tasks: <span className="font-extrabold text-slate-900 dark:text-white">{totalTasks}</span>
          </p>
          <p className="text-xs font-bold text-slate-500 flex gap-4 mt-1">
            <span className="text-emerald-500 font-black">Completed: {completedTasks}</span>
            <span className="text-blue-500 font-black">In Progress: {inProgressTasks}</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="text-xs font-black uppercase text-slate-400">Criterion-wise Status</h3>
          <div className="grid grid-cols-4 gap-1.5 text-[10px] font-black uppercase text-slate-400">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <span key={num} className="bg-slate-100 dark:bg-slate-850 p-1 rounded text-center">
                C{num}: {getCriterionReadiness(num)}%
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Task Panel */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 h-fit">
          <h3 className="font-bold text-lg">Assign Quality Task</h3>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Target Criterion</label>
              <select 
                value={critNum} 
                onChange={(e) => setCritNum(Number(e.target.value))}
                className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <option key={num} value={num}>Criterion {num}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Task Description</label>
              <input 
                type="text" 
                required 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="e.g. Upload FDP certificates roster" 
                className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Assigned Department</label>
              <select 
                value={dept} 
                onChange={(e) => setDept(e.target.value)}
                className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none cursor-pointer"
              >
                <option value="IQAC">IQAC</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Basic Sciences">Basic Sciences</option>
                <option value="Administration">Administration</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Responsible Person</label>
              <input 
                type="text" 
                required 
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="e.g. Dr. Jane Smith" 
                className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Target Date</label>
              <input 
                type="date" 
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none cursor-pointer"
              />
            </div>

            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5">
              <Plus size={14} /> Assign Task
            </button>
          </form>
        </div>

        {/* Task List Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-lg">Roadmap Tasks ({checklist.length})</h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
              {checklist.map((task) => (
                <div key={task._id} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] font-black uppercase px-2.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                        Criterion {task.criterionNumber}
                      </span>
                      <h4 className="font-bold text-sm text-slate-850 dark:text-white mt-1.5">{task.itemDescription}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={task.status} 
                        onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                        className={`text-[10px] font-bold uppercase rounded px-2.5 py-1 cursor-pointer outline-none ${
                          task.status === "Completed" ? "bg-emerald-100 text-emerald-800" :
                          task.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                          "bg-slate-100 text-slate-550"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button onClick={() => handleDeleteTask(task._id)} className="text-rose-500 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2.5 border-t border-slate-150/40 dark:border-slate-850/40 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    <div>
                      <p>Department</p>
                      <p className="text-slate-700 dark:text-slate-200 mt-0.5">{task.assignedDepartment}</p>
                    </div>
                    <div>
                      <p>Responsible</p>
                      <p className="text-slate-700 dark:text-slate-200 mt-0.5 normal-case">{task.responsiblePerson}</p>
                    </div>
                    <div>
                      <p>Target Date</p>
                      <p className="text-slate-700 dark:text-slate-200 mt-0.5">{task.targetDate ? new Date(task.targetDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p>Completed At</p>
                      <p className="text-slate-700 dark:text-slate-200 mt-0.5">{task.completionDate ? new Date(task.completionDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}

              {checklist.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-8">No checklist items created yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
