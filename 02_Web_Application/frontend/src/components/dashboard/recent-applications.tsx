"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Eye, MoreHorizontal, ArrowUpRight, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ApiApplicationRow = Record<string, any>

type DashboardApplication = {
  id: string
  name: string
  initials: string
  nik: string
  plafon: string
  tenor: string
  status: string
  tanggal: string
  badge: { bg: string; text: string; dot: string; shadow: string }
}

function formatCurrencyIdr(value: unknown): string {
  const n = Number(value)
  if (!n || Number.isNaN(n)) return "—"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n)
}

function formatDateId(value: unknown): string {
  if (!value) return "—"
  const d = new Date(String(value))
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "??"
  const first = parts[0]?.[0] ?? "?"
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : ""
  return (first + second).toUpperCase()
}

function normalizeStatus(statusRaw: string): string {
  const s = statusRaw.toUpperCase().trim()
  if (!s) return "—"
  if (["APPROVED", "APPROVAL", "DISSETUJUI"].includes(s)) return "Disetujui"
  if (["REJECTED", "DENIED", "DITOLAK"].includes(s)) return "Ditolak"
  if (["PROCESS", "PROCESSING", "IN_REVIEW", "REVIEW", "PROSES_VERIFIKASI"].includes(s)) return "Proses Verifikasi"
  if (["PENDING", "WAITING", "MENUNGGU", "MENUNGGU_PENGELOLAAN"].includes(s)) return "Menunggu Persetujuan"
  if (["COMPLETED", "FINISHED", "SELESAI"].includes(s)) return "Selesai"
  return statusRaw
}

function getBadgeForStatus(label: string): DashboardApplication["badge"] {
  switch (label) {
    case "Disetujui":
      return {
        bg: "bg-devpro-emerald/10",
        text: "text-devpro-emerald",
        dot: "bg-devpro-emerald",
        shadow: "shadow-[0_0_8px_rgba(16,185,129,0.4)]",
      }
    case "Proses Verifikasi":
      return {
        bg: "bg-devpro-neon/10",
        text: "text-devpro-neon",
        dot: "bg-devpro-neon",
        shadow: "shadow-[0_0_8px_rgba(0,255,204,0.4)]",
      }
    case "Menunggu Persetujuan":
      return {
        bg: "bg-blue-400/10",
        text: "text-blue-400",
        dot: "bg-blue-400",
        shadow: "shadow-[0_0_8px_rgba(96,165,250,0.4)]",
      }
    case "Ditolak":
      return {
        bg: "bg-rose-400/10",
        text: "text-rose-400",
        dot: "bg-rose-400",
        shadow: "shadow-[0_0_8px_rgba(251,113,133,0.4)]",
      }
    case "Selesai":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        dot: "bg-emerald-400",
        shadow: "shadow-[0_0_8px_rgba(16,185,129,0.4)]",
      }
    default:
      return {
        bg: "bg-amber-400/10",
        text: "text-amber-400",
        dot: "bg-amber-400",
        shadow: "shadow-[0_0_8px_rgba(251,191,36,0.4)]",
      }
  }
}

