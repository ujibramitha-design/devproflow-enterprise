"use client"

import { useState, useEffect } from "react"
import {
  Building2,
  Search,
  MapPin,
  CheckCircle2,
  Clock,
  Layers,
  LayoutGrid,
  List,
  ChevronRight,
  Plus,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useGlobalData, Format, GlobalMasterRow } from "@/lib/global-store"
import { HoverScale, StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/page-transition"
import { DsSkeleton, DsSkeletonGrid } from "@/components/ui/ds-skeleton"
import { UnitStatusPanel } from "@/components/ui/unit-status-panel"

// ── Siteplan metadata (from 07_Raw_Materials_Data/siteplan_data.json) ─────────
const SITEPLANS = [
  { id: "1", name: "Ciruas Land",         prefix: "SRG0310122020T002", year: "2020", code: "002" },
  { id: "2", name: "Ciruasland Tahap 3",   prefix: "SRG0310122024T001", year: "2024", code: "001" },
]
const UNIT_CATEGORIES = ["PLATINUM", "SKANDIUM", "PALADIO", "TITANIUM", "GOLD", "CROWN"]

// Status → gradient warna blok siteplan (Design_Tokens.json aligned)
const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-gradient-to-br from-emerald-400 to-emerald-600",
  TERSEDIA:  "bg-gradient-to-br from-emerald-400 to-emerald-600",
  AKAD:      "bg-gradient-to-br from-blue-400 to-blue-600",
  CAIR:      "bg-gradient-to-br from-violet-400 to-violet-600",
  SOLD:      "bg-gradient-to-br from-rose-400 to-rose-600",
  TERJUAL:   "bg-gradient-to-br from-rose-400 to-rose-600",
  BOOKING:   "bg-gradient-to-br from-cyan-400 to-cyan-600",
  KPR:       "bg-gradient-to-br from-indigo-400 to-indigo-600",
}

