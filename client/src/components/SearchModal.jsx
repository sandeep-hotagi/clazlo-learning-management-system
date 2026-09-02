import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, BookOpen, Clipboard, User, Award, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults(null);
    }
  }, [isOpen]);

  // Debounced API call
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`${API_URL}/search?q=${query}`, config);
        setResults(res.data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  // Esc key closure
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const hasResults =
    results &&
    (results.students?.length > 0 ||
      results.teachers?.length > 0 ||
      results.classes?.length > 0 ||
      results.homework?.length > 0 ||
      results.assignments?.length > 0 ||
      results.exams?.length > 0 ||
      results.notices?.length > 0);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-md flex items-start justify-center pt-[10vh] px-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200/40 dark:border-slate-800/40">
          <Search className="text-slate-400 dark:text-slate-500" size={22} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search classes, homework, assignments, results, teachers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-850 dark:text-white outline-none placeholder-slate-400 dark:placeholder-slate-550 text-base font-medium"
          />
          {loading ? (
            <Loader2 className="animate-spin text-blue-600" size={20} />
          ) : (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {!results && !query.trim() && (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm font-medium">
              Start typing to search globally across the academy portal...
            </div>
          )}

          {query.trim() && results && !hasResults && !loading && (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm font-medium">
              No matches found for "{query}"
            </div>
          )}

          {results && hasResults && (
            <div className="space-y-6">
              {/* Notices */}
              {results.notices?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Notices & Board</h4>
                  <div className="space-y-1">
                    {results.notices.map((notice) => (
                      <button
                        key={notice._id}
                        onClick={() => handleNavigate("/academic-calendar")}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors group"
                      >
                        <Bell className="text-amber-500 shrink-0" size={16} />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">{notice.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Homework */}
              {results.homework?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Homework Tasks</h4>
                  <div className="space-y-1">
                    {results.homework.map((hw) => (
                      <button
                        key={hw._id}
                        onClick={() => handleNavigate("/student/homework")}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors group"
                      >
                        <Clipboard className="text-blue-500 shrink-0" size={16} />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                          {hw.title} <span className="text-xs font-normal text-slate-400">({hw.subject})</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments */}
              {results.assignments?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Assignments</h4>
                  <div className="space-y-1">
                    {results.assignments.map((ass) => (
                      <button
                        key={ass._id}
                        onClick={() => handleNavigate("/student/homework")}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors group"
                      >
                        <Award className="text-purple-500 shrink-0" size={16} />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                          {ass.title} <span className="text-xs font-normal text-slate-400">({ass.subject} • {ass.grade})</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Students & Users */}
              {results.students?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Student Members</h4>
                  <div className="space-y-1">
                    {results.students.map((student) => (
                      <div
                        key={student._id}
                        className="p-3 rounded-xl flex items-center gap-3"
                      >
                        <User className="text-slate-400 shrink-0" size={16} />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {student.name} <span className="text-xs font-normal text-slate-400">({student.studentCode || 'Student'} • Grade {student.grade})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teachers */}
              {results.teachers?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Instructors</h4>
                  <div className="space-y-1">
                    {results.teachers.map((t) => (
                      <div
                        key={t._id}
                        className="p-3 rounded-xl flex items-center gap-3"
                      >
                        <User className="text-indigo-500 shrink-0" size={16} />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {t.name} <span className="text-xs font-normal text-slate-400">({t.subjects?.join(", ")})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes */}
              {results.classes?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Classes & Cohorts</h4>
                  <div className="space-y-1">
                    {results.classes.map((c) => (
                      <div
                        key={c._id}
                        className="p-3 rounded-xl flex items-center gap-3"
                      >
                        <BookOpen className="text-emerald-500 shrink-0" size={16} />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {c.name} - Section {c.section}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shortcut Legend Footer */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-200/40 dark:border-slate-800/40 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Navigate with arrow keys or click results</span>
          <span className="flex items-center gap-1.5 bg-white dark:bg-slate-850 px-2.5 py-1 rounded-md border border-slate-200/50 dark:border-slate-800/50 shadow-sm shrink-0">
            <span>ESC</span>
            <span className="font-normal text-[8px]">to close</span>
          </span>
        </div>
      </div>
    </div>
  );
}
