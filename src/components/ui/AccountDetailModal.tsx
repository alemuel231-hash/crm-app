'use client';

import React, { useState, useEffect } from 'react';
import {
  X, User, FileText, Clock, ShoppingBag, CreditCard,
  Star, FolderOpen, Lock, ChevronLeft, Mail, Phone,
  Car, MapPin, Calendar, Activity, Hash, Shield,
  Navigation, Package, Users, Edit,
} from 'lucide-react';

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
export interface DetailField {
  label: string;
  value: string | React.ReactNode;
  mono?: boolean;
  fullWidth?: boolean;
}

export interface DetailSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  fields: DetailField[];
}

export interface AccountDetailConfig {
  /** entity type: 'driver' | 'rider' | 'customer' | 'contact' | 'lead' | 'trip' | 'order' | 'payment' */
  entityType: string;
  /** initials shown in the avatar circle */
  initials: string;
  /** accent color class e.g. 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple' */
  accent: 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
  /** main name / title */
  name: string;
  /** subtitle under name (ID, email, etc.) */
  subtitle?: string;
  /** status badge node */
  statusBadge?: React.ReactNode;
  /** extra meta pills displayed beside status */
  metaPills?: { label: string; value: string; icon?: React.ReactNode }[];
  /** tab sections */
  sections: DetailSection[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  config: AccountDetailConfig;
}

/* ─────────────────────────────────────────
   Accent colour maps
───────────────────────────────────────── */
const ACCENT = {
  indigo:  { avatar: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/50 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-300', tab: 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400', pill: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300' },
  emerald: { avatar: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/50 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-300', tab: 'text-emerald-600 dark:text-emerald-400 border-emerald-600 dark:border-emerald-400', pill: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' },
  amber:   { avatar: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/50 dark:border-amber-900/30 text-amber-600 dark:text-amber-300', tab: 'text-amber-600 dark:text-amber-400 border-amber-600 dark:border-amber-400', pill: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' },
  blue:    { avatar: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-300', tab: 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400', pill: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' },
  purple:  { avatar: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/50 dark:border-purple-900/30 text-purple-600 dark:text-purple-300', tab: 'text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400', pill: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300' },
  rose:    { avatar: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/50 dark:border-rose-900/30 text-rose-600 dark:text-rose-300', tab: 'text-rose-600 dark:text-rose-400 border-rose-600 dark:border-rose-400', pill: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300' },
};

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export default function AccountDetailModal({ open, onClose, onEdit, config }: Props) {
  const [activeTab, setActiveTab] = useState(config.sections[0]?.id || '');
  const ac = ACCENT[config.accent] || ACCENT.indigo;

  // Reset tab when re-opened for a different entity
  useEffect(() => {
    if (open) setActiveTab(config.sections[0]?.id || '');
  }, [open, config.name]);

  // Escape key close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const activeSection = config.sections.find(s => s.id === activeTab);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-2xl animate-fade-in overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-color)] bg-[var(--hover-bg)]/40 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ChevronLeft size={15} />
            Account Details
          </button>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--foreground)] bg-[var(--hover-bg)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition-colors"
              >
                <Edit size={12} /> Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ── Hero / Basic Details card ── */}
        <div className="px-5 py-4 border-b border-[var(--border-color)] bg-[var(--card-bg)] shrink-0">
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Basic details</p>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Avatar */}
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl font-extrabold shrink-0 ${ac.avatar}`}>
              {config.initials}
            </div>

            {/* Name + meta strip */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-extrabold text-[var(--foreground)] tracking-tight truncate">{config.name}</h2>
              {config.subtitle && (
                <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">{config.subtitle}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {/* Meta pills */}
                {config.metaPills?.map((pill, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    {pill.icon && <span className="text-[var(--text-muted)]">{pill.icon}</span>}
                    <span className="text-[10px] text-[var(--text-muted)] font-semibold">{pill.label}</span>
                    <span className="text-[11px] font-bold text-[var(--foreground)]">{pill.value}</span>
                  </div>
                ))}
                {/* Status */}
                {config.statusBadge && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[var(--text-muted)] font-semibold">Status</span>
                    {config.statusBadge}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex items-center gap-0 border-b border-[var(--border-color)] bg-[var(--card-bg)] px-5 overflow-x-auto shrink-0 scrollbar-none">
          {config.sections.map(section => {
            const isActive = section.id === activeTab;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all duration-150 -mb-px ${
                  isActive
                    ? `${ac.tab} bg-transparent`
                    : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)] hover:border-[var(--border-color)]'
                }`}
              >
                <span className="shrink-0">{section.icon}</span>
                {section.label}
              </button>
            );
          })}
        </div>

        {/* ── Section content ── */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeSection && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 animate-fade-in">
              {activeSection.fields.map((field, i) => (
                <div key={i} className={field.fullWidth ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">
                    {field.label}
                  </label>
                  {typeof field.value === 'string' ? (
                    <div className={`orbit-input-static ${field.mono ? 'font-mono' : ''}`}>
                      {field.value || <span className="text-[var(--text-muted)] italic text-xs">Not provided</span>}
                    </div>
                  ) : (
                    <div className="orbit-input-static flex items-center">
                      {field.value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Helper: build sections for each entity type
───────────────────────────────────────── */

const formatValue = (val: any) => {
  if (!val) return '';
  if (typeof val === 'object') {
    return val.name || val.formatted_address || val.street || val.city || JSON.stringify(val);
  }
  return String(val);
};

/** Build sections for a DRIVER */
export function buildDriverSections(driver: {
  driverID?: string; driverName?: string; driverEmail?: string; driverPhone?: string;
  vehicleModel?: string; vehicleColor?: string; licensePlate?: string;
  blocked?: boolean; document_uploaded?: boolean;
  created_at?: string; rating?: number;
}): DetailSection[] {
  return [
    {
      id: 'details',
      label: 'Details',
      icon: <User size={13} />,
      fields: [
        { label: 'Full Name',      value: driver.driverName    || '' },
        { label: 'Driver ID',      value: driver.driverID      || '', mono: true },
        { label: 'Email Address',  value: driver.driverEmail   || '' },
        { label: 'Phone Number',   value: driver.driverPhone   || '', mono: true },
        { label: 'Vehicle Model',  value: driver.vehicleModel  || '' },
        { label: 'Vehicle Color',  value: driver.vehicleColor  || '' },
        { label: 'License Plate',  value: driver.licensePlate  || '', mono: true },
        { label: 'Registered On',  value: driver.created_at    || 'Recently' },
      ],
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingBag size={13} />,
      fields: [
        { label: 'Total Trips Completed', value: '—' },
        { label: 'Trips This Month',      value: '—' },
        { label: 'Last Trip Date',        value: '—' },
        { label: 'Average Trip Distance', value: '—' },
      ],
    },
    {
      id: 'credit',
      label: 'Credit Records',
      icon: <CreditCard size={13} />,
      fields: [
        { label: 'Total Earnings',   value: '—' },
        { label: 'Pending Payout',   value: '—' },
        { label: 'Last Payout Date', value: '—' },
        { label: 'Payment Method',   value: '—' },
      ],
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: <Star size={13} />,
      fields: [
        { label: 'Average Rating',   value: driver.rating ? `${driver.rating} / 5 ★` : '—' },
        { label: 'Total Reviews',    value: '—' },
        { label: 'Last Review',      value: '—' },
        { label: 'Complaints Filed', value: '0' },
      ],
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FolderOpen size={13} />,
      fields: [
        { label: 'Documents Uploaded', value: driver.document_uploaded ? 'Yes — Complete' : 'No — Pending' },
        { label: 'Driver\'s License',  value: driver.document_uploaded ? 'Submitted' : 'Awaiting' },
        { label: 'Vehicle Insurance',  value: driver.document_uploaded ? 'Submitted' : 'Awaiting' },
        { label: 'Roadworthiness',     value: driver.document_uploaded ? 'Submitted' : 'Awaiting' },
      ],
    },
    {
      id: 'account',
      label: 'Password',
      icon: <Lock size={13} />,
      fields: [
        { label: 'Account Status',    value: driver.blocked ? 'Blocked' : 'Active' },
        { label: 'Password',          value: '••••••••', mono: true },
        { label: 'Last Login',        value: 'Recently' },
        { label: 'Two-Factor Auth',   value: 'Not Enabled' },
      ],
    },
  ];
}

/** Build sections for a RIDER / CUSTOMER */
export function buildRiderSections(rider: {
  id?: string; name?: string; email?: string; phone?: string;
  address?: string; created_at?: string; total_rides?: number; rating?: number;
}): DetailSection[] {
  return [
    {
      id: 'details',
      label: 'Details',
      icon: <User size={13} />,
      fields: [
        { label: 'Full Name',      value: rider.name     || '' },
        { label: 'Rider ID',       value: rider.id       || '', mono: true },
        { label: 'Email Address',  value: rider.email    || '' },
        { label: 'Phone Number',   value: rider.phone    || '', mono: true },
        { label: 'Address',        value: formatValue(rider.address), fullWidth: true },
        { label: 'Member Since',   value: rider.created_at || 'Recently' },
      ],
    },
    {
      id: 'trips',
      label: 'Trips',
      icon: <Navigation size={13} />,
      fields: [
        { label: 'Total Trips',     value: String(rider.total_rides || '—') },
        { label: 'Trips This Month', value: '—' },
        { label: 'Favourite Route',  value: '—' },
        { label: 'Last Trip Date',   value: '—' },
      ],
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <CreditCard size={13} />,
      fields: [
        { label: 'Total Spent',       value: '—' },
        { label: 'Pending Balance',   value: '—' },
        { label: 'Preferred Payment', value: '—' },
        { label: 'Last Transaction',  value: '—' },
      ],
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: <Star size={13} />,
      fields: [
        { label: 'Rider Rating',   value: rider.rating ? `${rider.rating} / 5 ★` : '—' },
        { label: 'Total Reviews',  value: '—' },
        { label: 'Complaints',     value: '0' },
        { label: 'Last Review',    value: '—' },
      ],
    },
    {
      id: 'account',
      label: 'Password',
      icon: <Lock size={13} />,
      fields: [
        { label: 'Account Status', value: 'Active' },
        { label: 'Password',       value: '••••••••', mono: true },
        { label: 'Last Login',     value: 'Recently' },
        { label: '2FA Enabled',    value: 'No' },
      ],
    },
  ];
}

/** Build sections for a CONTACT / LEAD */
export function buildContactSections(contact: {
  id?: string; name?: string; email?: string; phone?: string;
  company?: string; position?: string; address?: string;
  status?: string; source?: string; created_at?: string;
}): DetailSection[] {
  return [
    {
      id: 'details',
      label: 'Details',
      icon: <User size={13} />,
      fields: [
        { label: 'Full Name',   value: contact.name     || '' },
        { label: 'Contact ID',  value: contact.id       || '', mono: true },
        { label: 'Email',       value: contact.email    || '' },
        { label: 'Phone',       value: contact.phone    || '', mono: true },
        { label: 'Company',     value: contact.company  || '' },
        { label: 'Position',    value: contact.position || '' },
        { label: 'Address',     value: formatValue(contact.address), fullWidth: true },
      ],
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: <FileText size={13} />,
      fields: [
        { label: 'Lead Source',    value: contact.source  || '—' },
        { label: 'Contact Status', value: contact.status  || '—' },
        { label: 'Created On',     value: contact.created_at || 'Recently' },
        { label: 'Internal Notes', value: 'No notes added yet.', fullWidth: true },
      ],
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingBag size={13} />,
      fields: [
        { label: 'Total Orders',     value: '—' },
        { label: 'Last Order',       value: '—' },
        { label: 'Order Value',      value: '—' },
        { label: 'Preferred Method', value: '—' },
      ],
    },
    {
      id: 'account',
      label: 'Password',
      icon: <Lock size={13} />,
      fields: [
        { label: 'Account Status', value: 'Active' },
        { label: 'Password',       value: '••••••••', mono: true },
        { label: 'Last Login',     value: 'Recently' },
        { label: '2FA Enabled',    value: 'No' },
      ],
    },
  ];
}

/** Build sections for a TRIP */
export function buildTripSections(trip: {
  id?: string; rider_name?: string; driver_name?: string;
  pickup_address?: string; dropoff_address?: string;
  fare?: string | number; status?: string; distance?: string;
  created_at?: string; payment_method?: string; rating?: number;
}): DetailSection[] {
  return [
    {
      id: 'details',
      label: 'Details',
      icon: <Navigation size={13} />,
      fields: [
        { label: 'Trip ID',          value: trip.id           || '', mono: true },
        { label: 'Status',           value: trip.status       || '' },
        { label: 'Rider',            value: trip.rider_name   || '' },
        { label: 'Driver',           value: trip.driver_name  || '' },
        { label: 'Pickup Address',   value: formatValue(trip.pickup_address), fullWidth: true },
        { label: 'Dropoff Address',  value: formatValue(trip.dropoff_address), fullWidth: true },
        { label: 'Distance',         value: trip.distance     || '—' },
        { label: 'Trip Date',        value: trip.created_at   || 'Recently' },
      ],
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <CreditCard size={13} />,
      fields: [
        { label: 'Fare Amount',      value: trip.fare ? `GHS ${trip.fare}` : '—', mono: true },
        { label: 'Payment Method',   value: trip.payment_method || '—' },
        { label: 'Payment Status',   value: 'Settled' },
        { label: 'Receipt Number',   value: `RCP-${trip.id || '000'}`, mono: true },
      ],
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: <Star size={13} />,
      fields: [
        { label: 'Rider Rating',    value: trip.rating ? `${trip.rating} / 5 ★` : '—' },
        { label: 'Driver Rating',   value: '—' },
        { label: 'Rider Feedback',  value: 'No feedback submitted.', fullWidth: true },
      ],
    },
  ];
}

/** Build sections for an ORDER */
export function buildOrderSections(order: {
  id?: string; customer_name?: string; driver_name?: string;
  pickup?: string; destination?: string; amount?: string | number;
  status?: string; payment_method?: string; created_at?: string;
}): DetailSection[] {
  return [
    {
      id: 'details',
      label: 'Details',
      icon: <Package size={13} />,
      fields: [
        { label: 'Order ID',         value: order.id             || '', mono: true },
        { label: 'Status',           value: order.status         || '' },
        { label: 'Customer',         value: order.customer_name  || '' },
        { label: 'Driver',           value: order.driver_name    || '' },
        { label: 'Pickup',           value: formatValue(order.pickup), fullWidth: true },
        { label: 'Destination',      value: formatValue(order.destination), fullWidth: true },
        { label: 'Order Date',       value: order.created_at     || 'Recently' },
      ],
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <CreditCard size={13} />,
      fields: [
        { label: 'Order Amount',     value: order.amount ? `GHS ${order.amount}` : '—', mono: true },
        { label: 'Payment Method',   value: order.payment_method || '—' },
        { label: 'Payment Status',   value: 'Settled' },
        { label: 'Invoice Number',   value: `INV-${order.id || '000'}`, mono: true },
      ],
    },
  ];
}

/** Build sections for a PAYMENT */
export function buildPaymentSections(payment: {
  id?: string; customer_name?: string; driver_name?: string;
  amount?: string | number; method?: string; status?: string;
  description?: string; created_at?: string; reference?: string;
}): DetailSection[] {
  return [
    {
      id: 'details',
      label: 'Details',
      icon: <CreditCard size={13} />,
      fields: [
        { label: 'Payment ID',     value: payment.id            || '', mono: true },
        { label: 'Status',         value: payment.status        || '' },
        { label: 'Customer',       value: payment.customer_name || '' },
        { label: 'Driver',         value: payment.driver_name   || '' },
        { label: 'Amount',         value: payment.amount ? `GHS ${payment.amount}` : '—', mono: true },
        { label: 'Method',         value: payment.method        || '' },
        { label: 'Reference',      value: payment.reference     || `REF-${payment.id || '000'}`, mono: true },
        { label: 'Date',           value: payment.created_at    || 'Recently' },
        { label: 'Description',    value: payment.description   || '', fullWidth: true },
      ],
    },
    {
      id: 'credit',
      label: 'Credit Records',
      icon: <Shield size={13} />,
      fields: [
        { label: 'Running Balance', value: '—' },
        { label: 'Cleared Amount',  value: payment.amount ? `GHS ${payment.amount}` : '—', mono: true },
        { label: 'Dispute Status',  value: 'None' },
        { label: 'Audit Log',       value: 'Clean' },
      ],
    },
  ];
}
