const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'activities', title: 'Activities', icon: 'Activity', fields: [{k:'title',l:'Title'},{k:'type',l:'Type'},{k:'dueDate',l:'Due Date'},{k:'status',l:'Status'}] },
  { name: 'calendar', title: 'Calendar', icon: 'Calendar', fields: [{k:'eventName',l:'Event Name'},{k:'date',l:'Date'},{k:'time',l:'Time'},{k:'location',l:'Location'}] },
  { name: 'campaigns', title: 'Campaigns', icon: 'Megaphone', fields: [{k:'campaignName',l:'Campaign Name'},{k:'budget',l:'Budget (GHS)',t:'number'},{k:'startDate',l:'Start Date'},{k:'status',l:'Status'}] },
  { name: 'chat', title: 'Chat', icon: 'MessageSquare', fields: [{k:'user',l:'User'},{k:'lastMessage',l:'Last Message'},{k:'date',l:'Date'},{k:'status',l:'Status'}] },
  { name: 'companies', title: 'Companies', icon: 'Building', fields: [{k:'companyName',l:'Company Name'},{k:'industry',l:'Industry'},{k:'website',l:'Website'},{k:'status',l:'Status'}] },
  { name: 'email', title: 'Email', icon: 'Mail', fields: [{k:'subject',l:'Subject'},{k:'recipient',l:'Recipient'},{k:'date',l:'Date'},{k:'status',l:'Status'}] },
  { name: 'estimations', title: 'Estimations', icon: 'Calculator', fields: [{k:'estimateId',l:'Estimate ID'},{k:'client',l:'Client'},{k:'amount',l:'Amount (GHS)',t:'number'},{k:'status',l:'Status'}] },
  { name: 'marketing', title: 'Marketing', icon: 'TrendingUp', fields: [{k:'strategy',l:'Strategy'},{k:'channel',l:'Channel'},{k:'budget',l:'Budget (GHS)',t:'number'},{k:'status',l:'Status'}] },
  { name: 'opportunities', title: 'Opportunities', icon: 'Lightbulb', fields: [{k:'oppName',l:'Opportunity Name'},{k:'value',l:'Value (GHS)',t:'number'},{k:'stage',l:'Stage'}] },
  { name: 'payout', title: 'Payouts', icon: 'Banknote', fields: [{k:'payoutId',l:'Payout ID'},{k:'driver',l:'Driver'},{k:'amount',l:'Amount (GHS)',t:'number'},{k:'status',l:'Status'}] },
  { name: 'projects', title: 'Projects', icon: 'Briefcase', fields: [{k:'projectName',l:'Project Name'},{k:'client',l:'Client'},{k:'deadline',l:'Deadline'},{k:'status',l:'Status'}] },
  { name: 'proposals', title: 'Proposals', icon: 'FileSignature', fields: [{k:'proposalId',l:'Proposal ID'},{k:'client',l:'Client'},{k:'value',l:'Value (GHS)',t:'number'},{k:'status',l:'Status'}] },
  { name: 'reports', title: 'Reports', icon: 'BarChart2', fields: [{k:'reportName',l:'Report Name'},{k:'type',l:'Type'},{k:'generatedDate',l:'Generated Date'},{k:'status',l:'Status'}] },
];

