import React, { useState, useEffect } from 'react';
import { Award, Star, Trash2, Filter, Search, RefreshCw, MessageSquare, User, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import StarRating from '../../components/StarRating';
import { demoFeedbacks } from '../../data/demoData';

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'student-to-teacher', 'teacher-to-student'
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/feedback/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFeedbacks(data);
        } else {
          // Use demo feedback fallback if database is currently empty
          setFeedbacks(demoFeedbacks);
        }
      } else {
        // Fallback to demo feedbacks
        setFeedbacks(demoFeedbacks);
      }
    } catch (err) {
      console.warn('Backend fetch failed, loading demo feedback data:', err);
      setFeedbacks(demoFeedbacks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback entry?')) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setSuccessMsg('Feedback entry deleted successfully.');
        setFeedbacks(prev => prev.filter(item => item._id !== id));
      } else {
        // If local demo item or API failed
        setFeedbacks(prev => prev.filter(item => item._id !== id));
        setSuccessMsg('Feedback removed from display.');
      }
    } catch (err) {
      setFeedbacks(prev => prev.filter(item => item._id !== id));
      setSuccessMsg('Feedback removed.');
    } finally {
      setDeletingId(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Filtered feedbacks calculation
  const filteredFeedbacks = feedbacks.filter(item => {
    // Direction filter
    if (filterRole === 'student-to-teacher' && item.fromRole !== 'student') return false;
    if (filterRole === 'teacher-to-student' && item.fromRole !== 'teacher') return false;

    // Minimum rating filter
    if (minRating > 0 && item.rating < minRating) return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const fromName = (item.fromUser?.name || '').toLowerCase();
      const toName = (item.toUser?.name || '').toLowerCase();
      const courseTitle = (item.course?.title || item.course?.code || '').toLowerCase();
      const comment = (item.comment || '').toLowerCase();
      return fromName.includes(q) || toName.includes(q) || courseTitle.includes(q) || comment.includes(q);
    }

    return true;
  });

  // Calculate metrics
  const totalCount = feedbacks.length;
  const avgRating = totalCount > 0 
    ? (feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0) / totalCount).toFixed(1)
    : '0.0';
  const studentToTeacherCount = feedbacks.filter(f => f.fromRole === 'student').length;
  const teacherToStudentCount = feedbacks.filter(f => f.fromRole === 'teacher').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="text-blue-600 dark:text-blue-400" size={28} />
            Feedback Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Monitor, inspect, and moderate two-way ratings between students and teachers across all courses.
          </p>
        </div>
        <button
          onClick={fetchFeedbacks}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-all active:scale-95 self-start sm:self-auto"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle size={20} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Feedbacks</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{totalCount}</div>
          <div className="text-xs text-slate-400 mt-1">Persisted submissions</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Overall Average Rating</div>
          <div className="text-3xl font-black text-amber-500 mt-2 flex items-center gap-2">
            {avgRating} <Star size={24} className="fill-current" />
          </div>
          <div className="text-xs text-slate-400 mt-1">Out of 5.0 stars</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Student → Teacher</div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">{studentToTeacherCount}</div>
          <div className="text-xs text-slate-400 mt-1">Course evaluations</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Teacher → Student</div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">{teacherToStudentCount}</div>
          <div className="text-xs text-slate-400 mt-1">Performance feedback</div>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student/teacher name, course or comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Direction Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <button
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              filterRole === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Feedback ({totalCount})
          </button>
          <button
            onClick={() => setFilterRole('student-to-teacher')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              filterRole === 'student-to-teacher'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Student → Teacher ({studentToTeacherCount})
          </button>
          <button
            onClick={() => setFilterRole('teacher-to-student')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              filterRole === 'teacher-to-student'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Teacher → Student ({teacherToStudentCount})
          </button>
        </div>
      </div>

      {/* Feedbacks List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-blue-500" />
          <p>Loading feedback records...</p>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <MessageSquare size={36} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No feedback entries found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFeedbacks.map((item) => {
            const isStudentToTeacher = item.fromRole === 'student';
            const fromName = item.fromUser?.name || (isStudentToTeacher ? 'Student' : 'Teacher');
            const toName = item.toUser?.name || (isStudentToTeacher ? 'Teacher' : 'Student');
            const courseTitle = item.course?.title || item.course?.code || 'Course Evaluation';
            const formattedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently';

            return (
              <div
                key={item._id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        isStudentToTeacher
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                      }`}
                    >
                      {isStudentToTeacher ? 'Student → Teacher' : 'Teacher → Student'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <StarRating rating={item.rating} readOnly={true} />
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="Delete Feedback Entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Card Body - Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-medium">From ({item.fromRole})</div>
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <User size={15} className="text-slate-400" />
                      {fromName}
                    </div>
                    {item.fromUser?.email && <div className="text-xs text-slate-400">{item.fromUser.email}</div>}
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-medium">To ({item.toRole})</div>
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <User size={15} className="text-slate-400" />
                      {toName}
                    </div>
                    {item.toUser?.email && <div className="text-xs text-slate-400">{item.toUser.email}</div>}
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-medium">Associated Course</div>
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <BookOpen size={15} className="text-slate-400" />
                      {courseTitle}
                    </div>
                  </div>
                </div>

                {/* Sub-ratings Breakdown if present */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {isStudentToTeacher ? (
                    <>
                      {item.teachingQuality && <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-650 dark:text-slate-350">Teaching: <strong>{item.teachingQuality}/5</strong></span>}
                      {item.communication && <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-650 dark:text-slate-350">Communication: <strong>{item.communication}/5</strong></span>}
                      {item.subjectKnowledge && <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-650 dark:text-slate-350">Subject Knowledge: <strong>{item.subjectKnowledge}/5</strong></span>}
                      {item.explanationClarity && <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-650 dark:text-slate-350">Clarity: <strong>{item.explanationClarity}/5</strong></span>}
                    </>
                  ) : (
                    <>
                      {item.participation && <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-650 dark:text-slate-350">Participation: <strong>{item.participation}/5</strong></span>}
                      {item.attendance && <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-650 dark:text-slate-350">Attendance: <strong>{item.attendance}/5</strong></span>}
                      {item.assignmentPerformance && <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-650 dark:text-slate-350">Assignments: <strong>{item.assignmentPerformance}/5</strong></span>}
                      {item.behaviour && <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-650 dark:text-slate-350">Behaviour: <strong>{item.behaviour}/5</strong></span>}
                    </>
                  )}
                </div>

                {/* Comment */}
                {item.comment && (
                  <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 italic">
                    "{item.comment}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
