'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Navigation,
  Users,
  CreditCard,
  DollarSign,
  Settings,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  Compass,
  Zap,
} from 'lucide-react';
import { LangType } from '@/lib/i18n';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onClose: () => void;
}

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  submenu?: { label: string; href: string }[];
  badge?: string;
}

interface SidebarGroup {
  groupName: string;
  items: SidebarItem[];
}

const getSidebarGroups = (lang: LangType): SidebarGroup[] => {
  const t = {
    EN: {
      main: 'MAIN', dashboard: 'Dashboard',
      trip: 'TRIP MANAGEMENT', trips: 'Trips', orders: 'Orders', bookings: 'Booking Logs', customers: 'Customers', leads: 'Leads',
      users: 'USER MANAGEMENT', drivers: 'Drivers', driverDir: 'Driver Directory', pendingV: 'Pending Verification',
      riders: 'Riders', ridersDir: 'Riders Directory', contacts: 'Contacts',
      finance: 'FINANCE', payments: 'Payments', transactions: 'Transactions', payout: 'Payout Control',
      pricing: 'Pricing', fareMatrix: 'Fare Matrix', distEst: 'Distance Estimator',
      settings: 'PLATFORM SETTINGS', sysSettings: 'System Settings', appSettings: 'App Settings', globalSockets: 'Global Sockets', myProfile: 'My Profile', security: 'Security',
      analytics: 'ANALYTICS & REPORTS', analyticsItem: 'Analytics', fulfillment: 'Fulfillment Analysis', earnings: 'Earnings Reports',
      admin: 'ADMINISTRATION', adminItem: 'Administration', managerDir: 'Manager Directory', rolePerms: 'Role Permissions',
    },
    FR: {
      main: 'PRINCIPAL', dashboard: 'Tableau de Bord',
      trip: 'GESTION DES TRAJETS', trips: 'Trajets', orders: 'Commandes', bookings: 'Journaux de Réservation', customers: 'Clients', leads: 'Prospects',
      users: 'GESTION DES UTILISATEURS', drivers: 'Chauffeurs', driverDir: 'Annuaire des Chauffeurs', pendingV: 'Vérification en Attente',
      riders: 'Passagers', ridersDir: 'Annuaire des Passagers', contacts: 'Contacts',
      finance: 'FINANCES', payments: 'Paiements', transactions: 'Transactions', payout: 'Contrôle des Paiements',
      pricing: 'Tarification', fareMatrix: 'Grille Tarifaire', distEst: 'Estimateur de Distance',
      settings: 'PARAMÈTRES SYSTÈME', sysSettings: 'Paramètres Système', appSettings: "Paramètres de l'App", globalSockets: 'Sockets Globaux', myProfile: 'Mon Profil', security: 'Sécurité',
      analytics: 'ANALYSES & RAPPORTS', analyticsItem: 'Analyses', fulfillment: "Analyse d'Exécution", earnings: 'Rapports de Gains',
      admin: 'ADMINISTRATION', adminItem: 'Administration', managerDir: 'Annuaire des Managers', rolePerms: 'Permissions de Rôle',
    },
    AR: {
      main: 'الرئيسية', dashboard: 'لوحة التحكم',
      trip: 'إدارة الرحلات', trips: 'الرحلات', orders: 'الطلبات', bookings: 'سجلات الحجز', customers: 'العملاء', leads: 'العملاء المحتملين',
      users: 'إدارة المستخدمين', drivers: 'السائقون', driverDir: 'دليل السائقين', pendingV: 'قيد التحقق',
      riders: 'الركاب', ridersDir: 'دليل الركاب', contacts: 'جهات الاتصال',
      finance: 'المالية', payments: 'المدفوعات', transactions: 'المعاملات', payout: 'التحكم في المدفوعات',
      pricing: 'التسعير', fareMatrix: 'مصفوفة الأسعار', distEst: 'تقدير المسافة',
      settings: 'إعدادات المنصة', sysSettings: 'إعدادات النظام', appSettings: 'إعدادات التطبيق', globalSockets: 'المآخذ العالمية', myProfile: 'ملفي الشخصي', security: 'الأمان',
      analytics: 'التحليلات والتقارير', analyticsItem: 'التحليلات', fulfillment: 'تحليل التنفيذ', earnings: 'تقارير الأرباح',
      admin: 'الإدارة', adminItem: 'الإدارة', managerDir: 'دليل المديرين', rolePerms: 'صلاحيات الأدوار',
    },
  };

  const s = t[lang] || t.EN;

  return [
    {
      groupName: s.main,
      items: [
        { label: s.dashboard, icon: <LayoutDashboard size={16} />, href: '/crm/dashboard' }
      ]
    },
    {
      groupName: s.trip,
      items: [
        {
          label: s.trips,
          icon: <Navigation size={16} className="rotate-45" />,
          submenu: [
            { label: s.trips, href: '/crm/trips' },
            { label: s.orders, href: '/crm/orders' },
            { label: s.customers, href: '/crm/customers' },
            { label: s.leads, href: '/crm/leads' },
          ]
        }
      ]
    },
    {
      groupName: s.users,
      items: [
        {
          label: s.drivers,
          icon: <Users size={16} />,
          submenu: [
            { label: s.driverDir, href: '/crm/drivers' },
            { label: s.pendingV, href: '/crm/drivers/pending-verification' },
          ]
        },
        {
          label: s.riders,
          icon: <Users size={16} />,
          submenu: [
            { label: s.ridersDir, href: '/crm/riders' },
            { label: s.contacts, href: '/crm/contacts' },
          ]
        }
      ]
    },
    {
      groupName: s.finance,
      items: [
        {
          label: s.payments,
          icon: <CreditCard size={16} />,
          submenu: [
            { label: s.payments, href: '/crm/payments' },
            { label: s.transactions, href: '/crm/deals' },
            { label: s.payout, href: '/crm/pipeline' }
          ]
        },
        {
          label: s.pricing,
          icon: <DollarSign size={16} />,
          submenu: [
            { label: s.fareMatrix, href: '/crm/opportunities' },
            { label: s.distEst, href: '/crm/estimations' }
          ]
        }
      ]
    },
    {
      groupName: s.settings,
      items: [
        {
          label: s.sysSettings,
          icon: <Settings size={16} />,
          href: '/crm/settings'
        }
      ]
    },
    {
      groupName: s.analytics,
      items: [
        {
          label: s.analyticsItem,
          icon: <BarChart3 size={16} />,
          submenu: [
            { label: s.fulfillment, href: '/crm/reports' },
            { label: s.earnings, href: '/crm/campaigns' }
          ]
        }
      ]
    },
    {
      groupName: s.admin,
      items: [
        {
          label: s.adminItem,
          icon: <ShieldCheck size={16} />,
          submenu: [
            { label: s.managerDir, href: '/crm/companies' },
            { label: s.rolePerms, href: '/crm/email' }
          ]
        }
      ]
    }
  ];
};

