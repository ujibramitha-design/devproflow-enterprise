"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Wallet, 
  Banknote, 
  History, 
  Search, 
  Filter, 
  Landmark, 
  CheckCircle2, 
  MoreHorizontal, 
  FileDown, 
  Plus, 
  AlertCircle, 
  ArrowUpRight,
  FileSpreadsheet
} from "lucide-react"
import { cn } from "@/lib/utils"
import * as XLSX from 'xlsx'

const transactions = [
  { id: "TX-2026-001", client: "Andi Wijaya", type: "Booking Fee", amount: 5000000, status: "Verified", bank: "Mandiri", date: "Hari ini, 10:45" },
  { id: "TX-2026-002", client: "Siska Putri", type: "Down Payment", amount: 150000000, status: "Pending", bank: "BCA", date: "Hari ini, 09:12" },
  { id: "TX-2026-003", client: "Robert Han", type: "Angsuran #4", amount: 12500000, status: "Verified", bank: "BRI", date: "Kemarin" },
  { id: "TX-2026-004", client: "Dewi Kartika", type: "Pelunasan", amount: 420000000, status: "Rejected", bank: "BCA", date: "2 Hari lalu" },
];

export default function FinanceDashboard() {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
    XLSX.writeFile(workbook, "Finance_Ledger_DEVPro.xlsx");
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground uppercase">Finance Hub</h2>
          <p className="text-muted-foreground text-sm mt-1 font-medium">Verified transactions, cashflow monitoring, and ledger management.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportToExcel}
            className="h-10 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center gap-2 hover:bg-emerald-100 shadow-sm transition-all cursor-pointer"
          >
            <FileSpreadsheet className="size-4" /> Export Ledger (XLSX)
          </button>
          <button className="h-10 px-4 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <Plus className="size-4" /> New Disbursement
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Available Liquidity", value: "Rp 4.28 M", sub: "Operational Cash", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Accounts Receivable", value: "Rp 12.5 M", sub: "Outstanding Invoices", icon: Banknote, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Verification Queue", value: "8 Pending", sub: "Awaiting review", icon: History, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="p-6 border-0 shadow-sm ring-1 ring-border/40 bg-card">
            <div className="flex items-start justify-between">
              <div className={cn("size-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("size-6", stat.color)} />
              </div>
              <div className="flex flex-col items-end text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1.5">{stat.label}</p>
                <h3 className="text-xl font-black text-foreground leading-none">{stat.value}</h3>
                <p className="text-[9px] font-bold text-muted-foreground uppercase mt-2">{stat.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8 p-0 border-0 shadow-sm ring-1 ring-border/40 overflow-hidden bg-card">
          <div className="px-6 py-5 border-b border-border/20 flex items-center justify-between bg-secondary/5">
            <h4 className="font-black text-sm uppercase tracking-widest text-primary flex items-center gap-2">
              <History className="size-4" /> Incoming Transactions
            </h4>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
                <input type="text" placeholder="Search..." className="h-8 w-48 rounded-lg bg-background border border-border/40 pl-9 pr-4 text-[11px] outline-none" />
              </div>
              <button className="p-2 rounded-lg bg-background border border-border/40 text-muted-foreground hover:bg-secondary"><Filter className="size-3.5" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/10">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Nasabah</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Kategori</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Nominal</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Bank</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-secondary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-[12px] font-bold text-foreground uppercase tracking-tight">{tx.client}</p>
                      <p className="text-[10px] font-mono text-muted-foreground/60">{tx.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[9px] font-black uppercase border-0 bg-secondary/40 px-2 py-0.5">{tx.type}</Badge>
                    </td>
                    <td className="px-6 py-4 text-[12px] font-black text-foreground">Rp {tx.amount.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Landmark className="size-3 text-muted-foreground/40" />
                        <span className="text-[11px] font-bold text-muted-foreground">{tx.bank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase border-0 px-2 py-0.5",
                        tx.status === "Verified" ? "bg-emerald-500/10 text-emerald-600" : 
                        tx.status === "Pending" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"
                      )}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-secondary"><MoreHorizontal className="size-4 text-muted-foreground" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="lg:col-span-4 p-6 border-0 shadow-sm ring-1 ring-border/40 bg-card">
          <h4 className="font-black text-sm uppercase tracking-widest text-primary mb-6">Payment Realization</h4>
          <div className="space-y-8">
            {[
              { label: "DP Realization", val: 65, color: "bg-indigo-500", target: "Rp 2.5 M" },
              { label: "Installments", val: 88, color: "bg-emerald-500", target: "Rp 1.2 M" },
              { label: "Disbursement", val: 24, color: "bg-rose-500", target: "Rp 3.0 M" },
            ].map((item) => (
              <div key={item.label} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-foreground uppercase tracking-wider">{item.label}</span>
                  <span className="text-[10px] font-bold text-muted-foreground">{item.val}%</span>
                </div>
                <Progress value={item.val} className="h-1.5" />
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Target: {item.target}</span>
                  <ArrowUpRight className="size-3 text-primary" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}