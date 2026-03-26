"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FirebaseStats } from "@/components/dashboard/firebase-stats"
import {
  PieChart, TrendingUp, Users, DollarSign,
  BarChart3, Target, AlertCircle, Loader2,
  Home, Banknote, Activity, Download, FileSpreadsheet,
  Map, MapPin, Eye, Layers, Grid3x3, ZoomIn, ZoomOut,
} from "lucide-react"
import { useGlobalData, Format } from "@/lib/global-store"
import { supabaseClient } from "@/lib/supabase-client"
import { HoverScale, FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/page-transition"
import { DsSkeleton, DsSkeletonCard } from "@/components/ui/ds-skeleton"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

// ── Helper format angka (B style) ───────────────────────────────────────────────
function fmt(val: number): string {
  if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)}B`
  if (val >= 1_000_000)     return `Rp ${(val / 1_000_000).toFixed(1)}M`
  if (val === 0)            return "Rp 0"
  return Format.rupiah(val)
}

// ── Skeleton loader baris ─────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex justify-between items-center">
      <div className="h-4 w-36 bg-muted animate-pulse rounded" />
      <div className="h-4 w-16 bg-muted/60 animate-pulse rounded" />
    </div>
  )
}

// ── Komponen utama ────────────────────────────────────────────────────────────
export default function BODDashboardPage() {
  const { data: allRows, loading, error, fetchAllData, totalUnits, totalCustomers, totalCair, totalPlafon, statusCounts } = useGlobalData()
  const [realtimeActive, setRealtimeActive] = useState(false)
  const [siteplanZoom, setSiteplanZoom] = useState(1)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [siteplanView, setSiteplanView] = useState<'grid' | 'map'>('grid')
  const subRef = useRef<any>(null)

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Realtime subscription — auto-refresh on DB change
  useEffect(() => {
    try {
      const client = supabaseClient.getClient()
      subRef.current = client
        .channel('bod-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'data global master' }, () => {
          console.log('🔄 BOD Realtime: data changed — refreshing')
          fetchAllData()
        })
        .subscribe((status: string) => {
          setRealtimeActive(status === 'SUBSCRIBED')
        })
    } catch {
      // Supabase not initialized — realtime not available
    }
    return () => { subRef.current?.unsubscribe() }
  }, [fetchAllData])

  // Derived KPIs
  const totalHargaDPP = allRows.reduce((s, r) => s + (Number(r.harga_jual_dpp) || 0), 0)
  const progresStats = {
    selesai: allRows.filter(r => String(r.progres_rumah ?? '').toUpperCase().includes('SELESAI') || String(r.progres_rumah ?? '').includes('100')).length,
    proses:  allRows.filter(r => { const p = String(r.progres_rumah ?? '').toUpperCase(); return p && !p.includes('SELESAI') && !p.includes('100') && p !== '' }).length,
  }

  // Export functions
  const exportLaporanRingkas = () => {
    const headers = ["No", "Nama Customer", "Tipe Unit", "Harga Jual", "Status", "Tanggal", "Sales", "Bank"]
    const csv = [
      headers.join(","),
      ...allRows.slice(0, 10).map((r, i) => [
        i + 1,
        `"${r.nama_customer || ''}"`,
        `"${r.tipe_unit || ''}"`,
        Number(r.harga_jual_dpp) || 0,
        `"${(r as any).status_pengajuan || ''}"`,
        `"${(r as any).tanggal_pengajuan || ''}"`,
        `"${(r as any).nama_sales || ''}"`,
        `"${(r as any).bank_kpr || ''}"`
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `laporan-ringkas-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportMasterTracking = () => {
    const headers = [
      "No", "ID Aplikasi", "Nama Customer", "KTP", "Tipe Unit", "Blok", "Nomor", 
      "Harga Jual DPP", "Plafon KPR", "Bank KPR", "Status Pengajuan", "Tanggal Pengajuan",
      "Tanggal Akad", "Tanggal Cair", "Progres Rumah", "Nama Sales", "No HP Customer",
      "Email Customer", "Siteplan", "Aging Fisik", "Status Booking", "Status PPJB",
      "Status BAST", "Status Serah Terima"
    ]
    const csv = [
      headers.join(","),
      ...allRows.map((r, i) => [
        i + 1,
        `"${r.no || ''}"`,
        `"${r.nama_customer || ''}"`,
        `"${(r as any).no_ktp || ''}"`,
        `"${r.tipe_unit || ''}"`,
        `"${r.blok || ''}"`,
        `"${r.nomor || ''}"`,
        Number(r.harga_jual_dpp) || 0,
        Number((r as any).plafon_kpr) || 0,
        `"${(r as any).bank_kpr || ''}"`,
        `"${(r as any).status_pengajuan || ''}"`,
        `"${(r as any).tanggal_pengajuan || ''}"`,
        `"${r.tgl_akad || ''}"`,
        `"${(r as any).tanggal_cair || ''}"`,
        `"${r.progres_rumah || ''}"`,
        `"${(r as any).nama_sales || ''}"`,
        `"${(r as any).no_hp_customer || ''}"`,
        `"${r.email_cust || ''}"`,
        `"${r.siteplan || ''}"`,
        Number(r.aging_fisik) || 0,
        `"${(r as any).status_booking || ''}"`,
        `"${(r as any).status_ppjb || ''}"`,
        `"${(r as any).status_bast || ''}"`,
        `"${(r as any).status_serah_terima || ''}"`
      ].join(","))
    ].join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `master-tracking-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const kpiCards = [
    {
      label: "Total Cair (Revenue)",
      value: loading ? "—" : fmt(totalCair),
      sub:   loading ? "Memuat..." : `${statusCounts.cair} unit sudah cair`,
      icon:  DollarSign,
    },
    {
      label: "Total Harga DPP",
      value: loading ? "—" : fmt(totalHargaDPP),
      sub:   loading ? "Memuat..." : `Aggregate harga_jual_dpp · ${totalUnits} unit`,
      icon:  Banknote,
    },
    {
      label: "Total Plafon KPR",
      value: loading ? "—" : fmt(totalPlafon),
      sub:   loading ? "Memuat..." : `${statusCounts.sold} unit terjual`,
      icon:  Target,
    },
    {
      label: "Total Unit",
      value: loading ? "—" : String(totalUnits),
      sub:   loading ? "Memuat..." : `${statusCounts.available} available · ${statusCounts.akad} akad`,
      icon:  BarChart3,
    },
    {
      label: "Total Customer",
      value: loading ? "—" : String(totalCustomers),
      sub:   loading ? "Memuat..." : "Unique customer — Supabase live",
      icon:  Users,
    },
    {
      label: "Progres Rumah",
      value: loading ? "—" : `${progresStats.selesai} selesai`,
      sub:   loading ? "Memuat..." : `${progresStats.proses} masih proses — kolom progres_rumah`,
      icon:  Home,
    },
  ]

  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-devpro-primary/10 text-devpro-primary">
            <PieChart className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-devpro-foreground">Executive Dashboard</h1>
            <p className="text-devpro-muted-foreground">Board of Directors · Strategic Overview · Supabase Live</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Badge className={cn("text-xs font-bold px-2 py-1", realtimeActive ? "bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20" : "bg-devpro-muted/50 text-devpro-muted-foreground")}>
            {realtimeActive ? "🟢 Live" : "🔴 Offline"}
          </Badge>
          <Badge className="bg-devpro-primary/10 text-devpro-primary border border-devpro-primary/20">
            Supabase
          </Badge>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              onClick={exportLaporanRingkas}
              size="sm"
              className="bg-devpro-neon text-devpro-navy hover:bg-devpro-neon/90 font-bold text-xs"
            >
              <FileSpreadsheet className="size-3 mr-1" />
              Export Ringkas (10)
            </Button>
            <Button
              onClick={exportMasterTracking}
              size="sm"
              variant="outline"
              className="border-devpro-neon text-devpro-neon hover:bg-devpro-neon/10 font-bold text-xs"
            >
              <Download className="size-3 mr-1" />
              Export Tracking (23)
            </Button>
          </div>
          {loading && (
            <Badge className="bg-amber-500/10 text-amber-600 border-0">
              <Loader2 className="size-3 mr-1 animate-spin" /> Memuat dari Supabase...
            </Badge>
          )}
        </div>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10">
          <AlertCircle className="size-4 text-rose-400 mt-0.5 shrink-0" />
          <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
        </div>
      )}

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <DsSkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {kpiCards.map((kpi) => (
            <StaggerItem key={kpi.label}>
              <HoverScale>
                <Card className="cursor-default">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                    <kpi.icon className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                  </CardContent>
                </Card>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* ── Live Siteplan Panel ─────────────────────────────────────────────── */}
      <FadeIn delay={0.05}>
        <Card className="border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
                <Map className="size-5 text-[var(--primary)]" />
                🗺️ Live Siteplan Fisik
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-[var(--border)] rounded-lg">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSiteplanView('grid')}
                    className={cn("rounded-r-none", siteplanView === 'grid' ? "bg-[var(--muted)]" : "")}
                  >
                    <Grid3x3 className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSiteplanView('map')}
                    className={cn("rounded-l-none", siteplanView === 'map' ? "bg-[var(--muted)]" : "")}
                  >
                    <Layers className="size-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1 border border-[var(--border)] rounded-lg">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSiteplanZoom(Math.max(0.5, siteplanZoom - 0.25))}
                    className="rounded-r-none"
                  >
                    <ZoomOut className="size-4" />
                  </Button>
                  <span className="px-2 text-sm font-medium text-[var(--foreground)]">{Math.round(siteplanZoom * 100)}%</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSiteplanZoom(Math.min(2, siteplanZoom + 0.25))}
                    className="rounded-l-none"
                  >
                    <ZoomIn className="size-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {siteplanView === 'grid' ? (
                <div className="space-y-4">
                  {/* Grid View */}
                  <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6" style={{ transform: `scale(${siteplanZoom})`, transformOrigin: 'center' }}>
                    {allRows.slice(0, 24).map((unit, index) => {
                      const status = unit.status_unit || 'AVAILABLE'
                      const statusColor = {
                        'AVAILABLE': 'bg-emerald-500/20 border-emerald-500 text-emerald-700',
                        'TERJUAL': 'bg-blue-500/20 border-blue-500 text-blue-700',
                        'AKAD': 'bg-violet-500/20 border-violet-500 text-violet-700',
                        'CAIR': 'bg-orange-500/20 border-orange-500 text-orange-700',
                        'SOLD': 'bg-rose-500/20 border-rose-500 text-rose-700'
                      }[status] || 'bg-gray-500/20 border-gray-500 text-gray-700'
                      
                      return (
                        <div
                          key={index}
                          className={cn(
                            "relative p-3 rounded-lg border cursor-pointer transition-all hover:shadow-lg",
                            statusColor
                          )}
                          onClick={() => setSelectedUnit(unit)}
                        >
                          <div className="text-xs font-bold text-center">{unit.tipe_unit || 'N/A'}</div>
                          <div className="text-[10px] text-center mt-1">{unit.blok}-{unit.nomor}</div>
                          <div className="text-[10px] text-center mt-1 font-medium">
                            {unit.nama_customer ? unit.nama_customer.split(' ')[0] : 'Available'}
                          </div>
                          {unit.progres_rumah && (
                            <div className="absolute top-1 right-1">
                              <div className="text-[8px] bg-white/80 px-1 rounded">
                                {unit.progres_rumah.includes('100') ? '✅' : `${unit.progres_rumah}%`}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs text-[var(--muted-foreground)]">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-emerald-500 rounded" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded" />
                      <span>Terjual</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-violet-500 rounded" />
                      <span>Akad</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-500 rounded" />
                      <span>Cair</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-rose-500 rounded" />
                      <span>Sold</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Map View */}
                  <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-[var(--border)] overflow-hidden" style={{ transform: `scale(${siteplanZoom})`, transformOrigin: 'center' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Map className="size-16 text-[var(--muted-foreground)] mx-auto mb-4" />
                        <p className="text-[var(--muted-foreground)] font-medium">Interactive Siteplan Map</p>
                        <p className="text-sm text-[var(--muted-foreground)]/80 mt-2">Click units to view details</p>
                      </div>
                    </div>
                    {/* Mock unit positions on map */}
                    {allRows.slice(0, 12).map((unit, index) => {
                      const positions = [
                        { top: '20%', left: '15%' },
                        { top: '20%', left: '35%' },
                        { top: '20%', left: '55%' },
                        { top: '20%', left: '75%' },
                        { top: '40%', left: '15%' },
                        { top: '40%', left: '35%' },
                        { top: '40%', left: '55%' },
                        { top: '40%', left: '75%' },
                        { top: '60%', left: '15%' },
                        { top: '60%', left: '35%' },
                        { top: '60%', left: '55%' },
                        { top: '60%', left: '75%' },
                      ]
                      const pos = positions[index % positions.length]
                      const status = unit.status_unit || 'AVAILABLE'
                      const statusColor = {
                        'AVAILABLE': 'bg-emerald-500',
                        'TERJUAL': 'bg-blue-500',
                        'AKAD': 'bg-violet-500',
                        'CAIR': 'bg-orange-500',
                        'SOLD': 'bg-rose-500'
                      }[status] || 'bg-gray-500'
                      
                      return (
                        <div
                          key={index}
                          className="absolute w-3 h-3 rounded-full cursor-pointer hover:scale-150 transition-transform"
                          style={pos}
                          className={statusColor}
                          onClick={() => setSelectedUnit(unit)}
                          title={`${unit.tipe_unit} - ${unit.blok}-${unit.nomor}`}
                        />
                      )
                    })}
                  </div>
                  <div className="text-center text-xs text-[var(--muted-foreground)]">
                    🗺️ Interactive siteplan with real-time unit availability
                  </div>
                </div>
              )}
              
              {/* Selected Unit Details */}
              {selectedUnit && (
                <div className="mt-4 p-4 bg-[var(--muted)]/30 rounded-lg border border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[var(--foreground)]">{selectedUnit.tipe_unit}</h4>
                      <p className="text-sm text-[var(--muted-foreground)]">{selectedUnit.blok}-{selectedUnit.nomor}</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        Customer: {selectedUnit.nama_customer || 'Available'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSelectedUnit(null)}>
                      <Eye className="size-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* ── Activity Feed + Firebase Stats ─────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <FadeIn delay={0.1}>
          <ActivityFeed />
        </FadeIn>
        <FadeIn delay={0.2}>
          <FirebaseStats />
        </FadeIn>
      </div>

      {/* ── Status Breakdown + Strategic Initiatives ───────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Status Unit — live dari Supabase */}
        <Card>
          <CardHeader>
            <CardTitle>Status Unit — Supabase Live</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
              </div>
            ) : error ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                Data belum tersedia
              </p>
            ) : (
              <div className="space-y-4">
                {[
                  { label: "Available / Tersedia", val: statusCounts.available, color: "bg-emerald-500" },
                  { label: "Proses / Reserved",    val: statusCounts.reserved,  color: "bg-amber-500"  },
                  { label: "Akad",                  val: statusCounts.akad,      color: "bg-blue-500"   },
                  { label: "Cair",                  val: statusCounts.cair,      color: "bg-violet-500" },
                  { label: "Sold / Terjual",         val: statusCounts.sold,      color: "bg-rose-500"   },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium">{row.label}</span>
                      <span className="text-sm font-bold tabular-nums">{row.val}</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className={`${row.color} h-2 rounded-full transition-all duration-700`}
                        style={{ width: totalUnits > 0 ? `${(row.val / totalUnits) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2 text-right tabular-nums">
                  Total: {totalUnits} unit
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strategic Initiatives — static, konfigurasi internal */}
        <Card>
          <CardHeader>
            <CardTitle>Strategic Initiatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-devpro-primary/5 border border-devpro-primary/10">
                <h3 className="font-semibold text-devpro-primary mb-2">Digital Transformation</h3>
                <p className="text-sm text-devpro-muted-foreground">Complete digital integration across all departments</p>
                <div className="mt-2 w-full bg-devpro-primary/20 rounded-full h-2">
                  <div className="bg-devpro-primary h-2 rounded-full" style={{ width: "78%" }} />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <h3 className="font-semibold text-emerald-600 mb-2">Market Expansion</h3>
                <p className="text-sm text-devpro-muted-foreground">Enter 3 new regional markets</p>
                <div className="mt-2 w-full bg-emerald-500/20 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <h3 className="font-semibold text-amber-600 mb-2">Customer Experience</h3>
                <p className="text-sm text-devpro-muted-foreground">Achieve 95% customer satisfaction</p>
                <div className="mt-2 w-full bg-amber-500/20 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
