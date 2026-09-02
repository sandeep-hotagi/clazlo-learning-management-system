import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-rose-500/10 border-4 border-white dark:border-slate-800">
        <ShieldAlert size={48} />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Access Denied</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
        Oops! It looks like you don't have the necessary permissions to view this page. If you believe this is an error, please contact your administrator.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(-1)}
          className="dashboard-button-outline flex items-center justify-center gap-2 px-8"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          className="dashboard-button-primary px-8"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
