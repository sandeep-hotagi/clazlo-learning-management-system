// client/src/pages/teacher/StudentFeedback.jsx
// Page for teachers to give feedback to a specific student.

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';
import { Loader2 } from 'lucide-react';

export default function TeacherStudentFeedback() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    toUser: '',
    course: '',
    rating: 0,
    participation: 0,
    attendance: 0,
    assignmentPerformance: 0,
    behaviour: 0,
    comment: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch teacher's assigned students and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          api.get('/teacher/students'),
          api.get('/teacher/courses'),
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error('Error fetching teacher data', err);
        setError('Failed to load students or courses');
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'teacher') fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.toUser || !form.course || form.rating < 1) {
      setError('Please select student, course and give an overall rating');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        toUser: form.toUser,
        course: form.course,
        rating: Number(form.rating),
        participation: Number(form.participation),
        attendance: Number(form.attendance),
        assignmentPerformance: Number(form.assignmentPerformance),
        behaviour: Number(form.behaviour),
        comment: form.comment,
      };
      await api.post('/feedback/teacher-to-student', payload);
      setSuccess('Feedback submitted successfully');
      // Reset form
      setForm({
        toUser: '',
        course: '',
        rating: 0,
        participation: 0,
        attendance: 0,
        assignmentPerformance: 0,
        behaviour: 0,
        comment: '',
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 409) {
        setError('You have already submitted feedback for this student/course within 24h');
      } else {
        setError('Failed to submit feedback');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <Loader2 className="animate-spin mr-2" /> Loading data...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Give Student Feedback</h1>

      {error && <div className="p-3 bg-rose-100 text-rose-800 rounded">{error}</div>}
      {success && <div className="p-3 bg-emerald-100 text-emerald-800 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Student</label>
          <select
            name="toUser"
            value={form.toUser}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2"
            required
          >
            <option value="">Select a student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
        </div>

        {/* Course selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Course / Subject</label>
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2"
            required
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Overall rating */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Overall Rating</label>
          <StarRating
            rating={form.rating}
            readOnly={false}
            onChange={(val) => handleRatingChange('rating', val)}
          />
        </div>

        {/* Detailed ratings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Participation</label>
            <StarRating
              rating={form.participation}
              readOnly={false}
              onChange={(val) => handleRatingChange('participation', val)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Attendance</label>
            <StarRating
              rating={form.attendance}
              readOnly={false}
              onChange={(val) => handleRatingChange('attendance', val)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assignment Performance</label>
            <StarRating
              rating={form.assignmentPerformance}
              readOnly={false}
              onChange={(val) => handleRatingChange('assignmentPerformance', val)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Behaviour</label>
            <StarRating
              rating={form.behaviour}
              readOnly={false}
              onChange={(val) => handleRatingChange('behaviour', val)}
            />
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Comment (optional)</label>
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            rows={4}
            maxLength={1000}
            className="mt-1 block w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
