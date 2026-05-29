'use client';

import React, { useState, useEffect } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedLang = localStorage.getItem('lang') || 'EN';
    if (savedLang === 'AR') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', savedLang.toLowerCase());
    }
  }, []);

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[#39379e] selection:text-white antialiased overflow-hidden transition-colors duration-200">
      <Sidebar isOpen={sidebarOpen} isCollapsed={desktopCollapsed} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar onMenuToggle={() => {
          if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setDesktopCollapsed(!desktopCollapsed);
          } else {
            setSidebarOpen(!sidebarOpen);
          }
        }} />
        <main className="flex-1 overflow-auto bg-[var(--background)]">
          <div className="page-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
