import { useState, useEffect } from 'react';
import { Users, BarChart3, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ParentFamily() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await axios.get(`${API_URL}/parent/profile`);
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load parent family profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Family Profile</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Parent & Student Overview</h1>
              <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">Review parent contact details, child details, and performance notes in one place.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-300">
              <Users className="h-5 w-5 text-sky-500" />
              Family details
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-850">
            <Loader2 className="animate-spin mr-2" /> Loading Family Details...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Parent Details Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-4">
                <Users className="h-5 w-5 text-sky-500" />
                <h2 className="text-lg font-semibold">Parent Details</h2>
              </div>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Parent Name</p>
                  <p className="mt-1 text-lg font-semibold">{profile?.name || user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Relationship</p>
                  <p className="mt-1 text-lg font-semibold">Parent / Guardian</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Contact</p>
                  <p className="mt-1 text-lg font-semibold">{profile?.phone || user?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Students/Children Card */}
            <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-6">
                <Users className="h-5 w-5 text-sky-500" />
                <h2 className="text-lg font-semibold">Enrolled Children ({profile?.studentIds?.length || 0})</h2>
              </div>
              <div className="space-y-4">
                {profile?.studentIds && profile.studentIds.map(child => (
                  <div key={child._id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{child.name}</p>
                      <p className="text-xs text-slate-500">Student Code: {child.studentCode || 'N/A'}</p>
                      <p className="text-xs text-slate-500">Class: {child.grade}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-lg text-xs font-bold">
                      <BarChart3 size={14} /> Active Student
                    </div>
                  </div>
                ))}
                {(!profile?.studentIds || profile.studentIds.length === 0) && (
                  <p className="text-sm text-slate-500 text-center py-6">No children associated with this account.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
