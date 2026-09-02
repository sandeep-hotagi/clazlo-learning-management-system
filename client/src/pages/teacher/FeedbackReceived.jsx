// client/src/pages/teacher/FeedbackReceived.jsx
// Page for teachers to view feedback received from students.

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';
import { Loader2 } from 'lucide-react';

export default function TeacherFeedbackReceived() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get('/feedback/received');
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Error loading feedback:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'teacher') fetchFeedback();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <Loader2 className="animate-spin mr-2" /> Loading feedback...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Student Feedback Received</h1>
      {feedbacks.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">No feedback has been received yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-slate-800 dark:text-white">
                  From: {fb.fromUser?.name || 'Student'} ({fb.fromUser?.email})
                </div>
                <StarRating rating={fb.rating} readOnly={true} />
              </div>
              {fb.comment && (
                <p className="text-slate-600 dark:text-slate-400 mt-1">{fb.comment}</p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {new Date(fb.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
