const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'accounting', title: 'Accounting', icon: 'FileText', fields: [{k:'invoice',l:'Invoice #'},{k:'amount',l:'Amount (GH₵)',t:'number'},{k:'date',l:'Date'},{k:'status',l:'Status'}] },
  { name: 'activities', title: 'Activities', icon: 'Activity', fields: [{k:'title',l:'Title'},{k:'type',l:'Type'},{k:'dueDate',l:'Due Date'},{k:'status',l:'Status'}] },
  { name: 'calendar', title: 'Calendar', icon: 'Calendar', fields: [{k:'eventName',l:'Event Name'},{k:'date',l:'Date'},{k:'time',l:'Time'},{k:'location',l:'Location'}] },
  { name: 'campaigns', title: 'Campaigns', icon: 'Megaphone', fields: [{k:'campaignName',l:'Campaign Name'},{k:'budget',l:'Budget (GH₵)',t:'number'},{k:'startDate',l:'Start Date'},{k:'status',l:'Status'}] },
  { name: 'chat', title: 'Chat', icon: 'MessageSquare', fields: [{k:'user',l:'User'},{k:'lastMessage',l:'Last Message'},{k:'date',l:'Date'},{k:'status',l:'Status'}] },
  { name: 'companies', title: 'Companies', icon: 'Building', fields: [{k:'companyName',l:'Company Name'},{k:'industry',l:'Industry'},{k:'website',l:'Website'},{k:'status',l:'Status'}] },
  { name: 'customers', title: 'Customers', icon: 'Users', fields: [{k:'customerName',l:'Customer Name'},{k:'email',l:'Email'},{k:'phone',l:'Phone'},{k:'status',l:'Status'}] },
  { name: 'email', title: 'Email', icon: 'Mail', fields: [{k:'subject',l:'Subject'},{k:'recipient',l:'Recipient'},{k:'date',l:'Date'},{k:'status',l:'Status'}] },
  { name: 'estimations', title: 'Estimations', icon: 'Calculator', fields: [{k:'estimateId',l:'Estimate ID'},{k:'client',l:'Client'},{k:'amount',l:'Amount (GH₵)',t:'number'},{k:'status',l:'Status'}] },
  { name: 'marketing', title: 'Marketing', icon: 'TrendingUp', fields: [{k:'strategy',l:'Strategy'},{k:'channel',l:'Channel'},{k:'budget',l:'Budget (GH₵)',t:'number'},{k:'status',l:'Status'}] },
  { name: 'opportunities', title: 'Opportunities', icon: 'Lightbulb', fields: [{k:'oppName',l:'Opportunity Name'},{k:'value',l:'Value (GH₵)',t:'number'},{k:'stage',l:'Stage'}] },
  { name: 'orders', title: 'Orders', icon: 'ShoppingCart', fields: [{k:'orderId',l:'Order ID'},{k:'customer',l:'Customer'},{k:'amount',l:'Amount (GH₵)',t:'number'},{k:'status',l:'Status'}] },
  { name: 'payments', title: 'Payments', icon: 'CreditCard', fields: [{k:'transactionId',l:'Transaction ID'},{k:'amount',l:'Amount (GH₵)',t:'number'},{k:'method',l:'Method'},{k:'status',l:'Status'}] },
  { name: 'payout', title: 'Payouts', icon: 'Banknote', fields: [{k:'payoutId',l:'Payout ID'},{k:'driver',l:'Driver'},{k:'amount',l:'Amount (GH₵)',t:'number'},{k:'status',l:'Status'}] },
  { name: 'pipeline', title: 'Pipeline', icon: 'Filter', fields: [{k:'pipelineName',l:'Pipeline Name'},{k:'stage',l:'Stage'},{k:'totalValue',l:'Total Value (GH₵)',t:'number'},{k:'status',l:'Status'}] },
  { name: 'projects', title: 'Projects', icon: 'Briefcase', fields: [{k:'projectName',l:'Project Name'},{k:'client',l:'Client'},{k:'deadline',l:'Deadline'},{k:'status',l:'Status'}] },
  { name: 'proposals', title: 'Proposals', icon: 'FileSignature', fields: [{k:'proposalId',l:'Proposal ID'},{k:'client',l:'Client'},{k:'value',l:'Value (GH₵)',t:'number'},{k:'status',l:'Status'}] },
  { name: 'reports', title: 'Reports', icon: 'BarChart2', fields: [{k:'reportName',l:'Report Name'},{k:'type',l:'Type'},{k:'generatedDate',l:'Generated Date'},{k:'status',l:'Status'}] },
];

