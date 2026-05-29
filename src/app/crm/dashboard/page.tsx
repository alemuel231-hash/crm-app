'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Car,
  DollarSign,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  MapPin,
  Navigation,
  Star,
  Shield,
  PhoneCall,
  UserCheck,
  BarChart3,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreHorizontal,
  ChevronRight,
  Bike,
  Package,
  CreditCard,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import AccountDetailModal, { buildDriverSections } from '@/components/ui/AccountDetailModal';

/* ─── Types ─────────────────────────────────────────── */
interface KPICard {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend: number; // % change, positive or negative
  accentClass: string; // tailwind color classes
  sparkline: number[]; // 7 data points for mini bar chart
  href: string; // link to detail page
}

interface RecentTrip {
  id: string;
  rider: string;
  driver: string;
  pickup: string;
  destination: string;
  fare: string;
  status: 'Completed' | 'Cancelled' | 'Active' | 'Pending';
  time: string;
  rating?: number;
}

interface PendingDriver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  submitted: string;
  docs: 'Complete' | 'Partial' | 'Missing';
}

/* ─── Helpers ────────────────────────────────────────── */
const statusConfig: Record<string, { label: string; cls: string }> = {
  Completed: { label: 'Completed', cls: 'badge-success' },
  Active:    { label: 'Active',    cls: 'badge-primary' },
  Cancelled: { label: 'Cancelled', cls: 'badge-danger' },
  Pending:   { label: 'Pending',   cls: 'badge-warning' },
};

