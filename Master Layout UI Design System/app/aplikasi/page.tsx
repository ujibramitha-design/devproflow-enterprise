"use client"

import { Search, Plus, Filter, Eye, MoreHorizontal, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = "Disetujui" | "Review" | "Ditolak" | "Proses Verifikasi"

const statusConfig: Record<Status, { bg: string; text: string; dot: string }> = {
  Disetujui: { bg: "bg-emerald-500/10", text: "text-emerald-700", dot: "bg-emerald-500" },
  Review: { bg: "bg-amber-500/10", text: "text-amber-700", dot: "bg-amber-500" },
  Ditolak: { bg: "bg-rose-500/10", text: "text-rose-600", dot: "bg-rose-500" },
  "Proses Verifikasi": { bg: "bg-sky-500/10", text: "text-sky-700", dot: "bg-sky-500" },
}

const allApplications = [
  { id: "KPR-2026-001", name: "Ahmad Fauzi", nik: "3201****5678", plafon: "Rp 450.000.000", status: "Disetujui" as Status, date: "28 Feb 2026", unit: "Grand Emerald Residence" },
  { id: "KPR-2026-002", name: "Siti Nurhaliza", nik: "3202****9012", plafon: "Rp 620.000.000", status: "Review" as Status, date: "27 Feb 2026", unit: "Skyview Apartment" },
  { id: "KPR-2026-003", name: "Budi Santoso", nik: "3203****3456", plafon: "Rp 380.000.000", status: "Proses Verifikasi" as Status, date: "26 Feb 2026", unit: "Citra Gardenia" },
  { id: "KPR-2026-004", name: "Dewi Kartika", nik: "3204****7890", plafon: "Rp 550.000.000", status: "Ditolak" as Status, date: "25 Feb 2026", unit: "Pine Wood Mansion" },
  { id: "KPR-2026-005", name: "Reza Mahendra", nik: "3205****2345", plafon: "Rp 780.000.000", status: "Disetujui" as Status, date: "24 Feb 2026", unit: "The Zenith Office" },
]

export default function AplikasiPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground uppercase flex items-center gap-3">
            <FileText className="size-6 text-primary" /> Daftar Aplikasi KPR
          </h2>
          <p className="mt-1 text-[13px] text-muted-foreground">Manajemen seluruh pengajuan kredit pemilikan rumah secara komprehensif.</p>
        </div>
        <button className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
          <Plus className="size-4" /> Pengajuan Baru
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total Aplikasi", value: "1.248", color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Dalam Proses", value: "342", color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Selesai", value: "906", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/40">
            <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground/60">{stat.label}</p>
            <p className={cn("text-2xl font-black mt-1", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card shadow-sm ring-1 ring-border/40 overflow-hidden">
        <div className="px-6 py-5 border-b border-border/20 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <input type="text" placeholder="Cari nomor aplikasi atau nama nasabah..." className="h-10 w-full rounded-xl bg-secondary/40 border-0 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/15 transition-all" />
          </div>
          <button className="flex h-10 items-center gap-2 rounded-xl bg-secondary/60 px-4 text-[12px] font-bold text-muted-foreground hover:bg-secondary transition-all">
            <Filter className="size-3.5" /> Filter
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/10">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">ID & Tanggal</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Nasabah</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Unit Properti</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Plafon</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Status</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {allApplications.map((app) => {
                const status = statusConfig[app.status]
                return (
                  <tr key={app.id} className="group hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-bold text-foreground">{app.id}</p>
                      <p className="text-[11px] text-muted-foreground">{app.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-bold text-foreground">{app.name}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">{app.nik}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-medium text-foreground">{app.unit}</p>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-foreground">{app.plafon}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("gap-1.5 rounded-full border-0 px-3 py-1 text-[10px] font-black uppercase", status.bg, status.text)}>
                        <span className={cn("size-1.5 rounded-full", status.dot)} />
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"><Eye className="size-4" /></button>
                        <button className="p-2 rounded-lg text-muted-foreground hover:bg-secondary"><MoreHorizontal className="size-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
