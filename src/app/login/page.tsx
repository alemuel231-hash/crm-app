'use client';

import React, { useState } from 'react';
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
  Car,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Auto-filled helper credentials to make testing extremely convenient!
  const handleQuickLogin = (role: 'admin' | 'manager') => {
    if (role === 'admin') {
      setEmail('admin@orbit.com');
      setPassword('admin123');
    } else {
      setEmail('manager@orbit.com');
      setPassword('manager123');
    }
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate database lookup and auth check
    setTimeout(() => {
      const isValidAdmin = email === 'admin@orbit.com' && password === 'admin123';
      const isValidManager = email === 'manager@orbit.com' && password === 'manager123';

      if (isValidAdmin || isValidManager) {
        // Successful login, transition smoothly to telemetry home
        router.push('/crm/dashboard');
      } else {
        setError('Invalid telemetry credentials. Try admin@orbit.com / admin123');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row font-sans overflow-hidden">
      
      {/* Left Pane - Premium Fleet Telemetry Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden border-r border-slate-800">
        {/* Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-40" />
        <div className="absolute top-0 right-0 -translate-x-12 translate-y-12 w-[350px] h-[350px] bg-indigo-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 translate-x-12 -translate-y-12 w-[350px] h-[350px] bg-emerald-500/10 rounded-full filter blur-3xl animate-pulse delay-700" />

        {/* Techy HUD Graphics */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" r="220" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
          <circle cx="50%" cy="50%" r="120" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="10%" y1="10%" x2="90%" y2="90%" stroke="rgba(79, 70, 229, 0.05)" strokeWidth="1" />
        </svg>

        <div className="relative z-10 max-w-md text-white text-left space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center border border-indigo-400/20 shadow-lg">
              <Navigation size={26} className="text-white fill-white rotate-45" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-widest font-mono">ORBIT FLEET</h2>
              <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">Telemetry System V1.5</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Manage Your Fleet with Real-Time Intelligence
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connect to your live available drivers, verify DVLA document uploads, audit gross earnings, and handle dispatch queues from a single unified hub.
            </p>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">REGISTERED FLEET</span>
              <h3 className="text-2xl font-extrabold text-white mt-1">32 Active Drivers</h3>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">TELEMETRY DISPATCH</span>
              <h3 className="text-2xl font-extrabold text-white mt-1">34 Booking Logs</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Sleek Premium Login Form (Mighty Taxi style) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative bg-slate-950">
        {/* Mobile background gradients */}
        <div className="absolute w-[200px] h-[200px] bg-indigo-500/5 rounded-full filter blur-3xl lg:hidden" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Logo for mobile view */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Navigation size={18} className="text-white fill-white rotate-45" />
            </div>
            <h2 className="text-white font-extrabold font-mono tracking-wider">ORBIT FLEET</h2>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Sign In to Hub</h2>
            <p className="text-slate-400 text-xs mt-2">
              To keep connected with us, please login with your personal telemetry credentials.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5 text-sm text-white">
            {error && (
              <div className="p-3 bg-red-950/50 border border-red-800/30 text-red-400 rounded-xl text-xs flex items-center gap-2 animate-fade-in font-mono">
                <Compass size={14} className="animate-spin text-red-500" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. admin@orbit.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">PASSWORD</label>
                <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-slate-400 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-850 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                Keep me connected
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition flex items-center justify-center gap-2 border border-indigo-500/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting Secure socket...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Fleet Hub</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick-select Test Credentials Box - extremely premium developer convenience */}
          <div className="p-4 border border-slate-850 bg-slate-900/40 rounded-2xl">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
              <Sparkles size={12} className="text-amber-400" />
              Quick Select Credentials
            </h4>
            <div className="flex gap-2">
              <button 
                onClick={() => handleQuickLogin('admin')}
                className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 transition"
              >
                Admin (Full Access)
              </button>
              <button 
                onClick={() => handleQuickLogin('manager')}
                className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 transition"
              >
                Fleet Manager
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
