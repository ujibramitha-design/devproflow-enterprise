"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  History, 
  FileText,
  ChevronRight,
  Download,
  UserPlus,
  ArrowUpRight,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Format } from "@/lib/global-store"

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "Active Loan": { bg: "bg-devpro-emerald/10", text: "text-devpro-emerald", dot: "bg-devpro-emerald" },
  "In Review": { bg: "bg-devpro-neon/10", text: "text-devpro-neon", dot: "bg-devpro-neon" },
  "Prospect": { bg: "bg-amber-400/10", text: "text-amber-400", dot: "bg-amber-400" },
  "Rejected": { bg: "bg-rose-400/10", text: "text-rose-400", dot: "bg-rose-400" },
}

export default function CustomerCrmPage() {
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customersApi, setCustomersApi] = useState<any[]>([])

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      setError(null)
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://devproflow.com/api").replace(/\/+$/, "")
        const response = await fetch(`${apiBase}/customers`, { cache: "no-store" })
        if (!response.ok) {
          throw new Error(`Failed to fetch customers: HTTP ${response.status}`)
        }
        const payload: unknown = await response.json()
        const rows: any[] = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as any)?.data)
            ? (payload as any).data
            : []
        setCustomersApi(rows)
      } catch (e) {
        setCustomersApi([])
        setError(e instanceof Error ? e.message : "Gagal memuat data customer")
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const customers = customersApi.map((customer, index) => {
      const status = customer.status ? String(customer.status).toUpperCase() : "UNKNOWN"
      let customerStatus = "Prospect"
      
      if (["CAIR"].includes(status)) {
        customerStatus = "Active Loan"
      } else if (["AKAD"].includes(status)) {
        customerStatus = "In Review"
      } else if (["SOLD","TERJUAL"].includes(status)) {
        customerStatus = "Active Loan"
      }

      return {
        id: String(customer.customer_id ?? customer.id ?? `C${String(index + 1).padStart(3, '0')}`),
        name: String(customer.name ?? customer.nama_customer ?? "—"),
        email: String(customer.email ?? customer.email_cust ?? "—"),
        phone: String(customer.phone ?? customer.wa_cust ?? "—"),
        status: customerStatus,
        project: String(customer.project ?? customer.siteplan ?? "—"),
        unit: customer.blok && customer.nomor ? `Block ${customer.blok}-${customer.nomor}` : String(customer.id_unit ?? customer.unit_id ?? "—"),
        history: String(customer.history ?? "1 Application"),
        lastActive: customer.updated_at ? Format.dateShort(customer.updated_at) : "—",
        plafon: customer.plafon ? Format.rupiah(customer.plafon) : "—",
        bank: String(customer.bank ?? customer.bank_final ?? "—"),
        sales: String(customer.sales ?? customer.sales_koordinator ?? "—"),
      }
    })

  // Filter customers based on search
  const filteredCustomers = customers.filter((customer) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      customer.name.toLowerCase().includes(q) ||
      customer.email.toLowerCase().includes(q) ||
      customer.phone.toLowerCase().includes(q) ||
      customer.id.toLowerCase().includes(q) ||
      customer.project.toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in bg-devpro-navy min-h-screen">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-devpro-text-primary uppercase">
            Customer <span className="text-devpro-neon">CRM</span>
          </h2>
          <p className="text-devpro-text-secondary font-medium uppercase tracking-tighter text-sm mt-1">
            Enterprise customer relationship management and loan tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 rounded-xl border-devpro-slate/50 text-devpro-text-secondary font-bold uppercase tracking-widest text-[10px]">
            <Download className="size-3.5 mr-2" /> Export CSV
          </Button>
          <Button className="bg-devpro-neon text-devpro-navy font-black uppercase tracking-widest text-xs h-11 px-6 rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)]">
            <UserPlus className="size-4 mr-2" strokeWidth={3} /> Add New Customer
          </Button>
        </div>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10">
          <AlertCircle className="size-4 text-rose-400 mt-0.5 shrink-0" />
          <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
        </div>
      )}

      <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-4 p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-devpro-text-secondary" />
            <Input 
              className="bg-devpro-navy border-devpro-slate/50 text-devpro-text-primary pl-10 rounded-xl focus:border-devpro-neon/50 h-11" 
              placeholder="Search by name, email, phone or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto h-11 rounded-xl border-devpro-slate/50 text-devpro-text-secondary font-bold uppercase tracking-widest text-[10px]">
            <Filter className="size-3.5 mr-2" /> Advanced Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-devpro-navy/30">
                <th className="px-6 py-4 text-left text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">Customer ID</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">Customer Info</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">Current Unit</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">Activity</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t border-devpro-navy/50">
                    <td className="px-6 py-5"><div className="h-4 w-12 bg-muted animate-pulse rounded" /></td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-muted animate-pulse rounded-xl" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                          <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-5"><div className="h-6 w-20 bg-muted animate-pulse rounded" /></td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="size-8 bg-muted animate-pulse rounded-lg" />
                        <div className="size-8 bg-muted animate-pulse rounded-lg" />
                        <div className="size-8 bg-muted animate-pulse rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-t border-devpro-navy/50 transition-colors hover:bg-devpro-navy/40 group">
                    <td className="px-6 py-5">
                      <span className="text-[11px] font-black text-devpro-neon font-mono">{customer.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-devpro-navy border border-devpro-slate/50 text-devpro-text-primary font-black text-xs">
                          {customer.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-devpro-text-primary group-hover:text-devpro-neon transition-colors">{customer.name}</p>
                          <p className="text-[11px] text-devpro-text-secondary mt-0.5">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-[12px] font-bold text-devpro-text-primary uppercase tracking-tight">{customer.unit}</p>
                        <p className="text-[10px] text-devpro-text-secondary uppercase tracking-tighter">{customer.project}</p>
                        <p className="text-[9px] text-devpro-neon font-mono">{customer.plafon}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={cn(
                        "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-current/20",
                        statusConfig[customer.status].bg,
                        statusConfig[customer.status].text
                      )}>
                        <div className={cn("size-1 rounded-full", statusConfig[customer.status].dot)} />
                        {customer.status}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <History className="size-3 text-devpro-neon/60" />
                          <span className="text-[11px] font-bold text-devpro-text-secondary uppercase">{customer.history}</span>
                        </div>
                        <p className="text-[10px] text-devpro-text-secondary/50 font-medium uppercase italic">Last: {customer.lastActive}</p>
                        <p className="text-[9px] text-devpro-text-secondary">Bank: {customer.bank}</p>
                        <p className="text-[9px] text-devpro-text-secondary">Sales: {customer.sales}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="flex size-8 items-center justify-center rounded-lg bg-devpro-navy/50 border border-devpro-slate/30 text-devpro-text-secondary/50 cursor-not-allowed opacity-50"
                          title="WhatsApp dinonaktifkan sementara (Audit Phase)"
                          disabled
                        >
                          <Phone className="size-3.5" strokeWidth={2.5} />
                        </button>
                        <button className="flex size-8 items-center justify-center rounded-lg bg-devpro-navy border border-devpro-slate/50 text-devpro-text-secondary hover:text-devpro-neon hover:border-devpro-neon transition-all">
                          <Mail className="size-3.5" strokeWidth={2.5} />
                        </button>
                        <button className="flex size-8 items-center justify-center rounded-lg bg-devpro-navy border border-devpro-slate/50 text-devpro-text-secondary hover:text-devpro-neon hover:border-devpro-neon transition-all">
                          <MoreHorizontal className="size-3.5" strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-devpro-text-secondary">
                    {error ? "Gagal memuat data" : search ? "Tidak ada customer yang cocok dengan pencarian" : "Belum ada data customer"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-devpro-navy/30 px-6 py-4 flex items-center justify-between border-t border-devpro-navy/50">
          <span className="text-[10px] font-bold text-devpro-text-secondary uppercase tracking-[0.2em]">
            Showing {filteredCustomers.length} of {customers.length} Enterprise Customers
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-8 text-[10px] font-black text-devpro-text-secondary hover:text-devpro-neon uppercase">Previous</Button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, "...", 12].map((p, i) => (
                <button key={i} className={cn(
                  "size-8 rounded-lg text-[10px] font-black transition-all",
                  p === 1 ? "bg-devpro-neon text-devpro-navy shadow-lg" : "bg-devpro-navy text-devpro-text-secondary hover:border-devpro-neon/50 border border-devpro-slate/50"
                )}>
                  {p}
                </button>
              ))}
            </div>
            <Button variant="ghost" className="h-8 text-[10px] font-black text-devpro-text-secondary hover:text-devpro-neon uppercase">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