function generatePageCode(mod) {
  const capName = mod.name.charAt(0).toUpperCase() + mod.name.slice(1);
  const interfaceName = mod.title.replace(/\s+/g, '');
  
  let stateInit = '';
  mod.fields.forEach(f => {
    stateInit += `${f.k}: ${f.t === 'number' ? '0' : "''"}, `;
  });

  return `'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Search, Plus, Edit, Trash2, ${mod.icon} } from 'lucide-react';

interface ${interfaceName} {
  id: string;
  ${mod.fields.map(f => `${f.k}: ${f.t === 'number' ? 'number' : 'string'};`).join('\n  ')}
}

export default function ${interfaceName}Page() {
  const [items, setItems] = useState<${interfaceName}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<${interfaceName} | null>(null);
  const [formData, setFormData] = useState({
    ${stateInit}
  });

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/${mod.name}').then(r => r.json());
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

  const handleOpenModal = (item?: ${interfaceName}) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({ ${stateInit} });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { ...formData, id: editingItem.id } : formData;
      await fetch('/api/${mod.name}', {
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
      await fetch(\`/api/${mod.name}?id=\${id}\`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredItems = items.filter(i => 
    i.${mod.fields[0].k}?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <${mod.icon} className="text-blue-500" /> ${mod.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1">Manage your ${mod.title.toLowerCase()}.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            <Plus size={16} /> New Record
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Data Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                  ${mod.fields.map(f => `<th className="p-4 font-medium">GH₵{f.l}</th>`).join('\n                  ')}
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={${mod.fields.length + 1}} className="p-8 text-center text-slate-500">Loading ${mod.title.toLowerCase()}...</td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={${mod.fields.length + 1}} className="p-8 text-center text-slate-500">No records found.</td>
                  </tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition group">
                      ${mod.fields.map(f => `
                      <td className="p-4 text-slate-300">
                        {item.${f.k}}
                      </td>`).join('')}
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"><Trash2 size={16} /></button>
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
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{editingItem ? 'Edit Record' : 'Add New Record'}</h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                ${mod.fields.map(f => `
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">GH₵{f.l}</label>
                  <input required type="${f.t === 'number' ? 'number' : 'text'}" value={formData.${f.k}} onChange={e => setFormData({...formData, ${f.k}: ${f.t === 'number' ? 'Number(e.target.value)' : 'e.target.value'}})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                </div>`).join('')}
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 font-medium transition">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}`;
}

function generateApiCode(mod) {
  const capName = mod.name.charAt(0).toUpperCase() + mod.name.slice(1);
  return `import { NextResponse } from 'next/server';
import { get${capName}, add${capName}, update${capName}, delete${capName} } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const items = await get${capName}();

    if (id) {
      const item = items.find((i: any) => i.id === id);
      if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(item);
    }
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newItem = await add${capName}(data);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updates } = data;
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const updated = await update${capName}(id, updates);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const success = await delete${capName}(id);
    if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}`;
}

function generateDbMethods(mod) {
  const capName = mod.name.charAt(0).toUpperCase() + mod.name.slice(1);
  return `
// ${capName}
export async function get${capName}() {
  const snapshot = await get(ref(database, '${mod.name}'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function add${capName}(item: any) {
  const newRef = push(ref(database, '${mod.name}'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function update${capName}(id: string, updates: any) {
  const snapshot = await get(ref(database, '${mod.name}'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, \`${mod.name}/\${key}\`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function delete${capName}(id: string) {
  const snapshot = await get(ref(database, '${mod.name}'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, \`${mod.name}/\${key}\`));
    return true;
  }
  return false;
}
`;
}

let dbAppend = '';

modules.forEach(mod => {
  // Page
  const pageDir = path.join(__dirname, 'src', 'app', 'crm', mod.name);
  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), generatePageCode(mod));
  
  // API
  const apiDir = path.join(__dirname, 'src', 'app', 'api', mod.name);
  if (!fs.existsSync(apiDir)) fs.mkdirSync(apiDir, { recursive: true });
  fs.writeFileSync(path.join(apiDir, 'route.ts'), generateApiCode(mod));

  dbAppend += generateDbMethods(mod);
});

fs.appendFileSync(path.join(__dirname, 'src', 'lib', 'db.ts'), dbAppend);

console.log('All 18 modules generated successfully.');
