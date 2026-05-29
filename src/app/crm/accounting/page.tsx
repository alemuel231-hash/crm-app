'use client';
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { DollarSign, TrendingUp, CreditCard, Banknote } from 'lucide-react';

export default function AccountingPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trips').then(r => r.json()).then(data => {
      setTrips(data.trips || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalRevenue = trips.reduce((acc: number, t: any) => acc + (parseFloat(t.tripCost) || 0), 0);
  const cashTrips = trips.filter((t: any) => t.payment_method?.toLowerCase() === 'cash');
  const cardTrips = trips.filter((t: any) => t.payment_method?.toLowerCase() !== 'cash');
  const cashRevenue = cashTrips.reduce((acc: number, t: any) => acc + (parseFloat(t.tripCost) || 0), 0);

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
        <div className="flex items-center gap-3 orbit-card bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <TrendingUp className="text-[#39379e] w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Ride Accounting</h1>
            <p className="text-[var(--text-muted)] text-xs mt-1">Revenue analytics derived from live trip data.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl"><DollarSign className="text-blue-500" /></div>
              <div>
                <p className="text-[var(--text-muted)] text-sm font-semibold uppercase tracking-wider">Total Trip Revenue</p>
                <h3 className="text-2xl font-bold text-[var(--foreground)]">GHS {totalRevenue.toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl"><Banknote className="text-emerald-500" /></div>
              <div>
                <p className="text-[var(--text-muted)] text-sm font-semibold uppercase tracking-wider">Cash Revenue</p>
                <h3 className="text-2xl font-bold text-[var(--foreground)]">GHS {cashRevenue.toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl"><CreditCard className="text-purple-500" /></div>
              <div>
                <p className="text-[var(--text-muted)] text-sm font-semibold uppercase tracking-wider">Card/Digital Revenue</p>
                <h3 className="text-2xl font-bold text-[var(--foreground)]">GHS {(totalRevenue - cashRevenue).toFixed(2)}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
