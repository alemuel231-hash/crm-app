'use client';
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Filter, Clock, UserCheck, ShieldAlert } from 'lucide-react';

export default function PipelinePage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/drivers').then(r => r.json()).then(data => {
      setDrivers(data.drivers || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const pending = drivers.filter((d: any) => !d.document_uploaded && !d.blocked);
  const approved = drivers.filter((d: any) => d.document_uploaded && !d.blocked);
  const blocked = drivers.filter((d: any) => d.blocked);

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
        <div className="flex items-center gap-3 orbit-card bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <Filter className="text-[#39379e] w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Driver Onboarding Pipeline</h1>
            <p className="text-[var(--text-muted)] text-xs mt-1">Manage applicants through the verification stages.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b border-[var(--border-color)] bg-yellow-500/10 flex justify-between items-center">
              <h3 className="font-bold text-yellow-700 dark:text-yellow-500 flex items-center gap-2"><Clock size={18}/> Pending Docs</h3>
              <span className="badge badge-warning font-bold">{pending.length}</span>
            </div>
            <div className="p-4 space-y-4 flex-1">
              {pending.map((d: any) => (
                <div key={d.driverID} className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] hover:border-yellow-500/50 transition">
                  <h4 className="text-[var(--foreground)] font-bold">{d.driverName || 'No Name'}</h4>
                  <p className="text-sm text-[var(--text-muted)]">{d.driverPhone}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b border-[var(--border-color)] bg-green-500/10 flex justify-between items-center">
              <h3 className="font-bold text-green-700 dark:text-green-500 flex items-center gap-2"><UserCheck size={18}/> Approved</h3>
              <span className="badge badge-success font-bold">{approved.length}</span>
            </div>
            <div className="p-4 space-y-4 flex-1">
              {approved.map((d: any) => (
                <div key={d.driverID} className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] hover:border-green-500/50 transition">
                  <h4 className="text-[var(--foreground)] font-bold">{d.driverName || 'No Name'}</h4>
                  <p className="text-sm text-[var(--text-muted)]">{d.driverPhone}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b border-[var(--border-color)] bg-red-500/10 flex justify-between items-center">
              <h3 className="font-bold text-red-700 dark:text-red-500 flex items-center gap-2"><ShieldAlert size={18}/> Blocked</h3>
              <span className="badge badge-danger font-bold">{blocked.length}</span>
            </div>
            <div className="p-4 space-y-4 flex-1">
              {blocked.map((d: any) => (
                <div key={d.driverID} className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] hover:border-red-500/50 transition">
                  <h4 className="text-[var(--foreground)] font-bold">{d.driverName || 'No Name'}</h4>
                  <p className="text-sm text-[var(--text-muted)]">{d.driverPhone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}