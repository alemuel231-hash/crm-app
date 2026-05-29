'use client';

import React from 'react';
import { Compass, Navigation } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-[var(--background)] flex flex-col items-center justify-center z-50 overflow-hidden font-sans">
      {/* Pulse background effects */}
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/5 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute w-[200px] h-[200px] bg-emerald-500/5 rounded-full filter blur-2xl animate-pulse delay-1000" />

      {/* Main Loader Container */}
      <div className="relative flex flex-col items-center">
        {/* Pulsing Outer Radar Circle */}
        <div className="absolute -inset-8 rounded-full border border-indigo-500/10 animate-ping opacity-75" />
        <div className="absolute -inset-4 rounded-full border border-indigo-500/20" />
        
        {/* Glowing Pulse Logo */}
        <div className="relative w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30 border border-indigo-400/20 animate-[bounce_2s_infinite]">
          <Navigation size={38} className="text-white fill-white rotate-45" />
        </div>

        {/* Pulsing Text */}
        <h3 className="text-[var(--foreground)] font-extrabold tracking-widest text-lg mt-8 uppercase font-mono flex items-center gap-2">
          <Compass className="text-emerald-400 animate-spin" size={18} />
          ORBIT TELEMETRY
        </h3>
        <p className="text-slate-500 text-xs mt-2 font-mono tracking-wider animate-pulse">
          Establishing Fleet Secure Socket Connection...
        </p>
      </div>

      {/* Linear Loader Bar */}
      <div className="w-52 h-1 bg-slate-800 rounded-full overflow-hidden mt-8 relative">
        <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full w-2/3 animate-[loading_1.5s_infinite_ease-in-out]" />
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
