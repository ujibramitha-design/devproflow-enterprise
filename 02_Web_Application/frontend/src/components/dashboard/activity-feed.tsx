"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Activity,
  FileText,
  UserPlus,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useGlobalData } from "@/lib/global-store"

interface AuditEntry {
  id: string
  user: string
  action: string
  target: string
  time: string
  icon: any
  color: string
}

function generateAuditLogs(data: any[]): AuditEntry[] {
  if (!data || data.length === 0) return []

  const now = Date.now()
  const actions = [
    { action: "mengupdate status unit",  icon: Building2,    color: "text-blue-400" },
    { action: "mengupload dokumen KPR",  icon: FileText,     color: "text-emerald-400" },
    { action: "menambah prospek baru",   icon: UserPlus,     color: "text-violet-400" },
    { action: "memverifikasi pencairan", icon: DollarSign,   color: "text-amber-400" },
    { action: "menyelesaikan akad",      icon: CheckCircle,  color: "text-cyan-400" },
    { action: "menandai isu kendala",    icon: AlertTriangle, color: "text-rose-400" },
  ]

  const users = ["Admin", "Sales A", "Finance", "Legal", "Marketing", "Manager"]
  const timeLabels = ["2 menit lalu", "5 menit lalu", "12 menit lalu", "28 menit lalu", "1 jam lalu"]

  return Array.from({ length: 5 }).map((_, i) => {
    const row = data[i % data.length]
    const act = actions[i % actions.length]
    const unitLabel = String(row?.id_unit ?? row?.blok ?? `Unit #${i + 1}`)
    return {
      id: `audit-${i}`,
      user: users[i % users.length],
      action: act.action,
      target: unitLabel,
      time: timeLabels[i],
      icon: act.icon,
      color: act.color,
    }
  })
}

export function ActivityFeed() {
  const { data, loading } = useGlobalData()
  const [logs, setLogs] = useState<AuditEntry[]>([])

  useEffect(() => {
    if (data.length > 0) {
      setLogs(generateAuditLogs(data))
    }
  }, [data])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="size-4 text-[var(--primary)]" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-[var(--muted)] animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/4 rounded bg-[var(--muted)] animate-pulse" />
                  <div className="h-2.5 w-1/2 rounded bg-[var(--muted)]/60 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)] text-center py-8">
            Belum ada aktivitas tercatat
          </p>
        ) : (
          <div className="space-y-1">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[var(--muted)]/40 transition-colors group"
                >
                  <div className={cn("flex size-8 items-center justify-center rounded-lg bg-[var(--muted)]/60 shrink-0 group-hover:scale-110 transition-transform")}>
                    <log.icon className={cn("size-4", log.color)} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--foreground)] leading-snug">
                      <span className="font-semibold">{log.user}</span>
                      {" "}{log.action}{" "}
                      <span className="font-semibold text-[var(--primary)]">{log.target}</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="size-3 text-[var(--muted-foreground)]" />
                      <span className="text-xs text-[var(--muted-foreground)]">{log.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
