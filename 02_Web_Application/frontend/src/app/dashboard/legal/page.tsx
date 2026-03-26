"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Gavel, FileCheck, Clock, AlertCircle, Loader2,
  Printer, FileText, FileSignature, Stamp, Building,
  CheckCircle, Sparkles, Download, ChevronRight, X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, DollarSign, FileDown, Send, Users, Home } from "lucide-react"
import { useGlobalData, Format, GlobalMasterRow } from "@/lib/global-store"
import { HoverScale, FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/page-transition"
import { DsSkeletonCard } from "@/components/ui/ds-skeleton"

// ── Document Templates (from MENU_MASTER.gs) ─────────────────────────────────
const DOC_TEMPLATES = [
  // Audit Documents
  { id: "audit-trail",     label: "Audit Trail",            icon: FileCheck,     color: "from-rose-500 to-rose-600",     desc: "Complete audit log" },
  { id: "compliance",      label: "Compliance Check",       icon: CheckCircle,   color: "from-green-500 to-green-600",   desc: "Legal compliance verification" },
  { id: "risk-assessment", label: "Risk Assessment",       icon: AlertCircle,   color: "from-orange-500 to-orange-600", desc: "Risk analysis report" },
  
  // PPJB Documents
  { id: "ppjb",            label: "Cetak PPJB",             icon: FileSignature, color: "from-blue-500 to-blue-600",     desc: "Perjanjian Pengikatan Jual Beli" },
  { id: "ppjb-amendment",  label: "PPJB Amendment",         icon: FileSignature, color: "from-blue-600 to-blue-700",     desc: "PPJB addendum/revisi" },
  
  // Bank Documents (BTN Variants)
  { id: "btn-v1",          label: "Pra-Akad BTN V1",        icon: Building,      color: "from-emerald-500 to-emerald-600", desc: "Verifikasi Data Debitur" },
  { id: "btn-v2",          label: "Pra-Akad BTN V2",        icon: Building,      color: "from-emerald-600 to-emerald-700", desc: "Dokumen Jaminan" },
  { id: "btn-v3",          label: "Pra-Akad BTN V3",        icon: Building,      color: "from-teal-500 to-teal-600",     desc: "Surat Pernyataan Debitur" },
  { id: "btn-v4",          label: "Pra-Akad BTN V4",        icon: Building,      color: "from-teal-600 to-teal-700",     desc: "Memo Internal Bank" },
  { id: "btn-v5",          label: "Pra-Akad BTN V5",        icon: Building,      color: "from-cyan-500 to-cyan-600",     desc: "Checklist Berkas" },
  { id: "btn-v6",          label: "Pra-Akad BTN V6",        icon: Building,      color: "from-cyan-600 to-cyan-700",     desc: "Berita Acara Serah Terima" },
  
  // Other Bank Documents
  { id: "bank-mandiri",     label: "Mandiri Docs",           icon: Building,      color: "from-yellow-500 to-yellow-600", desc: "Mandiri bank documents" },
  { id: "bank-bca",        label: "BCA Docs",               icon: Building,      color: "from-blue-400 to-blue-500",     desc: "BCA bank documents" },
  { id: "bank-bni",        label: "BNI Docs",               icon: Building,      color: "from-red-500 to-red-600",       desc: "BNI bank documents" },
  { id: "bank-bri",        label: "BRI Docs",               icon: Building,      color: "from-blue-600 to-blue-700",     desc: "BRI bank documents" },
  
  // Akad Documents
  { id: "akad",            label: "Cetak Akad",             icon: Stamp,         color: "from-violet-500 to-violet-600", desc: "Akad Kredit Notaril" },
  { id: "akad-deed",       label: "Akad Deed",              icon: Stamp,         color: "from-purple-500 to-purple-600", desc: "Akad deed document" },
  
  // Post-Akad Documents
  { id: "bast",            label: "BAST Document",          icon: FileCheck,     color: "from-indigo-500 to-indigo-600", desc: "Berita Acara Serah Terima" },
  { id: "serah-terima",    label: "Serah Terima",           icon: FileCheck,     color: "from-indigo-600 to-indigo-700", desc: "Serah terima unit" },
  { id: "handover",        label: "Handover Certificate",   icon: FileCheck,     color: "from-purple-400 to-purple-500", desc: "Sertifikat serah terima" },
  { id: "post-akad",       label: "Post-Akad Checklist",    icon: CheckCircle,   color: "from-pink-500 to-pink-600",     desc: "Post-akad verification" },
  
  // Legal Tools
  { id: "memo",            label: "Auto-Generate Memo",     icon: FileText,      color: "from-amber-500 to-amber-600",   desc: "Memo Legal Otomatis" },
  { id: "legal-review",    label: "Legal Review",           icon: Gavel,         color: "from-slate-500 to-slate-600",   desc: "Document legal review" },
]

// ── Confetti burst ────────────────────────────────────────────────────────────
function ConfettiBurst({ show }: { show: boolean }) {
  if (!show) return null
  const particles = Array.from({ length: 30 })
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, y: "40vh", x: "50vw", scale: 1 }}
          animate={{
            opacity: 0,
            y: `${Math.random() * -60 + 10}vh`,
            x: `${Math.random() * 80 + 10}vw`,
            rotate: Math.random() * 720,
            scale: Math.random() * 0.5 + 0.5,
          }}
          transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
          className="absolute"
        >
          <div
            className="size-3 rounded-sm"
            style={{ background: ['#60A5FA','#34D399','#FBBF24','#F472B6','#A78BFA','#FB923C'][i % 6] }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default function LegalDashboardPage() {
  const { loading, error, fetchAllData, data: units } = useGlobalData()
  const [selectedRow, setSelectedRow] = useState<GlobalMasterRow | null>(null)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const [generating, setGenerating] = useState<string | null>(null)
  const [generatedDocs, setGeneratedDocs] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Cost estimation state
  const [costEstimation, setCostEstimation] = useState({
    hargaBangunan: 0,
    tanah: 0,
    bphtb: 0,
    ppn: 0,
    pph: 0,
    biayaNotaris: 0,
    total: 0
  })
  
  // BTN Pra-Akad dropdown state
  const [selectedBtnVariant, setSelectedBtnVariant] = useState<string>("")
  
  // Bank tabs state
  const [activeBankTab, setActiveBankTab] = useState<string>("btn")

  useEffect(() => { fetchAllData() }, [fetchAllData])
  
  // Calculate cost estimation
  const calculateCostEstimation = () => {
    const hargaBangunan = costEstimation.hargaBangunan || 500000000
    const tanah = costEstimation.tanah || 100000000
    const bphtb = Math.round((hargaBangunan + tanah) * 0.05)
    const ppn = Math.round(hargaBangunan * 0.11)
    const pph = Math.round((hargaBangunan + tanah) * 0.025)
    const biayaNotaris = 2500000
    const total = hargaBangunan + tanah + bphtb + ppn + pph + biayaNotaris
    
    setCostEstimation({
      hargaBangunan,
      tanah,
      bphtb,
      ppn,
      pph,
      biayaNotaris,
      total
    })
  }
  
  // Handle document generation for dropdown and tabs
  const handleGenerateDoc = (docType: string, bank?: string) => {
    console.log(`📜 Generating ${docType} for ${bank || 'general'}`)
    setGenerating(docType)
    setTimeout(() => {
      setGeneratedDocs(prev => [...prev, `${docType}-${Date.now()}`])
      setGenerating(null)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }, 1500)
  }
  
  const legalMetrics = {
    totalContracts: units.filter(r => r.ajb_ppjb || r.tgl_ppjb).length,
    pendingNotary: units.filter(r => r.status_unit && ["AKAD"].includes(String(r.status_unit).toUpperCase()) && !r.no_ppjb_notaril).length,
    verifiedDeeds: units.filter(r => r.no_ppjb_notaril).length,
    totalPPJB: units.filter(r => r.tgl_ppjb).length,
  }

  const legalTasks = units
    .filter(r => r.nama_customer || r.ajb_ppjb || r.tgl_ppjb || r.notaris)
    .slice(0, 10)
    .map((unit, i) => {
      const status = unit.status_unit ? String(unit.status_unit).toUpperCase() : "UNKNOWN"
      let taskStatus = "Pending"
      let taskType = "Document Review"
      let priority = "Medium"
      if (["AKAD"].includes(status)) { taskStatus = "In Progress"; taskType = "Akad Prep"; priority = "High" }
      else if (unit.no_ppjb_notaril) { taskStatus = "Completed"; taskType = "Notary Check"; priority = "Low" }
      else if (unit.tgl_ppjb) { taskStatus = "In Progress"; taskType = "PPJB Processing"; priority = "Medium" }
      return {
        id: `L-${String(unit.no || i + 1).padStart(3, '0')}`,
        type: taskType, customer: String(unit.nama_customer || "—"), status: taskStatus, priority,
        notaris: String(unit.notaris || "—"), tgl_ppjb: unit.tgl_ppjb ? Format.dateShort(unit.tgl_ppjb) : "—",
        no_ppjb: String(unit.no_ppjb_notaril || "—"), raw: unit,
      }
    })

  // Deep Printing engine — simulate document generation
  const handleGenerateDocument = useCallback(async (templateId: string) => {
    if (!selectedRow) return
    setGenerating(templateId)
    // Simulate API call to GS engine (bukaDialogCetakPPJB / bukaDialogCetakAkad)
    await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000))
    const docId = `DOC_${templateId.toUpperCase()}_${Date.now()}`
    setGeneratedDocs(prev => [...prev, docId])
    setGenerating(null)
    // Confetti!
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2500)
    console.log(`✅ Legal: Generated ${templateId} for ${selectedRow.nama_customer} → ${docId}`)
  }, [selectedRow])

  const statsCards = [
    { label: "Active Contracts", value: loading ? "—" : String(legalMetrics.totalContracts), icon: Gavel, color: "text-blue-400" },
    { label: "Pending Notary",   value: loading ? "—" : String(legalMetrics.pendingNotary),  icon: Clock, color: "text-amber-400" },
    { label: "Verified Deeds",   value: loading ? "—" : String(legalMetrics.verifiedDeeds),  icon: FileCheck, color: "text-emerald-400" },
    { label: "Total PPJB",       value: loading ? "—" : String(legalMetrics.totalPPJB),      icon: FileSignature, color: "text-violet-400" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <ConfettiBurst show={showConfetti} />

      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)] uppercase">
              Legal <span className="text-[var(--primary)]">Workflow</span>
            </h2>
            <p className="text-[var(--muted-foreground)] font-medium uppercase tracking-tighter text-sm mt-1">
              Deep Printing Engine · Auto-Generate Dokumen · Supabase Live
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-0"><Printer className="size-3 mr-1" /> Print Engine</Badge>
            <Badge className="bg-violet-500/10 text-violet-400 border-0"><Sparkles className="size-3 mr-1" /> PPJB + Akad + BTN V1-V6</Badge>
          </div>
        </div>
      </FadeIn>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10">
          <AlertCircle className="size-4 text-rose-400 mt-0.5 shrink-0" />
          <p className="text-xs text-rose-300">{error}</p>
        </div>
      )}

      {/* KPI Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <DsSkeletonCard key={i} />)}</div>
      ) : (
        <StaggerContainer className="grid gap-4 md:grid-cols-4">
          {statsCards.map(s => (
            <StaggerItem key={s.label}>
              <HoverScale>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-medium">{s.label}</CardTitle>
                    <s.icon className={cn("size-4", s.color)} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{s.value}</div>
                  </CardContent>
                </Card>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* ── Cost Estimation Panel ───────────────────────────────────────────── */}
      <FadeIn delay={0.1}>
        <Card className="border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
              <Calculator className="size-5 text-[var(--primary)]" />
              Estimasi Biaya Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="harga-bangunan">Harga Bangunan</Label>
                <Input
                  id="harga-bangunan"
                  type="number"
                  placeholder="500.000.000"
                  value={costEstimation.hargaBangunan || ""}
                  onChange={(e) => setCostEstimation(prev => ({ ...prev, hargaBangunan: Number(e.target.value) }))}
                  className="bg-[var(--background)] border-[var(--border)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harga-tanah">Harga Tanah</Label>
                <Input
                  id="harga-tanah"
                  type="number"
                  placeholder="100.000.000"
                  value={costEstimation.tanah || ""}
                  onChange={(e) => setCostEstimation(prev => ({ ...prev, tanah: Number(e.target.value) }))}
                  className="bg-[var(--background)] border-[var(--border)]"
                />
              </div>
            </div>
            
            <Button onClick={calculateCostEstimation} className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]">
              <Calculator className="size-4 mr-2" />
              Hitung Estimasi Biaya
            </Button>
            
            {costEstimation.total > 0 && (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)]">BPHTB (5%)</div>
                  <div className="text-lg font-bold text-[var(--foreground)]">Rp {Format.rupiah(costEstimation.bphtb)}</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)]">PPN (11%)</div>
                  <div className="text-lg font-bold text-[var(--foreground)]">Rp {Format.rupiah(costEstimation.ppn)}</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)]">PPH (2.5%)</div>
                  <div className="text-lg font-bold text-[var(--foreground)]">Rp {Format.rupiah(costEstimation.pph)}</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)]">
                  <div className="text-xs text-[var(--muted-foreground)]">Biaya Notaris</div>
                  <div className="text-lg font-bold text-[var(--foreground)]">Rp {Format.rupiah(costEstimation.biayaNotaris)}</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 md:col-span-2 lg:col-span-3">
                  <div className="text-xs text-[var(--primary)] font-semibold">TOTAL ESTIMASI</div>
                  <div className="text-xl font-bold text-[var(--primary)]">Rp {Format.rupiah(costEstimation.total)}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* ── BTN Pra-Akad Dropdown Panel ─────────────────────────────────────────── */}
      <FadeIn delay={0.12}>
        <Card className="border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
              <FileText className="size-5 text-[var(--primary)]" />
              📜 Cetak Pra-Akad BTN
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="btn-variant">Pilih Variant Pra-Akad</Label>
              <Select value={selectedBtnVariant} onValueChange={setSelectedBtnVariant}>
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                  <SelectValue placeholder="Pilih variant Pra-Akad BTN..." />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                  <SelectItem value="btn-v1">V1 - Verifikasi Data Debitur</SelectItem>
                  <SelectItem value="btn-v2">V2 - Dokumen Jaminan</SelectItem>
                  <SelectItem value="btn-v3">V3 - Surat Pernyataan Debitur</SelectItem>
                  <SelectItem value="btn-v4">V4 - Memo Internal Bank</SelectItem>
                  <SelectItem value="btn-v5">V5 - Checklist Berkas</SelectItem>
                  <SelectItem value="btn-v6">V6 - Berita Acara Serah Terima</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedBtnVariant && (
              <Button 
                onClick={() => handleGenerateDoc(selectedBtnVariant, 'BTN')}
                disabled={generating === selectedBtnVariant}
                className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
              >
                {generating === selectedBtnVariant ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Printer className="size-4 mr-2" />
                    Cetak Pra-Akad {selectedBtnVariant.split('-')[1].toUpperCase()}
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* ── Bank Documents Tabs Panel ─────────────────────────────────────────────── */}
      <FadeIn delay={0.14}>
        <Card className="border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
              <Building className="size-5 text-[var(--primary)]" />
              📂 Dokumen Bank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeBankTab} onValueChange={setActiveBankTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-[var(--muted)]">
                <TabsTrigger value="btn" className="data-[state=active]:bg-[var(--card)]">BTN</TabsTrigger>
                <TabsTrigger value="bjb" className="data-[state=active]:bg-[var(--card)]">BJB</TabsTrigger>
                <TabsTrigger value="bni" className="data-[state=active]:bg-[var(--card)]">BNI</TabsTrigger>
                <TabsTrigger value="bri" className="data-[state=active]:bg-[var(--card)]">BRI</TabsTrigger>
                <TabsTrigger value="mandiri" className="data-[state=active]:bg-[var(--card)]">Mandiri</TabsTrigger>
                <TabsTrigger value="bsi" className="data-[state=active]:bg-[var(--card)]">BSI</TabsTrigger>
              </TabsList>
              
              {['btn', 'bjb', 'bni', 'bri', 'mandiri', 'bsi'].map((bank) => (
                <TabsContent key={bank} value={bank} className="mt-4">
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { id: 'flpp', label: 'FLPP', icon: FileDown },
                      { id: 'subsidi', label: 'Form Subsidi', icon: FileDown },
                      { id: 'memo', label: 'Memo Akad', icon: FileText },
                      { id: 'sales', label: 'Sales Order', icon: FileText },
                      { id: 'undangan', label: 'Undangan Akad', icon: Send }
                    ].map((doc) => (
                      <Button
                        key={doc.id}
                        onClick={() => handleGenerateDoc(`${bank}-${doc.id}`, bank.toUpperCase())}
                        disabled={generating === `${bank}-${doc.id}`}
                        variant="outline"
                        className="h-auto p-4 flex flex-col gap-2 border-[var(--border)] hover:border-[var(--primary)]/50"
                      >
                        {generating === `${bank}-${doc.id}` ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <doc.icon className="size-4" />
                        )}
                        <span className="text-sm font-medium">{doc.label}</span>
                        <span className="text-xs text-[var(--muted-foreground)]">{bank.toUpperCase()}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </FadeIn>

      {/* ── Deep Printing Panel (Glassmorphism) ───────────────────────────── */}
      <FadeIn delay={0.15}>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                <Printer className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Deep Printing Engine</h3>
                <p className="text-xs text-[var(--muted-foreground)]">Pilih baris data → Klik template → Generate PDF otomatis</p>
              </div>
            </div>
            {selectedRow && (
              <Badge className="bg-emerald-500/10 text-emerald-500 border-0">
                <CheckCircle className="size-3 mr-1" />
                {selectedRow.nama_customer} selected
              </Badge>
            )}
          </div>

          {!selectedRow ? (
            <div className="p-8 text-center">
              <FileText className="size-10 mx-auto mb-3 text-[var(--muted-foreground)]/40" />
              <p className="text-sm text-[var(--muted-foreground)]">Klik baris di tabel Legal Queue untuk memilih data, lalu generate dokumen.</p>
            </div>
          ) : (
            <div className="p-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DOC_TEMPLATES.map(tpl => (
                  <motion.button
                    key={tpl.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={generating !== null}
                    onClick={() => handleGenerateDocument(tpl.id)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl text-left transition-all",
                      "border border-[var(--border)] hover:border-[var(--primary)]/50",
                      "bg-[var(--background)] hover:shadow-lg",
                      generating === tpl.id && "ring-2 ring-[var(--primary)] animate-pulse",
                      generatedDocs.some(d => d.includes(tpl.id.toUpperCase())) && "border-emerald-500/50 bg-emerald-500/5"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg bg-gradient-to-br text-white shrink-0", tpl.color)}>
                      {generating === tpl.id ? <Loader2 className="size-4 animate-spin" /> : <tpl.icon className="size-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--foreground)] truncate">{tpl.label}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">{tpl.desc}</p>
                    </div>
                    {generatedDocs.some(d => d.includes(tpl.id.toUpperCase())) && (
                      <CheckCircle className="size-4 text-emerald-500 shrink-0 ml-auto" />
                    )}
                  </motion.button>
                ))}
              </div>

              {generatedDocs.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs font-semibold text-emerald-500 mb-2">✅ {generatedDocs.length} dokumen berhasil di-generate:</p>
                  <div className="flex flex-wrap gap-2">
                    {generatedDocs.map(d => (
                      <Badge key={d} className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px]">
                        <Download className="size-3 mr-1" /> {d}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </FadeIn>

      {/* ── Legal Queue Table ─────────────────────────────────────────────── */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader className="px-6 py-4 border-b border-[var(--border)]">
            <CardTitle className="text-sm font-bold">Legal Queue — Klik baris untuk memilih</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--muted)]/30">
                    {["Task ID","Type","Customer","Priority","Status","Notaris","Tgl PPJB","No. PPJB"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-t border-[var(--border)]">
                        {Array.from({ length: 8 }).map((__, j) => (
                          <td key={j} className="px-5 py-4"><div className="h-4 w-20 bg-[var(--muted)] animate-pulse rounded" /></td>
                        ))}
                      </tr>
                    ))
                  ) : legalTasks.length > 0 ? (
                    legalTasks.map(task => (
                      <tr
                        key={task.id}
                        onClick={() => { setSelectedRow(task.raw); setGeneratedDocs([]) }}
                        className={cn(
                          "border-t border-[var(--border)] cursor-pointer transition-all",
                          selectedRow?.no === task.raw.no
                            ? "bg-[var(--primary)]/10 ring-1 ring-inset ring-[var(--primary)]/30"
                            : "hover:bg-[var(--muted)]/30"
                        )}
                      >
                        <td className="px-5 py-3.5 text-[11px] font-bold text-[var(--primary)] font-mono">{task.id}</td>
                        <td className="px-5 py-3.5 text-xs font-semibold text-[var(--foreground)]">{task.type}</td>
                        <td className="px-5 py-3.5 text-xs text-[var(--muted-foreground)]">{task.customer}</td>
                        <td className="px-5 py-3.5">
                          <Badge className={cn("text-[9px] font-bold uppercase px-2 py-0.5",
                            task.priority === "High" ? "bg-rose-500/10 text-rose-400" :
                            task.priority === "Low" ? "bg-emerald-500/10 text-emerald-400" :
                            "bg-[var(--muted)] text-[var(--muted-foreground)]"
                          )}>{task.priority}</Badge>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-semibold text-[var(--foreground)]">{task.status}</td>
                        <td className="px-5 py-3.5 text-xs text-[var(--muted-foreground)]">{task.notaris}</td>
                        <td className="px-5 py-3.5 text-xs text-[var(--muted-foreground)]">{task.tgl_ppjb}</td>
                        <td className="px-5 py-3.5 text-xs font-mono text-[var(--primary)]">{task.no_ppjb}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={8} className="px-6 py-10 text-center text-sm text-[var(--muted-foreground)]">Belum ada data legal</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
