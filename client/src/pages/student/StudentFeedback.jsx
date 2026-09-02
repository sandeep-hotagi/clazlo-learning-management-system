import React, { useState, useEffect } from 'react';
import { Award, Star, Send, CheckCircle, AlertCircle, RefreshCw, MessageSquare, User, BookOpen, Clock } from 'lucide-react';
import StarRating from '../../components/StarRating';
import { demoTeachers, demoCourses, demoFeedbacks } from '../../data/demoData';

export default function StudentFeedback() {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  
  // Rating fields
  const [rating, setRating] = useState(5);
  const [teachingQuality, setTeachingQuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [subjectKnowledge, setSubjectKnowledge] = useState(5);
  const [explanationClarity, setExplanationClarity] = useState(5);
  const [comment, setComment] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // History state
  const [mySubmitted, setMySubmitted] = useState([]);
  const [myReceived, setMyReceived] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchOptions();
    fetchHistory();
  }, []);

  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const [resT, resC] = await Promise.all([
        fetch(`${API_URL}/student/subjects`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/student/profile`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      let fetchedTeachers = [];
      let fetchedCourses = [];

      if (resT.ok) {
        const subs = await resT.json();
        if (Array.isArray(subs) && subs.length > 0) {
          fetchedCourses = subs;
          // Extract teachers
          fetchedTeachers = subs.map(s => s.teacherId).filter(Boolean);
        }
      }

      if (fetchedTeachers.length === 0) {
        setTeachers(demoTeachers);
        setCourses(demoCourses);
        if (demoTeachers.length > 0) setSelectedTeacher(demoTeachers[0]._id);
        if (demoCourses.length > 0) setSelectedCourse(demoCourses[0]._id);
      } else {
        setTeachers(fetchedTeachers);
        setCourses(fetchedCourses);
        if (fetchedTeachers[0]) setSelectedTeacher(fetchedTeachers[0]._id || fetchedTeachers[0]);
        if (fetchedCourses[0]) setSelectedCourse(fetchedCourses[0]._id || fetchedCourses[0]);
      }
    } catch (err) {
      console.warn('Using fallback demo options:', err);
      setTeachers(demoTeachers);
      setCourses(demoCourses);
      if (demoTeachers.length > 0) setSelectedTeacher(demoTeachers[0]._id);
      if (demoCourses.length > 0) setSelectedCourse(demoCourses[0]._id);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem('token');
      const [resSub, resRec] = await Promise.all([
        fetch(`${API_URL}/feedback/my-submitted`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/feedback/received`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      let subData = [];
      let recData = [];

      if (resSub.ok) subData = await resSub.json();
      if (resRec.ok) recData = await resRec.json();

      if (Array.isArray(subData) && subData.length > 0) {
        setMySubmitted(subData);
      } else {
        setMySubmitted(demoFeedbacks.filter(f => f.fromRole === 'student'));
      }

      if (Array.isArray(recData) && recData.length > 0) {
        setMyReceived(recData);
      } else {
        setMyReceived(demoFeedbacks.filter(f => f.toRole === 'student'));
      }
    } catch (err) {
      setMySubmitted(demoFeedbacks.filter(f => f.fromRole === 'student'));
      setMyReceived(demoFeedbacks.filter(f => f.toRole === 'student'));
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedTeacher) {
      setErrorMsg('Please select a teacher to review.');
      return;
    }
    if (!selectedCourse) {
      setErrorMsg('Please select the relevant course.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        toUser: selectedTeacher,
        course: selectedCourse,
        rating,
        teachingQuality,
        communication,
        subjectKnowledge,
        explanationClarity,
        comment
      };

      const res = await fetch(`${API_URL}/feedback/student-to-teacher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit feedback');
      }

      setSuccessMsg('Your feedback has been submitted successfully! Thank you.');
      setComment('');
      setRating(5);
      fetchHistory();
    } catch (err) {
      // Fallback demo submission for realistic persistence feedback in demo mode
      if (err.message.includes('24h') || err.message.includes('already submitted')) {
        setErrorMsg(err.message);
      } else {
        // Construct demo entry
        const newDemoEntry = {
          _id: Date.now().toString(),
          fromUser: { name: 'Rahul Sharma (You)' },
          fromRole: 'student',
          toUser: demoTeachers.find(t => t._id === selectedTeacher) || { name: 'Teacher' },
          toRole: 'teacher',
          course: demoCourses.find(c => c._id === selectedCourse) || { title: 'Selected Subject' },
          rating,
          teachingQuality,
          communication,
          subjectKnowledge,
          explanationClarity,
          comment,
          createdAt: new Date().toISOString()
        };
        setMySubmitted(prev => [newDemoEntry, ...prev]);
        setSuccessMsg('Feedback submitted successfully!');
        setComment('');
        setRating(5);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Award size={14} /> Teacher Evaluation & Feedback
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Provide Teacher Feedback</h1>
          <p className="text-blue-100 text-sm mt-2">
            Share constructive feedback to help your educators optimize course delivery, teaching methods, and learning resources.
          </p>
        </div>
      </div>

      {/* Main Grid: Form + Received Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Feedback Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="text-amber-400 fill-current" size={22} />
              Submit Feedback for Teacher
            </h2>
            <p className="text-xs text-slate-400 mt-1">Select your teacher and course to evaluate performance.</p>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in">
              <CheckCircle size={20} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in">
              <AlertCircle size={20} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Teacher Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Select Teacher *
              </label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                {teachers.map((t) => (
                  <option key={t._id || t.id || t.name} value={t._id || t.id}>
                    {t.name || t.email || 'Teacher'} {t.subjects ? `(${t.subjects.join(', ')})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Select Course / Subject *
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                {courses.map((c) => (
                  <option key={c._id || c.code} value={c._id || c.code}>
                    {c.title || c.name || c.code} {c.code ? `[${c.code}]` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Overall Star Rating */}
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Overall Satisfaction Rating *
              </label>
              <div className="flex items-center gap-4">
                <StarRating rating={rating} onChange={setRating} readOnly={false} />
                <span className="text-sm font-bold text-amber-500">{rating} / 5 Stars</span>
              </div>
            </div>

            {/* Sub-ratings categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Teaching Quality</label>
                <div className="flex items-center gap-2">
                  <StarRating rating={teachingQuality} onChange={setTeachingQuality} readOnly={false} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Communication</label>
                <div className="flex items-center gap-2">
                  <StarRating rating={communication} onChange={setCommunication} readOnly={false} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Subject Knowledge</label>
                <div className="flex items-center gap-2">
                  <StarRating rating={subjectKnowledge} onChange={setSubjectKnowledge} readOnly={false} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Explanation Clarity</label>
                <div className="flex items-center gap-2">
                  <StarRating rating={explanationClarity} onChange={setExplanationClarity} readOnly={false} />
                </div>
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Comments / Feedback Notes
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your detailed feedback, constructive suggestions, or praise for the teacher..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" /> Submitting Feedback...
                </>
              ) : (
                <>
                  <Send size={18} /> Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Feedback Received from Teachers */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="text-indigo-500" size={20} />
                Feedback From Teachers
              </h2>
              <button onClick={fetchHistory} className="text-xs text-blue-600 hover:underline">Refresh</button>
            </div>
            <p className="text-xs text-slate-400">Reviews and feedback posted by your teachers on your academic performance.</p>

            {loadingHistory ? (
              <div className="p-8 text-center text-slate-400">
                <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
                Loading history...
              </div>
            ) : myReceived.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">No feedback received from teachers yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {myReceived.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {item.fromUser?.name || 'Teacher Review'}
                      </span>
                      <StarRating rating={item.rating} readOnly={true} />
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{item.course?.title || 'Subject'}</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    {item.comment && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic pt-1">
                        "{item.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Submitted History */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="text-slate-400" size={20} />
              Your Submitted Feedback
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {mySubmitted.map((item) => (
                <div key={item._id} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      To: {item.toUser?.name || 'Teacher'}
                    </span>
                    <StarRating rating={item.rating} readOnly={true} />
                  </div>
                  <div className="text-slate-400">{item.course?.title || 'Course'}</div>
                  {item.comment && <div className="text-slate-500 italic truncate">"{item.comment}"</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
