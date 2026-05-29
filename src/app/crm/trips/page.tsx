'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  X,
  Compass,
  DollarSign,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
} from 'lucide-react';
import { LangType } from '@/lib/i18n';
import AccountDetailModal, { buildTripSections } from '@/components/ui/AccountDetailModal';

interface Trip {
  tripID: string;
  riderName: string;
  driverName?: string;
  pickupAddress?: string;
  pickup_address?: string;
  destinationAddress?: string;
  destination_address?: string;
  tripCost?: number;
  fare?: number;
  status: string;
  date?: string;
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [lang, setLang] = useState<LangType>('EN');
  
  // Modals
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [viewDetailTrip, setViewDetailTrip] = useState<any | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    riderName: '',
    driverName: '',
    pickupAddress: '',
    destinationAddress: '',
    tripCost: '',
    status: 'pending',
    date: ''
  });

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips').then(r => r.json()).catch(() => []);
      const tripsData = Array.isArray(res) ? res : res.trips || res.data || [];
      
      setTrips(tripsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedLang = (localStorage.getItem('lang') || 'EN') as LangType;
    setLang(savedLang);
    fetchTrips();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      riderName: '',
      driverName: '',
      pickupAddress: '',
      destinationAddress: '',
      tripCost: '',
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      riderName: trip.riderName || '',
      driverName: trip.driverName || 'N/A',
      pickupAddress: trip.pickupAddress || trip.pickup_address || '',
      destinationAddress: trip.destinationAddress || trip.destination_address || '',
      tripCost: String(trip.tripCost || trip.fare || 0),
      status: trip.status || 'pending',
      date: trip.date || new Date().toISOString().split('T')[0]
    });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.riderName || !formData.pickupAddress || !formData.destinationAddress) return;

    const newTrip = {
      rider_name: formData.riderName,
      driverID: formData.driverName,
      pickup_address: formData.pickupAddress,
      destination_address: formData.destinationAddress,
      tripCost: parseFloat(formData.tripCost) || 0,
      paymentStatus: formData.status,
      created_at: formData.date
    };

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrip),
      });
      if (res.ok) {
        const result = await res.json();
        setTrips(prev => [result.trip, ...prev]);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Failed to add trip', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrip) return;

    const updates = {
      tripID: editingTrip.tripID,
      rider_name: formData.riderName,
      driverID: formData.driverName,
      pickup_address: formData.pickupAddress,
      destination_address: formData.destinationAddress,
      tripCost: parseFloat(formData.tripCost) || 0,
      paymentStatus: formData.status,
      created_at: formData.date
    };

    try {
      const res = await fetch('/api/trips', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (res.ok) {
        setTrips(prev => prev.map(t => {
          if (t.tripID === editingTrip.tripID) {
            return { ...t, ...updates };
          }
          return t;
        }));
        setEditingTrip(null);
      }
    } catch (error) {
      console.error('Failed to update trip', error);
    }
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      (trip.riderName || '')?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.pickupAddress || trip.pickup_address || '')?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.destinationAddress || trip.destination_address || '')?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'active') {
      return matchesSearch && (trip.status === 'active' || trip.status === 'in-progress');
    } else if (filterStatus === 'completed') {
      return matchesSearch && trip.status === 'completed';
    } else if (filterStatus === 'cancelled') {
      return matchesSearch && trip.status === 'cancelled';
    }

    return matchesSearch;
  });

  const getStatusBadge = (trip: Trip) => {
    const status = trip.status || 'pending';
    if (status.toLowerCase() === 'completed') {
      return (
        <span className="badge badge-success inline-flex items-center gap-1">
          <CheckCircle size={12} />
          Completed
        </span>
      );
    } else if (status.toLowerCase() === 'cancelled') {
      return (
        <span className="badge badge-danger inline-flex items-center gap-1">
          <XCircle size={12} />
          Cancelled
        </span>
      );
    } else if (status.toLowerCase() === 'active' || status.toLowerCase() === 'in-progress') {
      return (
        <span className="badge badge-primary inline-flex items-center gap-1">
          <Activity size={12} />
          Active
        </span>
      );
    }
    return (
      <span className="badge badge-warning inline-flex items-center gap-1">
        <AlertCircle size={12} />
        Pending
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
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Trips</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">Track and manage all ride trips</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="orbit-btn-primary flex items-center gap-2 px-4 py-2 bg-[#39379e] hover:bg-[#2f2d8c]"
          >
            <Plus size={16} />
            New Trip
          </button>
        </div>

        {/* Filters and Search */}
        <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 text-[var(--text-muted)]" size={16} />
              <input
                type="text"
                placeholder="Search by rider, pickup, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="orbit-input w-full pl-10 pr-4 py-2 text-xs"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap sm:flex-nowrap">
              {['all', 'active', 'completed', 'cancelled'].map((status) => (
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

        {/* Trips Table */}
        <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="orbit-table w-full">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Rider</th>
                  <th>Driver</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-[var(--text-muted)] text-xs font-semibold">
                      No trips found
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map((trip, idx) => (
                    <tr key={trip.tripID || idx} className="hover:bg-[var(--hover-bg)]/50 transition">
                      <td className="font-mono text-[11px] text-[var(--text-secondary)]">{trip.tripID || `TRP${idx}`}</td>
                      <td className="font-bold text-[var(--foreground)]">{trip.riderName || 'N/A'}</td>
                      <td className="text-[var(--text-secondary)]">{trip.driverName || 'N/A'}</td>
                      <td className="text-[var(--text-secondary)] max-w-xs truncate">
                        <div className="flex items-center gap-1">
                          <MapPin size={13} className="text-[#39379e] flex-shrink-0" />
                          {trip.pickupAddress || trip.pickup_address || 'N/A'}
                        </div>
                      </td>
                      <td className="text-[var(--text-secondary)] max-w-xs truncate">
                        <div className="flex items-center gap-1">
                          <MapPin size={13} className="text-[#39379e] flex-shrink-0" />
                          {trip.destinationAddress || trip.destination_address || 'N/A'}
                        </div>
                      </td>
                      <td className="font-bold text-[var(--foreground)] font-mono">
                        GHS ${parseFloat(trip.tripCost || trip.fare || 0).toFixed(2)}
                      </td>
                      <td>{getStatusBadge(trip)}</td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewDetailTrip(trip)}
                            className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg transition text-[var(--text-secondary)] hover:text-[#39379e]"
                            title="View Trip Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(trip)}
                            className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg transition text-[var(--text-secondary)] hover:text-indigo-500"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(trip.tripID)}
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
          <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--hover-bg)]/10 flex items-center justify-between text-xs text-[var(--text-muted)] font-semibold">
            <span>Showing {filteredTrips.length} of {trips.length} trips</span>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--hover-bg)]/30 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
                  <Compass size={16} className="text-[#39379e]" /> Dispatch New Trip
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
                      placeholder="e.g. Nana Yaw"
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Assigned Driver</label>
                    <input
                      type="text"
                      value={formData.driverName}
                      onChange={e => setFormData({ ...formData, driverName: e.target.value })}
                      placeholder="e.g. Robert K. (Optional)"
                      className="orbit-input w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Pickup Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.pickupAddress}
                    onChange={e => setFormData({ ...formData, pickupAddress: e.target.value })}
                    placeholder="e.g. Kotoka Intl Airport"
                    className="orbit-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Destination Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.destinationAddress}
                    onChange={e => setFormData({ ...formData, destinationAddress: e.target.value })}
                    placeholder="e.g. Osu Oxford Street"
                    className="orbit-input w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Trip Cost (GHS </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.tripCost}
                      onChange={e => setFormData({ ...formData, tripCost: e.target.value })}
                      placeholder="e.g. 120.00"
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Trip Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="orbit-input w-full"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
                    Dispatch Trip
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingTrip && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--hover-bg)]/30 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
                  <Edit size={16} className="text-[#39379e]" /> Edit Trip ID: {editingTrip.tripID}
                </h3>
                <button onClick={() => setEditingTrip(null)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
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
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Driver Name</label>
                    <input
                      type="text"
                      value={formData.driverName}
                      onChange={e => setFormData({ ...formData, driverName: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Pickup Address</label>
                  <input
                    type="text"
                    required
                    value={formData.pickupAddress}
                    onChange={e => setFormData({ ...formData, pickupAddress: e.target.value })}
                    className="orbit-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Destination Address</label>
                  <input
                    type="text"
                    required
                    value={formData.destinationAddress}
                    onChange={e => setFormData({ ...formData, destinationAddress: e.target.value })}
                    className="orbit-input w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Trip Cost (GHS </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.tripCost}
                      onChange={e => setFormData({ ...formData, tripCost: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Trip Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="orbit-input w-full"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => setEditingTrip(null)}
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
          open={!!viewDetailTrip}
          onClose={() => setViewDetailTrip(null)}
          config={viewDetailTrip ? {
            entityType: 'trip',
            accent: 'emerald',
            initials: (viewDetailTrip.rider_name || viewDetailTrip.riderName || viewDetailTrip.customer_name || 'TR').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
            name: `Trip #${viewDetailTrip.id || viewDetailTrip.tripID || 'N/A'}`,
            subtitle: viewDetailTrip.rider_name || viewDetailTrip.riderName || viewDetailTrip.customer_name || '',
            statusBadge: typeof getStatusBadge === 'function' ? getStatusBadge(viewDetailTrip) : undefined,
            metaPills: [
              { label: 'Fare', value: viewDetailTrip.fare ? `GHS ${viewDetailTrip.fare}` : '—' },
              { label: 'Date', value: viewDetailTrip.created_at || viewDetailTrip.date || 'Recently' },
            ],
            sections: buildTripSections({
              id: String(viewDetailTrip.id || viewDetailTrip.tripID || ''),
              rider_name: viewDetailTrip.rider_name || viewDetailTrip.riderName || viewDetailTrip.customer_name,
              driver_name: viewDetailTrip.driver_name || viewDetailTrip.driverName,
              pickup_address: viewDetailTrip.pickup_address || viewDetailTrip.pickup || viewDetailTrip.from,
              dropoff_address: viewDetailTrip.dropoff_address || viewDetailTrip.destination || viewDetailTrip.to,
              fare: viewDetailTrip.fare,
              status: viewDetailTrip.status,
              distance: viewDetailTrip.distance,
              created_at: viewDetailTrip.created_at || viewDetailTrip.date,
              payment_method: viewDetailTrip.payment_method,
              rating: viewDetailTrip.rating,
            }),
          } : { entityType: 'trip', accent: 'emerald', initials: '--', name: '', sections: [] }}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
              <div className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-2 flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-500" /> Delete Trip Record?
                </h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">This action cannot be undone. The trip record will be permanently removed.</p>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const idToDelete = showDeleteConfirm;
                      if (!idToDelete) return;
                      try {
                        const res = await fetch(`/api/trips?id=${idToDelete}`, { method: 'DELETE' });
                        if (res.ok) {
                          setTrips(prev => prev.filter(t => (t.tripID || (t as any).id) !== idToDelete));
                          setShowDeleteConfirm(null);
                        }
                      } catch (error) {
                        console.error('Failed to delete trip', error);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-[var(--foreground)] rounded-lg text-xs font-bold transition"
                  >
                    Delete Trip
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
