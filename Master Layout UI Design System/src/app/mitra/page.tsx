"use client"

import { Landmark, RefreshCw, Clock } from "lucide-react"

const partners = [
  { name: "Bank Mandiri", status: "Active", type: "API Integration", lastSync: "2 menit yang lalu", health: 98 },
  { name: "Bank BCA", status: "Maintenance", type: "Webhook", lastSync: "1 jam yang lalu", health: 45 },
  { name: "Bank BRI", status: "Active", type: "SOAP Service", lastSync: "15 menit yang lalu", health: 92 },
]

export default function MitraPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Mitra Bisnis</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">Kelola konektivitas dan integrasi bank mitra sistem Anda.</p>
        </div>
        <button className="flex h-10 items-center gap-2 rounded-xl bg-secondary px-4 text-[13px] font-bold border border-border/60 hover:bg-secondary/80 transition-all">
          <RefreshCw className="size-4" /> Re-Sync Koneksi
        </button>
      </div>

      <div className="grid gap-4">
        {partners.map((p, i) => (
          <div key={i} className="group rounded-3xl border border-border/40 p-6 bg-card flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:shadow-lg">
            <div className="flex items-center gap-6">
              <div className="size-16 bg-secondary/30 rounded-2xl flex items-center justify-center text-primary border border-border/20">
                <Landmark className="size-8" />
              </div>
              <div>
                <h4 className="text-lg font-black">{p.name}</h4>
                <div className="flex items-center gap-4 mt-1 text-[11px] text-muted-foreground font-medium">
                  <span className="uppercase tracking-widest font-black text-primary/60">{p.type}</span>
                  <span className="flex items-center gap-1.5"><Clock className="size-3" /> Sinkron: {p.lastSync}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-muted-foreground">CONNECTION HEALTH</span>
                <div className="h-1.5 w-32 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full ${p.health > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${p.health}%` }} />
                </div>
              </div>
              <button className="h-10 px-4 rounded-xl bg-primary/10 text-[12px] font-black text-primary hover:bg-primary hover:text-white transition-all">Konfigurasi</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
