import { useState, useEffect } from 'react';
import { BookOpen, Plus, FileText, Loader2, Trash2, ArrowLeft, CheckCircle, Clock, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TeacherHomework() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('homework');
  const [gradingSubmissionId, setGradingSubmissionId] = useState(null);
  const [homeworkQs, setHomeworkQs] = useState([]);
  const [assignmentQs, setAssignmentQs] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form Fields
  const [type, setType] = useState('homework'); // 'homework' or 'assignment'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [classId, setClassId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(10);
  const [allowResubmission, setAllowResubmission] = useState(true);
  const [attachments, setAttachments] = useState('');
  const [error, setError] = useState('');

  // Workflow / Review State
  const [selectedTask, setSelectedTask] = useState(null); // The Homework or Assignment task to review
  const [selectedTaskType, setSelectedTaskType] = useState('homework'); // 'homework' or 'assignment'
  const [reviewSubmissions, setReviewSubmissions] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [gradingStudent, setGradingStudent] = useState(null); // The student object currently being graded
  const [gradingMarks, setGradingMarks] = useState('');
  const [gradingRemarks, setGradingRemarks] = useState('');
  const [gradingStatus, setGradingStatus] = useState('Approved');
  const [gradingError, setGradingError] = useState('');
  const [gradingSuccess, setGradingSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const hwRes = await axios.get(`${API_URL}/homework/teacher/${user.id}`, getHeaders());
      setHomeworkQs(hwRes.data);

      const assRes = await axios.get(`${API_URL}/assignment/teacher/${user.id}`, getHeaders());
      setAssignmentQs(assRes.data);

      const clRes = await axios.get(`${API_URL}/teacher/classes`, getHeaders());
      setClasses(clRes.data);
    } catch (err) {
      console.error('Failed to load homework details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!classId) {
      setError('Please select a target class');
      return;
    }

    try {
      const selectedClass = classes.find(c => c._id === classId);
      const resolvedGrade = selectedClass ? selectedClass.name.replace("Class ", "").replace("Grade ", "") + "th" : "10th";

      const attachmentArray = attachments.trim() ? attachments.split(',').map(s => s.trim()) : [];

      const payload = type === 'homework'
        ? {
            title,
            description,
            subject,
            classId,
            dueDate,
            maxMarks: Number(maxMarks),
            allowResubmission,
            attachments: attachmentArray
          }
        : {
            title,
            description,
            subject,
            classId,
            grade: resolvedGrade,
            dueDate,
            attachments: attachmentArray
          };

      const url = type === 'homework' 
        ? `${API_URL}/homework`
        : `${API_URL}/assignment`;

      await axios.post(url, payload, getHeaders());
      setShowModal(false);
      setTitle('');
      setDescription('');
      setSubject('');
      setClassId('');
      setDueDate('');
      setAttachments('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDelete = async (id, targetType) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const url = targetType === 'homework'
        ? `${API_URL}/homework/${id}`
        : `${API_URL}/assignment/${id}`;

      await axios.delete(url, getHeaders());
      if (selectedTask && selectedTask._id === id) {
        setSelectedTask(null);
      }
      fetchData();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Fetch Submissions for Review
  const handleViewSubmissions = async (task, taskType) => {
    setSelectedTask(task);
    setSelectedTaskType(taskType);
    setReviewLoading(true);
    setReviewSubmissions([]);
    setGradingStudent(null);

    try {
      const url = taskType === 'homework'
        ? `${API_URL}/homework/${task._id}/submissions`
        : `${API_URL}/assignment/${task._id}/submissions`;
      
      const res = await axios.get(url, getHeaders());
      setReviewSubmissions(res.data);
    } catch (err) {
      console.error("Failed to load submissions for task:", err);
    } finally {
      setReviewLoading(false);
    }
  };

  // Open Grading Drawer/Modal
  const handleOpenGrading = (student, submission) => {
    setGradingStudent(student);
    setGradingSubmissionId(submission ? submission._id : null);
    setGradingMarks(submission && submission.marks !== null ? submission.marks : '');
    setGradingRemarks(submission ? (submission.feedback || submission.remarks) : '');
    setGradingStatus(submission && submission.status !== 'Submitted' ? submission.status : 'Reviewed');
    setGradingError('');
    setGradingSuccess('');
  };

  // Submit Grading Evaluated Results
  const handleSubmitGrading = async (e) => {
    e.preventDefault();
    setGradingError('');
    setGradingSuccess('');

    try {
      const url = selectedTaskType === 'homework'
        ? `${API_URL}/homework/submission/${gradingSubmissionId}/review`
        : `${API_URL}/assignment/submission/${gradingSubmissionId}/review`;

      await axios.put(url, {
        studentId: gradingStudent._id,
        marks: Number(gradingMarks),
        feedback: gradingRemarks,
        remarks: gradingRemarks, // compatibility mapping
        status: gradingStatus
      }, getHeaders());

      setGradingSuccess('Grade updated successfully!');
      
      setTimeout(async () => {
        setGradingStudent(null);
        const subRes = await axios.get(
          selectedTaskType === 'homework'
            ? `${API_URL}/homework/${selectedTask._id}/submissions`
            : `${API_URL}/assignment/${selectedTask._id}/submissions`,
          getHeaders()
        );
        setReviewSubmissions(subRes.data);
        fetchData();
      }, 1000);

    } catch (err) {
      setGradingError(err.response?.data?.message || 'Failed to update grades');
    }
  };

  // Helper to compile class students list and combine with submission data
  const getSubmissionsTable = () => {
    if (!selectedTask) return [];
    return reviewSubmissions.map(sub => ({
      student: sub.studentId || { name: 'Unknown Student', studentCode: 'N/A', rollNumber: '-' },
      submission: sub
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Assignments & Homeworks</h1>
          </div>
          <p className="text-slate-650 dark:text-slate-350 mt-2 max-w-xl text-sm">
            Manage your daily homework assignments and class assessments. Create, view submissions, and grade your classes.
          </p>
        </div>
        <button 
          onClick={() => {
            setTitle('');
            setDescription('');
            setSubject('');
            setClassId('');
            setDueDate('');
            setAttachments('');
            setError('');
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} /> Create New Task
        </button>
      </div>

      {!selectedTask ? (
        <>
          {/* Tabs */}
          <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-px">
            <button
              onClick={() => setActiveTab('homework')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'homework'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Homework Tasks ({homeworkQs.length})
            </button>
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'assessment'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Assessments & Assignments ({assignmentQs.length})
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12 text-slate-550 dark:text-slate-400">
              <Loader2 className="animate-spin mr-2" /> Loading published tasks...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeTab === 'homework' ? homeworkQs : assignmentQs).map(task => (
                <div key={task._id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md">
                        {task.subject}
                      </span>
                      <button 
                        onClick={() => handleDelete(task._id, activeTab)}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-455 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{task.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mt-1.5 leading-relaxed">{task.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider space-y-0.5">
                      <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                      {task.classId && <p>Class: {task.classId.name}</p>}
                      {task.grade && <p>Grade: {task.grade}</p>}
                    </div>
                    <button 
                      onClick={() => handleViewSubmissions(task, activeTab)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-350 transition-colors"
                    >
                      Review Submissions &rarr;
                    </button>
                  </div>
                </div>
              ))}

              {(activeTab === 'homework' ? homeworkQs : assignmentQs).length === 0 && (
                <div className="col-span-full py-16 bg-white dark:bg-slate-900 rounded-3xl text-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 font-medium">
                  No {activeTab} tasks created yet. Click 'Create New Task' to begin.
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        // Review Roster Section
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedTask(null)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-350 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review Submissions</h2>
              <p className="text-sm text-slate-500 mt-0.5">{selectedTask.title} • {selectedTask.subject}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            {reviewLoading ? (
              <div className="p-12 flex items-center justify-center text-slate-500">
                <Loader2 className="animate-spin mr-2" /> Loading student rosters...
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Roll No</th>
                    <th className="py-4 px-6">Student</th>
                    <th className="py-4 px-6">Submission Status</th>
                    <th className="py-4 px-6">File Attachment</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {getSubmissionsTable().map(({ student, submission }) => (
                    <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-450 dark:text-slate-400">#{student.rollNumber || '1'}</td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.studentCode}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          submission?.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          submission?.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' :
                          submission?.status === 'Submitted' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {submission?.status === 'Approved' && <CheckCircle size={12} />}
                          {submission?.status === 'Reviewed' && <CheckCircle size={12} />}
                          {submission?.status === 'Submitted' && <Clock size={12} />}
                          {submission?.status === 'Pending' && <AlertTriangle size={12} />}
                          {submission?.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {submission && submission.submittedFile ? (
                          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold group cursor-pointer max-w-[200px]">
                            <Eye size={14} className="shrink-0" />
                            <a href={submission.submittedFile} target="_blank" rel="noreferrer" className="underline truncate block">{submission.submittedFile}</a>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">No attachment</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => handleOpenGrading(student, submission)}
                          className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-indigo-600 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-400 hover:text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                        >
                          Evaluate Grades &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}

                  {getSubmissionsTable().length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-500">
                        No students assigned to this class cohort roster list.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Workspace Task</h2>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Task Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="homework">Homework Task</option>
                  <option value="assignment">Assessment / Assignment</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject Name</label>
                <input 
                  type="text" 
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solve Quadratic Equations"
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details..."
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Class</label>
                <select 
                  required
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Select a class...</option>
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>{c.name} - {c.section}</option>
                  ))}
                </select>
              </div>

              {type === 'homework' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Max Marks</label>
                    <input
                      type="number"
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(e.target.value)}
                      className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="allowResubmission"
                      checked={allowResubmission}
                      onChange={(e) => setAllowResubmission(e.target.checked)}
                      className="h-4 w-4 text-indigo-650 border-slate-300 rounded"
                    />
                    <label htmlFor="allowResubmission" className="text-xs font-semibold text-slate-655 dark:text-slate-400">Resubmissions</label>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Attachments (comma-separated URLs)</label>
                <input 
                  type="text" 
                  value={attachments}
                  onChange={(e) => setAttachments(e.target.value)}
                  placeholder="e.g. http://file1.pdf, http://file2.jpg"
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</label>
                <input 
                  type="date" 
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 rounded-xl text-slate-655 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grading Dialog */}
      {gradingStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmitGrading} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Evaluate Submission</h2>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-xs space-y-1">
              <p className="font-bold text-slate-755 dark:text-slate-200 text-sm">{gradingStudent.name}</p>
              <p className="text-slate-500 font-semibold uppercase tracking-wider">{gradingStudent.studentCode}</p>
            </div>

            {gradingError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-bold">
                {gradingError}
              </div>
            )}
            
            {gradingSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl font-bold">
                {gradingSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select 
                  value={gradingStatus}
                  onChange={(e) => setGradingStatus(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Approved">Approved</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Marks / Score (out of {selectedTask.maxMarks || 10})</label>
                <input 
                  type="number" 
                  required
                  min={0}
                  max={selectedTask.maxMarks || 10}
                  value={gradingMarks}
                  onChange={(e) => setGradingMarks(e.target.value)}
                  placeholder="e.g. 9"
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Feedback Remarks</label>
                <textarea 
                  rows={3}
                  value={gradingRemarks}
                  onChange={(e) => setGradingRemarks(e.target.value)}
                  placeholder="Write constructive comments here..."
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                type="button" 
                onClick={() => setGradingStudent(null)} 
                className="px-4 py-2 rounded-xl text-slate-655 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-bold shadow-md shadow-indigo-600/20"
              >
                Save Evaluation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
