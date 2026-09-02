import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn, BookOpen, GraduationCap } from 'lucide-react';
import LogoImage from '../assets/logo.png';

export default function Login() {
  const location = useLocation();
  const [role, setRole] = useState(location.state?.role || 'student');
  const [adminType, setAdminType] = useState(location.state?.adminType || 'school');
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [grade, setGrade] = useState('10th');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Sync role if location state changes
  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role === 'admin' ? 'admin' : location.state.role);
    }
    if (location.state?.adminType) {
      setAdminType(location.state.adminType);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const finalRole = role === 'admin' 
        ? (adminType === 'company' ? 'company-admin' : 'admin')
        : role;
        
      const creds = { role: finalRole, password };
      if (role === 'student') {
        creds.grade = grade;
        creds.studentCode = identifier;
      }
      if (role === 'teacher') {
        creds.teacherId = identifier;
      }
      if (role === 'admin') {
        creds.phone = identifier;
      }

      console.log('Login Attempt:', creds);
      const user = await login(creds);
      console.log('Login Response:', user);

      if (user.role === 'teacher') navigate('/teacher');
      else if (user.role === 'student') navigate('/student');
      else if (user.role === 'company-admin') navigate('/company');
      else if (user.role === 'admin') navigate('/admin');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Login failed'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_25%)]"></div>
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-8 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6 sm:p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">

            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 sm:space-y-12 py-8 sm:py-12">
              <div className="bg-white rounded-full p-0 shadow-2xl shadow-blue-500/40 transform hover:scale-110 transition-transform duration-500 overflow-hidden w-32 h-32 sm:w-48 sm:h-48 flex items-center justify-center border-4 border-white">
                <img src={LogoImage} alt="Clazlo Logo" className="w-full h-full object-contain p-4" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">
                  Clazlo<span className="text-blue-500">Hub</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 sm:p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Login</p>
              <h2 className="mt-3 text-3xl font-bold text-white">Sign in to your dashboard</h2>
              <p className="mt-2 text-slate-400">Choose your role and enter your credentials to continue.</p>
            </div>

            {error && (
              <div className="mb-6 rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Profile role</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {['student', 'teacher', 'admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${role === r
                          ? 'border-transparent bg-slate-100/10 text-white shadow-lg shadow-slate-950/20'
                          : 'border-slate-700/80 text-slate-400 hover:border-slate-500 hover:text-white'
                        }`}
                    >
                      {r === 'admin' ? 'Admins' : r}
                    </button>
                  ))}
                </div>
                {role === 'admin' && (
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin Type</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {['school', 'company'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAdminType(type)}
                          className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${adminType === type
                              ? 'border-transparent bg-slate-100/10 text-white shadow-lg shadow-slate-950/20'
                              : 'border-slate-700/80 text-slate-400 hover:border-slate-500 hover:text-white'
                            }`}
                        >
                          {type === 'school' ? 'School Admin' : 'Company Admin'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-4">
                  <label className="block text-xs uppercase tracking-[0.3em] text-slate-500">{role === 'teacher' ? 'Teacher ID' : role === 'student' ? 'Student Code' : role === 'admin' ? 'Admin Code' : 'Admin Code'}</label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={`Enter your ${role === 'student' ? 'student code' : role === 'teacher' ? 'teacher ID' : role === 'admin' ? 'admin code' : 'admin code'}`}
                    className="mt-3 w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/30"
                  />
                </div>
                {role === 'student' && (
                  <div className="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-4">
                    <label className="block text-xs uppercase tracking-[0.3em] text-slate-500">Class</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="mt-3 w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/30"
                    >
                      <option value="7th" className="bg-slate-950 text-white">7th Class</option>
                      <option value="8th" className="bg-slate-950 text-white">8th Class</option>
                      <option value="9th" className="bg-slate-950 text-white">9th Class</option>
                      <option value="10th" className="bg-slate-950 text-white">10th Class</option>
                    </select>
                  </div>
                )}
                <div className="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-4">
                  <label className="block text-xs uppercase tracking-[0.3em] text-slate-500">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-3 w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <span>Authenticate</span>
                <LogIn size={18} />
              </button>

              <p className="text-sm text-slate-400 text-center">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-white hover:text-sky-300">
                  Register Here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
