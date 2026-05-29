'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Search, Plus, Edit, Trash2, X, Mail } from 'lucide-react';

interface Email {
  id: string;
  subject: string;
  recipient: string;
  date: string;
  status: string;
}

export default function EmailPage() {
  const [items, setItems] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Email | null>(null);
  const [formData, setFormData] = useState({
    subject: '', recipient: '', date: '', status: '', 
  });

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/email').then(r => r.json());
      setItems(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (item?: Email) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({ subject: '', recipient: '', date: '', status: '',  });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { ...formData, id: editingItem.id } : formData;
      await fetch('/api/email', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      setShowModal(false);
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await fetch(`/api/email?id=${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredItems = items.filter(i => 
    i.subject?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
              <Mail className="text-[#39379e]" size={24} /> Email
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">Manage your email.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="orbit-btn-primary flex items-center gap-2 px-4 py-2 bg-[#39379e] hover:bg-[#2f2d8c] text-white"
          >
            <Plus size={16} /> New Record
          </button>
        </div>

        {/* Search Bar */}
        <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] p-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 text-[var(--text-muted)]" size={16} />
            <input 
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="orbit-input w-full pl-10 pr-4 py-2 text-xs"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="orbit-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Subject</th>
                  <th className="text-left">Recipient</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-muted)] text-xs font-semibold">Loading email...</td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-muted)] text-xs font-semibold">No records found.</td>
                  </tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-[var(--hover-bg)] transition-colors group">
                      <td className="font-medium text-[var(--foreground)]">
                        {item.subject}
                      </td>
                      <td className="text-[var(--text-secondary)]">
                        {item.recipient}
                      </td>
                      <td className="text-[var(--text-secondary)]">
                        {item.date}
                      </td>
                      <td className="text-[var(--text-secondary)]">
                        {item.status}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenModal(item)} className="p-1.5 text-[var(--text-muted)] hover:text-[#39379e] hover:bg-[#39379e]/10 rounded transition-colors"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"><Trash2 size={16} /></button>
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--hover-bg)]/30 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
                   {editingItem ? 'Edit Record' : 'Add New Record'}
                </h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Subject</label>
                  <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="orbit-input w-full" />
                </div>
                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Recipient</label>
                  <input required type="text" value={formData.recipient} onChange={e => setFormData({...formData, recipient: e.target.value})} className="orbit-input w-full" />
                </div>
                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Date</label>
                  <input required type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="orbit-input w-full" />
                </div>
                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1">Status</label>
                  <input required type="text" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="orbit-input w-full" />
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-[var(--border-color)] text-[var(--foreground)] rounded-lg hover:bg-[var(--hover-bg)] transition-colors">Cancel</button>
                  <button type="submit" className="orbit-btn-primary px-4 py-2 bg-[#39379e] hover:bg-[#2f2d8c] text-white rounded-lg transition-colors">Save Record</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
