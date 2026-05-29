'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  ShieldCheck, Car, User, FileText, XCircle, CheckCircle2,
  Search, Phone, Mail, AlertTriangle, RefreshCw, Eye, X, Compass, Clock, DollarSign, Users, Briefcase, Activity
} from 'lucide-react';
import { getTranslation, LangType } from '@/lib/i18n';

interface Driver {
  driverID: string;
  driverName: string;
  driverPhone: string;
  driverEmail: string;
  blocked: boolean;
  document_uploaded: boolean;
  vehicleColor: string;
  vehicleMenufacturer: string;
  vehicleModel: string;
  vehicleType: string;
  vehicleYear: string;
  licensePlate: string;
  signup_setup_complete: boolean;
}

export default function PendingVerificationPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<'license' | 'insurance' | 'registration'>('license');
  const [successMsg, setSuccessMsg] = useState('');
  const [lang, setLang] = useState<LangType>('EN');
  const [lastRefresh, setLastRefresh] = useState('');

  // Structured Audit Checklist state matching BetterSuite professional workflow
  const [docVerifications, setDocVerifications] = useState<{ license: boolean; insurance: boolean; registration: boolean }>({
    license: false,
    insurance: false,
    registration: false
  });

  const fetchDrivers = useCallback(async () => {
    try {
      const res = await fetch('/api/drivers', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        const pending = data.drivers.filter((d: Driver) => d.document_uploaded && !d.signup_setup_complete && !d.blocked);
        setDrivers(pending);
        setLastRefresh(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchDrivers();
    const savedLang = (localStorage.getItem('lang') || 'EN') as LangType;
    setLang(savedLang);
    const poll = setInterval(fetchDrivers, 20000);
    const sync = () => setLang((localStorage.getItem('lang') || 'EN') as LangType);
    window.addEventListener('languageChange', sync);
    return () => { clearInterval(poll); window.removeEventListener('languageChange', sync); };
  }, [fetchDrivers]);

  const handleOpenAuditModal = (driver: Driver) => {
    setDocVerifications({ license: false, insurance: false, registration: false });
    setSelectedDriver(driver);
    setActiveDocTab('license');
  };

  const handleApprove = async (driver: Driver) => {
    try {
      const res = await fetch('/api/drivers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverID: driver.driverID, signup_setup_complete: true }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`${driver.driverName} has been approved and activated!`);
        setTimeout(() => setSuccessMsg(''), 4000);
        setSelectedDriver(null);
        await fetchDrivers();
      }
    } catch {}
  };

  const handleReject = async (driver: Driver) => {
    try {
      const res = await fetch('/api/drivers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverID: driver.driverID, blocked: true }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`${driver.driverName} has been rejected and blocked.`);
        setTimeout(() => setSuccessMsg(''), 4000);
        setSelectedDriver(null);
        await fetchDrivers();
      }
    } catch {}
  };

  const filtered = drivers.filter(d =>
    (d.driverName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.driverEmail || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const docPlaceholders: { [key: string]: { label: string; color: string; icon: React.ReactNode } } = {
    license: { label: 'Driving License', color: '#39379e', icon: <FileText size={20} className="text-[#39379e] dark:text-[#a5b4fc]" /> },
    insurance: { label: 'Vehicle Insurance', color: '#57b78a', icon: <ShieldCheck size={20} className="text-[#57b78a]" /> },
    registration: { label: 'Vehicle Registration', color: '#e6a66f', icon: <Car size={20} className="text-[#e6a66f]" /> },
  };

  const allVerified = docVerifications.license && docVerifications.insurance && docVerifications.registration;

  const renderMockDocument = (driver: Driver, type: 'license' | 'insurance' | 'registration') => {
    if (type === 'license') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-900 text-[var(--foreground)] rounded-xl shadow-lg p-4 flex flex-col justify-between border border-indigo-400/20 font-sans tracking-wide relative select-none">
          <div className="absolute top-0 right-0 p-3 opacity-15">
            <ShieldCheck size={120} />
          </div>
          <div className="flex justify-between items-start border-b border-indigo-500/30 pb-2">
            <div>
              <p className="text-[10px] font-black tracking-widest text-indigo-200">COMMERCIAL DRIVING PERMIT</p>
              <p className="text-[8px] font-bold text-indigo-300">REPUBLIC OF GHANA</p>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-indigo-500/40 border border-indigo-400/30">CLASS C</span>
          </div>

          <div className="flex gap-4 items-center my-3">
            <div className="w-14 h-18 bg-indigo-500/20 border border-indigo-400/30 rounded flex items-center justify-center text-indigo-300 shrink-0">
              <User size={28} />
            </div>
            <div className="space-y-1 font-mono text-[9px] leading-tight">
              <p><span className="text-indigo-300 font-sans text-[8px] uppercase">Permit ID:</span> {driver.driverID}</p>
              <p><span className="text-indigo-300 font-sans text-[8px] uppercase">Holder:</span> {driver.driverName}</p>
              <p><span className="text-indigo-300 font-sans text-[8px] uppercase">Expires:</span> 2030-12-31</p>
              <p><span className="text-indigo-300 font-sans text-[8px] uppercase">Status:</span> VALID - TELEMETRY</p>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-indigo-500/30 pt-2 text-[7px] text-indigo-300 font-mono">
            <p>MINISTRY OF TRANSPORTATION</p>
            <div className="w-16 h-4 bg-white/20 rounded flex items-center justify-center text-[5px] tracking-widest font-black uppercase overflow-hidden">BARCODE SCAN</div>
          </div>
        </div>
      );
    } else if (type === 'insurance') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-900 text-[var(--foreground)] rounded-xl shadow-lg p-4 flex flex-col justify-between border border-emerald-400/20 font-sans tracking-wide relative select-none">
          <div className="absolute top-0 right-0 p-3 opacity-15">
            <Car size={120} />
          </div>
          <div className="flex justify-between items-start border-b border-emerald-500/30 pb-2">
            <div>
              <p className="text-[10px] font-black tracking-widest text-emerald-200">FLEET LIABILITY CERTIFICATE</p>
              <p className="text-[8px] font-bold text-emerald-300">STAR ALLIANCE INSURANCE</p>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-500/40 border border-emerald-400/30">INSURED</span>
          </div>

          <div className="my-3 space-y-1 font-mono text-[9px] leading-tight">
            <p><span className="text-emerald-300 font-sans text-[8px] uppercase">Policy No:</span> POL-77382-GH</p>
            <p><span className="text-emerald-300 font-sans text-[8px] uppercase">Insured:</span> {driver.driverName}</p>
            <p><span className="text-emerald-300 font-sans text-[8px] uppercase">Vehicle:</span> {driver.vehicleMenufacturer} {driver.vehicleModel} ({driver.licensePlate})</p>
            <p><span className="text-emerald-300 font-sans text-[8px] uppercase">Coverage:</span> COMPREHENSIVE PASSENGER LIABILITY</p>
          </div>

          <div className="flex justify-between items-end border-t border-emerald-500/30 pt-2 text-[7px] text-emerald-300 font-mono">
            <p>STAR MUTUAL ASSURANCE</p>
            <p className="font-sans text-[8px] font-black text-emerald-200">ACTIVE</p>
          </div>
        </div>
      );
    } else if (type === 'registration') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-amber-600 to-amber-900 text-[var(--foreground)] rounded-xl shadow-lg p-4 flex flex-col justify-between border border-amber-400/20 font-sans tracking-wide relative select-none">
          <div className="absolute top-0 right-0 p-3 opacity-15">
            <FileText size={120} />
          </div>
          <div className="flex justify-between items-start border-b border-amber-500/30 pb-2">
            <div>
              <p className="text-[10px] font-black tracking-widest text-amber-200">OFFICIAL VEHICLE LOGBOOK</p>
              <p className="text-[8px] font-bold text-amber-300">DRIVER & VEHICLE LICENSING AUTHORITY</p>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-amber-500/40 border border-amber-400/30">DVLA REG</span>
          </div>

          <div className="my-3 space-y-1 font-mono text-[9px] leading-tight">
            <p><span className="text-amber-300 font-sans text-[8px] uppercase">Owner:</span> {driver.driverName}</p>
            <p><span className="text-amber-300 font-sans text-[8px] uppercase">Chassis No:</span> CHA-{driver.driverID}-KM</p>
            <p><span className="text-amber-300 font-sans text-[8px] uppercase">Plate Make:</span> {driver.licensePlate} ({driver.vehicleYear} {driver.vehicleMenufacturer})</p>
            <p><span className="text-amber-300 font-sans text-[8px] uppercase">Logbook Code:</span> DVLA-882937-GH</p>
          </div>

          <div className="flex justify-between items-end border-t border-amber-500/30 pt-2 text-[7px] text-amber-300 font-mono">
            <p>REPUBLIC OF GHANA DVLA</p>
            <p className="font-sans text-[8px] font-black text-amber-200">REGISTERED</p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[var(--background)] text-[var(--foreground)]">
        <div className="w-10 h-10 border-4 border-[#39379e] border-t-transparent rounded-full animate-spin" />
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="p-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{getTranslation(lang, 'pending_title')}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{getTranslation(lang, 'pending_subtitle')}</p>
            {lastRefresh && <p className="text-[10px] text-[var(--text-muted)] mt-1.5 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#57b78a] rounded-full animate-pulse" /> Last Sync: {lastRefresh}</p>}
          </div>
          <div className="flex items-center gap-3">
            {drivers.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-[#fb764a]/10 border border-[#fb764a]/30 rounded-[6px]">
                <AlertTriangle size={14} className="text-[#fb764a]" />
                <span className="text-xs font-bold text-[#fb764a]">{drivers.length} Awaiting Review</span>
              </div>
            )}
            <button onClick={fetchDrivers} className="flex items-center gap-2 border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2.5 rounded-[6px] text-xs font-bold cursor-pointer text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition">
              <RefreshCw size={14} /> {getTranslation(lang, 'refresh')}
            </button>
          </div>
        </div>

        {/* Analytics Header bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Awaiting Audit', value: drivers.length, desc: 'Drivers in queue', color: '#fb764a' },
            { label: 'Avg. Audit Speed', value: '4.8 Min', desc: 'Real-time telemetry speed', color: '#39379e' },
            { label: 'Rejection Rate', value: '12%', desc: 'Database threshold', color: '#fb764a' },
            { label: 'Verified Today', value: '5 Drivers', desc: 'Approved and active', color: '#57b78a' },
          ].map((stat, i) => (
            <div key={i} className="orbit-card p-4 bg-[var(--card-bg)] border border-[var(--border-color)] flex flex-col justify-between" style={{ borderLeft: `3px solid ${stat.color}` }}>
              <div>
                <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest block">{stat.label}</span>
                <span className="text-xl font-extrabold mt-1 block text-[var(--foreground)]" style={{ color: stat.color }}>{stat.value}</span>
              </div>
              <span className="text-[9.5px] text-[var(--text-muted)] mt-1.5 block">{stat.desc}</span>
            </div>
          ))}
        </div>

        {successMsg && (
          <div className="mb-5 p-3 bg-[#57b78a]/10 border border-[#57b78a]/30 text-[#57b78a] rounded-[6px] flex items-center gap-2 text-xs font-bold animate-[fadeIn_0.2s_ease-out]">
            <CheckCircle2 size={14} /> {successMsg}
          </div>
        )}

        {/* Search */}
        <div className="orbit-card p-4 mb-5 bg-[var(--card-bg)] border border-[var(--border-color)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
            <input type="text" placeholder="Search pending drivers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="orbit-input pl-9 text-xs" />
          </div>
        </div>

        {/* Pending List */}
        {filtered.length === 0 ? (
          <div className="orbit-card p-16 text-center bg-[var(--card-bg)] border border-[var(--border-color)]">
            <CheckCircle2 size={48} className="text-[#57b78a] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[var(--foreground)]">{getTranslation(lang, 'queue_clear')}</h3>
            <p className="text-sm text-[var(--text-muted)] mt-2">All driver documents have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(driver => (
              <div key={driver.driverID} className="orbit-card p-5 bg-[var(--card-bg)] border border-[var(--border-color)] flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30 shrink-0 font-black text-lg">
                      {driver.driverName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-extrabold text-[var(--foreground)] text-sm leading-tight">{driver.driverName}</h3>
                        <span className="badge badge-warning shrink-0">{getTranslation(lang, 'awaiting_audit')}</span>
                      </div>
                      <div className="mt-1.5 space-y-1">
                        {driver.driverPhone && (
                          <p className="text-xs text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
                            <Phone size={11} className="text-indigo-600 dark:text-indigo-400" /> {driver.driverPhone}
                          </p>
                        )}
                        {driver.driverEmail && (
                          <p className="text-xs text-[var(--text-secondary)] font-semibold flex items-center gap-1.5 truncate">
                            <Mail size={11} className="text-indigo-600 dark:text-indigo-400" /> {driver.driverEmail}
                          </p>
                        )}
                        {driver.licensePlate && (
                          <p className="text-xs text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
                            <Car size={11} className="text-indigo-600 dark:text-indigo-400" /> {driver.licensePlate} • {driver.vehicleType}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Document Status Indicators */}
                  <div className="flex gap-2 mb-4">
                    {Object.entries(docPlaceholders).map(([key, doc]) => (
                      <div key={key} className="flex-1 text-center p-2.5 border border-[var(--border-color)] rounded-[6px] bg-[var(--hover-bg)]/20">
                        <div className="flex justify-center mb-1">{doc.icon}</div>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{doc.label.split(' ')[1] || doc.label}</p>
                        <span className="text-[9px] text-[#57b78a] font-bold tracking-wider mt-1 block">Uploaded</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t border-[var(--border-color)] pt-3.5">
                  <button
                    onClick={() => handleOpenAuditModal(driver)}
                    className="flex-1 py-2 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-[6px] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Eye size={13} /> {getTranslation(lang, 'view')}
                  </button>
                  <button
                    onClick={() => handleApprove(driver)}
                    className="flex-1 py-2 bg-[#57b78a]/10 border border-[#57b78a]/30 text-[#57b78a] rounded-[6px] text-xs font-bold hover:bg-[#57b78a]/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={13} /> {getTranslation(lang, 'verify_approve')}
                  </button>
                  <button
                    onClick={() => handleReject(driver)}
                    className="py-2 px-3 bg-[#fb764a]/10 border border-[#fb764a]/30 text-[#fb764a] rounded-[6px] text-xs font-bold hover:bg-[#fb764a]/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDriver && (
        <>
          <div className="fixed inset-0 bg-[var(--card-bg)]/60 z-40 backdrop-blur-sm" onClick={() => setSelectedDriver(null)} />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--hover-bg)]/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-[#39379e] dark:text-[#a5b4fc]" />
                  <div>
                    <h3 className="font-extrabold text-[var(--foreground)] text-sm uppercase tracking-wider">Document Audit Console</h3>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Auditing: {selectedDriver.driverName} ({selectedDriver.driverID})</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDriver(null)} className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg cursor-pointer text-[var(--text-muted)] hover:text-[var(--foreground)] transition"><X size={16} /></button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Left Side: Document Preview & Checklist */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {(['license', 'insurance', 'registration'] as const).map(tab => {
                      const doc = docPlaceholders[tab];
                      const isVerified = docVerifications[tab];
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveDocTab(tab)}
                          className={`flex-1 py-2 px-1 rounded-lg text-[10px] font-extrabold border transition cursor-pointer flex flex-col items-center gap-1 ${activeDocTab === tab ? 'border-[#39379e] bg-indigo-50 dark:bg-indigo-950/40 text-[#39379e] dark:text-[#a5b4fc]' : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] bg-[var(--card-bg)]'} relative`}
                        >
                          {doc.icon}
                          <span>{doc.label.split(' ')[1] || doc.label}</span>
                          {isVerified && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-[var(--foreground)] text-[8px] font-black rounded-full flex items-center justify-center border border-white">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Document Live Preview */}
                  <div className="relative h-64 border border-[var(--border-color)] rounded-xl bg-[var(--hover-bg)]/20 flex items-center justify-center overflow-hidden shadow-inner p-4">
                    {/* Render high-fidelity mock document */}
                    {renderMockDocument(selectedDriver, activeDocTab)}

                    {/* Scan line animation */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#39379e]/40 dark:via-[#888fdf]/40 to-transparent animate-scan pointer-events-none" style={{ position: 'absolute' }} />
                  </div>

                  {/* Checklist Switch */}
                  <div className="p-4 bg-[var(--hover-bg)]/40 border border-[var(--border-color)] rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wide">Document Verification</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-medium">Verify authenticity and readability of this document</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={docVerifications[activeDocTab]} 
                          onChange={(e) => setDocVerifications(prev => ({ ...prev, [activeDocTab]: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-10 h-5.5 bg-slate-200 dark:bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-emerald-500"></div>
                        <span className="ml-2.5 text-[10px] font-extrabold uppercase text-[var(--text-secondary)] peer-checked:text-emerald-500">
                          {docVerifications[activeDocTab] ? 'Verified' : 'Verify'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Side: Driver & Vehicle Details Grid */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2 flex items-center gap-1.5">
                    <User size={14} className="text-[#39379e] dark:text-[#a5b4fc]" />
                    Associated Profile Parameters
                  </h4>
                  <div className="grid grid-cols-2 gap-3 font-semibold">
                    {[
                      { label: 'Full Name', value: selectedDriver.driverName },
                      { label: 'Phone', value: selectedDriver.driverPhone },
                      { label: 'Email Address', value: selectedDriver.driverEmail },
                      { label: 'License Plate', value: selectedDriver.licensePlate },
                      { label: 'Vehicle Type', value: selectedDriver.vehicleType },
                      { label: 'Vehicle Make', value: selectedDriver.vehicleMenufacturer },
                      { label: 'Vehicle Model', value: selectedDriver.vehicleModel },
                      { label: 'Vehicle Year', value: selectedDriver.vehicleYear },
                    ].map(({ label, value }) => (
                      <div key={label} className="border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] p-3">
                        <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold block">{label}</span>
                        <span className="font-extrabold text-[var(--foreground)] mt-1 block text-xs">{value || '—'}</span>
                      </div>
                    ))}
                  </div>

                  {/* Audit Checklist Progress Bar */}
                  <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--hover-bg)]/20 space-y-2">
                    <div className="flex justify-between text-[10px] font-extrabold uppercase text-[var(--text-secondary)]">
                      <span>Verification Progress</span>
                      <span className={allVerified ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}>
                        {Object.values(docVerifications).filter(Boolean).length}/3 Documents Verified
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-[var(--border-color)] rounded-full h-2 overflow-hidden shadow-inner">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${allVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${(Object.values(docVerifications).filter(Boolean).length / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--hover-bg)]/20 flex gap-3 justify-end shrink-0">
                <button onClick={() => { handleReject(selectedDriver); }} className="px-4 py-2 border border-[#fb764a]/30 bg-[#fb764a]/10 hover:bg-[#fb764a]/20 text-[#fb764a] rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1.5">
                  <XCircle size={14} /> {getTranslation(lang, 'reject_block')}
                </button>
                <button 
                  onClick={() => { handleApprove(selectedDriver); }} 
                  disabled={!allVerified}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-[var(--border-color)] disabled:text-[var(--text-muted)] dark:disabled:text-slate-600 disabled:cursor-not-allowed text-[var(--foreground)] rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow-md disabled:shadow-none"
                >
                  <CheckCircle2 size={14} /> {getTranslation(lang, 'verify_approve')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}
