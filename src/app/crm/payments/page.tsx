'use client';
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function PaymentsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trips').then(r => r.json()).then(data => {
      setTrips(data.trips || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
        <div className="flex items-center gap-3 orbit-card bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <CreditCard className="text-[#39379e] w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Trip Payments</h1>
            <p className="text-[var(--text-muted)] text-xs mt-1">Payment statuses for all completed ride requests.</p>
          </div>
        </div>

        <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
          <table className="orbit-table w-full">
            <thead>
              <tr>
                <th className="text-left">Trip ID</th>
                <th className="text-left">Customer</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Method</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-[var(--text-muted)] text-xs font-semibold">Loading payments...</td></tr>
              ) : trips.map((t: any) => (
                <tr key={t.tripID || Math.random()} className="hover:bg-[var(--hover-bg)] transition">
                  <td className="p-4 text-[var(--text-muted)] text-sm font-mono">{t.tripID?.substring(0,8) || 'N/A'}</td>
                  <td className="p-4 text-[var(--foreground)] font-medium">{t.rider_name || 'Unknown'}</td>
                  <td className="p-4 text-emerald-600 dark:text-emerald-500 font-bold">GHS {Number(t.tripCost || 0).toFixed(2)}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{t.payment_method || 'Cash'}</td>
                  <td className="p-4">
                    <span className={`badge inline-flex items-center gap-1 ${t.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                      {t.paymentStatus === 'paid' ? <CheckCircle size={12}/> : <AlertCircle size={12}/>}
                      {t.paymentStatus || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
