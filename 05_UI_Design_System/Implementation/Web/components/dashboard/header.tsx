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
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground text-balance leading-tight">
          Dashboard KPR
        </h2>
        <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
          Pantau dan kelola seluruh pengajuan kredit pemilikan rumah Anda secara terpadu.
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-[13px] font-medium text-muted-foreground shadow-sm ring-1 ring-border/40">
          <Calendar className="size-4 text-muted-foreground/60" strokeWidth={1.8} />
          <span>{mounted ? formattedDate : "Loading..."}</span>
        </div>
        <Link 
          href="/reports/view"
          className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-bold text-primary-foreground shadow-md shadow-primary/15 transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02]"
        >
          <Eye className="size-4" strokeWidth={2} />
          <span className="hidden sm:inline">Pratinjau Laporan</span>
        </Link>
      </div>
    </div>
  )
}