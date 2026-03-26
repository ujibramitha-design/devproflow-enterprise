"use client"

import { useState, useEffect } from "react"
import { 
  Settings, 
  Smartphone, 
  Globe, 
  Monitor, 
  RefreshCw, 
  ShieldCheck, 
  Database, 
  Bell, 
  Lock,
  Cpu,
  Cloud,
  Zap,
  AlertCircle,
  Loader2,
  Upload,
  FileText,
  Save,
  Building,
  Users,
  Download,
  Mail,
  Camera,
  FileImage,
  FolderOpen,
  Activity,
  CheckCircle2,
  Server,
  HardDrive,
  Wifi,
  Shield,
  CreditCard,
  MapPin,
  UserCheck,
  Archive,
  ScanLine,
  Calendar,
  Clock,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useGlobalData, Format } from "@/lib/global-store"
import { DataPorter } from "@/components/ui/data-porter"
import { SystemHealthAudit } from "@/components/ui/system-health-audit"
import { FadeIn, HoverScale } from "@/components/ui/page-transition"

export default function SystemSettingsPage() {
  const { loading, error, fetchAllData, data: units } = useGlobalData()
  
  // Enhanced Admin/Settings states
  const [syncStatus, setSyncStatus] = useState({
    apk: true,
    web: true,
    desktop: false,
  })

  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
  })

  // AI Uploader states
  const [aiUploaderDialogOpen, setAiUploaderDialogOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string; 
    size: string; 
    type: string; 
    processed: string; 
    aiAnalysis: string; 
  }>>([])
  const [aiProcessing, setAiProcessing] = useState(false)

  // Template upload state
  const [uploadingTemplate, setUploadingTemplate] = useState(false)
  const [templateFiles, setTemplateFiles] = useState([
    { name: "PPJB Template.docx", size: "245 KB", uploaded: "2025-03-20" },
    { name: "Akad Template.docx", size: "312 KB", uploaded: "2025-03-18" },
    { name: "BAST Template.docx", size: "189 KB", uploaded: "2025-03-15" },
  ])

  // OCR Integration states
  const [ocrDialogOpen, setOcrDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState('')
  const [ocrProcessing, setOcrProcessing] = useState(false)

  // Backup states
  const [backupInProgress, setBackupInProgress] = useState(false)
  const [lastBackup, setLastBackup] = useState("2025-03-22 14:30")
  const [emailScanning, setEmailScanning] = useState(false)
  const [systemHealthDialogOpen, setSystemHealthDialogOpen] = useState(false)

  // Enhanced bank assignment states
  const [bankAssignments, setBankAssignments] = useState([
    { bank: "BTN", assigned: 45, available: 12, kcpList: ["KCP Jakarta", "KCP Tangerang", "KCP Bekasi", "KCP Depok"] },
    { bank: "BCA", assigned: 32, available: 8, kcpList: ["KCP Jakarta Pusat", "KCP Jakarta Selatan", "KCP Bandung", "KCP Surabaya"] },
    { bank: "Mandiri", assigned: 28, available: 15, kcpList: ["KCP Jakarta", "KCP Bogor", "KCP Tangerang"] },
    { bank: "BNI", assigned: 21, available: 5, kcpList: ["KCP Jakarta", "KCP Bandung", "KCP Semarang"] },
    { bank: "BRI", assigned: 18, available: 10, kcpList: ["KCP Jakarta", "KCP Surabaya", "KCP Medan"] },
    { bank: "BSI", assigned: 15, available: 8, kcpList: ["KCP Jakarta", "KCP Yogyakarta", "KCP Solo"] },
  ])

  // Notaris assignment states
  const [notarisAssignments, setNotarisAssignments] = useState([
    { notaris: "Notaris Ahmad Wijaya", assigned: 12, available: 8, specialization: "PPJB" },
    { notaris: "Notaris Siti Nurhaliza", assigned: 8, available: 5, specialization: "Akad KPR" },
    { notaris: "Notaris Budi Santoso", assigned: 15, available: 3, specialization: "BAST" },
    { notaris: "Notaris Dewi Lestari", assigned: 10, available: 6, specialization: "SHM" },
  ])

  // System health metrics
  const [systemHealth, setSystemHealth] = useState({
    server: { status: "healthy", cpu: 45, memory: 62, disk: 78 },
    database: { status: "healthy", connections: 12, queries: 156, latency: 2 },
    network: { status: "healthy", bandwidth: "1.2 Gbps", latency: 12, uptime: "99.9%" },
    security: { status: "secure", firewall: "active", ssl: "valid", threats: 0 }
  })

  // Template upload function
  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setUploadingTemplate(true)
    console.log("📄 Admin: Template upload started", file.name)
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setTemplateFiles(prev => [
      { name: file.name, size: `${(file.size / 1024).toFixed(0)} KB`, uploaded: new Date().toISOString().split('T')[0] },
      ...prev.slice(0, 2)
    ])
    
    console.log("✅ Admin: Template upload completed")
    setUploadingTemplate(false)
    event.target.value = ""
  }

  // Bank assignment function
  const handleBankAssignment = (bank: string, action: 'assign' | 'release') => {
    console.log(`🏦 Admin: ${action} bank assignment for ${bank}`)
    setBankAssignments(prev => 
      prev.map(item => {
        if (item.bank === bank) {
          if (action === 'assign') {
            return { ...item, assigned: item.assigned + 1, available: Math.max(0, item.available - 1) }
          } else {
            return { ...item, assigned: Math.max(0, item.assigned - 1), available: item.available + 1 }
          }
        }
        return item
      })
    )
  }

  // Enhanced AI Uploader functions
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
      handleAIFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleAIFileUpload = async (file: File) => {
    setAiProcessing(true)
    console.log("🤖️ Admin: AI processing started", file.name)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setUploadedFiles(prev => [
      { 
        name: file.name, 
        size: `${(file.size / 1024).toFixed(0)} KB`, 
        type: file.type,
        processed: new Date().toISOString(),
        aiAnalysis: "Document processed successfully"
      },
      ...prev.slice(0, 4)
    ])
    
    console.log("✅ Admin: AI processing completed")
    setAiProcessing(false)
  }

  // OCR Integration functions
  const handleOCRProcessing = async () => {
    setOcrProcessing(true)
    console.log("📄 Admin: OCR processing started for", selectedDocument)
    
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    console.log("✅ Admin: OCR processing completed - Routing to /scanner")
    setOcrProcessing(false)
    setOcrDialogOpen(false)
    
    // In real implementation, this would route to /scanner
    window.open('/scanner', '_blank')
  }

  // Email scanning functions
  const handleEmailScanning = async () => {
    setEmailScanning(true)
    console.log("📧 Admin: Email scanning started")
    
    // Simulate email scanning
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    console.log("✅ Admin: Email scanning completed - Found 15 new documents")
    setEmailScanning(false)
  }

  // System health functions
  const handleSystemHealthCheck = async () => {
    console.log("🩺 Admin: System health audit started")
    
    // Simulate health check
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update system health with realistic data
    setSystemHealth({
      server: { status: "healthy", cpu: Math.floor(Math.random() * 30 + 30), memory: Math.floor(Math.random() * 20 + 60), disk: Math.floor(Math.random() * 15 + 70) },
      database: { status: "healthy", connections: Math.floor(Math.random() * 5 + 10), queries: Math.floor(Math.random() * 50 + 100), latency: Math.floor(Math.random() * 3 + 1) },
      network: { status: "healthy", bandwidth: `${(Math.random() * 0.5 + 1).toFixed(1)} Gbps`, latency: Math.floor(Math.random() * 10 + 5), uptime: "99.9%" },
      security: { status: "secure", firewall: "active", ssl: "valid", threats: Math.floor(Math.random() * 3) }
    })
    
    console.log("✅ Admin: System health audit completed")
  }

  // Enhanced backup function
  const handleBackup = async () => {
    setBackupInProgress(true)
    console.log("💾 Admin: System backup started")
    
    // Simulate backup process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setLastBackup(new Date().toLocaleString())
    console.log("✅ Admin: System backup completed")
    setBackupInProgress(false)
  }

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // System status metrics
  const systemMetrics = {
    totalRecords: units.length,
    lastSync: units.length > 0 ? 
      new Date(Math.max(...units.map(u => new Date(u.updated_at || u.created_at || 0).getTime()))).toLocaleString('id-ID') : 
      "—",
    activeUsers: units.length > 0 ? new Set(units.map((u: any) => u.nama_sales)).size : 0,
    dataIntegrity: "Passed",
    activeConnections: 3
  }

  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in bg-devpro-navy min-h-screen pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight text-devpro-text-primary uppercase">
          System <span className="text-devpro-neon">Settings</span>
        </h2>
        <p className="text-devpro-text-secondary font-medium uppercase tracking-tighter text-sm">
          Enterprise configuration and cross-platform synchronization control
        </p>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10">
          <AlertCircle className="size-4 text-rose-400 mt-0.5 shrink-0" />
          <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Platform Integration */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
            <div className="h-1 w-full bg-devpro-neon/30" />
            <CardHeader className="px-8 pt-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-devpro-navy text-devpro-neon border border-devpro-neon/20">
                  <RefreshCw className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-devpro-text-primary uppercase tracking-wider">Platform Synchronization</CardTitle>
                  <CardDescription className="text-devpro-text-secondary">Manage real-time data sync across all enterprise endpoints.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 py-6 space-y-6">
              {[
                { id: 'apk', name: 'Mobile APK Integration', icon: Smartphone, desc: 'Sync customer leads and document scans from Android devices.' },
                { id: 'web', name: 'Web Application Portal', icon: Globe, desc: 'Central management hub for sales and administrative staff.' },
                { id: 'desktop', name: 'Desktop Enterprise Client', icon: Monitor, desc: 'Legacy system bridge for offline data processing and bulk reporting.' },
              ].map((platform) => (
                <div key={platform.id} className="flex items-center justify-between p-5 rounded-xl bg-devpro-navy/50 border border-devpro-slate/50 hover:border-devpro-neon/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-devpro-navy border border-devpro-slate/50 text-devpro-text-secondary group-hover:text-devpro-neon transition-colors">
                      <platform.icon className="size-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-devpro-text-primary uppercase tracking-tight">{platform.name}</h4>
                      <p className="text-[11px] text-devpro-text-secondary mt-1 font-medium">{platform.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={cn(
                      "font-black text-[9px] uppercase tracking-widest px-2 py-0.5",
                      syncStatus[platform.id as keyof typeof syncStatus] 
                        ? "bg-devpro-emerald/10 text-devpro-emerald border-devpro-emerald/20" 
                        : "bg-devpro-slate/10 text-devpro-text-secondary border-devpro-slate/20"
                    )}>
                      {syncStatus[platform.id as keyof typeof syncStatus] ? "Live" : "Standby"}
                    </Badge>
                    <Switch 
                      checked={syncStatus[platform.id as keyof typeof syncStatus]} 
                      onCheckedChange={(val: boolean) => setSyncStatus(prev => ({ ...prev, [platform.id]: val }))}
                      className="data-[state=checked]:bg-devpro-neon"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
            <CardHeader className="px-8 pt-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-devpro-navy text-devpro-emerald border border-devpro-emerald/20">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-devpro-text-primary uppercase tracking-wider">Security & Access</CardTitle>
                  <CardDescription className="text-devpro-text-secondary">Configure enterprise-grade security protocols.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 py-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-devpro-navy/50 border border-devpro-slate/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="size-4 text-devpro-neon" />
                      <span className="text-xs font-black text-devpro-text-primary uppercase">Two-Factor Auth</span>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-devpro-neon" />
                  </div>
                  <p className="text-[10px] text-devpro-text-secondary font-medium leading-relaxed uppercase tracking-tighter">Requires verification code for all administrative logins.</p>
                </div>
                <div className="p-5 rounded-xl bg-devpro-navy/50 border border-devpro-slate/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="size-4 text-devpro-neon" />
                      <span className="text-xs font-black text-devpro-text-primary uppercase">Audit Logging</span>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-devpro-neon" />
                  </div>
                  <p className="text-[10px] text-devpro-text-secondary font-medium leading-relaxed uppercase tracking-tighter">Full traceability of all data modifications across platforms.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: System Status */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-devpro-emerald shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <CardHeader className="pb-4 px-6 pt-8">
              <div className="flex items-center gap-3 mb-1">
                <Cpu className="size-5 text-devpro-emerald" />
                <h4 className="text-base font-black text-devpro-text-primary uppercase tracking-wider">System Core</h4>
              </div>
              <Badge className="bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20 text-[10px] font-black tracking-widest uppercase w-fit">Operational</Badge>
            </CardHeader>
            <CardContent className="px-6 pb-8 pt-4 space-y-6">
              {[
                { label: "Data Records", val: loading ? "—" : String(systemMetrics.totalRecords), icon: Database, color: "text-devpro-emerald" },
                { label: "API Gateway", val: "STABLE", icon: Zap, color: "text-devpro-neon" },
                { label: "Cloud Storage", val: "CONNECTED", icon: Cloud, color: "text-devpro-neon" },
                { label: "Data Integrity", val: systemMetrics.dataIntegrity, icon: ShieldCheck, color: "text-devpro-emerald" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-devpro-navy border border-devpro-slate/50">
                  <div className="flex items-center gap-3">
                    {loading ? (
                      <div className="size-4 bg-muted animate-pulse rounded" />
                    ) : (
                      <item.icon className={cn("size-4", item.color)} />
                    )}
                    <span className="text-[10px] font-bold text-devpro-text-secondary uppercase">{item.label}</span>
                  </div>
                  {loading ? (
                    <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                  ) : (
                    <span className="text-[10px] font-black text-devpro-text-primary uppercase tracking-widest">{item.val}</span>
                  )}
                </div>
              ))}
              <div className="p-3 rounded-lg bg-devpro-navy border border-devpro-slate/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold text-devpro-text-secondary uppercase">Last Sync</span>
                  <span className="text-[9px] font-mono text-devpro-neon">
                    {loading ? "—" : systemMetrics.lastSync}
                  </span>
                </div>
              </div>
              <Button className="w-full bg-devpro-navy border border-devpro-slate/50 text-devpro-neon font-black uppercase tracking-widest text-[10px] h-11 hover:bg-devpro-charcoal transition-all">
                Run Diagnostic Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
            <CardHeader className="pb-2 px-6 pt-6">
              <div className="flex items-center gap-3 mb-1">
                <Bell className="size-5 text-amber-400" />
                <h4 className="text-sm font-black text-devpro-text-primary uppercase tracking-wider">Alert Config</h4>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2 space-y-4">
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-devpro-text-secondary uppercase tracking-tight">{key} Alerts</span>
                    <Switch 
                      checked={val} 
                      onCheckedChange={(checked: boolean) => setNotifications(prev => ({ ...prev, [key]: checked }))}
                      className="scale-75 data-[state=checked]:bg-amber-400" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-devpro-navy border border-devpro-neon/20 p-6 rounded-xl text-center space-y-4">
            <p className="text-[10px] font-black text-devpro-text-secondary uppercase tracking-[0.2em]">Maintenance Mode</p>
            <Button variant="outline" className="w-full border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-400 font-black uppercase tracking-widest text-[10px] rounded-xl h-11">
              Enter Emergency Lockdown
            </Button>
          </div>
        </div>
      </div>

      {/* ── Universal Data Porter & System Health ─────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DataPorter />
        <SystemHealthAudit />
      </div>

      {/* ── File & Data Center (Uploader Area) ─────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 📂 Universal AI Uploader */}
        <FadeIn delay={0.1}>
          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
            <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-devpro-neon font-black uppercase tracking-wider text-lg flex items-center gap-2">
                  <FolderOpen className="size-5" />
                  📂 Universal AI Uploader
                </CardTitle>
                <Button 
                  onClick={() => setAiUploaderDialogOpen(true)}
                  className="bg-devpro-emerald hover:bg-devpro-emerald/90 text-devpro-navy font-bold text-sm"
                >
                  <Upload className="size-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                className="border-2 border-dashed border-devpro-neon/50 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-devpro-neon hover:bg-devpro-neon/10"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => setAiUploaderDialogOpen(true)}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-devpro-neon/10 border border-devpro-neon/30">
                    <FolderOpen className="size-8 text-devpro-neon" />
                  </div>
                  <div>
                    <p className="text-devpro-neon font-bold text-lg">Drag & Drop Files Here</p>
                    <p className="text-devpro-text-secondary text-sm">AI-powered document processing</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary text-xs">
                      PDF
                    </Badge>
                    <Badge variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary text-xs">
                      DOCX
                    </Badge>
                    <Badge variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary text-xs">
                      Images
                    </Badge>
                    <Badge variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary text-xs">
                      Excel
                    </Badge>
                  </div>
                </div>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-bold text-devpro-text-primary">Recently Processed</h4>
                  {uploadedFiles.slice(0, 3).map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-devpro-navy/30 border border-devpro-slate/20">
                      <div className="flex items-center gap-2">
                        <FileImage className="size-4 text-devpro-neon" />
                        <div>
                          <div className="text-xs font-medium text-devpro-text-primary">{file.name}</div>
                          <div className="text-[10px] text-devpro-text-secondary">{file.size} • AI Processed</div>
                        </div>
                      </div>
                      <Badge className="bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20 text-[8px]">
                        ✓
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* 📤 Upload Template Word (.docx) */}
        <FadeIn delay={0.2}>
          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
            <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-devpro-emerald font-black uppercase tracking-wider text-lg flex items-center gap-2">
                  <FileText className="size-5" />
                  📤 Upload Template Word
                </CardTitle>
                <Badge className="bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20 text-xs">
                  DOCX Format
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    id="template-upload"
                    className="hidden"
                    accept=".docx,.doc"
                    onChange={handleTemplateUpload}
                    disabled={uploadingTemplate}
                  />
                  <label
                    htmlFor="template-upload"
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed cursor-pointer transition-all",
                      uploadingTemplate 
                        ? "border-devpro-slate/50 text-devpro-text-secondary cursor-not-allowed" 
                        : "border-devpro-emerald/50 text-devpro-emerald hover:border-devpro-emerald hover:bg-devpro-emerald/10"
                    )}
                  >
                    {uploadingTemplate ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span className="text-sm font-medium">Uploading Template...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="size-4" />
                        <span className="text-sm font-bold">📤 Upload Word Template</span>
                      </>
                    )}
                  </label>
                </div>
                
                <div className="space-y-2">
                  {templateFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-devpro-navy/30 border border-devpro-slate/20">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-devpro-emerald" />
                        <div>
                          <div className="text-xs font-medium text-devpro-text-primary">{file.name}</div>
                          <div className="text-[10px] text-devpro-text-secondary">{file.size} • {file.uploaded}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="text-devpro-text-secondary hover:text-devpro-emerald">
                          <Download className="size-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-devpro-text-secondary hover:text-red-400">
                          <X className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* 📄 OCR Integration Engine */}
        <FadeIn delay={0.3}>
          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
            <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-400 font-black uppercase tracking-wider text-lg flex items-center gap-2">
                  <ScanLine className="size-5" />
                  📄 OCR Integration
                </CardTitle>
                <Badge className="bg-blue-600/10 text-blue-400 border border-blue-600/30 text-xs">
                  AI Powered
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-devpro-text-secondary">Document Type</Label>
                  <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                    <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                      <SelectItem value="ktp">KTP (Kartu Tanda Penduduk)</SelectItem>
                      <SelectItem value="spr">SPR (Surat Pindah Tanah Rumah)</SelectItem>
                      <SelectItem value="ktp-el">KTP Elektronik</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="sim">SIM Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-devpro-text-secondary">Processing Mode</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                      <SelectItem value="auto">Auto-Detect</SelectItem>
                      <SelectItem value="manual">Manual Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Camera className="size-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">Google Gemini Vision AI</span>
                  </div>
                  <p className="text-xs text-blue-300">Advanced OCR with 113-column form mapping for Indonesian documents</p>
                </div>
                
                <Button 
                  onClick={handleOCRProcessing} 
                  disabled={ocrProcessing || !selectedDocument}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {ocrProcessing ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ScanLine className="size-4 mr-2" />
                      🚀 Route to Scanner
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* ── System & Backup Actions ─────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 📧 Scan Email Berkas Sekarang */}
        <FadeIn delay={0.4}>
          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
            <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-amber-400 font-black uppercase tracking-wider text-lg flex items-center gap-2">
                  <Mail className="size-5" />
                  📧 Scan Email Berkas
                </CardTitle>
                <Badge className={cn(
                  "text-xs",
                  emailScanning ? "bg-amber-600/10 text-amber-400 animate-pulse" : "bg-devpro-slate/10 text-devpro-text-secondary"
                )}>
                  {emailScanning ? "Scanning" : "Ready"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-amber-600/10 border border-amber-600/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="size-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-300">Gmail API Integration</span>
                  </div>
                  <p className="text-xs text-amber-300">Automatic prospect detection and document extraction</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-devpro-navy/30 border border-devpro-slate/20 rounded-lg">
                    <div className="text-2xl font-black text-devpro-emerald">156</div>
                    <div className="text-xs text-devpro-text-secondary">Documents Found</div>
                  </div>
                  <div className="p-3 bg-devpro-navy/30 border border-devpro-slate/20 rounded-lg">
                    <div className="text-2xl font-black text-devpro-neon">12</div>
                    <div className="text-xs text-devpro-text-secondary">New Prospects</div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleEmailScanning}
                  disabled={emailScanning}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  {emailScanning ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Mail className="size-4 mr-2" />
                      📧 Start Scanning
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* 💾 Backup Database Manual */}
        <FadeIn delay={0.5}>
          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
            <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-devpro-emerald font-black uppercase tracking-wider text-lg flex items-center gap-2">
                  <Archive className="size-5" />
                  💾 Backup Database
                </CardTitle>
                <Badge className="bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20 text-xs">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-devpro-text-primary">Last Backup</div>
                    <div className="text-xs text-devpro-text-secondary">{lastBackup}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-devpro-emerald font-medium">System Healthy</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-devpro-navy/30 border border-devpro-slate/20 rounded-lg">
                    <Database className="size-6 text-devpro-emerald mx-auto mb-2" />
                    <div className="text-lg font-black text-devpro-emerald">2.4 TB</div>
                    <div className="text-xs text-devpro-text-secondary">Database Size</div>
                  </div>
                  <div className="p-3 bg-devpro-navy/30 border border-devpro-slate/20 rounded-lg">
                    <Cloud className="size-6 text-devpro-neon mx-auto mb-2" />
                    <div className="text-lg font-black text-devpro-neon">98.5%</div>
                    <div className="text-xs text-devpro-text-secondary">Storage Used</div>
                  </div>
                </div>
                
                <div className="text-xs text-devpro-text-secondary">
                  <p>• Automatic backups scheduled daily at 2:00 AM</p>
                  <p>• Incremental backup system enabled</p>
                  <p>• 30-day retention policy</p>
                </div>
                
                <Button 
                  onClick={handleBackup}
                  disabled={backupInProgress}
                  className="w-full bg-devpro-emerald hover:bg-devpro-emerald/90 text-devpro-navy font-bold"
                >
                  {backupInProgress ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Backing up...
                    </>
                  ) : (
                    <>
                      <Save className="size-4 mr-2" />
                      💾 Backup Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* 🩺 System Health Audit */}
        <FadeIn delay={0.6}>
          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
            <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-devpro-emerald font-black uppercase tracking-wider text-lg flex items-center gap-2">
                  <ShieldCheck className="size-5" />
                  🩺 System Health Audit
                </CardTitle>
                <Badge className="bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20 text-xs animate-pulse">
                  Healthy
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-devpro-navy/30 border border-devpro-slate/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="size-4 text-devpro-emerald" />
                      <span className="text-sm font-medium text-devpro-text-primary">Server Status</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-devpro-text-secondary">CPU: {systemHealth.server.cpu}%</span>
                      <span className="text-xs text-devpro-emerald font-medium">Online</span>
                    </div>
                    <div className="w-full bg-devpro-navy rounded-full h-1.5 mt-2">
                      <div className="h-full bg-devpro-emerald rounded-full" style={{ width: `${systemHealth.server.cpu}%` }} />
                    </div>
                  </div>
                  
                  <div className="p-3 bg-devpro-navy/30 border border-devpro-slate/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="size-4 text-devpro-emerald" />
                      <span className="text-sm font-medium text-devpro-text-primary">Database</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-devpro-text-secondary">Latency: {systemHealth.database.latency}ms</span>
                      <span className="text-xs text-devpro-emerald font-medium">{systemHealth.database.connections} conn</span>
                    </div>
                    <div className="w-full bg-devpro-navy rounded-full h-1.5 mt-2">
                      <div className="h-full bg-devpro-emerald rounded-full" style={{ width: `${Math.min(systemHealth.database.queries / 200 * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-devpro-navy/30 border border-devpro-slate/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Wifi className="size-4 text-devpro-emerald" />
                      <span className="text-sm font-medium text-devpro-text-primary">Network</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-devpro-text-secondary">Bandwidth: {systemHealth.network.bandwidth}</span>
                      <span className="text-xs text-devpro-emerald font-medium">Stable</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-devpro-navy/30 border border-devpro-slate/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="size-4 text-devpro-emerald" />
                      <span className="text-sm font-medium text-devpro-text-primary">Security</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-devpro-text-secondary">Firewall: {systemHealth.security.firewall}</span>
                      <span className="text-xs text-devpro-emerald font-medium">{systemHealth.security.threats} threats</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSystemHealthCheck}
                  className="w-full bg-devpro-emerald hover:bg-devpro-emerald/90 text-devpro-navy font-bold"
                >
                  <Activity className="size-4 mr-2" />
                  🩺 Run Full Audit
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* ── Konfigurasi Legal & Bank (Pengaturan Data Master) ─────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 🏦 Get Bank KCP/KC Options */}
        <FadeIn delay={0.7}>
          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
            <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-devpro-emerald font-black uppercase tracking-wider text-lg flex items-center gap-2">
                  <Building className="size-5" />
                  🏦 Get Bank KCP/KC Options
                </CardTitle>
                <Badge className="bg-devpro-emerald/10 text-devpro-emerald border border-devpro-emerald/20 text-xs">
                  Master Data
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-devpro-text-secondary">Select Bank</Label>
                  <Select>
                    <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                      <SelectValue placeholder="Choose bank for KCP/KC management" />
                    </SelectTrigger>
                    <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                      {bankAssignments.map((bank) => (
                        <SelectItem key={bank.bank} value={bank.bank}>
                          <div className="flex items-center justify-between w-full">
                            <span>{bank.bank}</span>
                            <span className="text-xs text-devpro-text-secondary">{bank.kcpList.length} KCP</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-devpro-text-secondary">Available KCP/KC</Label>
                  <Select>
                    <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                      <SelectValue placeholder="Select KCP/KC location" />
                    </SelectTrigger>
                    <SelectContent className="bg-devpro-charcoal border-devpro-slate/30 max-h-60">
                      {bankAssignments[0]?.kcpList.map((kcp, i) => (
                        <SelectItem key={i} value={kcp}>
                          {kcp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-devpro-emerald/10 border border-devpro-emerald/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="size-4 text-devpro-emerald" />
                    <span className="text-sm font-medium text-devpro-emerald">Branch Management</span>
                  </div>
                  <p className="text-xs text-devpro-emerald">Manage bank branch locations for customer assignments</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-devpro-navy/30 border border-devpro-slate/20 rounded-lg">
                    <div className="text-2xl font-black text-devpro-emerald">
                      {bankAssignments.reduce((sum, bank) => sum + bank.kcpList.length, 0)}
                    </div>
                    <div className="text-xs text-devpro-text-secondary">Total KCP</div>
                  </div>
                  <div className="p-3 bg-devpro-navy/30 border border-devpro-slate/20 rounded-lg">
                    <div className="text-2xl font-black text-devpro-neon">
                      {bankAssignments.reduce((sum, bank) => sum + bank.available, 0)}
                    </div>
                    <div className="text-xs text-devpro-text-secondary">Available</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* ⚙️ Assign Bank by Final Bank */}
        <FadeIn delay={0.8}>
          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
            <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-devpro-neon font-black uppercase tracking-wider text-lg flex items-center gap-2">
                  <CreditCard className="size-5" />
                  ⚙️ Assign Bank by Final Bank
                </CardTitle>
                <Badge className="bg-devpro-neon/10 text-devpro-neon border border-devpro-neon/20 text-xs">
                  Auto-Assign
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-devpro-text-secondary">Final Bank Selection</Label>
                  <Select>
                    <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                      <SelectValue placeholder="Select final bank for assignment" />
                    </SelectTrigger>
                    <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                      {bankAssignments.map((bank) => (
                        <SelectItem key={bank.bank} value={bank.bank}>
                          <div className="flex items-center justify-between w-full">
                            <span>{bank.bank}</span>
                            <Badge className="bg-devpro-neon/10 text-devpro-neon border border-devpro-neon/20 text-xs">
                              {bank.assigned} assigned
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-devpro-text-secondary">Assignment Rules</Label>
                  <Select defaultValue="priority">
                    <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                      <SelectItem value="priority">Priority Based</SelectItem>
                      <SelectItem value="availability">Availability Based</SelectItem>
                      <SelectItem value="regional">Regional Preference</SelectItem>
                      <SelectItem value="workload">Workload Balance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-devpro-neon/10 border border-devpro-neon/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Settings className="size-4 text-devpro-neon" />
                    <span className="text-sm font-medium text-devpro-neon">Smart Assignment Engine</span>
                  </div>
                  <p className="text-xs text-devpro-neon">AI-powered bank assignment based on customer location and preferences</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-devpro-text-secondary">Batch Assignment</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      placeholder="Customer IDs (comma separated)"
                      className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary placeholder:text-devpro-text-secondary"
                    />
                    <Button className="bg-devpro-neon hover:bg-devpro-neon/90 text-devpro-navy font-bold text-sm">
                      Assign All
                    </Button>
                  </div>
                </div>
                
                <div className="text-xs text-devpro-text-secondary">
                  <p>• Automatic assignment based on customer location data</p>
                  <p>• Load balancing across available branches</p>
                  <p>• Priority assignment for VIP customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* ⚙️ Assign Bank by Final Notaris */}
        <FadeIn delay={0.9}>
          <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
            <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-purple-400 font-black uppercase tracking-wider text-lg flex items-center gap-2">
                  <UserCheck className="size-5" />
                  ⚙️ Assign Bank by Notaris
                </CardTitle>
                <Badge className="bg-purple-600/10 text-purple-400 border border-purple-600/30 text-xs">
                  Legal
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-devpro-text-secondary">Notaris Selection</Label>
                  <Select>
                    <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                      <SelectValue placeholder="Select notaris for assignment" />
                    </SelectTrigger>
                    <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                      {notarisAssignments.map((notaris) => (
                        <SelectItem key={notaris.notaris} value={notaris.notaris}>
                          <div className="flex items-center justify-between w-full">
                            <span>{notaris.notaris}</span>
                            <Badge className="bg-purple-600/10 text-purple-400 border border-purple-600/30 text-xs">
                              {notaris.specialization}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-devpro-text-secondary">Document Type</Label>
                  <Select>
                    <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                      <SelectItem value="ppjb">PPJB (Perjanjian Pengikatan Jual Beli)</SelectItem>
                      <SelectItem value="akad">Akad KPR</SelectItem>
                      <SelectItem value="bast">BAST (Berita Acara Serah Terima)</SelectItem>
                      <SelectItem value="shm">SHM (Sertifikat Hak Milik)</SelectItem>
                      <SelectItem value="imb">IMB (Izin Mendirikan Bangunan)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-devpro-text-secondary">Bank Preference</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                      <SelectItem value="auto">Auto-Detect from Document</SelectItem>
                      <SelectItem value="customer">Customer Preference</SelectItem>
                      <SelectItem value="notaris">Notaris Recommendation</SelectItem>
                      <SelectItem value="regional">Regional Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-purple-600/10 border border-purple-600/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="size-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-300">Legal Compliance</span>
                  </div>
                  <p className="text-xs text-purple-300">Notaris-based bank assignment with legal document verification</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-devpro-navy/30 border border-devpro-slate/20 rounded-lg">
                    <div className="text-2xl font-black text-purple-400">
                      {notarisAssignments.reduce((sum, n) => sum + n.assigned, 0)}
                    </div>
                    <div className="text-xs text-devpro-text-secondary">Active</div>
                  </div>
                  <div className="p-3 bg-devpro-navy/30 border border-devpro-slate/20 rounded-lg">
                    <div className="text-2xl font-black text-devpro-emerald">
                      {notarisAssignments.reduce((sum, n) => sum + n.available, 0)}
                    </div>
                    <div className="text-xs text-devpro-text-secondary">Available</div>
                  </div>
                </div>
                
                <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold">
                  <UserCheck className="size-4 mr-2" />
                  ⚙️ Configure Assignment Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* ── Dialog Components ─────────────────────────────────────────────────────── */}
      
      {/* 📂 Universal AI Uploader Dialog */}
      <Dialog open={aiUploaderDialogOpen} onOpenChange={setAiUploaderDialogOpen}>
        <DialogContent className="bg-devpro-charcoal border-devpro-slate/30 text-devpro-text-primary max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-devpro-neon font-black text-lg flex items-center gap-2">
              <FolderOpen className="size-5" />
              📂 Universal AI Uploader
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-devpro-neon/50 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-devpro-neon hover:bg-devpro-neon/10"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="ai-file-upload"
                className="hidden"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files?.[0] && handleAIFileUpload(e.target.files[0])}
                disabled={aiProcessing}
              />
              <label htmlFor="ai-file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-devpro-neon/10 border border-devpro-neon/30">
                    <FolderOpen className="size-8 text-devpro-neon" />
                  </div>
                  <div>
                    <p className="text-devpro-neon font-bold text-lg">Drop files here or click to browse</p>
                    <p className="text-devpro-text-secondary text-sm">AI will process and categorize your documents</p>
                  </div>
                </div>
              </label>
            </div>
            
            {aiProcessing && (
              <div className="text-center py-8">
                <Loader2 className="size-8 text-devpro-neon animate-spin mx-auto mb-4" />
                <p className="text-devpro-neon font-medium">AI Processing...</p>
                <p className="text-devpro-text-secondary text-sm">Analyzing document structure and content</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAiUploaderDialogOpen(false)} className="border-devpro-slate/50 text-devpro-text-secondary">
              Cancel
            </Button>
            <Button className="bg-devpro-emerald hover:bg-devpro-emerald/90 text-devpro-navy font-bold">
              <CheckCircle2 className="size-4 mr-2" />
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 📄 OCR Integration Dialog */}
      <Dialog open={ocrDialogOpen} onOpenChange={setOcrDialogOpen}>
        <DialogContent className="bg-devpro-charcoal border-devpro-slate/30 text-devpro-text-primary max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-400 font-black text-lg flex items-center gap-2">
              <ScanLine className="size-5" />
              📄 OCR Integration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Document Type</Label>
              <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                  <SelectItem value="ktp">KTP (Kartu Tanda Penduduk)</SelectItem>
                  <SelectItem value="spr">SPR (Surat Pindah Tanah Rumah)</SelectItem>
                  <SelectItem value="ktp-el">KTP Elektronik</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="sim">SIM Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Camera className="size-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Google Gemini Vision AI</span>
              </div>
              <p className="text-xs text-blue-300">Advanced OCR with 113-column form mapping for Indonesian documents</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOcrDialogOpen(false)} className="border-devpro-slate/50 text-devpro-text-secondary">
              Cancel
            </Button>
            <Button 
              onClick={handleOCRProcessing} 
              disabled={ocrProcessing || !selectedDocument}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
            >
              {ocrProcessing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ScanLine className="size-4 mr-2" />
                  🚀 Route to Scanner
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
