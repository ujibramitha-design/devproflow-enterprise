"use client"

import { User, Globe, Lock, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Pengaturan Sistem</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">Konfigurasi parameter operasional dan keamanan akun enterprise Anda.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3 flex flex-col gap-1.5">
          {[
            { label: "Profil Umum", icon: User, active: true },
            { label: "Keamanan", icon: Lock, active: false },
            { label: "Domain", icon: Globe, active: false },
          ].map((item, i) => (
            <button key={i} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-black transition-all ${
              item.active ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:bg-secondary/80'
            }`}>
              <item.icon className="size-4.5" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="rounded-3xl bg-card p-8 shadow-sm ring-1 ring-border/40 border-b-4 border-primary/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black flex items-center gap-2"><User className="size-5 text-primary" /> Informasi Dasar</h3>
              <Badge className="bg-emerald-500 text-white font-black">Live Production</Badge>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Nama Identitas Sistem</label>
                <input type="text" defaultValue="DEVPro FLOW System Enterprise" className="h-12 rounded-2xl bg-secondary/40 border border-border/20 px-5 text-sm font-semibold outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
              </div>
              <div className="grid gap-2">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Email Notifikasi</label>
                <input type="email" defaultValue="admin@devproflow.id" className="h-12 rounded-2xl bg-secondary/40 border border-border/20 px-5 text-sm font-semibold outline-none" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="h-12 px-8 rounded-2xl text-sm font-black text-muted-foreground hover:bg-secondary transition-all">Batalkan</button>
            <button className="h-12 px-10 rounded-2xl bg-primary text-primary-foreground text-sm font-black shadow-xl flex items-center gap-2.5 hover:bg-primary/90 transition-all">
              <Save className="size-4.5" /> Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
