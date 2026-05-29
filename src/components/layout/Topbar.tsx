'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, Settings, User, Lock, ChevronDown, Bell, Moon, Sun, Maximize2, Globe, Search, RefreshCw } from 'lucide-react';
import { isRTL, LangType } from '@/lib/i18n';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { getDir } from '@/lib/i18n';

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [activeLang, setActiveLang] = useState<LangType>('EN');
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Sync Settings on Mount & live clock
  useEffect(() => {
    // Dark mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDark = savedTheme === 'dark';
    applyTheme(isDark);
    setDarkMode(isDark);

    // Language
    const savedLang = (localStorage.getItem('lang') || 'EN') as LangType;
    setActiveLang(savedLang);
    applyRTL(savedLang);

    // Live clock
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // Cross-component sync
    const syncSettings = () => {
      const currentTheme = localStorage.getItem('theme') || 'light';
      const isDarkNow = currentTheme === 'dark';
      applyTheme(isDarkNow);
      setDarkMode(isDarkNow);
      const currentLang = (localStorage.getItem('lang') || 'EN') as LangType;
      setActiveLang(currentLang);
      applyRTL(currentLang);
    };

    window.addEventListener('languageChange', syncSettings);
    return () => {
      clearInterval(clockInterval);
      window.removeEventListener('languageChange', syncSettings);
    };
  }, []);

  function applyTheme(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }

  function applyRTL(lang: LangType) {
    const dir = getDir(lang);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang.toLowerCase());
  }

  const handleToggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    applyTheme(nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    window.dispatchEvent(new Event('languageChange'));
  };

  const handleLangSelect = (lang: LangType) => {
    setActiveLang(lang);
    localStorage.setItem('lang', lang);
    setShowLangMenu(false);
    applyRTL(lang);
    window.dispatchEvent(new Event('languageChange'));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Fullscreen error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const LANGUAGES: { code: LangType; label: string; flag: string }[] = [
    { code: 'EN', label: 'English', flag: '🇬🇧' },
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
    { code: 'AR', label: 'العربية', flag: '🇸🇦' },
  ];

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Driver Signup', titleAR: 'تسجيل سائق جديد', titleFR: 'Nouveau chauffeur inscrit', msg: 'Ssas Sas has registered as an online operator.', time: '2m ago', read: false },
    { id: 2, title: 'Ride Dispatch Pending', titleAR: 'إرسال رحلة في الانتظار', titleFR: 'Envoi de course en attente', msg: 'Rider Bless Dziko initiated a commercial request.', time: '8m ago', read: false },
    { id: 3, title: 'Document Review Required', titleAR: 'تحقق وثائق مطلوب', titleFR: 'Vérification requise', msg: 'Driver pending document audit review.', time: '15m ago', read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleReadNotification = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header className="bg-[var(--topbar-bg)] border-b border-[var(--border-color)] sticky top-0 z-40 h-16 shrink-0 text-[var(--foreground)] font-sans transition-colors duration-200">
      <div className="flex items-center justify-between px-5 h-full gap-4">
        
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 max-w-sm">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[#39379e] rounded-[6px] transition cursor-pointer"
            title="Toggle sidebar"
          >
            <Menu size={18} />
          </button>

          {/* Search */}
          <div className="relative w-full hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" size={14} />
            <input
              type="text"
              placeholder={activeLang === 'AR' ? 'البحث السريع...' : activeLang === 'FR' ? 'Recherche rapide...' : 'Quick Search...'}
              className="w-full pl-9 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[6px] text-xs focus:outline-none focus:border-[#39379e] focus:bg-[var(--card-bg)] text-[var(--foreground)] font-medium transition duration-200 placeholder:text-[var(--text-muted)]"
            />
          </div>
        </div>

        {/* Center — Live Clock */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-[6px] px-3 py-1.5">
          <span className="w-1.5 h-1.5 bg-[#57b78a] rounded-full animate-pulse" />
          <span className="text-[var(--foreground)] font-semibold">{currentTime}</span>
          <span className="text-[var(--text-muted)]">UTC+0</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">

          {/* Dark Mode Toggle */}
          <button
            onClick={handleToggleTheme}
            className="p-2 text-[var(--text-secondary)] hover:text-[#39379e] hover:bg-[var(--hover-bg)] rounded-[6px] transition cursor-pointer"
            title={darkMode ? (activeLang === 'AR' ? 'الوضع النهاري' : activeLang === 'FR' ? 'Mode Clair' : 'Light Mode') : (activeLang === 'AR' ? 'الوضع الليلي' : activeLang === 'FR' ? 'Mode Sombre' : 'Dark Mode')}
          >
            {darkMode ? <Sun size={17} className="text-[#fb764a]" /> : <Moon size={17} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotificationMenu(!showNotificationMenu); setShowUserMenu(false); setShowLangMenu(false); }}
              className="p-2 text-[var(--text-secondary)] hover:text-[#39379e] hover:bg-[var(--hover-bg)] rounded-[6px] transition cursor-pointer relative"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#fb764a] text-white text-[8px] font-extrabold flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[6px] shadow-2xl py-0 z-50 animate-fade-in text-xs overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--border-color)] font-bold text-[var(--foreground)] flex justify-between items-center bg-[var(--hover-bg)]">
                  <span className="flex items-center gap-2">
                    <Bell size={13} className="text-[#39379e]" />
                    {activeLang === 'AR' ? 'الإشعارات' : activeLang === 'FR' ? 'Notifications' : 'Notifications'}
                  </span>
                  <span 
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-[#39379e] cursor-pointer hover:underline font-semibold"
                  >
                    {activeLang === 'AR' ? 'تحديد الكل كمقروء' : activeLang === 'FR' ? 'Tout marquer comme lu' : 'Mark all as read'}
                  </span>
                </div>
                <div className="divide-y divide-[var(--border-color)]">
                  {notifications.length === 0 || unreadCount === 0 ? (
                    <div className="p-6 text-center text-[var(--text-muted)] font-medium">
                      {activeLang === 'AR' ? 'لا توجد إشعارات جديدة' : activeLang === 'FR' ? 'Aucune nouvelle notification' : 'No new notifications'}
                    </div>
                  ) : (
                    notifications.filter(n => !n.read).map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => handleReadNotification(n.id)}
                        className="p-3 hover:bg-[var(--hover-bg)] cursor-pointer transition"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-[var(--foreground)] text-xs leading-tight">
                            {activeLang === 'AR' ? n.titleAR : activeLang === 'FR' ? n.titleFR : n.title}
                          </span>
                          <span className="text-[9px] text-[var(--text-muted)] shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-1">{n.msg}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 text-[var(--text-secondary)] hover:text-[#39379e] hover:bg-[var(--hover-bg)] rounded-[6px] transition cursor-pointer hidden md:block"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={17} />
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => { setShowLangMenu(!showLangMenu); setShowUserMenu(false); setShowNotificationMenu(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-[6px] text-xs font-bold text-[var(--text-secondary)] hover:text-[#39379e] cursor-pointer transition"
            >
              <Globe size={14} />
              <span>{LANGUAGES.find(l => l.code === activeLang)?.flag} {activeLang}</span>
              <ChevronDown size={11} className="text-[var(--text-muted)]" />
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[6px] shadow-2xl py-1 z-50 animate-fade-in">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangSelect(lang.code)}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#eff1fc] hover:text-[#39379e] flex items-center justify-between cursor-pointer font-semibold text-xs text-[var(--foreground)] transition"
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    {activeLang === lang.code && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39379e]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-[var(--border-color)] hidden md:block" />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowLangMenu(false); setShowNotificationMenu(false); }}
              className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-[var(--hover-bg)] rounded-[6px] transition cursor-pointer"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-[#eff1fc] rounded-full flex items-center justify-center text-[#39379e] font-extrabold border border-[#888fdf]/20 shadow-sm overflow-hidden">
                  <User size={16} />
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#57b78a] border-2 border-[var(--card-bg)] rounded-full" />
              </div>
              <div className="hidden md:block text-left">
                <span className="font-bold text-[var(--foreground)] text-[11px] block leading-tight">Godfred Dziwornu</span>
                <span className="text-[9px] text-[var(--text-muted)] font-semibold">Super Admin</span>
              </div>
              <ChevronDown size={12} className="text-[var(--text-muted)] hidden md:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[6px] shadow-2xl py-1 z-50 animate-fade-in text-xs overflow-hidden">
                {/* User header */}
                <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[var(--hover-bg)]">
                  <p className="font-bold text-[var(--foreground)]">Godfred Dziwornu</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">fred@orbitfleettransport.com</p>
                </div>
                
                <button onClick={() => { setShowUserMenu(false); router.push('/crm/settings'); }} className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 hover:bg-[var(--hover-bg)] transition cursor-pointer text-[var(--foreground)] font-semibold">
                  <User size={14} className="text-[var(--text-muted)]" />
                  {activeLang === 'AR' ? 'ملفي الشخصي' : activeLang === 'FR' ? 'Mon profil' : 'My Profile'}
                </button>
                <button onClick={() => { setShowUserMenu(false); router.push('/crm/settings'); }} className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 hover:bg-[var(--hover-bg)] transition cursor-pointer text-[var(--foreground)] font-semibold">
                  <Settings size={14} className="text-[var(--text-muted)]" />
                  {activeLang === 'AR' ? 'إعدادات النظام' : activeLang === 'FR' ? 'Paramètres' : 'System Settings'}
                </button>
                <button onClick={() => { setShowUserMenu(false); handleLogout(); }} className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 hover:bg-[var(--hover-bg)] transition cursor-pointer text-[var(--foreground)] font-semibold">
                  <Lock size={14} className="text-[var(--text-muted)]" />
                  {activeLang === 'AR' ? 'قفل لوحة التحكم' : activeLang === 'FR' ? 'Verrouiller' : 'Lock Console'}
                </button>
                <div className="border-t border-[var(--border-color)] my-1" />
                <button onClick={handleLogout} className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-[#fb764a] hover:bg-[var(--hover-bg)] transition cursor-pointer font-bold">
                  <LogOut size={14} />
                  {activeLang === 'AR' ? 'تسجيل الخروج' : activeLang === 'FR' ? 'Se déconnecter' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || showLangMenu || showNotificationMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setShowUserMenu(false); setShowLangMenu(false); setShowNotificationMenu(false); }}
        />
      )}
    </header>
  );
}
