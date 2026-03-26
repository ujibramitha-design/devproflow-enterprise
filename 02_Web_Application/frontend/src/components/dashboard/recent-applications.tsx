"use client"

import Link from "next/link"
import { Eye, MoreHorizontal, ArrowUpRight, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = "Disetujui" | "Review" | "Ditolak" | "Proses Verifikasi"

const statusConfig: Record<string, { bg: string; text: string; dot: string; shadow: string }> = {
  Disetujui: {
    bg: "bg-devpro-emerald/10",
    text: "text-devpro-emerald",
    dot: "bg-devpro-emerald",
    shadow: "shadow-[0_0_8px_rgba(16,185,129,0.4)]",
  },
  Review: {
    bg: "bg-amber-400/10",
    text: "text-amber-400",
    dot: "bg-amber-400",
    shadow: "shadow-[0_0_8px_rgba(251,191,36,0.4)]",
  },
  Ditolak: {
    bg: "bg-rose-400/10",
    text: "text-rose-400",
    dot: "bg-rose-400",
    shadow: "shadow-[0_0_8px_rgba(251,113,133,0.4)]",
  },
  "Proses Verifikasi": {
    bg: "bg-devpro-neon/10",
    text: "text-devpro-neon",
    dot: "bg-devpro-neon",
    shadow: "shadow-[0_0_8px_rgba(0,255,204,0.4)]",
  },
  "Menunggu Persetujuan": {
    bg: "bg-blue-400/10",
    text: "text-blue-400",
    dot: "bg-blue-400",
    shadow: "shadow-[0_0_8px_rgba(96,165,250,0.4)]",
  },
}

const applications = [
  {
    name: "Ahmad Fauzi",
    initials: "AF",
    nik: "3201****5678",
    plafon: "Rp 450.000.000",
    tenor: "20 Years",
    status: "Disetujui",
    tanggal: "28 Feb 2026",
  },
  {
    name: "Siti Nurhaliza",
    initials: "SN",
    nik: "3202****9012",
    plafon: "Rp 675.000.000",
    tenor: "15 Years",
    status: "Proses Verifikasi",
    tanggal: "01 Mar 2026",
  },
  {
    name: "Budi Santoso",
    initials: "BS",
    nik: "3203****3456",
    plafon: "Rp 320.000.000",
    tenor: "25 Years",
    status: "Menunggu Persetujuan",
    tanggal: "03 Mar 2026",
  },
  {
    name: "Dewi Kartika",
    initials: "DK",
    nik: "3204****7890",
    plafon: "Rp 550.000.000",
    tenor: "20 Years",
    status: "Ditolak",
    tanggal: "25 Feb 2026",
  },
]

export function RecentApplications() {
  return (
    <div className="rounded-xl bg-devpro-charcoal border border-devpro-slate/30 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-6 border-b border-devpro-navy/50">
        <div>
          <h3 className="text-base font-black text-devpro-text-primary uppercase tracking-wider">
            Recent Applications
          </h3>
          <p className="mt-1 text-[11px] font-medium text-devpro-text-secondary uppercase tracking-tighter">
            Live queue of the latest 4 enterprise KPR submissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-9 items-center gap-2 rounded-lg bg-devpro-navy px-4 text-xs font-bold text-devpro-text-secondary border border-devpro-slate/50 transition-all hover:border-devpro-neon hover:text-devpro-neon">
            <Filter className="size-3.5" strokeWidth={2.5} />
            FILTER
          </button>
          <Link 
            href="/aplikasi" 
            className="flex h-9 items-center gap-2 rounded-lg bg-devpro-neon px-4 text-xs font-black text-devpro-navy transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,255,204,0.2)]"
          >
            VIEW ALL
            <ArrowUpRight className="size-3.5" strokeWidth={3} />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-devpro-navy/30">
              <th className="px-6 py-4 text-left text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">
                Applicant
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">
                Application Detail
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app.nik} className="border-t border-devpro-navy/50 transition-colors hover:bg-devpro-navy/40 group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-devpro-navy border border-devpro-slate/50 text-devpro-neon font-black text-sm shadow-inner group-hover:border-devpro-neon/30 transition-all">
                      {app.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-devpro-text-primary group-hover:text-devpro-neon transition-colors">{app.name}</p>
                      <p className="text-[11px] font-medium text-devpro-text-secondary font-mono tracking-tighter">{app.nik}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-devpro-text-primary tracking-tight">{app.plafon}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-devpro-text-secondary uppercase">{app.tenor}</span>
                      <span className="size-1 rounded-full bg-devpro-slate/50" />
                      <span className="text-[11px] font-medium text-devpro-neon/60 uppercase">{app.tanggal}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border border-current/20",
                    statusConfig[app.status].bg,
                    statusConfig[app.status].text
                  )}>
                    <div className={cn("size-1.5 rounded-full animate-pulse", statusConfig[app.status].dot, statusConfig[app.status].shadow)} />
                    {app.status}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="flex size-8 items-center justify-center rounded-lg bg-devpro-navy border border-devpro-slate/50 text-devpro-text-secondary hover:text-devpro-neon hover:border-devpro-neon transition-all">
                      <Eye className="size-4" strokeWidth={2.5} />
                    </button>
                    <button className="flex size-8 items-center justify-center rounded-lg bg-devpro-navy border border-devpro-slate/50 text-devpro-text-secondary hover:text-devpro-neon hover:border-devpro-neon transition-all">
                      <MoreHorizontal className="size-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-devpro-navy/30 px-6 py-4 flex items-center justify-center border-t border-devpro-navy/50">
        <span className="text-[10px] font-bold text-devpro-text-secondary uppercase tracking-[0.2em]">
          End of Queue - Security Audit Log Active
        </span>
      </div>
    </div>
  )
}
