'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Search, Plus, Edit, Trash2, User, Phone, Mail, Building, Briefcase } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', status: 'Prospect'
  });

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts').then(r => r.json());
      setContacts(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleOpenModal = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({ ...contact });
    } else {
      setEditingContact(null);
      setFormData({ name: '', email: '', phone: '', company: '', status: 'Prospect' });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingContact ? 'PUT' : 'POST';
      const body = editingContact ? { ...formData, id: editingContact.id } : formData;
      await fetch('/api/contacts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      setShowModal(false);
      fetchContacts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
      fetchContacts();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--card-bg)] shadow-sm p-4 rounded-2xl border border-[var(--border-color)]">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
              <User className="text-blue-500" /> Contacts Management
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Manage your clients and prospects.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-[var(--foreground)] rounded-lg font-medium transition"
          >
            <Plus size={16} /> New Contact
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input 
            type="text"
            placeholder="Search contacts by name or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl text-[var(--foreground)] placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Data Table */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--background)] text-[var(--text-muted)] text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Contact Details</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[var(--text-muted)] opacity-70">Loading contacts...</td>
                  </tr>
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[var(--text-muted)] opacity-70">No contacts found.</td>
                  </tr>
                ) : (
                  filteredContacts.map(contact => (
                    <tr key={contact.id} className="hover:bg-[var(--background)] transition group">
                      <td className="p-4">
                        <div className="font-medium text-[var(--foreground)]">{contact.name}</div>
                      </td>
                      <td className="p-4 text-[var(--foreground)]">
                        <div className="flex items-center gap-2">
                          <Building size={14} className="text-[var(--text-muted)] opacity-70" /> {contact.company}
                        </div>
                      </td>
                      <td className="p-4 text-[var(--foreground)] text-sm space-y-1">
                        <div className="flex items-center gap-2"><Mail size={12} className="text-[var(--text-muted)] opacity-70"/> {contact.email}</div>
                        <div className="flex items-center gap-2"><Phone size={12} className="text-[var(--text-muted)] opacity-70"/> {contact.phone}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          contact.status === 'Customer' ? 'bg-emerald-500/10 text-emerald-400' : 
                          contact.status === 'Prospect' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-[var(--text-muted)]'
                        }`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => handleOpenModal(contact)} className="p-2 text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--border-color)] rounded-lg transition"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(contact.id)} className="p-2 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"><Trash2 size={16} /></button>
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
                <h3 className="text-xl font-bold text-[var(--foreground)]">{editingContact ? 'Edit Contact' : 'Add New Contact'}</h3>
                <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]"><Trash2 size={20} className="hidden" />✕</button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--foreground)] focus:outline-none focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--foreground)] focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Phone</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--foreground)] focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Company</label>
                  <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--foreground)] focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--foreground)] focus:outline-none focus:border-blue-500">
                    <option>Prospect</option>
                    <option>Customer</option>
                    <option>Archived</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[var(--border-color)] rounded-lg text-[var(--foreground)] hover:bg-[var(--border-color)] font-medium transition">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-[var(--foreground)] font-medium transition">Save Contact</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
