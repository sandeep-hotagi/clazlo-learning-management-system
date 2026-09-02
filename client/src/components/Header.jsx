import { useAuth } from '../context/AuthContext';
import NotificationBar from './NotificationBar';
import { User, Moon, Sun, ChevronDown, LogOut, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoImage from '../assets/logo.png';
import SearchModal from './SearchModal';

export default function Header() {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', String(!darkMode));
  };

  return (
    <header className="flex items-center justify-between bg-white dark:bg-slate-900 px-6 py-4 shadow-sm sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <img src={LogoImage} alt="Clazlo Logo" className="h-8 w-8 object-contain" />
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">
          Clazlo <span className="text-blue-600 font-medium text-lg ml-1">Dashboard</span>
        </h1>
      </div>

      {/* Global Search Button */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={() => setShowSearchModal(true)}
          className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-850 px-4 py-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/65 text-slate-400 hover:border-slate-350 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 dark:text-slate-500">
            <Search size={18} />
            <span>Search academy...</span>
          </div>
          <span className="text-[10px] font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-400 uppercase tracking-widest shadow-sm">Ctrl+K</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Mobile Search Button */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
        >
          <Search size={20} />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />

        {/* Notifications */}
        <NotificationBar />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User size={20} />
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