export default function Sidebar({ isOpen, isCollapsed, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [lang, setLang] = useState<LangType>('EN');
  const pathname = usePathname();

  useEffect(() => {
    const savedLang = (localStorage.getItem('lang') || 'EN') as LangType;
    setLang(savedLang);

    const syncLanguage = () => {
      const currentLang = (localStorage.getItem('lang') || 'EN') as LangType;
      setLang(currentLang);
    };

    window.addEventListener('languageChange', syncLanguage);
    return () => window.removeEventListener('languageChange', syncLanguage);
  }, []);

  // Auto-expand active items
  useEffect(() => {
    const groups = getSidebarGroups(lang);
    const toExpand: string[] = [];
    groups.forEach(group => {
      group.items.forEach(item => {
        if (item.submenu?.some(sub => pathname.startsWith(sub.href))) {
          toExpand.push(item.label);
        }
      });
    });
    if (toExpand.length > 0) {
      setExpandedItems(prev => [...new Set([...prev, ...toExpand])]);
    }
  }, [pathname, lang]);

  const toggleSubmenu = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/crm/dashboard') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isSubmenuActive = (submenu?: { label: string; href: string }[]) => {
    if (!submenu) return false;
    return submenu.some(item => isActive(item.href));
  };

  const activeGroups = getSidebarGroups(lang);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[var(--sidenav-bg)] border-r border-[var(--border-color)] overflow-y-auto overflow-x-hidden transition-all duration-300 z-40 flex flex-col w-[230px] ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0 ${isCollapsed ? 'lg:w-[70px]' : 'lg:w-[230px]'}`}
      >
        <div className="flex-1">
          {/* Logo */}
          <div className={`px-5 h-16 border-b border-[var(--border-color)] flex items-center shrink-0 ${isCollapsed ? 'lg:justify-center' : 'gap-2.5'}`}>
            <div className="w-8 h-8 bg-[#39379e] rounded-[6px] flex items-center justify-center shadow-md shadow-[#39379e]/20 shrink-0">
              <Compass size={16} className="text-white" />
            </div>
            <div className={`${isCollapsed ? 'lg:hidden' : ''}`}>
              <span className="font-extrabold text-base text-[var(--foreground)] tracking-tight block leading-none whitespace-nowrap">
                Orbit Fleet
              </span>
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">
                Fleet Console
              </span>
            </div>
          </div>

          {/* Live Status Bar */}
          <div className={`mx-4 mt-3 mb-1 px-3 py-2 bg-[#eff1fc] rounded-[6px] border border-[#888fdf]/20 flex items-center justify-center ${isCollapsed ? 'lg:mx-2 lg:px-0 lg:py-2' : 'gap-2'}`}>
            <span className="w-1.5 h-1.5 bg-[#57b78a] rounded-full animate-pulse shrink-0" />
            <span className={`text-xs font-bold text-[#39379e] uppercase tracking-wide whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>
              {lang === 'AR' ? 'بث مباشر' : lang === 'FR' ? 'Flux en Direct' : 'Live Feed Active'}
            </span>
          </div>

          {/* Navigation */}
          <div className="p-3 space-y-4">
            {activeGroups.map((group) => (
              <div key={group.groupName} className="space-y-0.5">
                <span className={`block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest px-3 mb-1.5 whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>
                  {group.groupName}
                </span>
                {isCollapsed && <div className="hidden lg:block h-px w-6 mx-auto bg-[var(--border-color)] mb-2" />}

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const hasSub = !!item.submenu;
                    const subActive = isSubmenuActive(item.submenu);
                    const itemActive = isActive(item.href) || subActive;
                    const expanded = expandedItems.includes(item.label) && !isCollapsed;

                    return (
                      <div key={item.label}>
                        {hasSub ? (
                          <>
                            <button
                              onClick={() => toggleSubmenu(item.label)}
                              className={`w-full flex items-center py-2.5 rounded-[6px] transition font-semibold text-sm cursor-pointer ${isCollapsed ? 'lg:justify-center px-0' : 'justify-between px-3'} ${
                                itemActive
                                  ? 'bg-[var(--sidenav-active-bg)] text-[var(--sidenav-active-color)] font-bold'
                                  : 'text-[var(--sidenav-item)] hover:bg-[var(--hover-bg)]'
                              }`}
                              title={isCollapsed ? item.label : undefined}
                            >
                              <div className={`flex items-center ${isCollapsed ? '' : 'gap-2'}`}>
                                <span className={itemActive ? 'text-[var(--sidenav-active-color)]' : 'text-[var(--text-muted)]'}>
                                  {item.icon}
                                </span>
                                <span className={`whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                              </div>
                              <ChevronDown
                                size={11}
                                className={`transition-transform duration-200 text-[var(--text-muted)] shrink-0 ${expanded ? 'rotate-180' : ''} ${isCollapsed ? 'lg:hidden' : ''}`}
                              />
                            </button>

                            {expanded && (
                              <div className={`ml-4 mt-0.5 border-l-2 border-[var(--border-color)] pl-3 space-y-0.5 animate-fade-in ${isCollapsed ? 'lg:hidden' : ''}`}>
                                {item.submenu!.map((subitem) => (
                                  <Link
                                    key={subitem.href}
                                    href={subitem.href}
                                    onClick={onClose}
                                    className={`flex items-center py-1.5 px-3 rounded-[6px] transition text-sm font-semibold ${
                                      isActive(subitem.href)
                                        ? 'bg-[var(--sidenav-active-bg)] text-[var(--sidenav-active-color)] font-bold'
                                        : 'text-[var(--sidenav-item)] hover:text-[var(--sidenav-active-color)] hover:bg-[var(--hover-bg)]'
                                    }`}
                                  >
                                    {subitem.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <Link
                            href={item.href || '#'}
                            onClick={onClose}
                            className={`flex items-center py-2 rounded-[6px] transition text-sm font-semibold ${isCollapsed ? 'lg:justify-center px-0' : 'gap-2 px-3'} ${
                              isActive(item.href)
                                ? 'bg-[var(--sidenav-active-bg)] text-[var(--sidenav-active-color)] font-bold shadow-sm'
                                : 'text-[var(--sidenav-item)] hover:bg-[var(--hover-bg)]'
                            }`}
                            title={isCollapsed ? item.label : undefined}
                          >
                            <span className={isActive(item.href) ? 'text-[var(--sidenav-active-color)]' : 'text-[var(--text-muted)]'}>
                              {item.icon}
                            </span>
                            <span className={`whitespace-nowrap ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t border-[var(--border-color)] shrink-0 flex justify-center ${isCollapsed ? 'lg:px-2' : ''}`}>
          <div className="flex items-center gap-2.5 w-full">
            <div className="w-8 h-8 rounded-full bg-[#39379e] text-white flex items-center justify-center font-bold text-xs shadow-md border border-[#39379e]/30 shrink-0 mx-auto">
              G
            </div>
            <div className={`flex-1 min-w-0 ${isCollapsed ? 'lg:hidden' : ''}`}>
              <p className="text-[11px] font-bold text-[var(--foreground)] truncate leading-tight">Godfred Dziwornu</p>
              <p className="text-[9px] text-[var(--text-muted)] font-semibold truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
