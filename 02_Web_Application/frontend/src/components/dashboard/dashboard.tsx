"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  FileText, 
  Building2, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  Home,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Calculator
} from "lucide-react"

export function KPRFlowDashboard() {
  // Mock data untuk dashboard
  const stats = [
    {
      title: "Total Pengajuan",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: FileText,
      color: "kprflow-primary"
    },
    {
      title: "Customer Aktif",
      value: "892",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "kprflow-success"
    },
    {
      title: "Properti Tersedia",
      value: "156",
      change: "-3.1%",
      trend: "down",
      icon: Building2,
      color: "kprflow-warning"
    },
    {
      title: "Total Pinjaman",
      value: "Rp 45.6M",
      change: "+18.7%",
      trend: "up",
      icon: DollarSign,
      color: "kprflow-primary"
    }
  ]

  const recentApplications = [
    {
      id: "APP-001",
      customerName: "Budi Santoso",
      propertyName: "Rumah Tipe 120/120",
      amount: "Rp 450.000.000",
      status: "pending",
      date: "2024-03-21",
      bank: "BCA"
    },
    {
      id: "APP-002", 
      customerName: "Siti Nurhaliza",
      propertyName: "Apartemen Studio",
      amount: "Rp 180.000.000",
      status: "approved",
      date: "2024-03-20",
      bank: "Mandiri"
    },
    {
      id: "APP-003",
      customerName: "Ahmad Fauzi",
      propertyName: "Rumah Tipe 70/90",
      amount: "Rp 320.000.000",
      status: "rejected",
      date: "2024-03-19",
      bank: "BNI"
    },
    {
      id: "APP-004",
      customerName: "Dewi Lestari",
      propertyName: "Rumah Tipe 90/120",
      amount: "Rp 380.000.000",
      status: "completed",
      date: "2024-03-18",
      bank: "BRI"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'kprflow-status-pending'
      case 'approved': return 'kprflow-status-approved'
      case 'rejected': return 'kprflow-status-rejected'
      case 'completed': return 'kprflow-status-completed'
      default: return 'bg-kprflow-muted text-kprflow-muted-foreground'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu'
      case 'approved': return 'Disetujui'
      case 'rejected': return 'Ditolak'
      case 'completed': return 'Selesai'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold kprflow-gradient-text">Dashboard KPRFlow</h1>
          <p className="text-kprflow-muted-foreground mt-1">
            Sistem Manajemen Property & KPR Enterprise
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="devpro" className="gap-2">
            <FileText className="h-4 w-4" />
            Pengajuan Baru
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="kprflow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-kprflow-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                <stat.icon className={`h-4 w-4 text-${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-kprflow-muted-foreground">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-kprflow-success" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-kprflow-error" />
                )}
                <span className={stat.trend === 'up' ? 'text-kprflow-success' : 'text-kprflow-error'}>
                  {stat.change}
                </span>
                <span>dari bulan lalu</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pengajuan Terbaru</CardTitle>
              <CardDescription>
                Aplikasi KPR yang baru saja diajukan
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Lihat Semua
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-4 border border-kprflow-border/30 rounded-lg hover:bg-kprflow-accent/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-kprflow-primary/10">
                    <FileText className="h-5 w-5 text-kprflow-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{application.customerName}</p>
                    <p className="text-sm text-kprflow-muted-foreground">
                      {application.propertyName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{application.amount}</p>
                  <p className="text-sm text-kprflow-muted-foreground">
                    {application.bank} • {application.date}
                  </p>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {getStatusText(application.status)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer kprflow-card-hover">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 rounded-lg bg-kprflow-primary/10 mb-3">
              <Users className="h-6 w-6 text-kprflow-primary" />
            </div>
            <h3 className="font-semibold">Customer Baru</h3>
            <p className="text-sm text-kprflow-muted-foreground mt-1">
              Tambah customer baru
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer kprflow-card-hover">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 rounded-lg bg-kprflow-success/10 mb-3">
              <Building2 className="h-6 w-6 text-kprflow-success" />
            </div>
            <h3 className="font-semibold">Properti Baru</h3>
            <p className="text-sm text-kprflow-muted-foreground mt-1">
              Tambah properti baru
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer kprflow-card-hover">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 rounded-lg bg-kprflow-warning/10 mb-3">
              <Calculator className="h-6 w-6 text-kprflow-warning" />
            </div>
            <h3 className="font-semibold">Kalkulator KPR</h3>
            <p className="text-sm text-kprflow-muted-foreground mt-1">
              Hitung cicilan KPR
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer kprflow-card-hover">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 rounded-lg bg-kprflow-error/10 mb-3">
              <TrendingUp className="h-6 w-6 text-kprflow-error" />
            </div>
            <h3 className="font-semibold">Laporan</h3>
            <p className="text-sm text-kprflow-muted-foreground mt-1">
              Lihat laporan bulanan
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
