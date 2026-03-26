"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Star, Map, Target, LayoutGrid, Plus, MousePointer2, ExternalLink, TrendingUp, MessageCircle, Phone, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const leads = [
  { name: "Dewi Kartika", source: "Facebook Ads", status: "Hot Lead", interest: "Emerald Type 45", score: 92 },
  { name: "Budi Santoso", source: "Site Visit", status: "Follow Up", interest: "Zenith Suite", score: 78 },
  { name: "Siti Nurhaliza", source: "WA Referral", status: "Warm Lead", interest: "Skyview Studio", score: 65 },
];

export default function MarketingDashboard() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground uppercase tracking-tight">Marketing Center</h2>
          <p className="text-muted-foreground text-sm mt-1 font-medium italic">Lead conversion, interactive siteplans, and digital campaign monitoring.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-xl bg-card border border-border/40 text-xs font-bold flex items-center gap-2 shadow-sm hover:bg-secondary transition-all">
            <LayoutGrid className="size-4" /> Manage Siteplan
          </button>
          <button className="h-10 px-4 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Plus className="size-4" /> Register New Prospect
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Inquiries", value: "1,428", trend: "+12%", icon: Users, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Converted Sales", value: "156", trend: "+5%", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Site Visits Today", value: "28", trend: "+18%", icon: Map, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Conversion Rate", value: "10.9%", trend: "+2%", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((item, i) => (
          <Card key={i} className="p-5 border-0 shadow-sm ring-1 ring-border/40 bg-card hover:ring-primary/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("size-12 rounded-2xl flex items-center justify-center", item.bg)}>
                <item.icon className={cn("size-6", item.color)} />
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px] font-black">{item.trend}</Badge>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{item.label}</p>
            <h3 className="text-2xl font-black text-foreground mt-0.5 tracking-tight">{item.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-0 border-0 shadow-sm ring-1 ring-border/40 overflow-hidden bg-card">
          <div className="px-6 py-5 border-b border-border/20 flex items-center justify-between bg-secondary/5">
            <div>
              <h4 className="font-black text-sm uppercase tracking-widest text-primary">Interactive Siteplan Monitor</h4>
              <p className="text-[10px] text-muted-foreground font-bold mt-0.5 uppercase tracking-tighter">Real-time Visual Inventory Management</p>
            </div>
          </div>
          
          <div className="aspect-[16/9] relative group">
            <img src="https://picsum.photos/seed/siteplan2026/1200/800" className="absolute inset-0 size-full object-cover grayscale opacity-20 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-40" alt="Siteplan Preview" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center relative z-10 bg-gradient-to-br from-indigo-500/5 to-transparent">
              <div className="size-16 rounded-full bg-white/90 shadow-2xl flex items-center justify-center border border-border/40 animate-float mb-4 ring-4 ring-primary/10">
                <MousePointer2 className="size-8 text-primary" />
              </div>
              <h5 className="text-sm font-black text-foreground uppercase tracking-widest mb-2">Visual Map Interactive</h5>
              <p className="text-xs text-muted-foreground font-medium max-w-sm leading-relaxed mb-6">Klik pada blok unit untuk mengunci stok, melihat detail prospek, atau sinkronisasi ke WhatsApp API.</p>
              <div className="flex items-center gap-3">
                <button className="h-10 px-8 rounded-xl bg-primary text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all">Launch Canvas UI</button>
                <button className="h-10 px-4 rounded-xl bg-white border border-border/40 text-muted-foreground hover:bg-secondary"><ExternalLink className="size-4" /></button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm ring-1 ring-border/40 bg-card flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-black text-xs uppercase tracking-widest text-primary leading-none flex items-center gap-2">
              <TrendingUp className="size-4" /> Priority Leads
            </h4>
          </div>
          <div className="space-y-4 flex-1">
            {leads.map((lead, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-all group cursor-pointer border border-transparent hover:border-primary/10">
                <div className="size-10 shrink-0 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary font-black text-xs border border-border/40 group-hover:scale-110 transition-transform">
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[13px] font-black text-foreground truncate uppercase">{lead.name}</h5>
                    <span className="text-[10px] font-black text-primary">Score: {lead.score}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5 leading-tight">{lead.interest}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge className={cn(
                      "text-[8px] font-black uppercase border-0 px-2 py-0.5",
                      lead.status === "Hot Lead" ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
                    )}>{lead.status}</Badge>
                    <div className="flex items-center gap-1.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"><MessageCircle className="size-3" /></button>
                      <button className="p-1.5 rounded-md bg-sky-500/10 text-sky-600 hover:bg-sky-500 hover:text-white transition-all"><Phone className="size-3" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 rounded-xl bg-primary/10 font-black text-[11px] text-primary hover:bg-primary hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2">
            View All CRM Leads (142) <ArrowRight className="size-3.5" />
          </button>
        </Card>
      </div>
    </div>
  )
}
