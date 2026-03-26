"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FirebaseStats } from "@/components/dashboard/firebase-stats"
import { cn } from "@/lib/utils"
import { Wallet, TrendingUp, DollarSign, CreditCard, PiggyBank, Receipt, AlertCircle, Loader2, Upload, CheckCircle, FileText, Banknote, ArrowRight } from "lucide-react"
import { useGlobalData, Format } from "@/lib/global-store"
import { FadeIn, HoverScale } from "@/components/ui/page-transition"
import { DsSkeleton } from "@/components/ui/ds-skeleton"

export default function FinanceDashboardPage() {
  const { loading, error, fetchAllData, data: units } = useGlobalData()
  const [uploadingFile, setUploadingFile] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  
  // Enhanced DONE AKAD data with financial focus
  const [doneAkadData, setDoneAkadData] = useState([
    { 
      id: "AKAD-001", 
      customerName: "John Doe", 
      unit: "A-101", 
      bank: "BTN",
      hargaJual: "Rp 450.000.000",
      cairBank: "Rp 427.500.000",
      catatanRetensi: "Retensi 5% - Rp 22.500.000",
      statusPajak: "Lunas",
      sspStatus: "SSP Terbit",
      bphtbStatus: "BPHTB Lunas",
      tanggalAkad: "2025-03-20",
      tanggalCair: "2025-03-22"
    },
    { 
      id: "AKAD-002", 
      customerName: "Jane Smith", 
      unit: "B-205", 
      bank: "BCA",
      hargaJual: "Rp 380.000.000",
      cairBank: "Rp 361.000.000",
      catatanRetensi: "Retensi 5% - Rp 19.000.000",
      statusPajak: "Lunas",
      sspStatus: "SSP Terbit",
      bphtbStatus: "BPHTB Lunas",
      tanggalAkad: "2025-03-18",
      tanggalCair: "2025-03-20"
    },
    { 
      id: "AKAD-003", 
      customerName: "Bob Johnson", 
      unit: "C-309", 
      bank: "Mandiri",
      hargaJual: "Rp 520.000.000",
      cairBank: "Rp 494.000.000",
      catatanRetensi: "Retensi 5% - Rp 26.000.000",
      statusPajak: "Proses",
      sspStatus: "SSP Pending",
      bphtbStatus: "BPHTB Proses",
      tanggalAkad: "2025-03-22",
      tanggalCair: "-"
    },
    { 
      id: "AKAD-004", 
      customerName: "Sarah Williams", 
      unit: "D-112", 
      bank: "BNI",
      hargaJual: "Rp 680.000.000",
      cairBank: "Rp 646.000.000",
      catatanRetensi: "Retensi 5% - Rp 34.000.000",
      statusPajak: "Lunas",
      sspStatus: "SSP Terbit",
      bphtbStatus: "BPHTB Lunas",
      tanggalAkad: "2025-03-15",
      tanggalCair: "2025-03-17"
    }
  ])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Enhanced Smart Gateway upload functions with drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['.xlsx', '.xls', '.csv', '.pdf', '.doc', '.docx']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      console.error('Invalid file type')
      return
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      console.error('File too large')
      return
    }
    
    setUploadingFile(true)
    console.log("🏦 Finance: Smart Gateway upload started", file.name)
    
    // Simulate upload process with automatic distribution
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    // Add to uploaded files list
    setUploadedFiles(prev => [...prev, file.name])
    
    console.log("✅ Finance: Smart Gateway upload completed - File distributed to APK PIC Bank & Notaris")
    setUploadingFile(false)
  }

  const handleSmartGatewayUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    await handleFileUpload(file)
    event.target.value = ""
  }

  // Done Akad action function
  const handleDoneAkad = (id: string) => {
    console.log("📝 Finance: Done Akad action triggered for", id)
    setDoneAkadData(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, statusPajak: "Lunas", sspStatus: "SSP Terbit", bphtbStatus: "BPHTB Lunas", tanggalCair: new Date().toISOString().split('T')[0] }
          : item
      )
    )
  }

  // Finance metrics from global data
  const financeMetrics = {
    totalPlafon: units.reduce((s, r) => s + (Number(r.plafon) || 0), 0),
    totalCair: units.reduce((s, r) => s + (Number(r.cair) || 0), 0),
    totalPPH: units.reduce((s, r) => s + (Number(r.pph) || 0), 0),
    totalBPHTB: units.reduce((s, r) => s + (Number(r.bphtb) || 0), 0),
    activeLoans: units.filter(r => r.status_unit && ["AKAD", "CAIR"].includes(String(r.status_unit).toUpperCase())).length,
    pendingLoans: units.filter(r => r.status_unit && ["AVAILABLE", "TERSEDIA"].includes(String(r.status_unit).toUpperCase())).length,
  }

  // Bank distribution
  const bankDistribution = units.reduce((acc, r) => {
    const bank = String(r.bank_final || "Unknown")
    acc[bank] = (acc[bank] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const kpiCards = [
    {
      label: "Total Plafon Disetujui",
      value: loading ? "—" : Format.rupiah(financeMetrics.totalPlafon),
      sub: loading ? "Memuat..." : `${units.length} total aplikasi`,
      icon: CreditCard,
    },
    {
      label: "Total Pencairan",
      value: loading ? "—" : Format.rupiah(financeMetrics.totalCair),
      sub: loading ? "Memuat..." : `${financeMetrics.activeLoans} aktif`,
      icon: PiggyBank,
    },
    {
      label: "PPH Terkumpul",
      value: loading ? "—" : Format.rupiah(financeMetrics.totalPPH),
      sub: loading ? "Memuat..." : "Pajak Penghasilan",
      icon: Receipt,
    },
    {
      label: "BPHTB Terkumpul",
      value: loading ? "—" : Format.rupiah(financeMetrics.totalBPHTB),
      sub: loading ? "Memuat..." : "Bea Perolehan Hak",
      icon: Wallet,
    },
  ]
  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-devpro-primary/10 text-devpro-primary">
            <Wallet className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-devpro-foreground">Finance Hub</h1>
            <p className="text-devpro-muted-foreground">Financial Management & Analytics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-devpro-primary/10 text-devpro-primary border-0">
            <DollarSign className="size-3 mr-1" />
            Finance Department
          </Badge>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-0">
            <TrendingUp className="size-3 mr-1" />
            {loading ? <Loader2 className="size-3 mr-1 animate-spin" /> : null}
            Supabase Live
          </Badge>
        </div>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10">
          <AlertCircle className="size-4 text-rose-400 mt-0.5 shrink-0" />
          <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
        </div>
      )}

      {/* ── Smart Gateway Uploader ─────────────────────────────────────────────── */}
      <FadeIn delay={0.2}>
        <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
          <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
            <CardTitle className="text-devpro-neon font-black uppercase tracking-wider text-lg flex items-center gap-2">
              <Upload className="size-5" />
              📤 Upload SI & Dokumen Lainnya
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Drag & Drop Area */}
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                  dragActive 
                    ? "border-devpro-neon bg-devpro-neon/10 scale-[1.02]" 
                    : uploadingFile
                    ? "border-devpro-slate/50 bg-devpro-slate/10 cursor-not-allowed"
                    : "border-devpro-neon/50 bg-devpro-navy/30 hover:border-devpro-neon hover:bg-devpro-neon/5"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !uploadingFile && document.getElementById('smart-gateway-upload')?.click()}
              >
                <input
                  type="file"
                  id="smart-gateway-upload"
                  className="hidden"
                  accept=".xlsx,.xls,.csv,.pdf,.doc,.docx"
                  onChange={handleSmartGatewayUpload}
                  disabled={uploadingFile}
                />
                
                <div className="flex flex-col items-center gap-4">
                  {uploadingFile ? (
                    <>
                      <div className="relative">
                        <Loader2 className="size-12 text-devpro-neon animate-spin" />
                        <div className="absolute inset-0 size-12 rounded-full border-2 border-devpro-neon/20 animate-ping"></div>
                      </div>
                      <div>
                        <p className="text-devpro-neon font-bold text-lg">Mengupload Dokumen...</p>
                        <p className="text-devpro-text-secondary text-sm mt-1">Sedang mendistribusikan ke APK PIC Bank & Notaris</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 rounded-full bg-devpro-neon/10 border border-devpro-neon/30">
                        <Upload className="size-8 text-devpro-neon" />
                      </div>
                      <div>
                        <p className="text-devpro-neon font-bold text-lg">
                          {dragActive ? 'Lepaskan file di sini' : 'Drag & Drop atau Klik untuk Upload'}
                        </p>
                        <p className="text-devpro-text-secondary text-sm mt-1">
                          Surat Instruksi (SI), Dokumen Bank, Notaris, dll.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center text-xs">
                        <Badge variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary">
                          Excel (.xlsx, .xls)
                        </Badge>
                        <Badge variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary">
                          CSV
                        </Badge>
                        <Badge variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary">
                          PDF
                        </Badge>
                        <Badge variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary">
                          Word (.doc, .docx)
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Important UI/UX Text */}
              <div className="bg-gradient-to-r from-devpro-emerald/10 to-devpro-neon/10 border border-devpro-emerald/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-devpro-emerald/20">
                    <CheckCircle className="size-4 text-devpro-emerald" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-devpro-emerald mb-1">🔥 Smart Gateway Distribution</h4>
                    <p className="text-devpro-text-secondary text-sm leading-relaxed">
                      <strong>Sistem akan mendistribusikan berkas secara otomatis ke APK PIC Bank & Notaris.</strong>
                    </p>
                    <p className="text-devpro-text-secondary text-xs mt-2">
                      Dokumen yang diupload akan langsung diteruskan ke pihak terkait sesuai jenis dokumen dan bank yang bersangkutan.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Recently Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="bg-devpro-navy/30 border border-devpro-slate/30 rounded-lg p-4">
                  <h4 className="font-bold text-devpro-text-primary mb-3 text-sm">📋 Recently Uploaded</h4>
                  <div className="space-y-2">
                    {uploadedFiles.slice(-3).map((fileName, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="size-3 text-devpro-neon" />
                          <span className="text-devpro-text-secondary">{fileName}</span>
                        </div>
                        <Badge className="bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20 text-[8px]">
                          Distributed
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* ── Informasi Detail DONE AKAD ─────────────────────────────────────────── */}
      <FadeIn delay={0.3}>
        <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
          <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
            <CardTitle className="text-devpro-neon font-black uppercase tracking-wider text-lg flex items-center gap-2">
              <CheckCircle className="size-5" />
              📊 Informasi Detail DONE AKAD
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-devpro-slate/30">
                    <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-wider text-devpro-text-secondary">ID AKAD</th>
                    <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-wider text-devpro-text-secondary">Nama Nasabah</th>
                    <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-wider text-devpro-text-secondary">Unit</th>
                    <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-wider text-devpro-text-secondary">Bank</th>
                    <th className="text-right py-3 px-4 text-xs font-black uppercase tracking-wider text-devpro-text-secondary">Harga Jual</th>
                    <th className="text-right py-3 px-4 text-xs font-black uppercase tracking-wider text-devpro-text-secondary">Cair Bank</th>
                    <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-wider text-devpro-text-secondary">Catatan Retensi</th>
                    <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-wider text-devpro-text-secondary">Status Pajak</th>
                    <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-wider text-devpro-text-secondary">SSP</th>
                    <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-wider text-devpro-text-secondary">BPHTB</th>
                    <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-wider text-devpro-text-secondary">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-devpro-slate/20">
                  {doneAkadData.map((item, index) => (
                    <FadeIn key={item.id} delay={index * 0.1}>
                      <tr className="hover:bg-devpro-navy/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-devpro-neon font-mono">{item.id}</span>
                            {item.tanggalCair !== "-" && (
                              <Badge className="bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20 text-[8px]">
                                CAIR
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-devpro-text-primary">{item.customerName}</div>
                            <div className="text-xs text-devpro-text-secondary">Akad: {item.tanggalAkad}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary text-xs">
                            {item.unit}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={cn(
                            "text-xs font-bold",
                            item.bank === "BTN" ? "bg-blue-600/20 text-blue-400 border border-blue-600/30" :
                            item.bank === "BCA" ? "bg-orange-600/20 text-orange-400 border border-orange-600/30" :
                            item.bank === "Mandiri" ? "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30" :
                            "bg-green-600/20 text-green-400 border border-green-600/30"
                          )}>
                            {item.bank}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="font-bold text-devpro-text-primary">{item.hargaJual}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="font-bold text-devpro-emerald">{item.cairBank}</div>
                          {item.tanggalCair !== "-" && (
                            <div className="text-xs text-devpro-text-secondary">{item.tanggalCair}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs text-devpro-text-secondary max-w-[150px]">{item.catatanRetensi}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={cn(
                            "text-xs font-bold",
                            item.statusPajak === "Lunas" 
                              ? "bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20" 
                              : "bg-amber-600/10 text-amber-400 border border-amber-600/30"
                          )}>
                            {item.statusPajak}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={cn(
                            "text-xs font-bold",
                            item.sspStatus === "SSP Terbit" 
                              ? "bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20" 
                              : "bg-amber-600/10 text-amber-400 border border-amber-600/30"
                          )}>
                            {item.sspStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={cn(
                            "text-xs font-bold",
                            item.bphtbStatus === "BPHTB Lunas" 
                              ? "bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20" 
                              : "bg-amber-600/10 text-amber-400 border border-amber-600/30"
                          )}>
                            {item.bphtbStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.statusPajak !== "Lunas" && (
                            <Button
                              onClick={() => handleDoneAkad(item.id)}
                              size="sm"
                              className="bg-devpro-emerald hover:bg-devpro-emerald/90 text-devpro-navy font-bold text-xs h-7 px-3"
                            >
                              <CheckCircle className="size-3 mr-1" />
                              Done
                            </Button>
                          )}
                          {item.statusPajak === "Lunas" && (
                            <div className="flex items-center justify-center gap-1 text-devpro-emerald">
                              <CheckCircle className="size-3" />
                              <span className="text-xs font-bold">OK</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    </FadeIn>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Summary Statistics */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-devpro-navy/30 border border-devpro-slate/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-devpro-text-secondary mb-1">Total Akad</div>
                    <div className="text-xl font-black text-devpro-text-primary">{doneAkadData.length}</div>
                  </div>
                  <FileText className="size-5 text-devpro-neon" />
                </div>
              </div>
              <div className="bg-devpro-navy/30 border border-devpro-slate/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-devpro-text-secondary mb-1">Total Harga Jual</div>
                    <div className="text-xl font-black text-devpro-neon">
                      {doneAkadData.reduce((sum, item) => sum + parseInt(item.hargaJual.replace(/[^\d]/g, '')), 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                    </div>
                  </div>
                  <DollarSign className="size-5 text-devpro-emerald" />
                </div>
              </div>
              <div className="bg-devpro-navy/30 border border-devpro-slate/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-devpro-text-secondary mb-1">Total Cair Bank</div>
                    <div className="text-xl font-black text-devpro-emerald">
                      {doneAkadData.reduce((sum, item) => sum + parseInt(item.cairBank.replace(/[^\d]/g, '')), 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                    </div>
                  </div>
                  <PiggyBank className="size-5 text-devpro-emerald" />
                </div>
              </div>
              <div className="bg-devpro-navy/30 border border-devpro-slate/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-devpro-text-secondary mb-1">Pajak Lunas</div>
                    <div className="text-xl font-black text-devpro-emerald">
                      {doneAkadData.filter(item => item.statusPajak === "Lunas").length}
                    </div>
                  </div>
                  <CheckCircle className="size-5 text-devpro-emerald" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* ── KPI Cards (Live Data) ─────────────────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-8 w-28 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-36 bg-muted/50 animate-pulse rounded" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <FirebaseStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Analysis — Live</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-devpro-primary/5 border border-devpro-primary/10">
                <h3 className="font-semibold text-devpro-primary mb-2">Total Applications</h3>
                <p className="text-sm text-devpro-muted-foreground">{loading ? "Memuat..." : `${units.length} total aplikasi`}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-full bg-devpro-primary/20 rounded-full h-2">
                    <div className="bg-devpro-primary h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <span className="text-sm font-medium">100%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <h3 className="font-semibold text-emerald-600 mb-2">Active Loans (Akad/Cair)</h3>
                <p className="text-sm text-devpro-muted-foreground">{loading ? "Memuat..." : `${financeMetrics.activeLoans} aktif · ${Format.rupiah(financeMetrics.totalCair)}`}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-full bg-emerald-500/20 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{width: units.length > 0 ? `${(financeMetrics.activeLoans / units.length) * 100}%` : '0%'}}></div>
                  </div>
                  <span className="text-sm font-medium">{units.length > 0 ? Math.round((financeMetrics.activeLoans / units.length) * 100) : 0}%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <h3 className="font-semibold text-amber-600 mb-2">Pending (Available)</h3>
                <p className="text-sm text-devpro-muted-foreground">{loading ? "Memuat..." : `${financeMetrics.pendingLoans} pending · ${Format.rupiah(financeMetrics.totalPlafon - financeMetrics.totalCair)}`}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-full bg-amber-500/20 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{width: units.length > 0 ? `${(financeMetrics.pendingLoans / units.length) * 100}%` : '0%'}}></div>
                  </div>
                  <span className="text-sm font-medium">{units.length > 0 ? Math.round((financeMetrics.pendingLoans / units.length) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bank Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-8 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : Object.entries(bankDistribution).length > 0 ? (
                Object.entries(bankDistribution).map(([bank, count]) => (
                  <div key={bank} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{bank}</span>
                    <span className="text-sm font-bold text-devpro-primary">{count} aplikasi</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Belum ada data bank</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
