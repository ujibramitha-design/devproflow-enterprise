"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, AlertCircle, User, History, Search, Filter, Download, Eye, Globe, Terminal, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const auditLogs = [
  { id: "LOG-8821", user: "Admin (Felix)", action: "Permission Update", target: "Finance Dept", time: "10m ago", status: "Critical", ip: "192.168.1.42" },
  { id: "LOG-8820", user: "Ir. Hendra", action: "Progress Photo Upload", target: "Emerald Site", time: "45m ago", status: "Secure", ip: "10.0.0.12" },
  { id: "LOG-8819", user: "Bank Analist", action: "Document Download", target: "KPR-998", time: "1h ago", status: "Secure", ip: "172.16.5.1" },
  { id: "LOG-8818", user: "Unknown", action: "Failed Login Attempt", target: "BOD Dashboard", time: "2h ago", status: "Warning", ip: "45.12.9.102" },
];

export default function AuditPage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground uppercase">Audit Security</h2>
          <p className="text-muted-foreground text-sm mt-1 font-medium italic">Monitoring system activity, data integrity, and compliance logs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-xl bg-card border border-border/40 text-xs font-bold flex items-center gap-2 shadow-sm hover:bg-secondary transition-all">
            <Lock className="size-4" /> Security Policy
          </button>
          <button className="h-10 px-4 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <Terminal className="size-4" /> Export Audit Logs
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Security Status", value: "Optimal", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Alerts Detected", value: "4 Issues", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "Active Sessions", value: "14 Users", icon: User, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Database Sync", value: "Verified", icon: History, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="p-5 border-0 shadow-sm ring-1 ring-border/40 bg-card">
            <div className="flex items-center gap-4">
              <div className={cn("size-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("size-6", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1.5">{stat.label}</p>
                <h3 className="text-xl font-black text-foreground leading-none">{stat.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-0 border-0 shadow-sm ring-1 ring-border/40 overflow-hidden bg-card">
        <div className="px-6 py-5 border-b border-border/20 flex flex-col sm:flex-row gap-4 sm:items-center justify-between bg-secondary/5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <input type="text" placeholder="Search logs..." className="h-10 w-full rounded-xl bg-background border border-border/40 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/15 transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-10 items-center gap-2 rounded-xl bg-secondary/60 px-4 text-[12px] font-black text-muted-foreground hover:bg-secondary transition-all uppercase tracking-widest shadow-sm">
              <Filter className="size-3.5" /> Advanced Filter
            </button>
            <button className="p-2.5 rounded-xl border border-border/40 text-muted-foreground hover:bg-secondary transition-all">
              <Download className="size-4" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/10">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Log ID & Time</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">User Identity</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Activity Detail</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Origin IP</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Level</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {auditLogs.map((log) => (
                <tr key={log.id} className="group hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[12px] font-bold text-foreground">{log.id}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase">{log.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black text-primary border border-border/40">{log.user.charAt(0)}</div>
                      <p className="text-[12px] font-black text-foreground uppercase">{log.user}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[12px] font-bold text-foreground uppercase leading-tight">{log.action}</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5 italic">Target: {log.target}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Globe className="size-3 opacity-50" /> {log.ip}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={cn(
                      "text-[9px] font-black uppercase border-0 px-2 py-0.5 tracking-wider",
                      log.status === "Critical" ? "bg-rose-500 text-white animate-pulse" :
                      log.status === "Warning" ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                    )}>{log.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"><Eye className="size-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
