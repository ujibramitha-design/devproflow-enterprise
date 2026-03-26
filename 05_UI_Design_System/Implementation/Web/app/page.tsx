"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { RealTimeUnits } from "@/components/dashboard/real-time-units"
import { FirebaseStats } from "@/components/dashboard/firebase-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Activity, Bell, Zap, Cloud, BarChart3, ArrowRight, Database, Phone } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardHeader />
        <div className="flex items-center gap-3">
          <div className="hidden md:flex px-4 py-2 rounded-2xl items-center gap-3 border border-devpro-border/40 shadow-sm bg-devpro-card">
            <Cloud className="size-4 text-sky-500" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-devpro-muted-foreground uppercase tracking-widest leading-none">Cloud Sync</span>
              <span className="text-[11px] font-black text-devpro-foreground">STABLE</span>
            </div>
          </div>
          <div className="px-4 py-2 rounded-2xl flex items-center gap-3 border border-devpro-border/40 shadow-sm bg-devpro-card ring-1 ring-emerald-500/20">
            <ShieldCheck className="size-5 text-emerald-600" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-devpro-muted-foreground uppercase tracking-widest leading-none">Identity</span>
              <span className="text-[12px] font-black text-emerald-600 uppercase tracking-tight">DevPro-Enterprise Hub</span>
            </div>
          </div>
        </div>
      </div>

      <FirebaseStats />

      <RealTimeUnits />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <RecentApplications />
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="hover:ring-devpro-primary/20 transition-all border-0 shadow-sm ring-1 ring-devpro-border/40 devpro-card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-6">
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-devpro-primary" />
                  <CardTitle>Firebase Integration</CardTitle>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px] font-bold">Connected</Badge>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 px-6">
                <div className="p-3 rounded-xl bg-devpro-primary/5 border border-devpro-primary/10">
                  <p className="text-[11px] font-bold text-devpro-primary flex items-center gap-2"><Database className="size-3" /> Real-time Database Active</p>
                  <p className="text-[10px] text-devpro-muted-foreground mt-1 leading-tight">Firebase Real-time Database connected and synchronized.</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-2"><Phone className="size-3" /> WhatsApp Integration Ready</p>
                  <p className="text-[10px] text-devpro-muted-foreground mt-1 leading-tight">WhatsApp Business API integrated for customer communication.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:ring-devpro-primary/20 transition-all border-0 shadow-sm ring-1 ring-devpro-border/40 devpro-card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-6">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-devpro-primary" />
                  <CardTitle>System Health</CardTitle>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px] font-bold">Optimal</Badge>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 px-6">
                {[
                  { label: "Core API Response", load: "14ms", color: "bg-emerald-500" },
                  { label: "Database Read/Write", load: "28ms", color: "bg-emerald-500" },
                  { label: "DevPro Services", load: "12ms", color: "bg-emerald-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-devpro-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-devpro-muted-foreground/60">{item.load}</span>
                      <div className={cn("size-1.5 rounded-full animate-pulse", item.color)} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="devpro-gradient text-white p-6 border-0 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="size-4 text-amber-300" />
              <h4 className="text-lg font-black uppercase">Quick Access</h4>
            </div>
            <p className="text-white/70 text-xs font-medium mb-6">Kelola instrumen kontrol DevPro-Enterprise Anda.</p>
            <div className="grid gap-2">
              {[
                { label: "BOD Analytics", href: "/dashboard/bod" },
                { label: "Legal Hub", href: "/dashboard/legal" },
                { label: "Finance Hub", href: "/dashboard/finance" },
                { label: "Marketing Panel", href: "/dashboard/marketing" },
                { label: "Engineering", href: "/dashboard/engineering" },
              ].map((btn) => (
                <Link key={btn.label} href={btn.href} className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all group border border-white/5">
                  <span className="font-black text-[11px] uppercase tracking-wide">{btn.label}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              ))}
            </div>
          </Card>
          <QuickStats />
        </div>
      </div>
    </div>
  )
}
