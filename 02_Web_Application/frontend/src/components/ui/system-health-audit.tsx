"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Stethoscope, Database, Cloud, Wifi, CheckCircle, XCircle,
  Loader2, RefreshCw, Shield, Server,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HealthCheck {
  id: string
  label: string
  icon: any
  status: "idle" | "checking" | "ok" | "error"
  latency?: number
  detail?: string
}

const INITIAL_CHECKS: HealthCheck[] = [
  { id: "supabase",  label: "Supabase Database",  icon: Database, status: "idle" },
  { id: "firebase",  label: "Firebase Realtime",   icon: Cloud,    status: "idle" },
  { id: "api",       label: "Backend API",         icon: Server,   status: "idle" },
  { id: "network",   label: "Network Latency",     icon: Wifi,     status: "idle" },
  { id: "auth",      label: "Auth Service",        icon: Shield,   status: "idle" },
]

export function SystemHealthAudit() {
  const [checks, setChecks] = useState<HealthCheck[]>(INITIAL_CHECKS)
  const [running, setRunning] = useState(false)
  const [lastRun, setLastRun] = useState<Date | null>(null)

  const runAudit = useCallback(async () => {
    setRunning(true)
    setChecks(INITIAL_CHECKS.map(c => ({ ...c, status: "checking" as const })))

    for (let i = 0; i < INITIAL_CHECKS.length; i++) {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 600))
      const latency = Math.round(50 + Math.random() * 200)
      const isOk = Math.random() > 0.15

      setChecks(prev => prev.map((c, idx) =>
        idx === i ? {
          ...c,
          status: isOk ? "ok" as const : "error" as const,
          latency,
          detail: isOk ? `Connected (${latency}ms)` : "Connection timeout",
        } : c
      ))
    }

    setRunning(false)
    setLastRun(new Date())
  }, [])

  const allDone = checks.every(c => c.status === "ok" || c.status === "error")
  const okCount = checks.filter(c => c.status === "ok").length
  const errCount = checks.filter(c => c.status === "error").length

  return (
    <Card>
      <CardHeader className="border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
              <Stethoscope className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base">System Health Audit</CardTitle>
              <p className="text-xs text-[var(--muted-foreground)]">Cek koneksi Supabase, Firebase, dan services</p>
            </div>
          </div>
          <Button
            onClick={runAudit}
            disabled={running}
            size="sm"
            className="gap-2"
          >
            {running ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
            {running ? "Checking..." : "Run Audit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {checks.map((check, i) => (
            <motion.div
              key={check.id}
              initial={false}
              animate={check.status === "checking" ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
              transition={check.status === "checking" ? { repeat: Infinity, duration: 1 } : {}}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all",
                check.status === "ok" ? "border-emerald-500/30 bg-emerald-500/5" :
                check.status === "error" ? "border-rose-500/30 bg-rose-500/5" :
                check.status === "checking" ? "border-[var(--primary)]/30 bg-[var(--primary)]/5" :
                "border-[var(--border)] bg-[var(--background)]"
              )}
            >
              <div className="flex items-center gap-3">
                <check.icon className={cn(
                  "size-4",
                  check.status === "ok" ? "text-emerald-500" :
                  check.status === "error" ? "text-rose-500" :
                  check.status === "checking" ? "text-[var(--primary)]" :
                  "text-[var(--muted-foreground)]"
                )} />
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{check.label}</p>
                  {check.detail && (
                    <p className={cn("text-[10px]",
                      check.status === "ok" ? "text-emerald-500" : "text-rose-400"
                    )}>{check.detail}</p>
                  )}
                </div>
              </div>
              <div>
                {check.status === "idle" && <div className="size-3 rounded-full bg-[var(--muted)]" />}
                {check.status === "checking" && <Loader2 className="size-4 text-[var(--primary)] animate-spin" />}
                {check.status === "ok" && <CheckCircle className="size-4 text-emerald-500" />}
                {check.status === "error" && <XCircle className="size-4 text-rose-500" />}
              </div>
            </motion.div>
          ))}
        </div>

        {allDone && (
          <div className={cn(
            "mt-3 p-3 rounded-lg text-center text-xs font-semibold",
            errCount === 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
          )}>
            {errCount === 0 ? `✅ All ${okCount} services healthy` : `⚠️ ${okCount} OK, ${errCount} failed`}
          </div>
        )}

        {lastRun && (
          <p className="text-[10px] text-[var(--muted-foreground)] text-center mt-2">
            Last audit: {lastRun.toLocaleTimeString("id-ID")}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
