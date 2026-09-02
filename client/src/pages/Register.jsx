import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, MessageSquare } from 'lucide-react';
import LogoImage from '../assets/logo.png';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [grade, setGrade] = useState('10th'); // default class
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  
  // OTP States
  const [userOtp, setUserOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpSentMsg, setOtpSentMsg] = useState('');
  
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleSendOtp = async () => {
    setError('');
    setOtpSentMsg('');
    if (!email) {
      setError('Please enter a valid email address first.');
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/auth/send-otp`, { email });
      setOtpSentMsg('OTP code sent successfully to your email.');
      if (res.data && res.data.otp) {
        console.log("Dev OTP Code:", res.data.otp);
        alert(`[Development Mode] OTP Code sent: ${res.data.otp}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setOtpSentMsg('');
    if (!email || !userOtp) {
      setError('Please enter both your email and the 6-digit OTP code.');
      return;
    }
    try {
      await axios.post(`${API_URL}/auth/verify-otp`, { email, otp: userOtp });
      setIsOtpVerified(true);
      setOtpSentMsg('Email verified successfully! You can now submit registration.');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!isOtpVerified) {
      setError('Please verify your email address via OTP first.');
      return;
    }

    try {
      const userData = {
        name,
        email,
        role,
        password,
        grade,
        phone,
        gender,
        dob,
        address,
      };

      if (role === "teacher") userData.teacherId = identifier;
      if (role === "student") userData.studentCode = identifier;

      await register(userData);

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  const roleStyles = {
    student: 'bg-blue-500 shadow-blue-500/50',
    teacher: 'bg-purple-500 shadow-purple-500/50',
    parent:  'bg-emerald-500 shadow-emerald-500/50',
    admin: 'bg-indigo-500 shadow-indigo-500/50',
    'company-admin': 'bg-pink-500 shadow-pink-500/50'
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black relative">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-pulse"></div>
      
      <div className="w-full max-w-lg z-10 py-8">
        <div 
          className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 p-6 sm:p-10 shadow-2xl rounded-3xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="text-center mb-6">
              <div className="bg-white rounded-full shadow-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-white">
                <img src={LogoImage} alt="Clazlo Logo" className="w-full h-full object-contain p-1" />
              </div>
              <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Create Account</h2>
              <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em]">Join the Clazlo Ecosystem</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2.5 rounded-xl mb-4 text-xs text-center font-bold animate-pulse">
              {error}
            </div>
          )}

          {otpSentMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-2.5 rounded-xl mb-4 text-xs text-center font-bold flex items-center justify-center gap-2">
              <MessageSquare size={14} /> {otpSentMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Roles Bar */}
            <div className="space-y-1">
              <div className="grid grid-cols-4 gap-1.5 bg-black/20 p-1 rounded-xl">
                {[
                  { id: 'student', label: 'Student' },
                  { id: 'teacher', label: 'Teacher' },
                  { id: 'admin', label: 'School Admin' },
                  { id: 'company-admin', label: 'Company Admin' }
                ].map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      setError('');
                    }}
                    className={`text-center py-2 text-[9px] rounded-lg transition-all duration-300 font-bold capitalize truncate px-0.5 ${
                      role === r.id 
                        ? 'text-white bg-white/20 ring-1 ring-white/30 shadow-md font-extrabold' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-250'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alice Cooper"
                  className="w-full mt-1 bg-black/30 text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-white/45 text-sm transition-all placeholder-gray-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full mt-1 bg-black/30 text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-white/45 text-sm transition-all cursor-pointer"
                >
                  <option value="Male" className="text-black">Male</option>
                  <option value="Female" className="text-black">Female</option>
                  <option value="Other" className="text-black">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Date of Birth</label>
                <input 
                  type="date" 
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full mt-1 bg-black/30 text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-white/45 text-sm transition-all cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Mobile Number</label>
                <input 
                  type="tel" 
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full mt-1 bg-black/30 text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-white/45 text-sm transition-all placeholder-gray-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Residential Address</label>
                <input 
                  type="text" 
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, State"
                  className="w-full mt-1 bg-black/30 text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-white/45 text-sm transition-all placeholder-gray-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@gmail.com"
                  className="w-full mt-1 bg-black/30 text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-white/45 text-sm transition-all placeholder-gray-500"
                />
              </div>

              {/* OTP Verifier Row */}
              <div className="sm:col-span-2 bg-white/5 p-3 rounded-xl border border-white/5 space-y-2">
                <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Email OTP Verification</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    maxLength={6}
                    value={userOtp}
                    onChange={(e) => setUserOtp(e.target.value)}
                    disabled={isOtpVerified}
                    placeholder="Enter 6-digit OTP"
                    className="flex-1 bg-black/35 text-white border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-white/40 text-xs text-center font-bold tracking-widest placeholder-gray-550 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isOtpVerified}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    Send OTP
                  </button>
                  {!isOtpVerified ? (
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Verify
                    </button>
                  ) : (
                    <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black flex items-center justify-center gap-1">
                      Verified ✅
                    </span>
                  )}
                </div>
              </div>

              {/* Role specific inputs */}
              {(role === 'student' || role === 'teacher') && (
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">
                    {role === 'teacher' ? 'Teacher ID' : 'Student Code'}
                  </label>
                  <input 
                    type="text" 
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={`Enter your verified official ${role === 'teacher' ? 'Teacher ID' : 'Student Code'}`}
                    className="w-full mt-1 bg-black/30 text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-white/45 text-sm transition-all placeholder-gray-500"
                  />
                </div>
              )}

              {role === 'student' && (
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Class / Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full mt-1 bg-black/30 text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-white/45 text-sm transition-all cursor-pointer"
                  >
                    <option value="7th" className="text-black">7th Class</option>
                    <option value="8th" className="text-black">8th Class</option>
                    <option value="9th" className="text-black">9th Class</option>
                    <option value="10th" className="text-black">10th Class</option>
                  </select>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a Secure Password"
                  className="w-full mt-1 bg-black/30 text-white border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-white/45 text-sm transition-all placeholder-gray-500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`w-full mt-6 flex items-center justify-center space-x-2 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all transform ${roleStyles[role]} hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.02] active:scale-95`}
            >
              <span>Register</span>
              <UserPlus size={18} className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
            </button>
            
            <div className="text-center mt-4">
               <Link to="/login" className="text-gray-400 hover:text-white text-xs transition-colors cursor-pointer">Already have an account? Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