function generatePageCode(mod) {
  const capName = mod.name.charAt(0).toUpperCase() + mod.name.slice(1);
  const interfaceName = mod.title.replace(/\\s+/g, '');
  
  let stateInit = '';
  mod.fields.forEach(f => {
    stateInit += f.k + ": " + (f.t === 'number' ? '0' : "''") + ", ";
  });

  return "'use client';\n\n" +
"import React, { useState, useEffect } from 'react';\n" +
"import MainLayout from '@/components/layout/MainLayout';\n" +
"import { Search, Plus, Edit, Trash2, X, " + mod.icon + " } from 'lucide-react';\n\n" +
"interface " + interfaceName + " {\n" +
"  id: string;\n" +
mod.fields.map(f => "  " + f.k + ": " + (f.t === 'number' ? 'number' : 'string') + ";").join('\n') +
"\n}\n\n" +
"export default function " + interfaceName + "Page() {\n" +
"  const [items, setItems] = useState<" + interfaceName + "[]>([]);\n" +
"  const [loading, setLoading] = useState(true);\n" +
"  const [searchQuery, setSearchQuery] = useState('');\n  \n" +
"  const [showModal, setShowModal] = useState(false);\n" +
"  const [editingItem, setEditingItem] = useState<" + interfaceName + " | null>(null);\n" +
"  const [formData, setFormData] = useState({\n    " + stateInit + "\n  });\n\n" +
"  const fetchItems = async () => {\n" +
"    try {\n" +
"      const res = await fetch('/api/" + mod.name + "').then(r => r.json());\n" +
"      setItems(Array.isArray(res) ? res : []);\n" +
"    } catch (e) {\n" +
"      console.error(e);\n" +
"    } finally {\n" +
"      setLoading(false);\n" +
"    }\n" +
"  };\n\n" +
"  useEffect(() => {\n" +
"    fetchItems();\n" +
"  }, []);\n\n" +
"  const handleOpenModal = (item?: " + interfaceName + ") => {\n" +
"    if (item) {\n" +
"      setEditingItem(item);\n" +
"      setFormData({ ...item });\n" +
"    } else {\n" +
"      setEditingItem(null);\n" +
"      setFormData({ " + stateInit + " });\n" +
"    }\n" +
"    setShowModal(true);\n" +
"  };\n\n" +
"  const handleSave = async (e: React.FormEvent) => {\n" +
"    e.preventDefault();\n" +
"    try {\n" +
"      const method = editingItem ? 'PUT' : 'POST';\n" +
"      const body = editingItem ? { ...formData, id: editingItem.id } : formData;\n" +
"      await fetch('/api/" + mod.name + "', {\n" +
"        method,\n" +
"        headers: { 'Content-Type': 'application/json' },\n" +
"        body: JSON.stringify(body)\n" +
"      });\n" +
"      setShowModal(false);\n" +
"      fetchItems();\n" +
"    } catch (error) {\n" +
"      console.error(error);\n" +
"    }\n" +
"  };\n\n" +
"  const handleDelete = async (id: string) => {\n" +
"    if (!confirm('Are you sure you want to delete this record?')) return;\n" +
"    try {\n" +
"      await fetch(`/api/" + mod.name + "?id=${id}`, { method: 'DELETE' });\n" +
"      fetchItems();\n" +
"    } catch (error) {\n" +
"      console.error(error);\n" +
"    }\n" +
"  };\n\n" +
"  const filteredItems = items.filter(i => \n" +
"    i." + mod.fields[0].k + "?.toString().toLowerCase().includes(searchQuery.toLowerCase())\n" +
"  );\n\n" +
"  return (\n" +
"    <MainLayout>\n" +
"      <div className=\"p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]\">\n" +
"        \n" +
"        {/* Header Section */}\n" +
"        <div className=\"flex flex-col sm:flex-row sm:items-center justify-between gap-4\">\n" +
"          <div>\n" +
"            <h1 className=\"text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2\">\n" +
"              <" + mod.icon + " className=\"text-[#39379e]\" size={24} /> " + mod.title + "\n" +
"            </h1>\n" +
"            <p className=\"text-xs text-[var(--text-muted)] mt-1\">Manage your " + mod.title.toLowerCase() + ".</p>\n" +
"          </div>\n" +
"          <button \n" +
"            onClick={() => handleOpenModal()}\n" +
"            className=\"orbit-btn-primary flex items-center gap-2 px-4 py-2 bg-[#39379e] hover:bg-[#2f2d8c] text-white\"\n" +
"          >\n" +
"            <Plus size={16} /> New Record\n" +
"          </button>\n" +
"        </div>\n\n" +
"        {/* Search Bar */}\n" +
"        <div className=\"orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] p-4\">\n" +
"          <div className=\"relative w-full md:w-1/2\">\n" +
"            <Search className=\"absolute left-3 top-2.5 text-[var(--text-muted)]\" size={16} />\n" +
"            <input \n" +
"              type=\"text\"\n" +
"              placeholder=\"Search records...\"\n" +
"              value={searchQuery}\n" +
"              onChange={(e) => setSearchQuery(e.target.value)}\n" +
"              className=\"orbit-input w-full pl-10 pr-4 py-2 text-xs\"\n" +
"            />\n" +
"          </div>\n" +
"        </div>\n\n" +
"        {/* Data Table */}\n" +
"        <div className=\"orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden\">\n" +
"          <div className=\"overflow-x-auto\">\n" +
"            <table className=\"orbit-table w-full\">\n" +
"              <thead>\n" +
"                <tr>\n" +
mod.fields.map(f => "                  <th className=\"text-left\">" + f.l + "</th>").join('\n') + "\n" +
"                  <th className=\"text-center\">Actions</th>\n" +
"                </tr>\n" +
"              </thead>\n" +
"              <tbody className=\"divide-y divide-[var(--border-color)]\">\n" +
"                {loading ? (\n" +
"                  <tr>\n" +
"                    <td colSpan={" + (mod.fields.length + 1) + "} className=\"px-6 py-8 text-center text-[var(--text-muted)] text-xs font-semibold\">Loading " + mod.title.toLowerCase() + "...</td>\n" +
"                  </tr>\n" +
"                ) : filteredItems.length === 0 ? (\n" +
"                  <tr>\n" +
"                    <td colSpan={" + (mod.fields.length + 1) + "} className=\"px-6 py-8 text-center text-[var(--text-muted)] text-xs font-semibold\">No records found.</td>\n" +
"                  </tr>\n" +
"                ) : (\n" +
"                  filteredItems.map(item => (\n" +
"                    <tr key={item.id} className=\"hover:bg-[var(--hover-bg)] transition-colors group\">\n" +
mod.fields.map((f, idx) => 
"                      <td className=\"" + (idx === 0 ? "font-medium text-[var(--foreground)]" : "text-[var(--text-secondary)]") + "\">\n" +
"                        {item." + f.k + "}\n" +
"                      </td>"
).join('\n') + "\n" +
"                      <td>\n" +
"                        <div className=\"flex items-center justify-center gap-2\">\n" +
"                          <button onClick={() => handleOpenModal(item)} className=\"p-1.5 text-[var(--text-muted)] hover:text-[#39379e] hover:bg-[#39379e]/10 rounded transition-colors\"><Edit size={16} /></button>\n" +
"                          <button onClick={() => handleDelete(item.id)} className=\"p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors\"><Trash2 size={16} /></button>\n" +
"                        </div>\n" +
"                      </td>\n" +
"                    </tr>\n" +
"                  ))\n" +
"                )}\n" +
"              </tbody>\n" +
"            </table>\n" +
"          </div>\n" +
"        </div>\n\n" +
"        {/* Modal */}\n" +
"        {showModal && (\n" +
"          <div className=\"fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]\">\n" +
"            <div className=\"bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden\">\n" +
"              <div className=\"px-6 py-4 border-b border-[var(--border-color)] bg-[var(--hover-bg)]/30 flex justify-between items-center\">\n" +
"                <h3 className=\"text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2\">\n" +
"                   {editingItem ? 'Edit Record' : 'Add New Record'}\n" +
"                </h3>\n" +
"                <button type=\"button\" onClick={() => setShowModal(false)} className=\"text-[var(--text-muted)] hover:text-[var(--foreground)]\">\n" +
"                  <X size={18} />\n" +
"                </button>\n" +
"              </div>\n" +
"              <form onSubmit={handleSave} className=\"p-6 space-y-4 text-xs font-semibold\">\n" +
mod.fields.map(f => 
"                <div>\n" +
"                  <label className=\"block text-[10px] text-[var(--text-muted)] uppercase mb-1\">" + f.l + "</label>\n" +
"                  <input required type=\"" + (f.t === 'number' ? 'number' : 'text') + "\" value={formData." + f.k + "} onChange={e => setFormData({...formData, " + f.k + ": " + (f.t === 'number' ? 'Number(e.target.value)' : 'e.target.value') + "})} className=\"orbit-input w-full\" />\n" +
"                </div>"
).join('\n') + "\n" +
"                \n" +
"                <div className=\"flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]\">\n" +
"                  <button type=\"button\" onClick={() => setShowModal(false)} className=\"px-4 py-2 border border-[var(--border-color)] text-[var(--foreground)] rounded-lg hover:bg-[var(--hover-bg)] transition-colors\">Cancel</button>\n" +
"                  <button type=\"submit\" className=\"orbit-btn-primary px-4 py-2 bg-[#39379e] hover:bg-[#2f2d8c] text-white rounded-lg transition-colors\">Save Record</button>\n" +
"                </div>\n" +
"              </form>\n" +
"            </div>\n" +
"          </div>\n" +
"        )}\n" +
"      </div>\n" +
"    </MainLayout>\n" +
"  );\n" +
"}\n";
}

modules.forEach(mod => {
  const pageDir = path.join(__dirname, 'src', 'app', 'crm', mod.name);
  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), generatePageCode(mod));
});

console.log('Fixed styles and GHS currency for generic modules.');
