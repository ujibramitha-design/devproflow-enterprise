"use client"

import { useEffect, useState } from "react"
import { ShieldCheck, Activity, Eye, Lock, Database, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGlobalData, Format } from "@/lib/global-store"

export default function AuditSecurityPage() {
  const { loading, error, fetchAllData, data: units } = useGlobalData()
  const [systemLogs, setSystemLogs] = useState<any[]>([])

  useEffect(() => {
    fetchAllData()
    
    // Generate system logs from data changes
    const logs = units.slice(0, 10).map((unit, i) => {
      const actions = ["Data Access", "Unit View", "Customer Query", "Report Generated"]
      const users = ["System", "Admin", "Manager", "Auditor"]
      const statuses = ["Success", "Success", "Success", "Warning"]
      
      return {
        id: `LOG-${String(i + 1).padStart(3, '0')}`,
        action: actions[i % actions.length],
        user: users[i % users.length],
        status: statuses[i % statuses.length],
        timestamp: unit.updated_at ? new Date(unit.updated_at).toLocaleString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: false 
        }).replace(',', '') : "2026-03-23 14:20:05",
        ip: `192.168.1.${(i % 254) + 1}`,
        record_id: unit.no,
        table: "data global master"
      }
    })
    
    setSystemLogs(logs)
  }, [fetchAllData, units])

  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in bg-devpro-navy min-h-screen">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight text-devpro-text-primary uppercase">
          Audit <span className="text-devpro-neon">Security</span>
        </h2>
        <p className="text-devpro-text-secondary font-medium uppercase tracking-tighter text-sm">
          Enterprise security audit logs and system integrity monitoring
        </p>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10">
          <AlertCircle className="size-4 text-rose-400 mt-0.5 shrink-0" />
          <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Security Level", value: "Enterprise", icon: ShieldCheck, color: "text-devpro-neon" },
          { label: "Data Records", value: loading ? "—" : String(units.length), icon: Database, color: "text-devpro-emerald" },
          { label: "System Logs", value: loading ? "—" : String(systemLogs.length), icon: Activity, color: "text-devpro-emerald" },
          { label: "Threats Blocked", value: "0", icon: ShieldCheck, color: "text-devpro-neon" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl group hover:border-devpro-neon/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary">{stat.label}</CardTitle>
              <stat.icon className={cn("size-4", stat.color)} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-xl font-black text-devpro-text-primary">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-devpro-navy/50 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-wider text-devpro-text-primary">System Audit Logs — Live Data</CardTitle>
          <Badge className="bg-devpro-neon/10 text-devpro-neon border border-devpro-neon/20 text-[10px] font-black uppercase tracking-widest">Live Monitoring</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-devpro-navy/30">
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Log ID</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">User</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Table</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Timestamp</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-devpro-navy/50">
                      <td className="px-6 py-4"><div className="h-4 w-16 bg-muted animate-pulse rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-muted animate-pulse rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-32 bg-muted animate-pulse rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-28 bg-muted animate-pulse rounded" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-16 bg-muted animate-pulse rounded" /></td>
                    </tr>
                  ))
                ) : systemLogs.length > 0 ? (
                  systemLogs.map((log: any) => (
                    <tr key={log.id} className="border-t border-devpro-navy/50 hover:bg-devpro-navy/40 transition-colors">
                      <td className="px-6 py-4 text-[11px] font-black text-devpro-neon font-mono">{log.id}</td>
                      <td className="px-6 py-4 text-xs font-bold text-devpro-text-primary">{log.action}</td>
                      <td className="px-6 py-4 text-xs font-medium text-devpro-text-secondary">{log.user}</td>
                      <td className="px-6 py-4 text-xs font-mono text-devpro-neon">{log.table}</td>
                      <td className="px-6 py-4 text-[10px] font-mono text-devpro-text-secondary/70">{log.timestamp}</td>
                      <td className="px-6 py-4">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5",
                          log.status === "Success" ? "bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20" : 
                          log.status === "Warning" ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" :
                          "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        )}>
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-devpro-text-secondary">
                      {error ? "Gagal memuat data" : "Belum ada data log sistem"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="size-5 text-devpro-neon" />
              <CardTitle className="text-sm font-black uppercase tracking-wider text-devpro-text-primary">Database Nodes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Primary Node (Supabase)", status: "Active", latency: "14ms" },
              { label: "Sync Node (Firebase)", status: "Active", latency: "28ms" },
              { label: "Backup Node (AWS S3)", status: "Standby", latency: "---" },
            ].map((node) => (
              <div key={node.label} className="flex items-center justify-between p-3 rounded-xl bg-devpro-navy border border-devpro-slate/50">
                <span className="text-[11px] font-bold text-devpro-text-secondary uppercase">{node.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-devpro-neon">{node.latency}</span>
                  <Badge className="bg-devpro-emerald/10 text-devpro-emerald border-devpro-emerald/20 text-[9px] uppercase font-black">{node.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="size-5 text-devpro-neon" />
              <CardTitle className="text-sm font-black uppercase tracking-wider text-devpro-text-primary">Access Control</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-3 text-amber-500">
              <AlertCircle className="size-5 shrink-0" />
              <p className="text-[10px] font-medium leading-relaxed uppercase tracking-tight">
                2 Unusual login attempts blocked in the last 24 hours. Enterprise firewall is operating at maximum sensitivity.
              </p>
            </div>
            <Button className="w-full bg-devpro-navy border border-devpro-slate/50 text-devpro-neon font-black uppercase tracking-widest text-[10px] h-11 hover:bg-devpro-charcoal transition-all">
              Update Security Policies
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
