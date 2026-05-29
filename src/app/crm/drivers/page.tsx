'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Car,
  CheckCircle,
  AlertCircle,
  XCircle,
  X,
  User,
  Mail,
  Phone,
  Layers,
  Activity,
} from 'lucide-react';
import { getTranslation, LangType } from '@/lib/i18n';
import AccountDetailModal, { buildDriverSections } from '@/components/ui/AccountDetailModal';

interface Driver {
  driverID: string;
  driverName: string;
  driverEmail: string;
  driverPhone: string;
  vehicleModel?: string;
  vehicleColor?: string;
  licensePlate?: string;
  blocked?: boolean;
  document_uploaded?: boolean;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'blocked'>('all');
  const [lang, setLang] = useState<LangType>('EN');
  
  // Modal states
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [viewDetailDriver, setViewDetailDriver] = useState<Driver | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    driverName: '',
    driverEmail: '',
    driverPhone: '',
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: '',
    document_uploaded: false,
    blocked: false
  });

  const fetchDrivers = async () => {
    try {
      const res = await fetch('/api/drivers').then(r => r.json()).catch(() => []);
      setDrivers(Array.isArray(res) ? res : res.drivers || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedLang = (localStorage.getItem('lang') || 'EN') as LangType;
    setLang(savedLang);
    fetchDrivers();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      driverName: '',
      driverEmail: '',
      driverPhone: '',
      vehicleModel: '',
      vehicleColor: '',
      licensePlate: '',
      document_uploaded: false,
      blocked: false
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      driverName: driver.driverName || '',
      driverEmail: driver.driverEmail || '',
      driverPhone: driver.driverPhone || '',
      vehicleModel: driver.vehicleModel || '',
      vehicleColor: driver.vehicleColor || '',
      licensePlate: driver.licensePlate || '',
      document_uploaded: driver.document_uploaded || false,
      blocked: driver.blocked || false
    });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.driverName || !formData.driverEmail || !formData.driverPhone) return;

    const newDriver: Driver = {
      driverID: `DRV${Math.floor(100 + Math.random() * 900)}`,
      driverName: formData.driverName,
      driverEmail: formData.driverEmail,
      driverPhone: formData.driverPhone,
      vehicleModel: formData.vehicleModel || 'N/A',
      vehicleColor: formData.vehicleColor || 'N/A',
      licensePlate: formData.licensePlate || 'N/A',
      blocked: formData.blocked,
      document_uploaded: formData.document_uploaded
    };

    try {
      const res = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriver),
      });
      if (res.ok) {
        setDrivers(prev => [newDriver, ...prev]);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Failed to add driver', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) return;

    const updates = {
      driverID: editingDriver.driverID,
      driverName: formData.driverName,
      driverEmail: formData.driverEmail,
      driverPhone: formData.driverPhone,
      vehicleModel: formData.vehicleModel,
      vehicleColor: formData.vehicleColor,
      licensePlate: formData.licensePlate,
      document_uploaded: formData.document_uploaded,
      blocked: formData.blocked
    };

    try {
      const res = await fetch('/api/drivers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (res.ok) {
        setDrivers(prev => prev.map(d => {
          if (d.driverID === editingDriver.driverID) {
            return { ...d, ...updates };
          }
          return d;
        }));
        setEditingDriver(null);
      }
    } catch (error) {
      console.error('Failed to update driver', error);
    }
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.driverEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.driverPhone?.includes(searchQuery);

    if (filterStatus === 'verified') {
      return matchesSearch && driver.document_uploaded;
    } else if (filterStatus === 'pending') {
      return matchesSearch && !driver.document_uploaded && !driver.blocked;
    } else if (filterStatus === 'blocked') {
      return matchesSearch && driver.blocked;
    }

    return matchesSearch;
  });

  const getStatusBadge = (driver: Driver) => {
    if (driver.blocked) {
      return (
        <span className="badge badge-danger inline-flex items-center gap-1">
          <XCircle size={12} />
          Blocked
        </span>
      );
    }
    if (driver.document_uploaded) {
      return (
        <span className="badge badge-success inline-flex items-center gap-1">
          <CheckCircle size={12} />
          Verified
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
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Drivers</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">Manage and monitor all drivers</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="orbit-btn-primary flex items-center gap-2 px-4 py-2 bg-[#39379e] hover:bg-[#2f2d8c]"
          >
            <Plus size={16} />
            Add Driver
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
              {['all', 'verified', 'pending', 'blocked'].map((status) => (
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

        {/* Drivers Table */}
        <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="orbit-table w-full">
              <thead>
                <tr>
                  <th>Driver ID</th>
                  <th>Driver Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-[var(--text-muted)] text-xs font-semibold">
                      No drivers found
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.driverID} className="hover:bg-[var(--hover-bg)]/50 transition">
                      <td className="font-mono text-[11px] text-[var(--text-secondary)]">{driver.driverID}</td>
                      <td className="font-bold text-[var(--foreground)]">{driver.driverName}</td>
                      <td className="text-[var(--text-secondary)]">{driver.driverEmail}</td>
                      <td className="text-[var(--text-secondary)] font-mono">{driver.driverPhone}</td>
                      <td className="text-[var(--text-secondary)]">
                        <span className="inline-flex items-center gap-1">
                          <Car size={13} className="text-[#39379e]" />
                          {driver.vehicleModel || 'N/A'} <span className="text-[10px] text-[var(--text-muted)]">({driver.vehicleColor})</span>
                        </span>
                      </td>
                      <td>{getStatusBadge(driver)}</td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewDetailDriver(driver)}
                            className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg transition text-[var(--text-secondary)] hover:text-[#39379e]"
                            title="View Account Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(driver)}
                            className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg transition text-[var(--text-secondary)] hover:text-indigo-500"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(driver.driverID)}
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
            <span>Showing {filteredDrivers.length} of {drivers.length} drivers</span>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--hover-bg)]/30 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
                  <Plus size={16} className="text-[#39379e]" /> Add New Driver Profile
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Driver Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.driverName}
                      onChange={e => setFormData({ ...formData, driverName: e.target.value })}
                      placeholder="e.g. Samuel Kojo"
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.driverEmail}
                      onChange={e => setFormData({ ...formData, driverEmail: e.target.value })}
                      placeholder="e.g. sam@example.com"
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
                      value={formData.driverPhone}
                      onChange={e => setFormData({ ...formData, driverPhone: e.target.value })}
                      placeholder="e.g. +233 24 123 4567"
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">License Plate</label>
                    <input
                      type="text"
                      value={formData.licensePlate}
                      onChange={e => setFormData({ ...formData, licensePlate: e.target.value })}
                      placeholder="e.g. GW-102-23"
                      className="orbit-input w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Vehicle Model</label>
                    <input
                      type="text"
                      value={formData.vehicleModel}
                      onChange={e => setFormData({ ...formData, vehicleModel: e.target.value })}
                      placeholder="e.g. Toyota Vitz"
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Vehicle Color</label>
                    <input
                      type="text"
                      value={formData.vehicleColor}
                      onChange={e => setFormData({ ...formData, vehicleColor: e.target.value })}
                      placeholder="e.g. Silver"
                      className="orbit-input w-full"
                    />
                  </div>
                </div>

                <div className="flex gap-4 border-t border-[var(--border-color)] pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.document_uploaded}
                      onChange={e => setFormData({ ...formData, document_uploaded: e.target.checked })}
                      className="rounded border-[var(--border-color)] bg-[var(--background)] text-[#39379e] focus:ring-[#39379e]"
                    />
                    <span className="text-xs text-[var(--text-secondary)]">Verify Profile (Documents Uploaded)</span>
                  </label>
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
                    Register Driver
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingDriver && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--hover-bg)]/30 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
                  <Edit size={16} className="text-[#39379e]" /> Edit Driver: {editingDriver.driverName}
                </h3>
                <button onClick={() => setEditingDriver(null)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Driver Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.driverName}
                      onChange={e => setFormData({ ...formData, driverName: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.driverEmail}
                      onChange={e => setFormData({ ...formData, driverEmail: e.target.value })}
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
                      value={formData.driverPhone}
                      onChange={e => setFormData({ ...formData, driverPhone: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">License Plate</label>
                    <input
                      type="text"
                      value={formData.licensePlate}
                      onChange={e => setFormData({ ...formData, licensePlate: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Vehicle Model</label>
                    <input
                      type="text"
                      value={formData.vehicleModel}
                      onChange={e => setFormData({ ...formData, vehicleModel: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Vehicle Color</label>
                    <input
                      type="text"
                      value={formData.vehicleColor}
                      onChange={e => setFormData({ ...formData, vehicleColor: e.target.value })}
                      className="orbit-input w-full"
                    />
                  </div>
                </div>

                <div className="flex gap-5 border-t border-[var(--border-color)] pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.document_uploaded}
                      onChange={e => setFormData({ ...formData, document_uploaded: e.target.checked })}
                      className="rounded border-[var(--border-color)] bg-[var(--background)] text-[#39379e] focus:ring-[#39379e]"
                    />
                    <span className="text-xs text-[var(--text-secondary)]">Verified Driver</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.blocked}
                      onChange={e => setFormData({ ...formData, blocked: e.target.checked })}
                      className="rounded border-[var(--border-color)] bg-[var(--background)] text-[#39379e] focus:ring-[#39379e]"
                    />
                    <span className="text-xs text-red-500">Block Driver</span>
                  </label>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => setEditingDriver(null)}
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
          open={!!viewDetailDriver}
          onClose={() => setViewDetailDriver(null)}
          onEdit={() => {
            if (viewDetailDriver) {
              handleOpenEditModal(viewDetailDriver);
              setViewDetailDriver(null);
            }
          }}
          config={viewDetailDriver ? {
            entityType: 'driver',
            accent: 'indigo',
            initials: (viewDetailDriver.driverName || 'DR').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
            name: viewDetailDriver.driverName || 'Unknown Driver',
            subtitle: viewDetailDriver.driverID,
            statusBadge: getStatusBadge(viewDetailDriver),
            metaPills: [
              { label: 'Registered on', value: 'Recently' },
              { label: 'Rating', value: '★ 4.5/5' },
            ],
            sections: buildDriverSections(viewDetailDriver),
          } : { entityType: 'driver', accent: 'indigo', initials: '--', name: '', sections: [] }}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">Permanently Delete Driver?</h3>
                  <p className="text-[var(--text-muted)] text-xs font-semibold mt-1">This operational record cannot be restored.</p>
                </div>
                <div className="flex gap-2 pt-2 text-xs font-bold">
                    <button
                      onClick={async () => {
                        const idToDelete = showDeleteConfirm;
                        if (!idToDelete) return;
                        try {
                          const res = await fetch(`/api/drivers?id=${idToDelete}`, { method: 'DELETE' });
                          if (res.ok) {
                            setDrivers(prev => prev.filter(d => d.driverID !== idToDelete));
                            setShowDeleteConfirm(null);
                          }
                        } catch (error) {
                          console.error('Failed to delete driver', error);
                        }
                      }}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-[var(--foreground)] rounded-lg transition"
                    >
                    Delete Record
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-2.5 bg-[var(--hover-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--hover-bg)]/80 rounded-lg transition"
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
