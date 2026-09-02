import { useState, useEffect } from 'react';
import { Bell, Plus, AlertTriangle, Info, Calendar, Loader2, Trash2, X } from 'lucide-react';
import axios from 'axios';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [classId, setClassId] = useState('');
  const [priority, setPriority] = useState('Normal'); // local tag
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchData = async () => {
    setLoading(true);
    try {
      const annRes = await axios.get(`${API_URL}/admin/notices`);
      setAnnouncements(annRes.data);

      const clRes = await axios.get(`${API_URL}/admin/classes`);
      setClasses(clRes.data);
    } catch (err) {
      console.error('Failed to load notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_URL}/admin/notices`, {
        title,
        content,
        classId: classId || null,
      });
      setShowModal(false);
      setTitle('');
      setContent('');
      setClassId('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create notice');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await axios.delete(`${API_URL}/admin/notices/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete notice:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">School Announcements</h1>
          <p className="text-slate-500 text-sm mt-1">Broadcast important information to teachers, students, and parents.</p>
        </div>
        <button 
          onClick={() => {
            setTitle('');
            setContent('');
            setClassId('');
            setError('');
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} /> New Announcement
        </button>
      </div>

      {loading ? (
        <div className="p-12 flex items-center justify-center text-slate-500">
          <Loader2 className="animate-spin mr-2" /> Loading Announcements...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {announcements.map(ann => {
            const dateStr = new Date(ann.createdAt).toLocaleDateString();
            const authorRole = ann.authorId?.role || 'admin';
            const isGlobal = !ann.classId;
            return (
              <div key={ann._id} className="p-6 rounded-3xl shadow-sm border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 relative group">
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(ann._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <Info size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {ann.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wider">
                        {isGlobal ? 'Global Notice' : `Class: ${ann.classId.name} (${ann.classId.section})`}
                      </span>
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Calendar size={12} /> {dateStr}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        by {ann.authorId?.name || 'System'} ({authorRole})
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {ann.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* New Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">New Announcement</h2>

            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Announcement Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Break Schedule"
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Audience (Scope)</label>
                <select 
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Global (All School Roles)</option>
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>Class: {c.name} - Section {c.section}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Content / Message</label>
                <textarea 
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter notice details..."
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
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
                Broadcast Notice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
