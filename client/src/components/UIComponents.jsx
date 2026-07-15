import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'dashboard-button-primary',
    secondary: 'dashboard-button-secondary',
    outline: 'dashboard-button-outline',
  };
  
  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card = ({ children, title, subtitle, className = '', headerAction }) => {
  return (
    <div className={`dashboard-card ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h3 className="text-xl font-black text-slate-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
};

export const Badge = ({ children, variant = 'indigo', className = '' }) => {
  const variants = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>}
      <input 
        className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${error ? 'border-rose-500 focus:ring-rose-500/20' : 'focus:border-indigo-500'}`}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-rose-500 ml-1">{error}</p>}
    </div>
  );
};
