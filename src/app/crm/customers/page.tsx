'use client';
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Search, Users, MapPin, Activity } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/riders').then(r => r.json()).then(data => {
      setCustomers(data.riders || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
        <div className="flex items-center gap-3 orbit-card bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <Users className="text-[#39379e] w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Customers (Riders)</h1>
            <p className="text-[var(--text-muted)] text-xs mt-1">Ride-hailing user directory linked to your database.</p>
          </div>
        </div>

        <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
          <table className="orbit-table w-full">
            <thead>
              <tr>
                <th className="text-left">Customer Name</th>
                <th className="text-left">Contact</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                <tr><td colSpan={3} className="p-8 text-center text-[var(--text-muted)] text-xs font-semibold">Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-[var(--text-muted)] text-xs font-semibold">No customers found.</td></tr>
              ) : customers.map((c: any) => (
                <tr key={c.riderID || Math.random()} className="hover:bg-[var(--hover-bg)] transition">
                  <td className="p-4 text-[var(--foreground)] font-medium">{c.riderName || 'Unknown User'}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{c.riderPhone || 'No phone'} <br/> <span className="text-xs text-[var(--text-muted)]">{c.riderEmail}</span></td>
                  <td className="p-4">
                    <span className={`badge inline-flex items-center gap-1 ${c.blocked ? 'badge-danger' : 'badge-success'}`}>
                      {c.blocked ? 'Blocked' : 'Active'}
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