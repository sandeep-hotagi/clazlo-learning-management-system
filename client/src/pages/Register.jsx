import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import LogoImage from '../assets/logo.png';

export default function Register() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [grade, setGrade] = useState('10th'); // default class
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userData = { name, role, password, grade };
      if (role === 'teacher') userData.teacherId = identifier;
      if (role === 'student') userData.studentCode = identifier;
      if (role === 'parent') userData.phone = identifier;
      
      const user = await register(userData);
      
      if (user.role === 'teacher') navigate('/teacher');
      else if (user.role === 'student') navigate('/student');
      else if (user.role === 'parent') navigate('/parent');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const roleStyles = {
    student: 'bg-blue-500 shadow-blue-500/50',
    teacher: 'bg-purple-500 shadow-purple-500/50',
    parent:  'bg-emerald-500 shadow-emerald-500/50'
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black relative">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-pulse"></div>
      
      <div className="w-full max-w-md z-10">
        <div 
          className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 p-6 sm:p-12 shadow-2xl rounded-3xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="text-center mb-8">
              <div className="bg-white rounded-full shadow-2xl w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 flex items-center justify-center overflow-hidden transform transition-transform hover:scale-110 border-4 border-white">
                <img src={LogoImage} alt="Clazlo Logo" className="w-full h-full object-contain p-2" />
              </div>
              <h2 className="text-3xl font-black text-white mb-1 tracking-tight leading-none">Create Account</h2>
              <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em]">Join the Clazlo Ecosystem</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-3">
                {['student', 'teacher', 'parent'].map((r) => (
                  <div
                    key={r}
                    onClick={() => setRole(r)}
                    className={`cursor-pointer text-center py-2 text-xs rounded-xl border transition-all duration-300 font-semibold capitalize ${
                      role === r 
                        ? 'border-transparent text-white bg-white/20 ring-2 ring-white/50 shadow-lg' 
                        : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-black/30 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/40 transition-all placeholder-gray-500"
                />
              </div>

              <div className="relative group">
                <input 
                  type="text" 
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={`Confirm your ${role === 'teacher' ? 'Teacher ID' : role === 'student' ? 'Student Code' : 'Phone Number'}`}
                  className="w-full bg-black/30 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/40 transition-all placeholder-gray-500"
                />
              </div>

              {role === 'student' && (
                <div className="relative group">
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-black/30 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/40 transition-all cursor-pointer"
                  >
                    <option value="7th" className="text-black">7th Class</option>
                    <option value="8th" className="text-black">8th Class</option>
                    <option value="9th" className="text-black">9th Class</option>
                    <option value="10th" className="text-black">10th Class</option>
                  </select>
                </div>
              )}

              <div className="relative group">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a Secure Password"
                  className="w-full bg-black/30 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/40 transition-all placeholder-gray-500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`w-full mt-6 flex items-center justify-center space-x-2 py-4 rounded-xl text-white font-bold tracking-wide transition-all transform ${roleStyles[role]} hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.02] active:scale-95`}
            >
              <span>Register</span>
              <UserPlus size={20} className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
            </button>
            
            <div className="text-center mt-6">
               <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">Already have an account? Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
