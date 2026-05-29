'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Navigation, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Users,
  CheckCircle2,
  FileText,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const router = useRouter();
  const [splashActive, setSplashActive] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Live Firebase auth state check during splash screen
  useEffect(() => {
    const minSplashTime = new Promise(resolve => setTimeout(resolve, 1800));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        router.push('/crm/dashboard');
      } else {
        await minSplashTime;
        setSplashFading(true);
        setTimeout(() => setSplashActive(false), 800);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset password.');
      return;
    }
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset link sent to ' + email);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect directly to real-time dispatch dashboard
      router.push('/crm/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
      setLoading(false);
    }
  };

  return (
    <>
      {splashActive && (
        <div className={`fixed inset-0 bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#0f172a] flex flex-col items-center justify-center z-50 overflow-hidden font-sans transition-all duration-[800ms] ease-in-out ${splashFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03]" />
          <div className="absolute w-[450px] h-[450px] bg-[#39379e]/20 rounded-full filter blur-3xl animate-[breathe_4s_ease-in-out_infinite]" />
          <div className="absolute w-[250px] h-[250px] bg-[#888fdf]/10 rounded-full filter blur-2xl animate-[breathe_5s_ease-in-out_infinite_reverse]" />
          
          <div className="relative flex flex-col items-center animate-[fadeUp_1s_ease-out_forwards]">
            <div className="absolute -inset-8 rounded-full border border-[#39379e]/30 animate-[breathe_3s_ease-in-out_infinite]" />
            <div className="absolute -inset-4 rounded-full border border-[#39379e]/20" />
            
            {/* Logo container using Orbit theme style */}
            <div className="relative w-20 h-20 bg-gradient-to-tr from-[#39379e] to-[#7b70ef] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#39379e]/30 border border-[#888fdf]/20">
              <Navigation size={38} className="text-white fill-white rotate-45" />
            </div>

            <h3 className="text-white font-extrabold tracking-widest text-lg mt-8 uppercase font-mono flex items-center gap-2">
              <Compass className="text-[#888fdf] animate-spin-slow" style={{ animationDuration: '6s' }} size={18} />
              ORBIT FLEET
            </h3>
            <p className="text-slate-500 text-[10px] mt-2 font-mono tracking-widest uppercase">
              ACTIVE REAL-TIME FLEET TELEMETRY...
            </p>
          </div>

          <div className="w-52 h-1 bg-[#1e293b] rounded-full overflow-hidden mt-8 relative shadow-inner animate-[fadeUp_1s_ease-out_0.3s_both]">
            <div className="h-full bg-gradient-to-r from-[#4f46e5] to-[#818cf8] rounded-full animate-[classicLoad_1.5s_ease-in-out_forwards]" />
          </div>

          <style jsx global>{`
            @keyframes fadeUp {
              0% { opacity: 0; transform: translateY(15px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes breathe {
              0%, 100% { transform: scale(1); opacity: 0.6; }
              50% { transform: scale(1.05); opacity: 0.3; }
            }
            @keyframes classicLoad {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#0f172a] flex flex-col lg:flex-row font-sans overflow-hidden relative">
      
      {/* Decorative Paces SVG background overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20"
        style={{ backgroundImage: `url('/assets/images/auth-card-bg.svg')` }}
      />
      
      {/* Left Pane - Premium Real-time Operations Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950/40 backdrop-blur-sm relative items-center justify-center p-12 overflow-hidden border-r border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-20" />
        
        <div className="relative z-10 max-w-lg text-white text-left space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#39379e] to-[#7b70ef] rounded-xl flex items-center justify-center border border-[#888fdf]/20 shadow-lg">
              <Navigation size={26} className="text-white fill-white rotate-45" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-widest font-mono text-white">ORBIT FLEET</h2>
              <span className="text-[10px] text-[#888fdf] font-mono tracking-widest uppercase font-bold">Active Real-time Fleet Telemetry</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
              Advanced Fleet Operations & Intelligence Hub
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Orbit Fleet is a modern, high-fidelity operations console displaying geolocated available taxis, comprehensive booking routes, and automated document verifications.
            </p>
          </div>

          {/* Detailed visual console card list (Directly matches Step 5 description) */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            
            {/* Live God's Eye Tracking */}
            <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl shadow-orbit flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-[#888fdf] font-bold uppercase tracking-wider font-mono">Live God's Eye</span>
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
              <h4 className="text-xs font-bold text-white block">God's Eye Tracking</h4>
              <p className="text-[9.5px] text-slate-500 mt-1 font-semibold leading-normal">
                Animate and track available geolocated taxi compass vectors on high-contrast SVG mapping overlays.
              </p>
            </div>

            {/* Document Audits */}
            <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl shadow-orbit flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-[#888fdf] font-bold uppercase tracking-wider font-mono">Document Audits</span>
                <FileText size={14} className="text-indigo-400" />
              </div>
              <h4 className="text-xs font-bold text-white block">Document Audits</h4>
              <p className="text-[9.5px] text-slate-500 mt-1 font-semibold leading-normal">
                Filter signup queues, preview driving licenses and insurance sheets under visual scanning lasers.
              </p>
            </div>

            {/* Operator Directory */}
            <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl shadow-orbit flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-[#888fdf] font-bold uppercase tracking-wider font-mono">Directory Console</span>
                <Users size={14} className="text-blue-400" />
              </div>
              <h4 className="text-xs font-bold text-white block">Operator Directory</h4>
              <p className="text-[9.5px] text-slate-500 mt-1 font-semibold leading-normal">
                Search profiles, onboard new drivers with dynamic drawer forms, and trigger double-toggle block switches.
              </p>
            </div>

            {/* Route Price Telemetry */}
            <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl shadow-orbit flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-[#888fdf] font-bold uppercase tracking-wider font-mono">Price Telemetry</span>
                <Activity size={14} className="text-rose-450" />
              </div>
              <h4 className="text-xs font-bold text-white block">Route Price Telemetry</h4>
              <p className="text-[9.5px] text-slate-500 mt-1 font-semibold leading-normal">
                Review route structures, passenger details, cost parameters, and coordinates via detailed overlays.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Right Pane - Orbit Fleet Sign In Hub Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative bg-[#0f172a]/50 backdrop-blur-md border-l border-[#888fdf]/10 shadow-2xl">
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Logo brand representation */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-6 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-[#39379e] to-[#7b70ef] rounded-xl flex items-center justify-center">
                <Navigation size={18} className="text-white fill-white rotate-45" />
              </div>
              <h2 className="text-white font-extrabold font-mono tracking-widest text-lg">ORBIT FLEET</h2>
            </div>
            <p className="text-slate-400 text-xs leading-normal">
              To keep connected with fleet telemetry, please login to your administrative operations console.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 text-sm text-white">
            {error && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/30 text-rose-400 rounded-lg text-xs flex items-center gap-2 animate-fade-in font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0d0f17] border border-slate-800/80 rounded-[6px] text-white focus:outline-none focus:border-[#39379e] focus:ring-1 focus:ring-[#39379e] font-medium transition duration-200"
                  placeholder="admin@orbit.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">PASSWORD</label>
                <button type="button" onClick={handleForgotPassword} className="text-xs text-[#888fdf] hover:underline font-semibold cursor-pointer">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#0d0f17] border border-slate-800/80 rounded-[6px] text-white focus:outline-none focus:border-[#39379e] focus:ring-1 focus:ring-[#39379e] font-medium transition duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-550 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-slate-400 text-xs cursor-pointer select-none font-semibold">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0d0f17] border-slate-800 text-[#39379e] focus:ring-0 cursor-pointer"
                />
                Keep me connected
              </label>
            </div>

            {/* Buttons list */}
            <div className="flex flex-col gap-3 pt-2">
              
              {/* Button 1: Sign In to Hub */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#39379e] to-[#605ecc] hover:opacity-90 disabled:opacity-50 text-white rounded-[6px] font-bold shadow-lg shadow-[#39379e]/10 transition flex items-center justify-center gap-2 border border-[#888fdf]/25 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting Console...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

            </div>
          </form>

          {/* Orbit Footer */}
          <div className="pt-6 border-t border-slate-900 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest font-mono">
            © 2026 Orbit Fleet Systems. All Rights Reserved.
          </div>

        </div>
      </div>
    </div>
  </>
  );
}
