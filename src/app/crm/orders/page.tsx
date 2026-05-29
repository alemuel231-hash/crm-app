'use client';
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ShoppingCart, MapPin, Clock } from 'lucide-react';

export default function OrdersPage() {
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
          <ShoppingCart className="text-[#39379e] w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Ride Orders (Trips)</h1>
            <p className="text-[var(--text-muted)] text-xs mt-1">Real-time overview of customer trip requests.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full p-8 text-center text-[var(--text-muted)] text-xs font-semibold">Loading orders...</div>
          ) : trips.map((t: any) => (
            <div key={t.tripID || Math.random()} className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 hover:border-[#39379e]/50 transition shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className={`badge ${t.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'} uppercase font-bold text-[10px]`}>{t.paymentStatus || 'Pending'}</span>
                <span className="text-[var(--text-muted)] text-xs flex items-center gap-1"><Clock size={12}/> {new Date(t.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">{t.rider_name || 'Guest Rider'}</h3>
              
              <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border-color)] before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[var(--background)] bg-emerald-500 text-white shrink-0 shadow z-10"></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-2 rounded border border-[var(--border-color)] bg-[var(--background)]">
                    <p className="text-xs text-[var(--foreground)] truncate">{t.pickup_address}</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[var(--background)] bg-red-500 text-white shrink-0 shadow z-10"></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-2 rounded border border-[var(--border-color)] bg-[var(--background)]">
                    <p className="text-xs text-[var(--foreground)] truncate">{t.destination_address}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 pt-4 border-t border-[var(--border-color)] flex justify-between items-center">
                <span className="text-[var(--text-muted)] text-sm font-semibold uppercase">Fare</span>
                <span className="text-[var(--foreground)] font-bold text-xl">GHS {parseFloat(t.tripCost || 0).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
