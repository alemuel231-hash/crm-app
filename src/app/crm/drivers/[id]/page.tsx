'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  ArrowLeft,
  User,
  FileText,
  Clock,
  ShoppingCart,
  CreditCard,
  Star,
  Lock,
  Phone,
  Mail,
  MapPin,
  Car,
  Calendar,
  Banknote,
  Edit2,
  Save,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getTranslation, LangType } from '@/lib/i18n';

interface Driver {
  driverID: string;
  driverName: string;
  driverPhone: string;
  driverEmail: string;
  blocked: boolean;
  vehicleType: string;
  licensePlate: string;
  vehicleColor?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  signup_setup_complete?: boolean;
}

export default function DriverDetailsPage() {
  const params = useParams();
  const driverID = params.id as string;
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<LangType>('EN');
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Driver>>({});

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await fetch(`/api/drivers`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          const found = data.drivers.find((d: Driver) => d.driverID === driverID);
          if (found) {
            setDriver(found);
            setEditForm(found);
          }
        }
      } catch (err) {
        console.error('Failed to load driver', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
    const savedLang = (localStorage.getItem('lang') || 'EN') as LangType;
    setLang(savedLang);
  }, [driverID]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/drivers/${driverID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setDriver(editForm as Driver);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to update driver', err);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[var(--background)]">
          <div className="w-12 h-12 border-4 border-[#39379e] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  if (!driver) {
    return (
      <MainLayout>
        <div className="p-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">Driver not found</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
        
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/crm/drivers" className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition">
            <ArrowLeft size={20} className="text-[var(--text-muted)]" />
          </Link>
          <h1 className="text-2xl font-bold">Account Details</h1>
        </div>

        {/* Driver Profile Card */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#39379e]/10 rounded-lg flex items-center justify-center">
                <User size={32} className="text-[#39379e]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">{driver.driverName}</h2>
                <p className="text-sm text-[var(--text-muted)]">Driver ID: {driver.driverID}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    driver.blocked ? 'bg-[#fb764a]/10 text-[#fb764a]' : 'bg-[#57b78a]/10 text-[#57b78a]'
                  }`}>
                    {driver.blocked ? 'Blocked' : 'Active'}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">Joined 1 day ago</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 text-[#39379e] hover:bg-[#39379e]/10 rounded-lg transition"
            >
              <Edit2 size={16} />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-[var(--border-color)] overflow-x-auto -mx-6 px-6 pb-3 mb-6">
            {[
              { id: 'details', label: 'Details', icon: FileText },
              { id: 'notes', label: 'Notes', icon: FileText },
              { id: 'timesheet', label: 'Timesheet', icon: Clock },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'credits', label: 'Credit Records', icon: CreditCard },
              { id: 'reviews', label: 'Reviews', icon: Star },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'password', label: 'Password', icon: Lock },
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-3 text-sm font-semibold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'text-[#39379e] border-b-2 border-[#39379e]'
                      : 'text-[var(--text-muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <TabIcon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-6">Basic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.driverName || ''}
                    onChange={(e) => setEditForm({...editForm, driverName: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.driverEmail || ''}
                    onChange={(e) => setEditForm({...editForm, driverEmail: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editForm.driverPhone || ''}
                    onChange={(e) => setEditForm({...editForm, driverPhone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Status</label>
                  <select
                    value={editForm.blocked ? 'blocked' : 'active'}
                    onChange={(e) => setEditForm({...editForm, blocked: e.target.value === 'blocked'})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg disabled:opacity-50"
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                <Car size={20} /> Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Vehicle Type</label>
                  <input
                    type="text"
                    value={editForm.vehicleType || ''}
                    onChange={(e) => setEditForm({...editForm, vehicleType: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">License Plate</label>
                  <input
                    type="text"
                    value={editForm.licensePlate || ''}
                    onChange={(e) => setEditForm({...editForm, licensePlate: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Vehicle Color</label>
                  <input
                    type="text"
                    value={editForm.vehicleColor || ''}
                    onChange={(e) => setEditForm({...editForm, vehicleColor: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Year</label>
                  <input
                    type="text"
                    value={editForm.vehicleYear || ''}
                    onChange={(e) => setEditForm({...editForm, vehicleYear: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm(driver);
                  }}
                  className="px-4 py-2 border border-[var(--border-color)] rounded-lg font-semibold hover:bg-[var(--hover-bg)] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-[#39379e] text-white rounded-lg font-semibold hover:bg-[#2f2d8c] transition"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            )}
          </div>
        )}

        {/* Other tabs placeholder */}
        {activeTab !== 'details' && (
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-12 text-center">
            <p className="text-[var(--text-muted)]">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section coming soon</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
