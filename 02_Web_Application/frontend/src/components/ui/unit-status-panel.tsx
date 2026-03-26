"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, X, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGlobalData } from "@/lib/global-store"

const statusRows = [
  { key: "available", label: "Tersedia",        gradient: "from-emerald-400 to-emerald-600" },
  { key: "akad",      label: "Akad",            gradient: "from-blue-400 to-blue-600" },
  { key: "cair",      label: "Cair",            gradient: "from-violet-400 to-violet-600" },
  { key: "sold",      label: "Terjual",         gradient: "from-rose-400 to-rose-600" },
  { key: "reserved",  label: "Booking / Proses", gradient: "from-amber-400 to-amber-600" },
] as const

export function UnitStatusPanel() {
  const [open, setOpen] = useState(true)
  const { statusCounts, loading } = useGlobalData()
  const total = statusCounts.available + statusCounts.akad + statusCounts.cair + statusCounts.sold + statusCounts.reserved

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={cn(
              "w-64 rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden",
              "bg-[var(--card)] backdrop-blur-md"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-[var(--primary)]" />
                <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Status Unit</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="size-6 flex items-center justify-center rounded-md hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)]"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Status rows */}
            <div className="p-3 space-y-2">
              {statusRows.map((row) => {
                const count = statusCounts[row.key] ?? 0
                const pct = total > 0 ? (count / total) * 100 : 0
                return (
                  <div key={row.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("size-2.5 rounded-sm bg-gradient-to-br", row.gradient)} />
                        <span className="text-[11px] font-semibold text-[var(--foreground)]">{row.label}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[var(--foreground)] tabular-nums">
                        {loading ? "—" : count}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--muted)]/60 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className={cn("h-full rounded-full bg-gradient-to-r", row.gradient)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--muted)]/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--muted-foreground)] font-medium uppercase tracking-wider">Total</span>
                <span className="text-sm font-bold text-[var(--foreground)] tabular-nums">
                  {loading ? "—" : total} unit
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed toggle */}
      {!open && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl",
            "bg-[var(--card)] border border-[var(--border)]",
            "text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
          )}
        >
          <BarChart3 className="size-4 text-[var(--primary)]" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {loading ? "..." : `${total} Unit`}
          </span>
          <ChevronUp className="size-3 text-[var(--muted-foreground)]" />
        </motion.button>
      )}
    </div>
  )
}