export function RecentApplications() {
  const [applications, setApplications] = useState<DashboardApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const visibleApplications = useMemo(() => applications.slice(0, 4), [applications])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://devproflow.com/api").replace(/\/+$/, "")

        const res = await fetch(`${apiBase}/applications`, { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to fetch applications: HTTP ${res.status}`)

        const json: unknown = await res.json()
        const rows: ApiApplicationRow[] = Array.isArray(json)
          ? json
          : Array.isArray((json as any)?.data)
            ? (json as any).data
            : []

        const mapped: DashboardApplication[] = rows.map((row, idx) => {
          const statusRaw = String(row?.status ?? row?.status_unit ?? row?.application_status ?? "")
          const statusLabel = normalizeStatus(statusRaw)
          const badge = getBadgeForStatus(statusLabel)

          const name =
            row?.customers?.name ??
            row?.customer?.name ??
            row?.nama_customer ??
            row?.name ??
            "Unknown"

          const nik = String(row?.nik ?? row?.nik_cust ?? row?.customer_nik ?? "—")

          const plafonValue =
            row?.plafon ??
            row?.loan_amount ??
            row?.down_payment ??
            row?.price ??
            row?.units?.price ??
            row?.units?.unit_price ??
            row?.amount

          const tenorValue = row?.tenor ?? row?.tenor_unit ?? row?.tenor_year ?? row?.tenor_month

          return {
            id: String(row?.id ?? row?.application_id ?? row?.unit_id ?? idx),
            name,
            initials: getInitials(name),
            nik,
            plafon: formatCurrencyIdr(plafonValue),
            tenor: String(tenorValue ?? "—"),
            status: statusLabel,
            tanggal: formatDateId(row?.tanggal ?? row?.created_at ?? row?.updated_at),
            badge,
          }
        })

        if (!cancelled) setApplications(mapped)
      } catch (e) {
        console.error("Error loading applications:", e)
        if (!cancelled) {
          setApplications([])
          setError(e instanceof Error ? e.message : "Gagal memuat aplikasi")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="rounded-xl bg-devpro-charcoal border border-devpro-slate/30 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-6 border-b border-devpro-navy/50">
        <div>
          <h3 className="text-base font-black text-devpro-text-primary uppercase tracking-wider">
            Recent Applications
          </h3>
          <p className="mt-1 text-[11px] font-medium text-devpro-text-secondary uppercase tracking-tighter">
            Live queue of the latest 4 enterprise KPR submissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-9 items-center gap-2 rounded-lg bg-devpro-navy px-4 text-xs font-bold text-devpro-text-secondary border border-devpro-slate/50 transition-all hover:border-devpro-neon hover:text-devpro-neon">
            <Filter className="size-3.5" strokeWidth={2.5} />
            FILTER
          </button>
          <Link
            href="/aplikasi"
            className="flex h-9 items-center gap-2 rounded-lg bg-devpro-neon px-4 text-xs font-black text-devpro-navy transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,255,204,0.2)]"
          >
            VIEW ALL
            <ArrowUpRight className="size-3.5" strokeWidth={3} />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-devpro-navy/30">
              <th className="px-6 py-4 text-left text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">
                Applicant
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">
                Application Detail
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-t border-devpro-navy/50">
                  <td className="px-6 py-5">
                    <div className="h-4 w-36 bg-devpro-navy rounded animate-pulse" />
                    <div className="h-3 w-24 bg-devpro-navy/80 rounded mt-2 animate-pulse" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 w-28 bg-devpro-navy rounded animate-pulse" />
                    <div className="h-3 w-40 bg-devpro-navy/80 rounded mt-2 animate-pulse" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 w-24 bg-devpro-navy rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="size-8 rounded bg-devpro-navy animate-pulse" />
                      <div className="size-8 rounded bg-devpro-navy animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr className="border-t border-devpro-navy/50">
                <td colSpan={4} className="px-6 py-6 text-sm text-rose-400">
                  {error}
                </td>
              </tr>
            ) : (
              visibleApplications.map((app) => (
                <tr key={app.id} className="border-t border-devpro-navy/50 transition-colors hover:bg-devpro-navy/40 group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-devpro-navy border border-devpro-slate/50 text-devpro-neon font-black text-sm shadow-inner group-hover:border-devpro-neon/30 transition-all">
                        {app.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-devpro-text-primary group-hover:text-devpro-neon transition-colors">
                          {app.name}
                        </p>
                        <p className="text-[11px] font-medium text-devpro-text-secondary font-mono tracking-tighter">{app.nik}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-devpro-text-primary tracking-tight">{app.plafon}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-devpro-text-secondary uppercase">{app.tenor}</span>
                        <span className="size-1 rounded-full bg-devpro-slate/50" />
                        <span className="text-[11px] font-medium text-devpro-neon/60 uppercase">{app.tanggal}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border border-current/20",
                        app.badge.bg,
                        app.badge.text
                      )}
                    >
                      <div className={cn("size-1.5 rounded-full animate-pulse", app.badge.dot, app.badge.shadow)} />
                      {app.status}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="flex size-8 items-center justify-center rounded-lg bg-devpro-navy border border-devpro-slate/50 text-devpro-text-secondary hover:text-devpro-neon hover:border-devpro-neon transition-all">
                        <Eye className="size-4" strokeWidth={2.5} />
                      </button>
                      <button className="flex size-8 items-center justify-center rounded-lg bg-devpro-navy border border-devpro-slate/50 text-devpro-text-secondary hover:text-devpro-neon hover:border-devpro-neon transition-all">
                        <MoreHorizontal className="size-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-devpro-navy/30 px-6 py-4 flex items-center justify-center border-t border-devpro-navy/50">
        <span className="text-[10px] font-bold text-devpro-text-secondary uppercase tracking-[0.2em]">
          End of Queue - Security Audit Log Active
        </span>
      </div>
    </div>
  )
}