const docsConfig: Record<string, { cls: string; icon: React.ReactNode }> = {
  Complete: { cls: 'badge-success', icon: <CheckCircle size={10} /> },
  Partial:  { cls: 'badge-warning', icon: <AlertTriangle size={10} /> },
  Missing:  { cls: 'badge-danger',  icon: <XCircle size={10} /> },
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 70;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const fillPts = `0,${h} ${polyline} ${w},${h}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#sg-${color})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DonutChart({ completed, cancelled, pending }: { completed: number; cancelled: number; pending: number }) {
  const total = completed + cancelled + pending || 1;
  const r = 44;
  const circ = 2 * Math.PI * r;
  const compDash  = (completed  / total) * circ;
  const cancDash  = (cancelled  / total) * circ;
  const pendDash  = (pending    / total) * circ;
  const compOff   = 0;
  const cancOff   = -(compDash);
  const pendOff   = -(compDash + cancDash);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border-color)" strokeWidth="10" />
      {completed > 0 && (
        <circle cx="50" cy="50" r={r} fill="none" stroke="#57b78a" strokeWidth="10"
          strokeDasharray={`${compDash} ${circ - compDash}`}
          strokeDashoffset={compOff}
          strokeLinecap="butt"
          style={{ animation: 'donutSpin 1.2s ease-out forwards' }}
        />
      )}
      {cancelled > 0 && (
        <circle cx="50" cy="50" r={r} fill="none" stroke="#fb764a" strokeWidth="10"
          strokeDasharray={`${cancDash} ${circ - cancDash}`}
          strokeDashoffset={cancOff}
          strokeLinecap="butt"
        />
      )}
      {pending > 0 && (
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e6a66f" strokeWidth="10"
          strokeDasharray={`${pendDash} ${circ - pendDash}`}
          strokeDashoffset={pendOff}
          strokeLinecap="butt"
        />
      )}
    </svg>
  );
}

/* ─── Main Component ─────────────────────────────────── */
const CRMDashboard: React.FC = () => {
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [flash, setFlash]                 = useState(false);
  const [kpis, setKpis]                   = useState<KPICard[]>([]);
  const [recentTrips, setRecentTrips]     = useState<RecentTrip[]>([]);
  const [pendingDrivers, setPendingDrivers] = useState<PendingDriver[]>([]);
  const [tripStats, setTripStats]         = useState({ completed: 0, cancelled: 0, pending: 0 });
  const [totalRevenue, setTotalRevenue]   = useState(0);
  const [activeDrivers, setActiveDrivers] = useState(0);
  const [now, setNow]                     = useState('');
  const [viewDetailDriver, setViewDetailDriver] = useState<PendingDriver | null>(null);

  const handleApproveDriver = (id: string) => {
    setPendingDrivers(prev => prev.filter(d => d.id !== id));
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
  };

  const buildDashboard = useCallback(async () => {
    setRefreshing(true);
    try {
      const [driversRes, tripsRes, ridersRes] = await Promise.all([
        fetch('/api/drivers').then(r => r.json()).catch(() => []),
        fetch('/api/trips').then(r => r.json()).catch(() => []),
        fetch('/api/riders').then(r => r.json()).catch(() => []),
      ]);

      const driverArr: any[] = driversRes?.drivers ? driversRes.drivers : (Array.isArray(driversRes) ? driversRes : []);
      const tripArr:   any[] = tripsRes?.trips ? tripsRes.trips : (Array.isArray(tripsRes) ? tripsRes : []);
      const riderArr:  any[] = ridersRes?.riders ? ridersRes.riders : (Array.isArray(ridersRes) ? ridersRes : []);

      const driverCount  = driverArr.length;
      const pendingCount = driverArr.filter(d => !d.signup_setup_complete || (d.status || '').toLowerCase() === 'pending').length;
      const activeCount  = driverArr.filter(d => !d.blocked).length;
      const tripCount    = tripArr.length;
      const riderCount   = riderArr.length;

      let revenue = 0;
      let todayRev = 0;
      let weekRev = 0;
      let comp = 0, canc = 0, pend = 0;
      
      const nowMs = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      tripArr.forEach((t: any) => {
        const cost = Number(t.tripCost || t.fare || 0) || 0;
        revenue += cost;
        const s = (t.paymentStatus || t.status || '').toLowerCase();
        if (s === 'paid' || s === 'completed') comp++;
        else if (s === 'cancelled') canc++;
        else pend++;
        
        if (t.created_at || t.createdAt) {
          const tripTime = new Date(t.created_at || t.createdAt).getTime();
          if (nowMs - tripTime < oneDay) todayRev += cost;
          if (nowMs - tripTime < oneDay * 7) weekRev += cost;
        } else {
          // If no date provided, count as today for demo purposes
          todayRev += cost;
          weekRev += cost;
        }
      });

      setTripStats({ completed: comp, cancelled: canc, pending: pend });
      setTotalRevenue(revenue);
      setActiveDrivers(activeCount);

      const avgFare = tripCount > 0 ? revenue / tripCount : 0;

      setKpis([
        {
          id: 'total_drivers',
          title: 'Total Drivers',
          value: driverCount,
          subtitle: `${activeCount} currently active`,
          icon: <Car className="w-5 h-5" />,
          trend: +12,
          accentClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
          sparkline: [0, 0, 0, 0, driverCount],
          href: '/crm/drivers',
        },
        {
          id: 'pending_verification',
          title: 'Pending Verification',
          value: pendingCount,
          subtitle: 'Awaiting document review',
          icon: <Shield className="w-5 h-5" />,
          trend: -2,
          accentClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
          sparkline: [0, 0, 0, pendingCount],
          href: '/crm/drivers/pending-verification',
        },
        {
          id: 'total_trips',
          title: 'Total Trips',
          value: tripCount,
          subtitle: `${comp} completed globally`,
          icon: <Navigation className="w-5 h-5" />,
          trend: +8,
          accentClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
          sparkline: [0, 0, 0, tripCount],
          href: '/crm/trips',
        },
        {
          id: 'today_revenue',
          title: "Today's Revenue",
          value: `GHS ${todayRev.toFixed(2)}`,
          subtitle: `GHS ${avgFare.toFixed(2)} avg per trip`,
          icon: <DollarSign className="w-5 h-5" />,
          trend: +22,
          accentClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
          sparkline: [0, 0, todayRev],
          href: '/crm/payments',
        },
        {
          id: 'weekly_revenue',
          title: 'Weekly Revenue',
          value: `GHS ${weekRev.toFixed(2)}`,
          subtitle: 'Last 7 days total',
          icon: <BarChart3 className="w-5 h-5" />,
          trend: +5,
          accentClass: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40',
          sparkline: [0, 0, weekRev],
          href: '/crm/payments',
        },
        {
          id: 'total_riders',
          title: 'Total Riders',
          value: riderCount,
          subtitle: 'Active passengers',
          icon: <Users className="w-5 h-5" />,
          trend: +15,
          accentClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
          sparkline: [0, riderCount],
          href: '/crm/riders',
        },
      ]);

      // Build pending drivers from data
      const pending: PendingDriver[] = driverArr
        .filter((d: any) => !d.signup_setup_complete || (d.status || '').toLowerCase() === 'pending')
        .slice(0, 5)
        .map((d: any) => ({
          id:        d.driverID || d.id || d._id || String(Math.random()),
          name:      d.driverName || d.name || d.full_name || 'Unknown Driver',
          phone:     d.driverPhone || d.phone || d.phone_number || 'N/A',
          vehicle:   d.vehicleModel || d.vehicle || d.car_model || 'Unknown Vehicle',
          submitted: d.created_at || d.createdAt || new Date().toISOString().split('T')[0],
          docs:      d.document_uploaded ? 'Complete' : 'Missing',
        }));

      setPendingDrivers(pending);

      // Build recent trips
      const trips5 = tripArr.slice(0, 5).map((t: any, i: number) => ({
        id:          t.tripID || t.id || t._id || String(i),
        rider:       t.rider_name  || t.customer_name || 'Unknown Rider',
        driver:      t.driverID || t.driver_name || t.driver || 'Unknown Driver',
        pickup:      t.pickup_address  || t.from || 'Unknown Pickup',
        destination: t.destination_address || t.dropoff_address || t.to || 'Unknown Destination',
        fare:        `GHS ${Number(t.tripCost || t.fare || 0).toFixed(2)}`,
        status:      (t.paymentStatus === 'paid' ? 'Completed' : t.paymentStatus === 'cancelled' ? 'Cancelled' : t.status || 'Pending'),
        time:        t.created_at ? new Date(t.created_at).toLocaleTimeString() : '—',
        rating:      t.rating,
      }));

      setRecentTrips(trips5);

      setFlash(true);
      setTimeout(() => setFlash(false), 800);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
    setRefreshing(false);
    setLoading(false);
  }, []);

  
  const hasFetched = React.useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      buildDashboard();
    }
    // Live clock
    const tick = () => {
      const d = new Date();
      setNow(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [buildDashboard]);


  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 space-y-6 animate-pulse">
          <div className="h-8 bg-[var(--border-color)] rounded w-64" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl" />
            <div className="h-80 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl" />
          </div>
        </div>
      </MainLayout>
    );
  }

  const total = tripStats.completed + tripStats.cancelled + tripStats.pending || 1;
  const compPct = Math.round((tripStats.completed / total) * 100);
  const cancPct = Math.round((tripStats.cancelled / total) * 100);
  const pendPct = Math.round((tripStats.pending   / total) * 100);

  return (
    <MainLayout>
      <div className={`p-5 lg:p-6 space-y-5 min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-all duration-300 ${flash ? 'data-updated' : ''}`}>

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
                Fleet Operations Dashboard
              </h1>
              <span className="live-pulse text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide ml-1">
                Live
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Real-time telemetry · <span className="font-mono">{now}</span>
            </p>
          </div>
          <button
            onClick={buildDashboard}
            disabled={refreshing}
            id="btn-refresh-dashboard"
            className="orbit-btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold self-start sm:self-auto"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Syncing…' : 'Refresh'}
          </button>
        </div>

        {/* ── KPI CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((kpi, idx) => {
            const up = kpi.trend >= 0;
            return (
              <Link
                href={kpi.href}
                key={kpi.id}
                id={`kpi-${kpi.id}`}
                className="orbit-card p-5 flex flex-col gap-3 hover:shadow-orbit-lg transition-all duration-300 group block cursor-pointer hover:scale-[1.02] hover:translate-y-[-6px] animate-fade-in border border-[var(--border-color)]/50 hover:border-[var(--border-color)] bg-gradient-to-br from-[var(--card-bg)] to-[var(--hover-bg)]/30 min-h-[140px]"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Top row: icon + trend */}
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${kpi.accentClass} shadow-sm`}>
                    {kpi.icon}
                  </div>
                  <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${up ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/40' : 'text-rose-700 dark:text-rose-300 bg-rose-100/60 dark:bg-rose-950/40'}`}>
                    {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {Math.abs(kpi.trend)}%
                  </span>
                </div>

                {/* Value + title */}
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-extrabold text-[var(--foreground)] tracking-tight leading-tight break-words large-number">
                    {kpi.value}
                  </p>
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2">
                    {kpi.title}
                  </p>
                </div>

                {/* Sparkline */}
                <div className="mt-auto pt-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                  <MiniSparkline
                    data={kpi.sparkline}
                    color={kpi.accentClass.includes('blue') ? '#3b82f6' :
                           kpi.accentClass.includes('amber') ? '#f59e0b' :
                           kpi.accentClass.includes('emerald') ? '#57b78a' :
                           kpi.accentClass.includes('indigo') ? '#6366f1' :
                           kpi.accentClass.includes('purple') ? '#a855f7' : '#fb764a'}
                  />
                </div>

                {/* Subtitle */}
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">
                  {kpi.subtitle}
                </p>
              </Link>
            );
          })}
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ── Recent Trips Table ── */}
          <div className="xl:col-span-2 orbit-card overflow-hidden border border-[var(--border-color)]/50">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-gradient-to-r from-[var(--hover-bg)]/50 to-transparent">
              <div className="flex items-center gap-2">
                <Navigation size={16} className="text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-[var(--foreground)] uppercase tracking-wider">Recent Trips</h2>
              </div>
              <Link href="/crm/trips" id="link-view-all-trips" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
                View All <ChevronRight size={13} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="orbit-table w-full">
                <thead>
                  <tr>
                    <th>Rider</th>
                    <th>Driver</th>
                    <th>Route</th>
                    <th>Fare</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {recentTrips.map((trip) => {
                    const sc = statusConfig[trip.status] || statusConfig.Pending;
                    return (
                      <tr key={trip.id} id={`trip-row-${trip.id}`}>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/40 dark:border-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold flex-shrink-0">
                              {trip.rider.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className="font-semibold text-[var(--foreground)] text-sm">{trip.rider}</span>
                          </div>
                        </td>
                        <td className="text-sm text-[var(--text-secondary)]">{trip.driver}</td>
                        <td>
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                              <MapPin size={10} className="text-emerald-500 flex-shrink-0" />
                              <span className="truncate max-w-[120px]">{trip.pickup}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                              <MapPin size={10} className="text-rose-500 flex-shrink-0" />
                              <span className="truncate max-w-[120px]">{trip.destination}</span>
                            </div>
                          </div>
                        </td>
                        <td className="font-bold text-[var(--foreground)] font-mono text-sm">{trip.fare}</td>
                        <td>
                          {trip.rating ? (
                            <div className="flex items-center gap-0.5">
                              {[...Array(trip.rating)].map((_, i) => (
                                <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                          ) : (
                            <span className="text-[var(--text-muted)] text-xs">—</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${sc.cls}`}>{sc.label}</span>
                        </td>
                        <td className="text-xs text-[var(--text-muted)] font-mono whitespace-nowrap">{trip.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Trip Status Donut ── */}
          <div className="orbit-card p-6 flex flex-col border border-[var(--border-color)]/50 bg-gradient-to-br from-[var(--card-bg)] to-[var(--hover-bg)]/30">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-[var(--foreground)] uppercase tracking-wider">Trip Analytics</h2>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-900/40 px-3 py-1 rounded-full font-mono">
                All Time
              </span>
            </div>

            {/* Donut */}
            <div className="relative w-36 h-36 mx-auto mb-4">
              <DonutChart
                completed={tripStats.completed}
                cancelled={tripStats.cancelled}
                pending={tripStats.pending}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-extrabold text-[var(--foreground)]">{total}</p>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide">Total Trips</p>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 mt-2">
              {[
                { label: 'Completed', count: tripStats.completed, pct: compPct, color: 'bg-emerald-500' },
                { label: 'Cancelled', count: tripStats.cancelled, pct: cancPct, color: 'bg-rose-500' },
                { label: 'Pending',   count: tripStats.pending,   pct: pendPct, color: 'bg-amber-500' },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${row.color}`} />
                  <span className="text-sm text-[var(--text-secondary)] flex-1">{row.label}</span>
                  <span className="text-sm font-bold text-[var(--foreground)]">{row.count}</span>
                  <span className="text-xs text-[var(--text-muted)] w-8 text-right">{row.pct}%</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-[var(--border-color)] grid grid-cols-2 gap-3">
              <div className="bg-[var(--hover-bg)] rounded-lg p-3">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Revenue</p>
                <p className="text-base font-extrabold text-[var(--foreground)] font-mono">GHS {totalRevenue.toFixed(0)}</p>
              </div>
              <div className="bg-[var(--hover-bg)] rounded-lg p-3">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Active Drivers</p>
                <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{activeDrivers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ── Pending Driver Verifications ── */}
          <div className="xl:col-span-2 orbit-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-color)] bg-[var(--hover-bg)]/30">
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-amber-500" />
                <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Pending Driver Verifications</h2>
                <span className="badge badge-warning text-[10px]">{pendingDrivers.length}</span>
              </div>
              <Link href="/crm/drivers" id="link-view-all-drivers" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
                Manage <ChevronRight size={13} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="orbit-table w-full">
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Phone</th>
                    <th>Vehicle</th>
                    <th>Submitted</th>
                    <th>Documents</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {pendingDrivers.map((driver) => {
                    const dc = docsConfig[driver.docs];
                    return (
                      <tr key={driver.id} id={`pending-driver-${driver.id}`}>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/40 dark:border-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 text-[11px] font-extrabold flex-shrink-0">
                              {driver.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className="font-semibold text-[var(--foreground)] text-sm">{driver.name}</span>
                          </div>
                        </td>
                        <td className="text-sm text-[var(--text-secondary)] font-mono">{driver.phone}</td>
                        <td className="text-sm text-[var(--text-secondary)]">{driver.vehicle}</td>
                        <td className="text-xs text-[var(--text-muted)] font-mono">{driver.submitted}</td>
                        <td>
                          <span className={`badge ${dc.cls} inline-flex items-center gap-1`}>
                            {dc.icon} {driver.docs}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveDriver(driver.id)}
                              id={`btn-approve-${driver.id}`}
                              title="Approve Driver"
                              className="orbit-btn-primary bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm rounded-md flex items-center gap-1.5"
                            >
                              <UserCheck size={14} /> Approve
                            </button>
                            <a
                              href={`tel:${driver.phone.replace(/[^0-9+]/g, '')}`}
                              id={`btn-call-${driver.id}`}
                              title="Call Driver"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm rounded-md flex items-center gap-1.5 inline-flex"
                            >
                              <PhoneCall size={14} /> Call
                            </a>
                            <button
                              onClick={() => setViewDetailDriver(driver)}
                              id={`btn-view-driver-${driver.id}`}
                              title="View Details"
                              className="bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[#39379e] hover:text-white hover:border-[#39379e] text-[var(--text-secondary)] px-3 py-1.5 text-xs font-bold transition-all shadow-sm rounded-md flex items-center gap-1.5"
                            >
                              <Eye size={14} /> View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Quick Stats / Activity Feed ── */}
          <div className="orbit-card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-[var(--text-muted)]" />
              <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Quick Actions</h2>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Add New Driver',    icon: <Car size={15} />,       href: '/crm/drivers',  color: 'text-blue-600 dark:text-blue-400   bg-blue-50 dark:bg-blue-950/40',   id: 'qa-add-driver'   },
                { label: 'Record Payment',    icon: <CreditCard size={15} />, href: '/crm/payments', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40', id: 'qa-payment' },
                { label: 'New Trip Entry',    icon: <Navigation size={15} />, href: '/crm/trips',    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40', id: 'qa-new-trip' },
                { label: 'Add New Rider',     icon: <Bike size={15} />,       href: '/crm/riders',   color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40', id: 'qa-add-rider' },
                { label: 'Manage Orders',     icon: <Package size={15} />,    href: '/crm/orders',   color: 'text-amber-600 dark:text-amber-400  bg-amber-50 dark:bg-amber-950/40',   id: 'qa-orders'   },
              ].map(action => (
                <Link
                  key={action.id}
                  id={action.id}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--hover-bg)]/40 hover:bg-[var(--hover-bg)] transition-colors group"
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-semibold text-[var(--foreground)]">{action.label}</span>
                  <ChevronRight size={14} className="ml-auto text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>

            {/* Fleet Health indicator */}
            <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
              <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Fleet Health</p>
              {[
                { label: 'Active Drivers', pct: Math.round((activeDrivers / (kpis[0]?.value as number || 32)) * 100), color: 'bg-emerald-500' },
                { label: 'Trip Completion', pct: compPct, color: 'bg-blue-500' },
                { label: 'Docs Compliance', pct: 72, color: 'bg-amber-500' },
              ].map(metric => (
                <div key={metric.label} className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-secondary)] font-medium">{metric.label}</span>
                    <span className="font-bold text-[var(--foreground)]">{metric.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${metric.color} rounded-full transition-all duration-700`}
                      style={{ width: `${metric.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Detail Modal for Drivers */}
        <AccountDetailModal
          open={!!viewDetailDriver}
          onClose={() => setViewDetailDriver(null)}
          config={viewDetailDriver ? {
            entityType: 'driver',
            accent: 'indigo',
            initials: (viewDetailDriver.name || 'DR').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
            name: viewDetailDriver.name || 'Unknown Driver',
            subtitle: viewDetailDriver.id,
            statusBadge: (
              <span className="badge badge-warning">Pending</span>
            ),
            metaPills: [
              { label: 'Submitted on', value: viewDetailDriver.submitted },
              { label: 'Documents', value: viewDetailDriver.docs },
            ],
            sections: buildDriverSections({
              driverID: viewDetailDriver.id,
              driverName: viewDetailDriver.name,
              driverPhone: viewDetailDriver.phone,
              vehicleModel: viewDetailDriver.vehicle,
              driverEmail: '—',
              vehicleColor: '—',
              licensePlate: '—',
            }),
          } : { entityType: 'driver', accent: 'indigo', initials: '--', name: '', sections: [] }}
        />
      </div>
    </MainLayout>
  );
};

export default CRMDashboard;
