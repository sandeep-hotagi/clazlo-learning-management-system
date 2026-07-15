import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, Shield, Rocket, Zap, BookOpen } from 'lucide-react';
import LogoImage from '../assets/logo.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'teacher') navigate('/teacher');
      else if (user.role === 'student') navigate('/student');
      else if (user.role === 'admin' && user.adminType === 'company') navigate('/company');
      else if (user.role === 'admin') navigate('/admin');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-hidden relative font-['Inter',sans-serif]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-purple-600/10 rounded-full blur-[80px] animate-bounce duration-[10000ms]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="bg-white rounded-full p-0 shadow-2xl transform transition-transform group-hover:rotate-12 overflow-hidden w-12 h-12 flex items-center justify-center border-2 border-white">
            <img src={LogoImage} alt="Clazlo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-black tracking-tighter">Clazlo<span className="text-blue-500">Hub</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Sign In</button>
          <button 
            onClick={() => navigate('/register')}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            Register Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-black uppercase tracking-widest text-blue-400">Next-Gen Education Platform</span>
          </div>
          
          <h1 className="text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
            Manage <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Education
            </span> <br />
            with Precision.
          </h1>

          <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
            The world's most advanced academic management system. Empowering students, teachers, and admins with real-time insights and seamless workflows.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => navigate('/login')}
              className="group flex items-center justify-center gap-3 bg-white text-[#0b0f19] px-10 py-5 rounded-2xl text-lg font-black transition-all hover:bg-blue-500 hover:text-white hover:-translate-y-1 active:translate-y-0 shadow-2xl shadow-white/5"
            >
              Get Started 
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>


        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
          <div className="relative bg-slate-900/50 border border-white/10 p-4 rounded-[40px] shadow-2xl backdrop-blur-3xl transform hover:rotate-2 transition-transform duration-700">
            <div className="bg-slate-950 rounded-[32px] overflow-hidden aspect-video flex items-center justify-center p-12">
               <div className="text-center space-y-6">
                 <div className="relative inline-block">
                   <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-40 animate-pulse" />
                   <div className="bg-white rounded-full p-0 overflow-hidden w-32 h-32 flex items-center justify-center border-4 border-white relative z-10 shadow-2xl mt-4">
                     <img src={LogoImage} alt="Clazlo" className="w-full h-full object-contain p-2" />
                   </div>
                 </div>
                 <h2 className="text-3xl font-black tracking-tight">AcademicHub v2.0</h2>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <Zap className="h-6 w-6 text-yellow-400 mb-2" />
                      <p className="text-[10px] uppercase font-black text-slate-500">Real-time</p>
                      <p className="text-sm font-bold">Sync</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <Shield className="h-6 w-6 text-emerald-400 mb-2" />
                      <p className="text-[10px] uppercase font-black text-slate-500">Secure</p>
                      <p className="text-sm font-bold">Vault</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-10 -right-10 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl animate-bounce duration-[4000ms]">
            <Rocket className="h-10 w-10 text-blue-400" />
          </div>
          <div className="absolute -bottom-10 -left-10 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl animate-bounce duration-[6000ms] delay-700">
            <BookOpen className="h-10 w-10 text-purple-400" />
          </div>
        </div>
      </main>


    </div>
  );
}
