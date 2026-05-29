const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'app', 'crm');

function writePage(folder, content) {
  const dir = path.join(baseDir, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
}

writePage('customers', "'use client';\n" +
"import React, { useState, useEffect } from 'react';\n" +
"import MainLayout from '@/components/layout/MainLayout';\n" +
"import { Search, Users, MapPin, Activity } from 'lucide-react';\n\n" +
"export default function CustomersPage() {\n" +
"  const [customers, setCustomers] = useState([]);\n" +
"  const [loading, setLoading] = useState(true);\n\n" +
"  useEffect(() => {\n" +
"    fetch('/api/riders').then(r => r.json()).then(data => {\n" +
"      setCustomers(data.riders || []);\n" +
"      setLoading(false);\n" +
"    }).catch(() => setLoading(false));\n" +
"  }, []);\n\n" +
"  return (\n" +
"    <MainLayout>\n" +
"      <div className=\"p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]\">\n" +
"        <div className=\"flex items-center gap-3 orbit-card bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm\">\n" +
"          <Users className=\"text-[#39379e] w-8 h-8\" />\n" +
"          <div>\n" +
"            <h1 className=\"text-2xl font-bold tracking-tight text-[var(--foreground)]\">Customers (Riders)</h1>\n" +
"            <p className=\"text-[var(--text-muted)] text-xs mt-1\">Ride-hailing user directory linked to your database.</p>\n" +
"          </div>\n" +
"        </div>\n\n" +
"        <div className=\"orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm\">\n" +
"          <table className=\"orbit-table w-full\">\n" +
"            <thead>\n" +
"              <tr>\n" +
"                <th className=\"text-left\">Customer Name</th>\n" +
"                <th className=\"text-left\">Contact</th>\n" +
"                <th className=\"text-left\">Status</th>\n" +
"              </tr>\n" +
"            </thead>\n" +
"            <tbody className=\"divide-y divide-[var(--border-color)]\">\n" +
"              {loading ? (\n" +
"                <tr><td colSpan={3} className=\"p-8 text-center text-[var(--text-muted)] text-xs font-semibold\">Loading...</td></tr>\n" +
"              ) : customers.length === 0 ? (\n" +
"                <tr><td colSpan={3} className=\"p-8 text-center text-[var(--text-muted)] text-xs font-semibold\">No customers found.</td></tr>\n" +
"              ) : customers.map((c: any) => (\n" +
"                <tr key={c.riderID || Math.random()} className=\"hover:bg-[var(--hover-bg)] transition\">\n" +
"                  <td className=\"p-4 text-[var(--foreground)] font-medium\">{c.riderName || 'Unknown User'}</td>\n" +
"                  <td className=\"p-4 text-[var(--text-secondary)]\">{c.riderPhone || 'No phone'} <br/> <span className=\"text-xs text-[var(--text-muted)]\">{c.riderEmail}</span></td>\n" +
"                  <td className=\"p-4\">\n" +
"                    <span className={`badge inline-flex items-center gap-1 GHS ${c.blocked ? 'badge-danger' : 'badge-success'}`}>\n" +
"                      {c.blocked ? 'Blocked' : 'Active'}\n" +
"                    </span>\n" +
"                  </td>\n" +
"                </tr>\n" +
"              ))}\n" +
"            </tbody>\n" +
"          </table>\n" +
"        </div>\n" +
"      </div>\n" +
"    </MainLayout>\n" +
"  );\n" +
"}");

writePage('accounting', "'use client';\n" +
"import React, { useState, useEffect } from 'react';\n" +
"import MainLayout from '@/components/layout/MainLayout';\n" +
"import { DollarSign, TrendingUp, CreditCard, Banknote } from 'lucide-react';\n\n" +
"export default function AccountingPage() {\n" +
"  const [trips, setTrips] = useState([]);\n" +
"  const [loading, setLoading] = useState(true);\n\n" +
"  useEffect(() => {\n" +
"    fetch('/api/trips').then(r => r.json()).then(data => {\n" +
"      setTrips(data.trips || []);\n" +
"      setLoading(false);\n" +
"    }).catch(() => setLoading(false));\n" +
"  }, []);\n\n" +
"  const totalRevenue = trips.reduce((acc: number, t: any) => acc + (parseFloat(t.tripCost) || 0), 0);\n" +
"  const cashTrips = trips.filter((t: any) => t.payment_method?.toLowerCase() === 'cash');\n" +
"  const cardTrips = trips.filter((t: any) => t.payment_method?.toLowerCase() !== 'cash');\n" +
"  const cashRevenue = cashTrips.reduce((acc: number, t: any) => acc + (parseFloat(t.tripCost) || 0), 0);\n\n" +
"  return (\n" +
"    <MainLayout>\n" +
"      <div className=\"p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]\">\n" +
"        <div className=\"flex items-center gap-3 orbit-card bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm\">\n" +
"          <TrendingUp className=\"text-[#39379e] w-8 h-8\" />\n" +
"          <div>\n" +
"            <h1 className=\"text-2xl font-bold tracking-tight text-[var(--foreground)]\">Ride Accounting</h1>\n" +
"            <p className=\"text-[var(--text-muted)] text-xs mt-1\">Revenue analytics derived from live trip data.</p>\n" +
"          </div>\n" +
"        </div>\n\n" +
"        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">\n" +
"          <div className=\"orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-sm\">\n" +
"            <div className=\"flex items-center gap-4\">\n" +
"              <div className=\"p-3 bg-blue-500/10 rounded-xl\"><DollarSign className=\"text-blue-500\" /></div>\n" +
"              <div>\n" +
"                <p className=\"text-[var(--text-muted)] text-sm font-semibold uppercase tracking-wider\">Total Trip Revenue</p>\n" +
"                <h3 className=\"text-2xl font-bold text-[var(--foreground)]\">GHS ${totalRevenue.toFixed(2)}</h3>\n" +
"              </div>\n" +
"            </div>\n" +
"          </div>\n" +
"          <div className=\"orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-sm\">\n" +
"            <div className=\"flex items-center gap-4\">\n" +
"              <div className=\"p-3 bg-emerald-500/10 rounded-xl\"><Banknote className=\"text-emerald-500\" /></div>\n" +
"              <div>\n" +
"                <p className=\"text-[var(--text-muted)] text-sm font-semibold uppercase tracking-wider\">Cash Revenue</p>\n" +
"                <h3 className=\"text-2xl font-bold text-[var(--foreground)]\">GHS ${cashRevenue.toFixed(2)}</h3>\n" +
"              </div>\n" +
"            </div>\n" +
"          </div>\n" +
"          <div className=\"orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-sm\">\n" +
"            <div className=\"flex items-center gap-4\">\n" +
"              <div className=\"p-3 bg-purple-500/10 rounded-xl\"><CreditCard className=\"text-purple-500\" /></div>\n" +
"              <div>\n" +
"                <p className=\"text-[var(--text-muted)] text-sm font-semibold uppercase tracking-wider\">Card/Digital Revenue</p>\n" +
"                <h3 className=\"text-2xl font-bold text-[var(--foreground)]\">GHS ${totalRevenue - cashRevenue).toFixed(2)}</h3>\n" +
"              </div>\n" +
"            </div>\n" +
"          </div>\n" +
"        </div>\n" +
"      </div>\n" +
"    </MainLayout>\n" +
"  );\n" +
"}");

writePage('payments', "'use client';\n" +
"import React, { useState, useEffect } from 'react';\n" +
"import MainLayout from '@/components/layout/MainLayout';\n" +
"import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';\n\n" +
"export default function PaymentsPage() {\n" +
"  const [trips, setTrips] = useState([]);\n" +
"  const [loading, setLoading] = useState(true);\n\n" +
"  useEffect(() => {\n" +
"    fetch('/api/trips').then(r => r.json()).then(data => {\n" +
"      setTrips(data.trips || []);\n" +
"      setLoading(false);\n" +
"    }).catch(() => setLoading(false));\n" +
"  }, []);\n\n" +
"  return (\n" +
"    <MainLayout>\n" +
"      <div className=\"p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]\">\n" +
"        <div className=\"flex items-center gap-3 orbit-card bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm\">\n" +
"          <CreditCard className=\"text-[#39379e] w-8 h-8\" />\n" +
"          <div>\n" +
"            <h1 className=\"text-2xl font-bold tracking-tight text-[var(--foreground)]\">Trip Payments</h1>\n" +
"            <p className=\"text-[var(--text-muted)] text-xs mt-1\">Payment statuses for all completed ride requests.</p>\n" +
"          </div>\n" +
"        </div>\n\n" +
"        <div className=\"orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm\">\n" +
"          <table className=\"orbit-table w-full\">\n" +
"            <thead>\n" +
"              <tr>\n" +
"                <th className=\"text-left\">Trip ID</th>\n" +
"                <th className=\"text-left\">Customer</th>\n" +
"                <th className=\"text-left\">Amount</th>\n" +
"                <th className=\"text-left\">Method</th>\n" +
"                <th className=\"text-left\">Status</th>\n" +
"              </tr>\n" +
"            </thead>\n" +
"            <tbody className=\"divide-y divide-[var(--border-color)]\">\n" +
"              {loading ? (\n" +
"                <tr><td colSpan={5} className=\"p-8 text-center text-[var(--text-muted)] text-xs font-semibold\">Loading payments...</td></tr>\n" +
"              ) : trips.map((t: any) => (\n" +
"                <tr key={t.tripID || Math.random()} className=\"hover:bg-[var(--hover-bg)] transition\">\n" +
"                  <td className=\"p-4 text-[var(--text-muted)] text-sm font-mono\">{t.tripID?.substring(0,8) || 'N/A'}</td>\n" +
"                  <td className=\"p-4 text-[var(--foreground)] font-medium\">{t.rider_name || 'Unknown'}</td>\n" +
"                  <td className=\"p-4 text-emerald-600 dark:text-emerald-500 font-bold\">GHS ${parseFloat(t.tripCost || 0).toFixed(2)}</td>\n" +
"                  <td className=\"p-4 text-[var(--text-secondary)]\">{t.payment_method || 'Cash'}</td>\n" +
"                  <td className=\"p-4\">\n" +
"                    <span className={`badge inline-flex items-center gap-1 GHS ${t.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>\n" +
"                      {t.paymentStatus === 'paid' ? <CheckCircle size={12}/> : <AlertCircle size={12}/>}\n" +
"                      {t.paymentStatus || 'pending'}\n" +
"                    </span>\n" +
"                  </td>\n" +
"                </tr>\n" +
"              ))}\n" +
"            </tbody>\n" +
"          </table>\n" +
"        </div>\n" +
"      </div>\n" +
"    </MainLayout>\n" +
"  );\n" +
"}");

writePage('pipeline', "'use client';\n" +
"import React, { useState, useEffect } from 'react';\n" +
"import MainLayout from '@/components/layout/MainLayout';\n" +
"import { Filter, Clock, UserCheck, ShieldAlert } from 'lucide-react';\n\n" +
"export default function PipelinePage() {\n" +
"  const [drivers, setDrivers] = useState([]);\n" +
"  const [loading, setLoading] = useState(true);\n\n" +
"  useEffect(() => {\n" +
"    fetch('/api/drivers').then(r => r.json()).then(data => {\n" +
"      setDrivers(data.drivers || []);\n" +
"      setLoading(false);\n" +
"    }).catch(() => setLoading(false));\n" +
"  }, []);\n\n" +
"  const pending = drivers.filter((d: any) => !d.document_uploaded && !d.blocked);\n" +
"  const approved = drivers.filter((d: any) => d.document_uploaded && !d.blocked);\n" +
"  const blocked = drivers.filter((d: any) => d.blocked);\n\n" +
"  return (\n" +
"    <MainLayout>\n" +
"      <div className=\"p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]\">\n" +
"        <div className=\"flex items-center gap-3 orbit-card bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm\">\n" +
"          <Filter className=\"text-[#39379e] w-8 h-8\" />\n" +
"          <div>\n" +
"            <h1 className=\"text-2xl font-bold tracking-tight text-[var(--foreground)]\">Driver Onboarding Pipeline</h1>\n" +
"            <p className=\"text-[var(--text-muted)] text-xs mt-1\">Manage applicants through the verification stages.</p>\n" +
"          </div>\n" +
"        </div>\n\n" +
"        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">\n" +
"          <div className=\"orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden flex flex-col shadow-sm\">\n" +
"            <div className=\"p-4 border-b border-[var(--border-color)] bg-yellow-500/10 flex justify-between items-center\">\n" +
"              <h3 className=\"font-bold text-yellow-700 dark:text-yellow-500 flex items-center gap-2\"><Clock size={18}/> Pending Docs</h3>\n" +
"              <span className=\"badge badge-warning font-bold\">{pending.length}</span>\n" +
"            </div>\n" +
"            <div className=\"p-4 space-y-4 flex-1\">\n" +
"              {pending.map((d: any) => (\n" +
"                <div key={d.driverID} className=\"bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] hover:border-yellow-500/50 transition\">\n" +
"                  <h4 className=\"text-[var(--foreground)] font-bold\">{d.driverName || 'No Name'}</h4>\n" +
"                  <p className=\"text-sm text-[var(--text-muted)]\">{d.driverPhone}</p>\n" +
"                </div>\n" +
"              ))}\n" +
"            </div>\n" +
"          </div>\n\n" +
"          <div className=\"orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden flex flex-col shadow-sm\">\n" +
"            <div className=\"p-4 border-b border-[var(--border-color)] bg-green-500/10 flex justify-between items-center\">\n" +
"              <h3 className=\"font-bold text-green-700 dark:text-green-500 flex items-center gap-2\"><UserCheck size={18}/> Approved</h3>\n" +
"              <span className=\"badge badge-success font-bold\">{approved.length}</span>\n" +
"            </div>\n" +
"            <div className=\"p-4 space-y-4 flex-1\">\n" +
"              {approved.map((d: any) => (\n" +
"                <div key={d.driverID} className=\"bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] hover:border-green-500/50 transition\">\n" +
"                  <h4 className=\"text-[var(--foreground)] font-bold\">{d.driverName || 'No Name'}</h4>\n" +
"                  <p className=\"text-sm text-[var(--text-muted)]\">{d.driverPhone}</p>\n" +
"                </div>\n" +
"              ))}\n" +
"            </div>\n" +
"          </div>\n\n" +
"          <div className=\"orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden flex flex-col shadow-sm\">\n" +
"            <div className=\"p-4 border-b border-[var(--border-color)] bg-red-500/10 flex justify-between items-center\">\n" +
"              <h3 className=\"font-bold text-red-700 dark:text-red-500 flex items-center gap-2\"><ShieldAlert size={18}/> Blocked</h3>\n" +
"              <span className=\"badge badge-danger font-bold\">{blocked.length}</span>\n" +
"            </div>\n" +
"            <div className=\"p-4 space-y-4 flex-1\">\n" +
"              {blocked.map((d: any) => (\n" +
"                <div key={d.driverID} className=\"bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] hover:border-red-500/50 transition\">\n" +
"                  <h4 className=\"text-[var(--foreground)] font-bold\">{d.driverName || 'No Name'}</h4>\n" +
"                  <p className=\"text-sm text-[var(--text-muted)]\">{d.driverPhone}</p>\n" +
"                </div>\n" +
"              ))}\n" +
"            </div>\n" +
"          </div>\n" +
"        </div>\n" +
"      </div>\n" +
"    </MainLayout>\n" +
"  );\n" +
"}");

writePage('orders', "'use client';\n" +
"import React, { useState, useEffect } from 'react';\n" +
"import MainLayout from '@/components/layout/MainLayout';\n" +
"import { ShoppingCart, MapPin, Clock } from 'lucide-react';\n\n" +
"export default function OrdersPage() {\n" +
"  const [trips, setTrips] = useState([]);\n" +
"  const [loading, setLoading] = useState(true);\n\n" +
"  useEffect(() => {\n" +
"    fetch('/api/trips').then(r => r.json()).then(data => {\n" +
"      setTrips(data.trips || []);\n" +
"      setLoading(false);\n" +
"    }).catch(() => setLoading(false));\n" +
"  }, []);\n\n" +
"  return (\n" +
"    <MainLayout>\n" +
"      <div className=\"p-6 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]\">\n" +
"        <div className=\"flex items-center gap-3 orbit-card bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm\">\n" +
"          <ShoppingCart className=\"text-[#39379e] w-8 h-8\" />\n" +
"          <div>\n" +
"            <h1 className=\"text-2xl font-bold tracking-tight text-[var(--foreground)]\">Ride Orders (Trips)</h1>\n" +
"            <p className=\"text-[var(--text-muted)] text-xs mt-1\">Real-time overview of customer trip requests.</p>\n" +
"          </div>\n" +
"        </div>\n\n" +
"        <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">\n" +
"          {loading ? (\n" +
"            <div className=\"col-span-full p-8 text-center text-[var(--text-muted)] text-xs font-semibold\">Loading orders...</div>\n" +
"          ) : trips.map((t: any) => (\n" +
"            <div key={t.tripID || Math.random()} className=\"orbit-card bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 hover:border-[#39379e]/50 transition shadow-sm\">\n" +
"              <div className=\"flex justify-between items-start mb-4\">\n" +
"                <span className={`badge GHS ${t.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'} uppercase font-bold text-[10px]`}>{t.paymentStatus || 'Pending'}</span>\n" +
"                <span className=\"text-[var(--text-muted)] text-xs flex items-center gap-1\"><Clock size={12}/> {new Date(t.created_at || Date.now()).toLocaleDateString()}</span>\n" +
"              </div>\n" +
"              <h3 className=\"text-lg font-bold text-[var(--foreground)] mb-4\">{t.rider_name || 'Guest Rider'}</h3>\n" +
"              \n" +
"              <div className=\"space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border-color)] before:to-transparent\">\n" +
"                <div className=\"relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active\">\n" +
"                  <div className=\"flex items-center justify-center w-6 h-6 rounded-full border-2 border-[var(--background)] bg-emerald-500 text-white shrink-0 shadow z-10\"></div>\n" +
"                  <div className=\"w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-2 rounded border border-[var(--border-color)] bg-[var(--background)]\">\n" +
"                    <p className=\"text-xs text-[var(--foreground)] truncate\">{t.pickup_address}</p>\n" +
"                  </div>\n" +
"                </div>\n" +
"                <div className=\"relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active\">\n" +
"                  <div className=\"flex items-center justify-center w-6 h-6 rounded-full border-2 border-[var(--background)] bg-red-500 text-white shrink-0 shadow z-10\"></div>\n" +
"                  <div className=\"w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-2 rounded border border-[var(--border-color)] bg-[var(--background)]\">\n" +
"                    <p className=\"text-xs text-[var(--foreground)] truncate\">{t.destination_address}</p>\n" +
"                  </div>\n" +
"                </div>\n" +
"              </div>\n" +
"              \n" +
"              <div className=\"mt-5 pt-4 border-t border-[var(--border-color)] flex justify-between items-center\">\n" +
"                <span className=\"text-[var(--text-muted)] text-sm font-semibold uppercase\">Fare</span>\n" +
"                <span className=\"text-[var(--foreground)] font-bold text-xl\">GHS ${parseFloat(t.tripCost || 0).toFixed(2)}</span>\n" +
"              </div>\n" +
"            </div>\n" +
"          ))}\n" +
"        </div>\n" +
"      </div>\n" +
"    </MainLayout>\n" +
"  );\n" +
"}");

console.log("Re-rendered Ride modules with flawless professional styles!");
