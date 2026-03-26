"use client"

import { useEffect, useState } from "react"
import { Calendar, Eye } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  const [mounted, setMounted] = useState(false)
  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    setMounted(true)
    setFormattedDate(new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }))
  }, [])

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-in-up">
      <div>
        <p className="text-[13px] font-semibold text-primary/80 dark:text-primary/90">
          Selamat Datang Kembali
        </p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground text-balance leading-tight uppercase">
          Enterprise Dashboard
        </h2>
        <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed max-w-lg">
          Monitor performa konsolidasi antar divisi secara real-time melalui instrumen kontrol terpusat.
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-[13px] font-medium text-muted-foreground shadow-sm ring-1 ring-border/40">
          <Calendar className="size-4 text-muted-foreground/60" strokeWidth={1.8} />
          <span className="uppercase text-[11px] font-black tracking-tight">{mounted ? formattedDate : "Memuat..."}</span>
        </div>
        <Link 
          href="/reports/view"
          className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Eye className="size-4" strokeWidth={2} />
          <span className="hidden sm:inline uppercase text-[11px] font-black tracking-wider">Pratinjau Laporan</span>
        </Link>
      </div>
    </div>
  )
}
