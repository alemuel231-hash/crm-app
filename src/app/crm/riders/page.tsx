'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  X,
  User,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { LangType } from '@/lib/i18n';
import AccountDetailModal, { buildRiderSections } from '@/components/ui/AccountDetailModal';

interface Rider {
  riderID: string;
  riderName: string;
  riderEmail: string;
  riderPhone: string;
  riderCity?: string;
  blocked?: boolean;
  active?: boolean;
}

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [lang, setLang] = useState<LangType>('EN');

  // Modals
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [viewDetailRider, setViewDetailRider] = useState<any | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRider, setEditingRider] = useState<Rider | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    riderName: '',
    riderEmail: '',
    riderPhone: '',
    riderCity: '',
    blocked: false
  });

  const fetchRiders = async () => {
    try {
      const res = await fetch('/api/riders').then(r => r.json()).catch(() => []);
      const ridersData = Array.isArray(res) ? res : res.riders || [];
      
      setRiders(ridersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching riders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedLang = (localStorage.getItem('lang') || 'EN') as LangType;
    setLang(savedLang);
    fetchRiders();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      riderName: '',
      riderEmail: '',
      riderPhone: '',
      riderCity: '',
      blocked: false
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (rider: Rider) => {
    setEditingRider(rider);
    setFormData({
      riderName: rider.riderName || '',
      riderEmail: rider.riderEmail || '',
      riderPhone: rider.riderPhone || '',
      riderCity: rider.riderCity || '',
      blocked: rider.blocked || false
    });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.riderName || !formData.riderEmail || !formData.riderPhone) return;

    const newRider = {
      riderID: `RID${Math.floor(100 + Math.random() * 900)}`,
      riderName: formData.riderName,
      riderEmail: formData.riderEmail,
      riderPhone: formData.riderPhone,
      riderCity: formData.riderCity || 'N/A',
      blocked: formData.blocked
    };

    try {
      const res = await fetch('/api/riders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRider),
      });
      if (res.ok) {
        const result = await res.json();
        setRiders(prev => [result.rider, ...prev]);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Failed to add rider', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRider) return;

    const updates = {
      riderID: editingRider.riderID,
      riderName: formData.riderName,
      riderEmail: formData.riderEmail,
      riderPhone: formData.riderPhone,
      riderCity: formData.riderCity,
      blocked: formData.blocked
    };

    try {
      const res = await fetch('/api/riders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setRiders(prev => prev.map(r => {
          if (r.riderID === editingRider.riderID) {
            return { ...r, ...updates };
          }
          return r;
        }));
        setEditingRider(null);
      }
    } catch (error) {
      console.error('Failed to update rider', error);
    }
  };

  const filteredRiders = riders.filter((rider) => {
    const matchesSearch =
      rider.riderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.riderEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.riderPhone?.includes(searchQuery);

    if (filterStatus === 'active') {
      return matchesSearch && !rider.blocked;
    } else if (filterStatus === 'inactive') {
      return matchesSearch && rider.blocked;
    }

    return matchesSearch;
  });

  const getStatusBadge = (rider: Rider) => {
    if (rider.blocked) {
      return (
        <span className="badge badge-danger inline-flex items-center gap-1">
          <XCircle size={12} />
          Blocked
        </span>
      );
    }
    return (
      <span className="badge badge-success inline-flex items-center gap-1">
        <CheckCircle size={12} />
        Active
      </span>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39379e]"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Riders</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">Manage and monitor all riders</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="orbit-btn-primary flex items-center gap-2 px-4 py-2 bg-[#39379e] hover:bg-[#2f2d8c]"
          >
            <Plus size={16} />
            Add Rider
          </button>
        </div>

        {/* Filters and Search */}
        <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Box */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 text-[var(--text-muted)]" size={16} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="orbit-input w-full pl-10 pr-4 py-2 text-xs"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-1.5 flex-wrap sm:flex-nowrap">
              {['all', 'active', 'inactive'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                    filterStatus === status
                      ? 'bg-[#39379e] text-white shadow-md'
                      : 'bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]/80'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Riders Table */}
        <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="orbit-table w-full">
              <thead>
                <tr>
                  <th>Rider ID</th>
                  <th>Rider Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredRiders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-[var(--text-muted)] text-xs font-semibold">
                      No riders found
                    </td>
                  </tr>
                ) : (
                  filteredRiders.map((rider) => (
                    <tr key={rider.riderID} className="hover:bg-[var(--hover-bg)]/50 transition">
                      <td className="font-mono text-[11px] text-[var(--text-secondary)]">{rider.riderID}</td>
                      <td className="font-bold text-[var(--foreground)]">{rider.riderName}</td>
                      <td className="text-[var(--text-secondary)]">{rider.riderEmail}</td>
                      <td className="text-[var(--text-secondary)] font-mono">{rider.riderPhone}</td>
                      <td className="text-[var(--text-secondary)]">{rider.riderCity || 'N/A'}</td>
                      <td>{getStatusBadge(rider)}</td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewDetailRider(rider)}
                            className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg transition text-[var(--text-secondary)] hover:text-[#39379e]"
                            title="View Account Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(rider)}
                            className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg transition text-[var(--text-secondary)] hover:text-indigo-500"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(rider.riderID)}
                            className="p-1.5 hover:bg-red-500/10 rounded-lg transition text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--hover-bg)]/10 flex items-center justify-between text-xs text-[var(--text-muted)] font-semibold">
            <span>Showing {filteredRiders.length} of {riders.length} riders</span>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--hover-bg)]/30 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
                  <Plus size={16} className="text-[#39379e]" /> Add New Rider Profile
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Rider Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.riderName}
                      onChange={e => setFormData({ ...formData, riderName: e.target.value })}
                      placeholder="e.g. Alice Johnson"
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.riderEmail}
                      onChange={e => setFormData({ ...formData, riderEmail: e.target.value })}
                      placeholder="e.g. alice@example.com"
                      className="orbit-input w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.riderPhone}
                      onChange={e => setFormData({ ...formData, riderPhone: e.target.value })}
                      placeholder="e.g. +233 24 999 8888"
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">City</label>
                    <input
                      type="text"
                      value={formData.riderCity}
                      onChange={e => setFormData({ ...formData, riderCity: e.target.value })}
                      placeholder="e.g. Accra"
                      className="orbit-input w-full"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-[var(--border-color)] bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]/80 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#39379e] hover:bg-[#2f2d8c] text-white rounded-lg transition font-bold"
                  >
                    Add Rider
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingRider && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--hover-bg)]/30 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
                  <Edit size={16} className="text-[#39379e]" /> Edit Rider: {editingRider.riderName}
                </h3>
                <button onClick={() => setEditingRider(null)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Rider Name</label>
                    <input
                      type="text"
                      required
                      value={formData.riderName}
                      onChange={e => setFormData({ ...formData, riderName: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.riderEmail}
                      onChange={e => setFormData({ ...formData, riderEmail: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.riderPhone}
                      onChange={e => setFormData({ ...formData, riderPhone: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">City</label>
                    <input
                      type="text"
                      value={formData.riderCity}
                      onChange={e => setFormData({ ...formData, riderCity: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                </div>

                <div className="flex gap-4 border-t border-[var(--border-color)] pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.blocked}
                      onChange={e => setFormData({ ...formData, blocked: e.target.checked })}
                      className="rounded border-[var(--border-color)] bg-[var(--background)] text-[#39379e] focus:ring-[#39379e]"
                    />
                    <span className="text-xs text-red-500">Block Rider Account</span>
                  </label>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => setEditingRider(null)}
                    className="px-4 py-2 border border-[var(--border-color)] bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]/80 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#39379e] hover:bg-[#2f2d8c] text-white rounded-lg transition font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* BetterSuite-style Account Detail Modal */}
        <AccountDetailModal
          open={!!viewDetailRider}
          onClose={() => setViewDetailRider(null)}
          config={viewDetailRider ? {
            entityType: 'rider',
            accent: 'emerald',
            initials: (viewDetailRider.name || viewDetailRider.riderName || 'RI').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
            name: viewDetailRider.name || viewDetailRider.riderName || 'Unknown Rider',
            subtitle: viewDetailRider.id || viewDetailRider.riderID || '',
            statusBadge: getStatusBadge ? getStatusBadge(viewDetailRider) : undefined,
            metaPills: [
              { label: 'Member since', value: 'Recently' },
              { label: 'Total trips', value: String(viewDetailRider.total_rides || viewDetailRider.totalRides || '—') },
            ],
            sections: buildRiderSections({
              id: viewDetailRider.id || viewDetailRider.riderID,
              name: viewDetailRider.name || viewDetailRider.riderName,
              email: viewDetailRider.email || viewDetailRider.riderEmail,
              phone: viewDetailRider.phone || viewDetailRider.riderPhone,
              address: viewDetailRider.address,
              created_at: viewDetailRider.created_at,
              total_rides: viewDetailRider.total_rides || viewDetailRider.totalRides,
            }),
          } : { entityType: 'rider', accent: 'emerald', initials: '--', name: '', sections: [] }}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
              <div className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-2 flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-500" /> Delete Rider Account?
                </h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">This action cannot be undone. The rider profile will be permanently removed.</p>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const idToDelete = showDeleteConfirm;
                      if (!idToDelete) return;
                      try {
                        const res = await fetch(`/api/riders?id=${idToDelete}`, { method: 'DELETE' });
                        if (res.ok) {
                          setRiders(prev => prev.filter(r => r.riderID !== idToDelete));
                          setShowDeleteConfirm(null);
                        }
                      } catch (error) {
                        console.error('Failed to delete rider', error);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-[var(--foreground)] rounded-lg text-xs font-bold transition"
                  >
                    Delete Rider
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-[var(--border-color)] bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]/80 rounded-lg text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
