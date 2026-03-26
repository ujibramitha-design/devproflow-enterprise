"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Mail, 
  RefreshCw, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  BarChart3,
  Clock,
  Settings
} from "lucide-react"
import { emailScannerService } from "@/services/email-scanner-service"

interface ScanStats {
  totalProspects: number
  newProspects: number
  lastScanTime: Date | null
  isRunning: boolean
}

export default function EmailScannerPage() {
  const [stats, setStats] = useState<ScanStats>({
    totalProspects: 0,
    newProspects: 0,
    lastScanTime: null,
    isRunning: false
  })
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState("")

  // Load initial stats
  useEffect(() => {
    loadStats()
  }, [])

  // Auto-refresh stats
  useEffect(() => {
    const interval = setInterval(() => {
      loadStats()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      const scanStats = await emailScannerService.getScanStats()
      setStats(scanStats)
    } catch (error: any) {
      console.error('Error loading stats:', error)
      setStatusMessage(`Error: ${error.message}`)
    }
  }

  const startScanner = () => {
    try {
      emailScannerService.startAutoScan()
      setStatusMessage("Email Scanner started - scanning every 30 minutes")
      loadStats()
    } catch (error: any) {
      setStatusMessage(`Error starting scanner: ${error.message}`)
    }
  }

  const stopScanner = () => {
    try {
      emailScannerService.stopAutoScan()
      setStatusMessage("Email Scanner stopped")
      loadStats()
    } catch (error: any) {
      setStatusMessage(`Error stopping scanner: ${error.message}`)
    }
  }

  const runManualScan = async () => {
    setIsScanning(true)
    setScanProgress(0)
    setStatusMessage("Starting manual scan...")

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      await emailScannerService.manualScan()
      
      clearInterval(progressInterval)
      setScanProgress(100)
      setStatusMessage("Manual scan completed successfully!")
      
      // Refresh stats
      await loadStats()
      
      // Reset progress after 2 seconds
      setTimeout(() => {
        setScanProgress(0)
        setIsScanning(false)
      }, 2000)

    } catch (error: any) {
      setStatusMessage(`Error during scan: ${error.message}`)
      setScanProgress(0)
      setIsScanning(false)
    }
  }

  const formatLastScanTime = (date: Date | null): string => {
    if (!date) return "Never"
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date)
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-devpro-primary/10 text-devpro-primary">
            <Mail className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-devpro-foreground">Email Scanner Service</h1>
            <p className="text-devpro-muted-foreground">
              Sinkronisasi otomatis prospek dari Gmail ke Supabase
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={stats.isRunning ? "bg-emerald-500/10 text-emerald-600 border-0" : "bg-rose-500/10 text-rose-600 border-0"}>
            {stats.isRunning ? (
              <>
                <Play className="size-3 mr-1" />
                Running
              </>
            ) : (
              <>
                <Pause className="size-3 mr-1" />
                Stopped
              </>
            )}
          </Badge>
          <Badge className="bg-devpro-primary/10 text-devpro-primary border-0">
            <Settings className="size-3 mr-1" />
            Auto-sync: 30 min
          </Badge>
          <Badge className="bg-amber-500/10 text-amber-600 border-0">
            <Clock className="size-3 mr-1" />
            Last: {formatLastScanTime(stats.lastScanTime)}
          </Badge>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Control Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-5" />
              Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Scanner Controls */}
            <div className="grid gap-4 md:grid-cols-2">
              <Button
                onClick={startScanner}
                disabled={stats.isRunning}
                className="w-full"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Auto Scanner
              </Button>
              
              <Button
                onClick={stopScanner}
                disabled={!stats.isRunning}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Pause className="mr-2 h-4 w-4" />
                Stop Auto Scanner
              </Button>
            </div>

            {/* Manual Scan */}
            <div className="space-y-2">
              <Button
                onClick={runManualScan}
                disabled={isScanning}
                className="w-full"
                variant="secondary"
                size="lg"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run Manual Scan
                  </>
                )}
              </Button>

              {/* Progress */}
              {isScanning && (
                <div className="space-y-2">
                  <Progress value={scanProgress} className="h-2" />
                  <p className="text-xs text-devpro-muted-foreground text-center">
                    Scanning emails... {scanProgress}%
                  </p>
                </div>
              )}
            </div>

            {/* Scanner Info */}
            <div className="p-4 bg-devpro-navy/50 rounded-lg space-y-2">
              <h4 className="font-semibold text-devpro-text-primary">Scanner Configuration</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-devpro-text-secondary">Keywords:</span>
                  <span className="text-devpro-text-primary">Notifikasi, Booking, Pembayaran, KPR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-devpro-text-secondary">Target Table:</span>
                  <span className="text-devpro-text-primary">prospek_temp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-devpro-text-secondary">Scan Interval:</span>
                  <span className="text-devpro-text-primary">30 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-devpro-text-secondary">Email Service:</span>
                  <span className="text-devpro-text-primary">Gmail API (Mock)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Total Prospects */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="size-8 text-devpro-primary mr-2" />
                <span className="text-3xl font-bold text-devpro-foreground">
                  {stats.totalProspects}
                </span>
              </div>
              <p className="text-sm text-devpro-muted-foreground">Total Prospects</p>
            </div>

            {/* New Prospects */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="size-6 text-emerald-500 mr-2" />
                <span className="text-2xl font-bold text-emerald-600">
                  {stats.newProspects}
                </span>
              </div>
              <p className="text-sm text-devpro-muted-foreground">New Prospects</p>
            </div>

            {/* Status Indicator */}
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                stats.isRunning 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {stats.isRunning ? (
                  <>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                    Active
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-rose-500 rounded-full mr-2" />
                    Inactive
                  </>
                )}
              </div>
            </div>

            {/* Last Scan */}
            <div className="text-center">
              <p className="text-xs text-devpro-muted-foreground">Last Scan</p>
              <p className="text-sm font-medium text-devpro-text-primary">
                {formatLastScanTime(stats.lastScanTime)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="size-5" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-xl bg-devpro-primary/5 border border-devpro-primary/10">
              <h4 className="font-semibold text-devpro-primary mb-2">1. Email Monitoring</h4>
              <p className="text-sm text-devpro-muted-foreground">
                Scanner monitors Gmail for keywords: "Notifikasi", "Booking", "Pembayaran", "KPR", "Properti"
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <h4 className="font-semibold text-emerald-600 mb-2">2. Data Extraction</h4>
              <p className="text-sm text-devpro-muted-foreground">
                Automatically extracts name, email, phone, unit info from email content
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <h4 className="font-semibold text-amber-600 mb-2">3. Supabase Sync</h4>
              <p className="text-sm text-devpro-muted-foreground">
                Syncs extracted data to prospek_temp table with status "BARU" for follow-up
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
