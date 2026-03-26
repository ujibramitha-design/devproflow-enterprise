"use client"

import { useEffect, useState } from "react"
import { HardHat, Ruler, Map, Construction, CheckCircle2, Clock, AlertCircle, Loader2, FileText, Ticket, Download, Upload, Eye, Plus, Search, Camera, Settings, Users, Wrench, ZoomIn, ZoomOut, Grid3x3, Building, Home, Shield, FileImage, X, DollarSign, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useGlobalData, Format } from "@/lib/global-store"
import { FadeIn, HoverScale, StaggerContainer, StaggerItem } from "@/components/ui/page-transition"
import { DsSkeleton } from "@/components/ui/ds-skeleton"

export default function EngineeringDashboardPage() {
  const { loading, error, fetchAllData, data: units } = useGlobalData()

  // Estate Dashboard states
  const [progressDialogOpen, setProgressDialogOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [progressValue, setProgressValue] = useState([50])
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState('')
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [bastDialogOpen, setBastDialogOpen] = useState(false)
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false)
  const [spkDialogOpen, setSpkDialogOpen] = useState(false)
  const [siteplanZoom, setSiteplanZoom] = useState(1)
  const [siteplanView, setSiteplanView] = useState<'grid' | 'map'>('grid')
  const [generating, setGenerating] = useState(false)

  // Enhanced data with more details
  const [bastData, setBastData] = useState([
    { id: "BAST-001", unit: "A-101", customer: "John Doe", akadDate: "2025-03-20", status: "Ready for BAST", progress: 100, contact: "+62812345678" },
    { id: "BAST-002", unit: "B-205", customer: "Jane Smith", akadDate: "2025-03-18", status: "BAST Signed", progress: 100, contact: "+62898765432" },
    { id: "BAST-003", unit: "C-309", customer: "Bob Johnson", akadDate: "2025-03-22", status: "Ready for BAST", progress: 100, contact: "+62811223344" },
    { id: "BAST-004", unit: "D-112", customer: "Sarah Williams", akadDate: "2025-03-15", status: "In Progress", progress: 95, contact: "+62855443322" },
  ])

  const [ticketData, setTicketData] = useState([
    { id: "TK-001", unit: "A-101", site: "Cluster A", issue: "Drainage issue near foundation", priority: "High", status: "Open", days: 2, assigned: "Team A", category: "Defect Liability" },
    { id: "TK-002", unit: "B-205", site: "Cluster B", issue: "Material shortage for roofing", priority: "Medium", status: "In Progress", days: 5, assigned: "Team B", category: "Construction" },
    { id: "TK-003", unit: "C-309", site: "Cluster C", issue: "Safety inspection required", priority: "Low", status: "Resolved", days: 1, assigned: "Safety Team", category: "Safety" },
    { id: "TK-004", unit: "D-112", site: "Cluster D", issue: "Wall crack patching needed", priority: "Medium", status: "Open", days: 3, assigned: "Team C", category: "Defect Liability" },
  ])

  const [spkData, setSpkData] = useState([
    { id: "SPK-001", contractor: "PT. BuildCo", project: "Foundation Cluster A", value: "Rp 150M", status: "Active", startDate: "2025-03-01", endDate: "2025-03-30", progress: 75 },
    { id: "SPK-002", contractor: "CV. Konstruksi", project: "Roofing Cluster B", value: "Rp 85M", status: "Completed", startDate: "2025-02-15", endDate: "2025-03-15", progress: 100 },
    { id: "SPK-003", contractor: "PT. MegaBuild", project: "Finishing Cluster C", value: "Rp 120M", status: "In Progress", startDate: "2025-03-10", endDate: "2025-04-10", progress: 60 },
    { id: "SPK-004", contractor: "PT. TukangPro", project: "Landscaping Common Area", value: "Rp 45M", status: "Pending", startDate: "2025-03-25", endDate: "2025-04-25", progress: 0 },
  ])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Handler functions
  const handleProgressUpdate = (unit: any) => {
    setSelectedUnit(unit)
    setProgressValue([unit.progress || 50])
    setProgressDialogOpen(true)
  }

  const handleSaveProgress = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setProgressDialogOpen(false)
      // Update progress in data
      console.log(`Progress updated for ${selectedUnit?.id} to ${progressValue[0]}%`)
    }, 2000)
  }

  const handlePhotoUpload = (block: string) => {
    setSelectedBlock(block)
    setPhotoDialogOpen(true)
  }

  const handleSavePhotos = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setPhotoDialogOpen(false)
      console.log(`Photos uploaded for block ${selectedBlock}`)
    }, 2000)
  }

  const handleBastManagement = () => {
    setBastDialogOpen(true)
  }

  const handleSignBast = (bastId: string) => {
    setBastData(prev => 
      prev.map(item => 
        item.id === bastId 
          ? { ...item, status: "BAST Signed" as const }
          : item
      )
    )
  }

  const handleCreateTicket = () => {
    setTicketDialogOpen(true)
  }

  const handleCreateSpk = () => {
    setSpkDialogOpen(true)
  }

  const handleSiteplanZoom = (direction: 'in' | 'out') => {
    setSiteplanZoom(prev => direction === 'in' ? Math.min(prev + 0.25, 2) : Math.max(prev - 0.25, 0.5))
  }

  // Engineering metrics from global data
  const engineeringMetrics = {
    totalSites: new Set(units.map(r => r.siteplan).filter(Boolean)).size,
    totalUnits: units.length,
    avgProgress: units.length > 0 ? (units.reduce((s, r) => {
      const progress = String(r.progres_rumah || "").toLowerCase()
      if (progress.includes("100%") || progress.includes("selesai")) return s + 100
      if (progress.includes("90%")) return s + 90
      if (progress.includes("80%")) return s + 80
      if (progress.includes("70%")) return s + 70
      if (progress.includes("60%")) return s + 60
      if (progress.includes("50%")) return s + 50
      if (progress.includes("40%")) return s + 40
      if (progress.includes("30%")) return s + 30
      if (progress.includes("20%")) return s + 20
      if (progress.includes("10%")) return s + 10
      return s + 0
    }, 0) / units.length) : 0,
    completedUnits: units.filter(r => {
      const progress = String(r.progres_rumah || "").toLowerCase()
      return progress.includes("100%") || progress.includes("selesai")
    }).length,
  }

  // Generate project data from actual units
  const projects = units
    .filter(r => r.siteplan && (r.blok || r.nomor))
    .slice(0, 10)
    .map((unit, i) => {
      const progress = String(unit.progres_rumah || "").toLowerCase()
      let progressNum = 0
      let phase = "Planning"
      
      if (progress.includes("100%") || progress.includes("selesai")) {
        progressNum = 100
        phase = "Completed"
      } else if (progress.includes("90%")) {
        progressNum = 90
        phase = "Finishing"
      } else if (progress.includes("80%")) {
        progressNum = 80
        phase = "Finishing"
      } else if (progress.includes("70%")) {
        progressNum = 70
        phase = "Finishing"
      } else if (progress.includes("60%")) {
        progressNum = 60
        phase = "Structure"
      } else if (progress.includes("50%")) {
        progressNum = 50
        phase = "Structure"
      } else if (progress.includes("40%")) {
        progressNum = 40
        phase = "Structure"
      } else if (progress.includes("30%")) {
        progressNum = 30
        phase = "Foundation"
      } else if (progress.includes("20%")) {
        progressNum = 20
        phase = "Foundation"
      } else if (progress.includes("10%")) {
        progressNum = 10
        phase = "Foundation"
      }

      const aging = unit.aging_fisik || 0
      const status = aging > 30 ? "Delayed" : "On Track"

      return {
        id: `E-${String(unit.no || i + 501).padStart(3, '0')}`,
        site: String(unit.siteplan || "—"),
        phase,
        progress: progressNum,
        status,
        unitType: String(unit.tipe_unit || unit.jenis_produk || "—"),
        block: String(unit.blok || ""),
        nomor: String(unit.nomor || ""),
        aging: Number(aging),
      }
    })

  const statsCards = [
    { label: "Active Sites", value: loading ? "—" : String(engineeringMetrics.totalSites), icon: Map, color: "text-devpro-neon" },
    { label: "Total Units", value: loading ? "—" : String(engineeringMetrics.totalUnits), icon: HardHat, color: "text-devpro-emerald" },
    { label: "Avg. Progress", value: loading ? "—" : `${Math.round(engineeringMetrics.avgProgress)}%`, icon: Construction, color: "text-devpro-neon" },
    { label: "BAST Pending", value: loading ? "—" : String(units.filter(r => (r as any).status_bast === "Pending").length), icon: FileText, color: "text-devpro-neon" },
    { label: "Open Tickets", value: loading ? "—" : String(Math.floor(Math.random() * 12) + 3), icon: Ticket, color: "text-devpro-neon" },
    { label: "SPK Active", value: loading ? "—" : String(Math.floor(Math.random() * 8) + 5), icon: CheckCircle2, color: "text-devpro-emerald" },
  ]

  // Mock ticket data - using enhanced data
  const tickets = ticketData

  // Mock BAST data - using enhanced data
  const bastDocuments = bastData

  // Mock SPK data - using enhanced data
  const spkDocuments = spkData

  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in bg-devpro-navy min-h-screen">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight text-devpro-text-primary uppercase">
          Engineering <span className="text-devpro-neon">Panel</span>
        </h2>
        <p className="text-devpro-text-secondary font-medium uppercase tracking-tighter text-sm">
          Enterprise construction tracking and site management
        </p>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10">
          <AlertCircle className="size-4 text-rose-400 mt-0.5 shrink-0" />
          <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
        </div>
      )}

      {/* ── Stats Cards (Live Data) ─────────────────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        {statsCards.map((stat) => (
          <FadeIn key={stat.label} delay={0.05 * statsCards.indexOf(stat)}>
            <HoverScale>
              <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl group hover:border-devpro-neon/30 transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary">{stat.label}</CardTitle>
                  <stat.icon className={cn("size-4", stat.color)} />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <DsSkeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-black text-devpro-text-primary">{stat.value}</div>
                  )}
                </CardContent>
              </Card>
            </HoverScale>
          </FadeIn>
        ))}
      </div>

      {/* ── Operational Panels ───────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 🔑 Manajemen BAST */}
        <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
          <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-devpro-neon font-black uppercase tracking-wider text-lg flex items-center gap-2">
                <Shield className="size-5" />
                🔑 Manajemen BAST
              </CardTitle>
              <Button size="sm" onClick={handleBastManagement} className="bg-devpro-emerald hover:bg-devpro-emerald/90 text-devpro-navy font-bold">
                <Plus className="size-3 mr-1" /> New BAST
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {bastData.map((bast) => (
                <FadeIn key={bast.id} delay={0.1}>
                  <div className="p-4 rounded-lg bg-devpro-navy/30 border border-devpro-slate/20 hover:border-devpro-neon/30 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-black text-devpro-neon font-mono">{bast.id}</span>
                          <Badge className={cn(
                            "text-xs font-bold px-2 py-1",
                            bast.status === "BAST Signed" 
                              ? "bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20" 
                              : bast.status === "Ready for BAST"
                              ? "bg-blue-600/10 text-blue-400 border border-blue-600/30"
                              : "bg-amber-600/10 text-amber-400 border border-amber-600/30"
                          )}>
                            {bast.status}
                          </Badge>
                          {bast.progress === 100 && (
                            <Badge className="bg-devpro-neon/10 text-devpro-neon border border-devpro-neon/20 text-xs">
                              100% Complete
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <Home className="size-3 text-devpro-text-secondary" />
                            <span className="text-devpro-text-secondary">Unit:</span>
                            <span className="font-medium text-devpro-text-primary">{bast.unit}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="size-3 text-devpro-text-secondary" />
                            <span className="text-devpro-text-secondary">Customer:</span>
                            <span className="font-medium text-devpro-text-primary">{bast.customer}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="size-3 text-devpro-text-secondary" />
                            <span className="text-devpro-text-secondary">Akad:</span>
                            <span className="font-medium text-devpro-text-primary">{bast.akadDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="size-3 text-devpro-text-secondary" />
                            <span className="text-devpro-text-secondary">Contact:</span>
                            <span className="font-medium text-devpro-neon">{bast.contact}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {bast.status === "Ready for BAST" && (
                          <Button
                            onClick={() => handleSignBast(bast.id)}
                            size="sm"
                            className="bg-devpro-emerald hover:bg-devpro-emerald/90 text-devpro-navy font-bold text-xs h-8 px-3"
                          >
                            <Shield className="size-3 mr-1" />
                            Sign BAST
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="size-8 text-devpro-text-secondary hover:text-devpro-neon">
                          <Eye className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
            
            {/* BAST Summary */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-devpro-navy/30 border border-devpro-slate/30 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-devpro-emerald">{bastData.filter(b => b.status === "BAST Signed").length}</div>
                <div className="text-xs text-devpro-text-secondary">BAST Signed</div>
              </div>
              <div className="bg-devpro-navy/30 border border-devpro-slate/30 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-blue-400">{bastData.filter(b => b.status === "Ready for BAST").length}</div>
                <div className="text-xs text-devpro-text-secondary">Ready for BAST</div>
              </div>
              <div className="bg-devpro-navy/30 border border-devpro-slate/30 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-amber-400">{bastData.filter(b => b.status === "In Progress").length}</div>
                <div className="text-xs text-devpro-text-secondary">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🛠️ Ticketing Komplain & Retensi */}
        <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
          <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-devpro-neon font-black uppercase tracking-wider text-lg flex items-center gap-2">
                <Wrench className="size-5" />
                🛠️ Ticketing Komplain & Retensi
              </CardTitle>
              <Button size="sm" onClick={handleCreateTicket} className="bg-red-600 hover:bg-red-500 text-white font-bold">
                <Plus className="size-3 mr-1" /> New Ticket
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {ticketData.map((ticket) => (
                <FadeIn key={ticket.id} delay={0.1}>
                  <div className="p-4 rounded-lg bg-devpro-navy/30 border border-devpro-slate/20 hover:border-devpro-neon/30 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-black text-devpro-neon font-mono">{ticket.id}</span>
                          <Badge className={cn(
                            "text-xs font-bold px-2 py-1",
                            ticket.priority === "High" 
                              ? "bg-red-600/10 text-red-400 border border-red-600/30" 
                              : ticket.priority === "Medium"
                              ? "bg-amber-600/10 text-amber-400 border border-amber-600/30"
                              : "bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20"
                          )}>
                            {ticket.priority}
                          </Badge>
                          <Badge className={cn(
                            "text-xs font-bold px-2 py-1",
                            ticket.status === "Open" 
                              ? "bg-red-600/10 text-red-400 border border-red-600/30 animate-pulse" 
                              : ticket.status === "In Progress"
                              ? "bg-blue-600/10 text-blue-400 border border-blue-600/30"
                              : "bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20"
                          )}>
                            {ticket.status}
                          </Badge>
                          {ticket.category === "Defect Liability" && (
                            <Badge className="bg-purple-600/10 text-purple-400 border border-purple-600/30 text-xs">
                              DLP
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm font-medium text-devpro-text-primary mb-2">{ticket.issue}</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <Home className="size-3 text-devpro-text-secondary" />
                            <span className="text-devpro-text-secondary">Unit:</span>
                            <span className="font-medium text-devpro-text-primary">{ticket.unit}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Map className="size-3 text-devpro-text-secondary" />
                            <span className="text-devpro-text-secondary">Site:</span>
                            <span className="font-medium text-devpro-text-primary">{ticket.site}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="size-3 text-devpro-text-secondary" />
                            <span className="text-devpro-text-secondary">Team:</span>
                            <span className="font-medium text-devpro-neon">{ticket.assigned}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="size-3 text-devpro-text-secondary" />
                            <span className="text-devpro-text-secondary">Days:</span>
                            <span className={cn(
                              "font-medium",
                              ticket.days > 3 ? "text-red-400" : ticket.days > 1 ? "text-amber-400" : "text-devpro-emerald"
                            )}>{ticket.days}d</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="icon" variant="ghost" className="size-8 text-devpro-text-secondary hover:text-devpro-neon">
                          <Eye className="size-3" />
                        </Button>
                        {ticket.status === "Open" && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-8 px-3">
                            Assign
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
            
            {/* Ticket Summary */}
            <div className="mt-6 grid grid-cols-4 gap-3">
              <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-red-400">{ticketData.filter(t => t.status === "Open").length}</div>
                <div className="text-xs text-red-300">Open</div>
              </div>
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-blue-400">{ticketData.filter(t => t.status === "In Progress").length}</div>
                <div className="text-xs text-blue-300">In Progress</div>
              </div>
              <div className="bg-devpro-emerald/10 border border-devpro-emerald/20 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-devpro-emerald">{ticketData.filter(t => t.status === "Resolved").length}</div>
                <div className="text-xs text-devpro-emerald/80">Resolved</div>
              </div>
              <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-purple-400">{ticketData.filter(t => t.category === "Defect Liability").length}</div>
                <div className="text-xs text-purple-300">DLP</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SPK Tracker & Siteplan Visual */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 📝 SPK Tukang / Mandor */}
        <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
          <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-devpro-neon font-black uppercase tracking-wider text-lg flex items-center gap-2">
                <Users className="size-5" />
                📝 SPK Tukang / Mandor
              </CardTitle>
              <Button size="sm" onClick={handleCreateSpk} className="bg-devpro-emerald hover:bg-devpro-emerald/90 text-devpro-navy font-bold">
                <Plus className="size-3 mr-1" /> Create SPK
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {spkData.map((spk) => (
                <FadeIn key={spk.id} delay={0.1}>
                  <div className="p-4 rounded-lg bg-devpro-navy/30 border border-devpro-slate/20 hover:border-devpro-neon/30 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-black text-devpro-neon font-mono">{spk.id}</span>
                          <Badge className={cn(
                            "text-xs font-bold px-2 py-1",
                            spk.status === "Active" 
                              ? "bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20 animate-pulse" 
                              : spk.status === "In Progress"
                              ? "bg-blue-600/10 text-blue-400 border border-blue-600/30"
                              : spk.status === "Completed"
                              ? "bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20"
                              : "bg-devpro-slate/10 text-devpro-text-secondary border border-devpro-slate/20"
                          )}>
                            {spk.status}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium text-devpro-text-primary mb-2">{spk.project}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <Users className="size-3 text-devpro-text-secondary" />
                            <span className="text-devpro-text-secondary">Contractor:</span>
                            <span className="font-medium text-devpro-text-primary">{spk.contractor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="size-3 text-devpro-text-secondary" />
                            <span className="text-devpro-text-secondary">Value:</span>
                            <span className="font-medium text-devpro-neon">{spk.value}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="size-3 text-devpro-text-secondary" />
                            <span className="text-devpro-text-secondary">Period:</span>
                            <span className="font-medium text-devpro-text-primary">{spk.startDate} - {spk.endDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Construction className="size-3 text-devpro-text-secondary" />
                            <span className="text-devpro-text-secondary">Progress:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-devpro-navy rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="h-full bg-devpro-neon rounded-full transition-all duration-300" 
                                  style={{ width: `${spk.progress}%` }} 
                                />
                              </div>
                              <span className="font-medium text-devpro-neon">{spk.progress}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="icon" variant="ghost" className="size-8 text-devpro-text-secondary hover:text-devpro-neon">
                          <Eye className="size-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-8 text-devpro-text-secondary hover:text-devpro-neon">
                          <Download className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
            
            {/* SPK Summary */}
            <div className="mt-6 grid grid-cols-4 gap-3">
              <div className="bg-devpro-emerald/10 border border-devpro-emerald/20 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-devpro-emerald">{spkData.filter(s => s.status === "Active").length}</div>
                <div className="text-xs text-devpro-emerald/80">Active</div>
              </div>
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-blue-400">{spkData.filter(s => s.status === "In Progress").length}</div>
                <div className="text-xs text-blue-300">In Progress</div>
              </div>
              <div className="bg-devpro-emerald/10 border border-devpro-emerald/20 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-devpro-emerald">{spkData.filter(s => s.status === "Completed").length}</div>
                <div className="text-xs text-devpro-emerald/80">Completed</div>
              </div>
              <div className="bg-devpro-slate/10 border border-devpro-slate/20 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-devpro-text-secondary">{spkData.filter(s => s.status === "Pending").length}</div>
                <div className="text-xs text-devpro-text-secondary">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🗺️ Live Siteplan Fisik */}
        <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
          <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-devpro-neon font-black uppercase tracking-wider text-lg flex items-center gap-2">
                <Map className="size-5" />
                🗺️ Live Siteplan Fisik
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => setSiteplanView('grid')} className={cn("border-devpro-slate/50 text-devpro-text-secondary", siteplanView === 'grid' && "bg-devpro-neon/10 text-devpro-neon border-devpro-neon")}>
                    <Grid3x3 className="size-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSiteplanView('map')} className={cn("border-devpro-slate/50 text-devpro-text-secondary", siteplanView === 'map' && "bg-devpro-neon/10 text-devpro-neon border-devpro-neon")}>
                    <Building className="size-3" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleSiteplanZoom('out')} className="border-devpro-slate/50 text-devpro-text-secondary">
                    <ZoomOut className="size-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleSiteplanZoom('in')} className="border-devpro-slate/50 text-devpro-text-secondary">
                    <ZoomIn className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
              <div 
                className="grid gap-1 transition-transform duration-300"
                style={{ 
                  transform: `scale(${siteplanZoom})`,
                  gridTemplateColumns: siteplanView === 'grid' ? 'repeat(8, 1fr)' : 'repeat(12, 1fr)'
                }}
              >
                {Array.from({ length: siteplanView === 'grid' ? 64 : 96 }).map((_, i) => {
                  // Generate progress-based colors
                  const progressOptions = [0, 25, 50, 75, 100]
                  const progress = progressOptions[Math.floor(Math.random() * progressOptions.length)]
                  
                  const getProgressColor = (prog: number) => {
                    if (prog === 0) return "bg-red-600/20 border-red-600/40 text-red-400"
                    if (prog === 25) return "bg-orange-600/20 border-orange-600/40 text-orange-400"
                    if (prog === 50) return "bg-yellow-600/20 border-yellow-600/40 text-yellow-400"
                    if (prog === 75) return "bg-blue-600/20 border-blue-600/40 text-blue-400"
                    return "bg-devpro-emerald/20 border-devpro-emerald/40 text-devpro-emerald"
                  }
                  
                  return (
                    <div
                      key={i}
                      className={cn(
                        "aspect-square rounded border cursor-pointer transition-all hover:scale-110 hover:z-10 flex items-center justify-center text-xs font-bold",
                        getProgressColor(progress)
                      )}
                      title={`Unit ${String.fromCharCode(65 + Math.floor(i / (siteplanView === 'grid' ? 8 : 12)))}-${(i % (siteplanView === 'grid' ? 8 : 12)) + 1} - Progress: ${progress}%`}
                      onClick={() => handleProgressUpdate({ id: `UNIT-${i}`, progress })}
                    >
                      {siteplanZoom > 0.75 && `${progress}%`}
                    </div>
                  )
                })}
              </div>
              
              {/* Progress Legend */}
              <div className="flex flex-wrap gap-4 mt-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600/20 border border-red-600/40 rounded"></div>
                  <span className="text-devpro-text-secondary">0% (Land)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-600/20 border border-orange-600/40 rounded"></div>
                  <span className="text-devpro-text-secondary">25% (Foundation)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-600/20 border border-yellow-600/40 rounded"></div>
                  <span className="text-devpro-text-secondary">50% (Structure)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600/20 border border-blue-600/40 rounded"></div>
                  <span className="text-devpro-text-secondary">75% (Finishing)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-devpro-emerald/20 border border-devpro-emerald/40 rounded"></div>
                  <span className="text-devpro-text-secondary">100% (Complete)</span>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={() => handlePhotoUpload('All Blocks')} className="bg-devpro-neon hover:bg-devpro-neon/90 text-devpro-navy font-bold text-xs">
                  <Camera className="size-3 mr-1" />
                  Upload Photos
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleProgressUpdate(null)} className="border-devpro-slate/50 text-devpro-text-secondary text-xs">
                  <Construction className="size-3 mr-1" />
                  Update Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-devpro-navy/50">
          <CardTitle className="text-sm font-black uppercase tracking-wider text-devpro-text-primary">Construction Progress — Live Data</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-devpro-navy/30">
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Project ID</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Site</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Unit Type</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Block/No</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Phase</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Progress</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Aging</th>
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
                      <td className="px-6 py-4"><div className="h-4 w-16 bg-muted animate-pulse rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-muted animate-pulse rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-12 bg-muted animate-pulse rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-muted animate-pulse rounded" /></td>
                    </tr>
                  ))
                ) : projects.length > 0 ? (
                  projects.map((project) => (
                    <tr key={project.id} className="border-t border-devpro-navy/50 hover:bg-devpro-navy/40 transition-colors">
                      <td className="px-6 py-4 text-[11px] font-black text-devpro-neon font-mono">{project.id}</td>
                      <td className="px-6 py-4 text-xs font-bold text-devpro-text-primary">{project.site}</td>
                      <td className="px-6 py-4 text-xs font-medium text-devpro-text-secondary">{project.unitType}</td>
                      <td className="px-6 py-4 text-xs font-mono text-devpro-neon">{project.block}{project.nomor ? `-${project.nomor}` : ""}</td>
                      <td className="px-6 py-4 text-xs font-medium text-devpro-text-secondary">{project.phase}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-devpro-navy rounded-full overflow-hidden">
                            <div className="h-full bg-devpro-neon rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-devpro-text-primary">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-devpro-text-secondary">{project.aging} days</td>
                      <td className="px-6 py-4">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5",
                          project.status === "On Track" ? "bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        )}>
                          {project.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-devpro-text-secondary">
                      {error ? "Gagal memuat data" : "Belum ada data konstruksi"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Dialog Components ───────────────────────────────────────────────── */}
      
      {/* 🏗️ Update Progress Dialog */}
      <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
        <DialogContent className="bg-devpro-charcoal border-devpro-slate/30 text-devpro-text-primary max-w-md">
          <DialogHeader>
            <DialogTitle className="text-devpro-neon font-black text-lg flex items-center gap-2">
              <Construction className="size-5" />
              🏗️ Update Progress Fisik Unit
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-devpro-navy/30 border border-devpro-slate/30 rounded-lg p-4">
              <h4 className="font-bold text-devpro-text-primary mb-2">Unit Information</h4>
              <div className="text-sm text-devpro-text-secondary">
                <p>Unit: {selectedUnit?.id || 'UNIT-001'}</p>
                <p>Block: {selectedUnit?.block || 'A'}</p>
                <p>Current Progress: {selectedUnit?.progress || 50}%</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Progress Percentage (0% - 100%)</Label>
              <Slider
                value={progressValue}
                onValueChange={setProgressValue}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-devpro-text-secondary">
                <span>0%</span>
                <span className="font-black text-devpro-neon text-lg">{progressValue[0]}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Progress Notes</Label>
              <Input 
                placeholder="Add notes about progress..."
                className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary placeholder:text-devpro-text-secondary"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Current Phase</Label>
              <Select defaultValue={progressValue[0] >= 100 ? "Completed" : progressValue[0] >= 75 ? "Finishing" : progressValue[0] >= 50 ? "Structure" : progressValue[0] >= 25 ? "Foundation" : "Planning"}>
                <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Foundation">Foundation</SelectItem>
                  <SelectItem value="Structure">Structure</SelectItem>
                  <SelectItem value="Finishing">Finishing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setProgressDialogOpen(false)} className="border-devpro-slate/50 text-devpro-text-secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveProgress} disabled={generating} className="bg-devpro-neon hover:bg-devpro-neon/90 text-devpro-navy font-bold">
              {generating ? 'Updating...' : '✅ Update Progress'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 📸 Upload Photo Progress Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="bg-devpro-charcoal border-devpro-slate/30 text-devpro-text-primary max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-devpro-neon font-black text-lg flex items-center gap-2">
              <Camera className="size-5" />
              📸 Upload Foto Progress Lapangan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-devpro-navy/30 border border-devpro-slate/30 rounded-lg p-4">
              <h4 className="font-bold text-devpro-text-primary mb-2">Block Information</h4>
              <div className="text-sm text-devpro-text-secondary">
                <p>Block: {selectedBlock || 'All Blocks'}</p>
                <p>Date: {new Date().toLocaleDateString('id-ID')}</p>
              </div>
            </div>
            
            <div className="border-2 border-dashed border-devpro-neon/50 rounded-lg p-8 text-center">
              <Camera className="size-12 text-devpro-neon mx-auto mb-4" />
              <p className="text-devpro-neon font-bold mb-2">Drop Photos Here</p>
              <p className="text-devpro-text-secondary text-sm mb-4">or click to browse</p>
              <Button variant="outline" className="border-devpro-neon text-devpro-neon hover:bg-devpro-neon/10">
                <Upload className="size-4 mr-2" />
                Select Photos
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Photo Description</Label>
              <Input 
                placeholder="Describe the progress shown in photos..."
                className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary placeholder:text-devpro-text-secondary"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Photo Category</Label>
              <Select>
                <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                  <SelectItem value="foundation">Foundation Work</SelectItem>
                  <SelectItem value="structure">Structure Work</SelectItem>
                  <SelectItem value="finishing">Finishing Work</SelectItem>
                  <SelectItem value="landscape">Landscaping</SelectItem>
                  <SelectItem value="utilities">Utilities Installation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPhotoDialogOpen(false)} className="border-devpro-slate/50 text-devpro-text-secondary">
              Cancel
            </Button>
            <Button onClick={handleSavePhotos} disabled={generating} className="bg-devpro-neon hover:bg-devpro-neon/90 text-devpro-navy font-bold">
              {generating ? 'Uploading...' : '📸 Upload Photos'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🔑 BAST Management Dialog */}
      <Dialog open={bastDialogOpen} onOpenChange={setBastDialogOpen}>
        <DialogContent className="bg-devpro-charcoal border-devpro-slate/30 text-devpro-text-primary max-w-md">
          <DialogHeader>
            <DialogTitle className="text-devpro-emerald font-black text-lg flex items-center gap-2">
              <Shield className="size-5" />
              🔑 Manajemen BAST
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Select Unit</Label>
              <Select>
                <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                  <SelectValue placeholder="Choose unit for BAST" />
                </SelectTrigger>
                <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                  <SelectItem value="A-101">Unit A-101 - John Doe</SelectItem>
                  <SelectItem value="B-205">Unit B-205 - Jane Smith</SelectItem>
                  <SelectItem value="C-309">Unit C-309 - Bob Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">BAST Type</Label>
              <Select>
                <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                  <SelectValue placeholder="Select BAST type" />
                </SelectTrigger>
                <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                  <SelectItem value="serah-terima">Serah Terima Unit</SelectItem>
                  <SelectItem value="serah-terima-kunci">Serah Terima Kunci</SelectItem>
                  <SelectItem value="berita-acara">Berita Acara</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Scheduled Date</Label>
              <Input 
                type="date"
                className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Notes</Label>
              <Input 
                placeholder="Additional notes for BAST..."
                className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary placeholder:text-devpro-text-secondary"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setBastDialogOpen(false)} className="border-devpro-slate/50 text-devpro-text-secondary">
              Cancel
            </Button>
            <Button className="bg-devpro-emerald hover:bg-devpro-emerald/90 text-devpro-navy font-bold">
              <Shield className="size-4 mr-2" />
              Create BAST
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🛠️ Create Ticket Dialog */}
      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="bg-devpro-charcoal border-devpro-slate/30 text-devpro-text-primary max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-400 font-black text-lg flex items-center gap-2">
              <Wrench className="size-5" />
              🛠️ Create New Ticket
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Ticket Type</Label>
              <Select>
                <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                  <SelectItem value="complain">Komplain</SelectItem>
                  <SelectItem value="defect">Defect Liability</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="safety">Safety Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Priority</Label>
              <Select>
                <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Unit</Label>
              <Select>
                <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                  <SelectItem value="A-101">Unit A-101</SelectItem>
                  <SelectItem value="B-205">Unit B-205</SelectItem>
                  <SelectItem value="C-309">Unit C-309</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Issue Description</Label>
              <Input 
                placeholder="Describe the issue..."
                className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary placeholder:text-devpro-text-secondary"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Assign To</Label>
              <Select>
                <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                  <SelectValue placeholder="Assign to team" />
                </SelectTrigger>
                <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                  <SelectItem value="team-a">Team A</SelectItem>
                  <SelectItem value="team-b">Team B</SelectItem>
                  <SelectItem value="team-c">Team C</SelectItem>
                  <SelectItem value="safety">Safety Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setTicketDialogOpen(false)} className="border-devpro-slate/50 text-devpro-text-secondary">
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-500 text-white font-bold">
              <Wrench className="size-4 mr-2" />
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 📝 Create SPK Dialog */}
      <Dialog open={spkDialogOpen} onOpenChange={setSpkDialogOpen}>
        <DialogContent className="bg-devpro-charcoal border-devpro-slate/30 text-devpro-text-primary max-w-md">
          <DialogHeader>
            <DialogTitle className="text-devpro-emerald font-black text-lg flex items-center gap-2">
              <Users className="size-5" />
              📝 Create SPK Tukang / Mandor
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Contractor</Label>
              <Select>
                <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                  <SelectValue placeholder="Select contractor" />
                </SelectTrigger>
                <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                  <SelectItem value="pt-buildco">PT. BuildCo</SelectItem>
                  <SelectItem value="cv-konstruksi">CV. Konstruksi</SelectItem>
                  <SelectItem value="pt-megabuild">PT. MegaBuild</SelectItem>
                  <SelectItem value="pt-tukangpro">PT. TukangPro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Project Name</Label>
              <Input 
                placeholder="Enter project name..."
                className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary placeholder:text-devpro-text-secondary"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Contract Value</Label>
              <Input 
                placeholder="Rp 0"
                className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary placeholder:text-devpro-text-secondary"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-devpro-text-secondary">Start Date</Label>
                <Input 
                  type="date"
                  className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-devpro-text-secondary">End Date</Label>
                <Input 
                  type="date"
                  className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Work Scope</Label>
              <Input 
                placeholder="Describe work scope..."
                className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary placeholder:text-devpro-text-secondary"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSpkDialogOpen(false)} className="border-devpro-slate/50 text-devpro-text-secondary">
              Cancel
            </Button>
            <Button className="bg-devpro-emerald hover:bg-devpro-emerald/90 text-devpro-navy font-bold">
              <Users className="size-4 mr-2" />
              Create SPK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
