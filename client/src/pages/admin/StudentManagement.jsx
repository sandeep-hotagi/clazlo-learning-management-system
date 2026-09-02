import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, X, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentManagement() {
  const { socket } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState('10th');
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchData = async () => {
    setLoading(true);
    try {
      const stdRes = await axios.get(`${API_URL}/admin/students`);
      setStudents(stdRes.data);

      const clRes = await axios.get(`${API_URL}/admin/classes`);
      setClasses(clRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleUpdate = () => {
        fetchData();
      };
      socket.on("studentRegistered", handleUpdate);
      socket.on("studentLoggedIn", handleUpdate);
      socket.on("studentProfileUpdated", handleUpdate);
      socket.on("statusChanged", handleUpdate);
      
      return () => {
        socket.off("studentRegistered", handleUpdate);
        socket.off("studentLoggedIn", handleUpdate);
        socket.off("studentProfileUpdated", handleUpdate);
        socket.off("statusChanged", handleUpdate);
      };
    }
  }, [socket]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setName('');
    setStudentCode('');
    setPassword('');
    setGrade('10th');
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (student) => {
    setIsEditing(true);
    setSelectedId(student._id);
    setName(student.name);
    setStudentCode(student.studentCode || '');
    setPassword('');
    setGrade(student.grade || '10th');
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/admin/students/${selectedId}`, {
          name,
          grade,
        });
      } else {
        await axios.post(`${API_URL}/admin/students`, {
          name,
          studentCode,
          password: password || '123456',
          grade,
        });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`${API_URL}/admin/students/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.studentCode && s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 relative">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Student Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage school student list, grades, and details.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-slate-500">
            <Loader2 className="animate-spin mr-2" /> Loading Students...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Grade / Code</th>
                  <th className="py-4 px-6">Parent</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map(student => {
                  const classMatch = classes.find(c => c.students.some(s => s._id === student._id));
                  return (
                    <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {student.name}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-400">
                        {student.grade} ({student.studentCode || 'N/A'})
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-400">
                        {student.parentId?.name || 'No Parent Linked'}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${student.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-800'}`}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedStudent(student)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleOpenEdit(student)}
                            className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(student._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h3>
                  <p className="text-slate-500 text-sm">Class: {selectedStudent.grade}</p>
                  <p className="text-slate-500 text-sm">Code: {selectedStudent.studentCode || 'N/A'}</p>
                </div>
              </div>


            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Student' : 'Add New Student'}
            </h2>
            
            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>

              {!isEditing && (
                <>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Student Code</label>
                    <input 
                      type="text" 
                      required
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Grade / Class</label>
                <select 
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="7th">7th Class</option>
                  <option value="8th">8th Class</option>
                  <option value="9th">9th Class</option>
                  <option value="10th">10th Class</option>
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
                {isEditing ? 'Save Changes' : 'Save Student'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