// ── Komponen ──────────────────────────────────────────────────────────────────
export default function UnitManagementPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search,   setSearch]   = useState("")
  const [activeSiteplan, setActiveSiteplan] = useState<string | null>(null)

  const { data: units, loading, error, fetchAllData, clearError, statusCounts } = useGlobalData()

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Filter pencarian lokal
  const filtered = units.filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      String(u.id_unit   ?? "").toLowerCase().includes(q) ||
      String(u.tipe_unit ?? "").toLowerCase().includes(q) ||
      String(u.siteplan  ?? "").toLowerCase().includes(q) ||
      String(u.cluster   ?? "").toLowerCase().includes(q)
    )
  })

  // Statistik dari global store
  const stats = {
    total:     statusCounts.available + statusCounts.akad + statusCounts.cair + statusCounts.sold + statusCounts.reserved,
    available: statusCounts.available,
    reserved:  statusCounts.akad + statusCounts.reserved,
    sold:      statusCounts.cair + statusCounts.sold,
  }

  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in bg-devpro-navy min-h-screen">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-devpro-text-primary uppercase">
            Unit <span className="text-devpro-neon">Management</span>
          </h2>
          <p className="text-devpro-text-secondary font-medium uppercase tracking-tighter text-sm mt-1">
            Inventori unit — live dari Supabase &ldquo;data global master&rdquo;
          </p>
        </div>
        <Button className="bg-devpro-neon text-devpro-navy font-black uppercase tracking-widest text-xs h-11 px-6 rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)]">
          <Plus className="size-4 mr-2" strokeWidth={3} /> Add New Unit
        </Button>
      </div>

      {/* ── Filter & Controls ──────────────────────────────────────────────── */}
      <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-4 p-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-devpro-text-secondary" />
            <Input
              className="bg-devpro-navy border-devpro-slate/50 text-devpro-text-primary pl-10 rounded-xl focus:border-devpro-neon/50 h-11"
              placeholder="Cari berdasarkan ID Unit, tipe, siteplan, atau cluster..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={fetchAllData}
              disabled={loading}
              className="flex-1 md:flex-none h-11 rounded-xl border-devpro-slate/50 text-devpro-text-secondary font-bold uppercase tracking-widest text-[10px]"
            >
              <RefreshCw className={cn("size-3.5 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <div className="h-11 bg-devpro-navy p-1 rounded-xl border border-devpro-slate/50 flex items-center gap-1">
              <Button
                variant="ghost" size="icon"
                onClick={() => setViewMode("grid")}
                className={cn("size-9 rounded-lg transition-all", viewMode === "grid" ? "bg-devpro-charcoal text-devpro-neon shadow-lg" : "text-devpro-text-secondary")}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant="ghost" size="icon"
                onClick={() => setViewMode("list")}
                className={cn("size-9 rounded-lg transition-all", viewMode === "list" ? "bg-devpro-charcoal text-devpro-neon shadow-lg" : "text-devpro-text-secondary")}
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Siteplan Visual Map ─────────────────────────────────────────── */}
      <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-devpro-text-primary uppercase tracking-widest">Siteplan Map — Live Status</h3>
            <p className="text-[10px] text-devpro-text-secondary mt-0.5">Warna blok berdasarkan status_unit di Supabase</p>
          </div>
          <div className="flex items-center gap-2">
            {SITEPLANS.map((sp) => (
              <Button
                key={sp.id}
                size="sm"
                variant={activeSiteplan === sp.id ? "default" : "outline"}
                onClick={() => setActiveSiteplan(activeSiteplan === sp.id ? null : sp.id)}
                className={cn(
                  "text-[9px] font-black uppercase tracking-widest h-8 px-3 rounded-lg",
                  activeSiteplan === sp.id
                    ? "bg-devpro-neon text-devpro-navy"
                    : "border-devpro-slate/50 text-devpro-text-secondary"
                )}
              >
                {sp.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="px-4 pb-2 flex items-center gap-4 flex-wrap">
          {[
            { label: "Tersedia",   color: "bg-emerald-500" },
            { label: "Akad",       color: "bg-blue-500" },
            { label: "Cair",       color: "bg-violet-500" },
            { label: "Terjual",    color: "bg-rose-500" },
            { label: "Proses",     color: "bg-amber-500" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={cn("size-2.5 rounded-sm", l.color)} />
              <span className="text-[9px] font-bold text-devpro-text-secondary uppercase tracking-widest">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Siteplan Grid — each unit as a small colored block */}
        {!loading && !error && (() => {
          const siteplanFiltered = activeSiteplan
            ? units.filter((u) => String(u.siteplan_index ?? "") === activeSiteplan || String(u.siteplan ?? "").toLowerCase().includes(SITEPLANS.find(s => s.id === activeSiteplan)?.name.toLowerCase().split(" ")[0] ?? ""))
            : units

          if (siteplanFiltered.length === 0) return (
            <div className="px-4 pb-4">
              <p className="text-xs text-devpro-text-secondary/60 text-center py-6">Pilih siteplan atau hubungkan data Supabase</p>
            </div>
          )

          return (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-1">
                {siteplanFiltered.map((unit, i) => {
                  const statusRaw = String(unit.status_unit ?? "").toUpperCase().trim()
                  const color = STATUS_COLORS[statusRaw] ?? "bg-amber-500"
                  const blok = String(unit.blok ?? "")
                  const nomor = String(unit.nomor ?? "")
                  const label = [blok, nomor].filter(Boolean).join("-") || String(unit.id_unit ?? `#${i + 1}`)
                  return (
                    <div
                      key={`sp-${i}`}
                      title={`${label} — ${String(unit.nama_customer || "Kosong")} — ${statusRaw || "N/A"}`}
                      className={cn(
                        "h-7 min-w-10 px-1.5 rounded-md text-[7px] font-black text-white flex items-center justify-center",
                        "cursor-pointer transition-all duration-200 ease-out",
                        "hover:scale-125 hover:z-20 hover:shadow-lg hover:ring-2 hover:ring-white/40",
                        "active:scale-110",
                        color
                      )}
                    >
                      {label}
                    </div>
                  )
                })}
              </div>
              <p className="text-[9px] text-devpro-text-secondary/50 mt-2 text-right">
                {siteplanFiltered.length} unit ditampilkan
              </p>
            </div>
          )
        })()}

        {loading && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 40 }).map((_, i) => (
                <DsSkeleton key={i} className="h-7 w-10 rounded-md" />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ── Stats (dihitung dari data live) ────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Units",  val: loading ? "—" : String(stats.total),     icon: Building2,    color: "text-devpro-neon" },
          { label: "Available",    val: loading ? "—" : String(stats.available),  icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Reserved/Akad",val: loading ? "—" : String(stats.reserved),  icon: Clock,        color: "text-amber-400" },
          { label: "Sold / Cair",  val: loading ? "—" : String(stats.sold),       icon: Layers,       color: "text-rose-400" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-devpro-charcoal border-devpro-slate/30 p-4 shadow-lg hover:border-devpro-neon/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-devpro-navy border border-devpro-slate/50">
                <stat.icon className={cn("size-4", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">{stat.label}</p>
                <p className={cn("text-xl font-black text-devpro-text-primary", loading && "animate-pulse")}>{stat.val}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-4 p-5 rounded-xl border border-rose-500/30 bg-rose-500/10">
          <AlertCircle className="size-5 text-rose-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-rose-400 uppercase tracking-widest mb-1">Koneksi Gagal</p>
            <p className="text-xs text-devpro-text-secondary leading-relaxed wrap-break-word">{error}</p>
          </div>
          <Button
            size="sm"
            onClick={fetchAllData}
            className="shrink-0 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 uppercase font-black text-[10px] tracking-widest"
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* ── Loading Skeleton ───────────────────────────────────────────────── */}
      {loading && <DsSkeletonGrid count={6} />}

      {/* ── Empty State ────────────────────────────────────────────────────── */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 border border-dashed border-devpro-slate/40 rounded-2xl">
          <div className="p-5 rounded-2xl bg-devpro-charcoal border border-devpro-slate/30">
            <Building2 className="size-10 text-devpro-neon/30" />
          </div>
          <div className="text-center">
            <p className="text-base font-black text-devpro-text-secondary uppercase tracking-widest mb-2">
              {search ? "Unit Tidak Ditemukan" : "Data Belum Tersedia"}
            </p>
            <p className="text-xs text-devpro-text-secondary/60 max-w-xs mx-auto leading-relaxed">
              {search
                ? `Tidak ada unit dengan kata kunci "${search}"`
                : 'Tabel "data global master" di Supabase masih kosong, atau koneksi belum dikonfigurasi.'}
            </p>
          </div>
          {search && (
            <Button
              onClick={() => setSearch("")}
              variant="outline"
              className="text-[10px] font-black uppercase tracking-widest border-devpro-slate/50 text-devpro-text-secondary h-9 px-5 rounded-lg"
            >
              Hapus Filter
            </Button>
          )}
        </div>
      )}

      {/* ── Grid View ──────────────────────────────────────────────────────── */}
      {!loading && !error && filtered.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((unit, i) => {
            const unitId    = String(unit.id_unit   ?? `UNIT-${i + 1}`)
            const tipeUnit  = String(unit.tipe_unit ?? unit.jenis_produk ?? "—")
            const project   = String(unit.siteplan  ?? "—")
            const blok      = String(unit.blok      ?? "")
            const nomor     = String(unit.nomor     ?? "")
            const blokNomor = [blok, nomor].filter(Boolean).join("-") || "—"
            const cluster   = String(unit.cluster   ?? "—")
            const harga     = Format.rupiah(unit.harga_jual_dpp)
            const statusRaw = String(unit.status_unit ?? "")
            const status    = Format.statusBadge(statusRaw)

            return (
              <Card key={`${unitId}-${i}`} className="bg-devpro-charcoal border-devpro-slate/30 overflow-hidden group hover:border-devpro-neon/30 transition-all duration-500 shadow-2xl">
                <div className="relative h-36 w-full bg-devpro-navy flex items-center justify-center overflow-hidden">
                  <Building2 className="size-14 text-devpro-slate/20" />
                  <Badge className={cn("absolute top-4 right-4 font-black uppercase tracking-widest text-[9px] px-3 py-1.5 border", status.color)}>
                    {status.label}
                  </Badge>
                  <div className="absolute bottom-3 left-4">
                    <p className="text-[10px] font-black text-devpro-neon uppercase tracking-widest mb-0.5">{unitId}</p>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Blok {blokNomor}</h4>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex flex-col gap-1 mb-4">
                    <h3 className="text-base font-black text-devpro-text-primary uppercase group-hover:text-devpro-neon transition-colors truncate">
                      {tipeUnit}
                    </h3>
                    <div className="flex items-center gap-2 text-devpro-text-secondary">
                      <MapPin className="size-3 shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-tighter truncate">{project}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {[{ label: "Cluster", val: cluster }, { label: "Blok", val: blokNomor }].map((item) => (
                      <div key={item.label} className="bg-devpro-navy/50 border border-devpro-slate/50 rounded-lg p-2 text-center">
                        <p className="text-[8px] font-black text-devpro-text-secondary uppercase tracking-tight">{item.label}</p>
                        <p className="text-[10px] font-bold text-devpro-text-primary truncate">{item.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-devpro-navy/50">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest">Harga DPP</p>
                      <p className="text-lg font-black text-devpro-neon tracking-tight">{harga}</p>
                    </div>
                    <Button size="icon" className="size-10 rounded-xl bg-devpro-navy border border-devpro-slate/50 text-devpro-text-secondary hover:text-devpro-neon hover:border-devpro-neon transition-all">
                      <ChevronRight className="size-5" strokeWidth={2.5} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* ── List View ──────────────────────────────────────────────────────── */}
      {!loading && !error && filtered.length > 0 && viewMode === "list" && (
        <div className="flex flex-col gap-2">
          {filtered.map((unit, i) => {
            const unitId    = String(unit.id_unit   ?? `UNIT-${i + 1}`)
            const tipeUnit  = String(unit.tipe_unit ?? unit.jenis_produk ?? "—")
            const project   = String(unit.siteplan  ?? "—")
            const blok      = String(unit.blok      ?? "")
            const nomor     = String(unit.nomor     ?? "")
            const blokNomor = [blok, nomor].filter(Boolean).join("-") || "—"
            const harga     = Format.rupiah(unit.harga_jual_dpp)
            const statusRaw = String(unit.status_unit ?? "")
            const status    = Format.statusBadge(statusRaw)

            return (
              <Card key={`${unitId}-${i}`} className="bg-devpro-charcoal border-devpro-slate/30 hover:border-devpro-neon/30 transition-all">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-3 rounded-xl bg-devpro-navy border border-devpro-slate/50 shrink-0">
                      <Building2 className="size-4 text-devpro-neon" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-devpro-neon uppercase tracking-widest">{unitId}</p>
                      <p className="text-sm font-black text-devpro-text-primary uppercase truncate">{tipeUnit}</p>
                      <div className="flex items-center gap-1.5 text-devpro-text-secondary mt-0.5">
                        <MapPin className="size-3 shrink-0" />
                        <span className="text-[10px] font-bold uppercase truncate">{project} · Blok {blokNomor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-[9px] text-devpro-text-secondary uppercase font-black tracking-widest">Harga DPP</p>
                      <p className="text-sm font-black text-devpro-neon">{harga}</p>
                    </div>
                    <Badge className={cn("font-black uppercase tracking-widest text-[9px] px-3 py-1.5 border", status.color)}>
                      {status.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="bg-devpro-charcoal/50 border border-devpro-slate/30 p-4 rounded-xl flex items-center justify-center">
        <span className="text-[10px] font-bold text-devpro-text-secondary uppercase tracking-[0.3em]">
          {loading
            ? "Memuat data dari Supabase..."
            : error
              ? "Koneksi Supabase diperlukan"
              : `Menampilkan ${filtered.length} dari ${units.length} unit · Supabase Live · READ-ONLY`}
        </span>
      </div>

      {/* ── Floating Status Panel ────────────────────────────────────────── */}
      <UnitStatusPanel />
    </div>
  )
}
