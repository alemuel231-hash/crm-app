'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Search, Plus, Edit, Trash2, DollarSign, Target, Briefcase } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState({
    title: '', value: 0, stage: 'Prospecting', probability: 50
  });

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/deals').then(r => r.json());
      setDeals(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleOpenModal = (deal?: Deal) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData({ ...deal });
    } else {
      setEditingDeal(null);
      setFormData({ title: '', value: 0, stage: 'Prospecting', probability: 50 });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingDeal ? 'PUT' : 'POST';
      const body = editingDeal ? { ...formData, id: editingDeal.id } : formData;
      await fetch('/api/deals', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      setShowModal(false);
      fetchDeals();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    try {
      await fetch(`/api/deals?id=${id}`, { method: 'DELETE' });
      fetchDeals();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredDeals = deals.filter(d => 
    d.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--card-bg)] shadow-sm p-4 rounded-2xl border border-[var(--border-color)]">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
              <Briefcase className="text-amber-500" /> Deals Pipeline
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Track your revenue opportunities.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-[var(--foreground)] rounded-lg font-medium transition"
          >
            <Plus size={16} /> New Deal
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input 
            type="text"
            placeholder="Search deals by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl text-[var(--foreground)] placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Data Table */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--background)] text-[var(--text-muted)] text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Deal Title</th>
                  <th className="p-4 font-medium">Value</th>
                  <th className="p-4 font-medium">Stage</th>
                  <th className="p-4 font-medium">Probability</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[var(--text-muted)] opacity-70">Loading deals...</td>
                  </tr>
                ) : filteredDeals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[var(--text-muted)] opacity-70">No deals found.</td>
                  </tr>
                ) : (
                  filteredDeals.map(deal => (
                    <tr key={deal.id} className="hover:bg-[var(--background)] transition group">
                      <td className="p-4">
                        <div className="font-medium text-[var(--foreground)]">{deal.title}</div>
                      </td>
                      <td className="p-4 text-emerald-400 font-mono">
                        ${Number(deal.value).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          deal.stage === 'Won' ? 'bg-emerald-500/10 text-emerald-400' : 
                          deal.stage === 'Lost' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {deal.stage}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Target size={14} className="text-[var(--text-muted)] opacity-70" />
                          <span className="text-[var(--foreground)]">{deal.probability}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => handleOpenModal(deal)} className="p-2 text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--border-color)] rounded-lg transition"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(deal.id)} className="p-2 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                <h3 className="text-xl font-bold text-[var(--foreground)]">{editingDeal ? 'Edit Deal' : 'Add New Deal'}</h3>
                <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]"><Trash2 size={20} className="hidden" />✕</button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Deal Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--foreground)] focus:outline-none focus:border-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Value (GHS </label>
                    <input type="number" required value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--foreground)] focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Probability (%)</label>
                    <input type="number" min="0" max="100" required value={formData.probability} onChange={e => setFormData({...formData, probability: Number(e.target.value)})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--foreground)] focus:outline-none focus:border-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Stage</label>
                  <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--foreground)] focus:outline-none focus:border-amber-500">
                    <option>Prospecting</option>
                    <option>Qualification</option>
                    <option>Proposal</option>
                    <option>Negotiation</option>
                    <option>Won</option>
                    <option>Lost</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[var(--border-color)] rounded-lg text-[var(--foreground)] hover:bg-[var(--border-color)] font-medium transition">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 rounded-lg text-[var(--foreground)] font-medium transition">Save Deal</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
