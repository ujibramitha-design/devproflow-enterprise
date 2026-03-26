"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

interface Stats {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ElementType
  color: string
}

interface Application {
  id: string
  applicantName: string
  propertyName: string
  location: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  createdAt: string
  propertyType: 'residential' | 'commercial' | 'mixed'
}

export function SimpleKPRFlowDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for demonstration
  const stats: Stats[] = [
    {
      title: "Total Pengajuan",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: FileText,
      color: "kprflow-primary"
    },
    {
      title: "Menunggu Proses",
      value: "456",
      change: "+8.2%",
      trend: "up",
      icon: Clock,
      color: "kprflow-warning"
    },
    {
      title: "Disetujui",
      value: "789",
      change: "+15.3%",
      trend: "up",
      icon: CheckCircle,
      color: "kprflow-success"
    },
    {
      title: "Ditolak",
      value: "123",
      change: "-3.1%",
      trend: "down",
      icon: AlertCircle,
      color: "kprflow-error"
    }
  ]

  const applications: Application[] = [
    {
      id: "1",
      applicantName: "John Doe",
      propertyName: "Rumah Tipe 36/72",
      location: "Jakarta Selatan",
      amount: 450000000,
      status: "pending",
      createdAt: "2026-03-20",
      propertyType: "residential"
    },
    {
      id: "2",
      applicantName: "Jane Smith",
      propertyName: "Apartemen Studio",
      location: "Jakarta Pusat",
      amount: 280000000,
      status: "approved",
      createdAt: "2026-03-19",
      propertyType: "residential"
    },
    {
      id: "3",
      applicantName: "Bob Johnson",
      propertyName: "Ruko 2 Lantai",
      location: "Jakarta Barat",
      amount: 850000000,
      status: "rejected",
      createdAt: "2026-03-18",
      propertyType: "commercial"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'kprflow-status-pending'
      case 'approved':
        return 'kprflow-status-approved'
      case 'rejected':
        return 'kprflow-status-rejected'
      case 'completed':
        return 'kprflow-status-completed'
      default:
        return 'kprflow-status-pending'
    }
  }

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'residential':
        return 'kprflow-type-residential'
      case 'commercial':
        return 'kprflow-type-commercial'
      case 'mixed':
        return 'kprflow-type-mixed'
      default:
        return 'kprflow-type-residential'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  return (
    <div className="min-h-screen bg-kprflow-background">
      <div className="container mx-auto p-6 space-y-6">
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
            <Button variant="outline" className="gap-2">
              <Calculator className="h-4 w-4" />
              Kalkulator KPR
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="kprflow-card-hover">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className={`p-3 rounded-lg bg-${stat.color}/10 mb-3`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                </div>
                <h3 className="font-semibold">{stat.title}</h3>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  stat.trend === 'up' ? 'text-kprflow-success' : 'text-kprflow-error'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Cari pengajuan berdasarkan nama, email, atau properti..."
                className="flex-1 px-3 py-2 border border-kprflow-border rounded-md focus:outline-none focus:ring-2 focus:ring-kprflow-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="devpro">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pengajuan Terbaru
            </CardTitle>
            <CardDescription>
              Daftar pengajuan KPR terbaru dengan status real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 border border-kprflow-border rounded-lg hover:bg-kprflow-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-kprflow-primary/10">
                      <FileText className="h-5 w-5 text-kprflow-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{application.applicantName}</h4>
                      <p className="text-sm text-kprflow-muted-foreground">
                        {application.propertyName} • {application.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getPropertyTypeColor(application.propertyType)}>
                          {application.propertyType}
                        </Badge>
                        <span className="text-sm text-kprflow-muted-foreground">
                          {formatDate(application.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(application.amount)}</div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="kprflow-card-hover cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="p-3 rounded-lg bg-kprflow-warning/10 mb-3">
                <Calculator className="h-6 w-6 text-kprflow-warning" />
              </div>
              <h3 className="font-semibold">Kalkulator KPR</h3>
              <p className="text-sm text-kprflow-muted-foreground mt-1">
                Hitung simulasi KPR Anda
              </p>
            </CardContent>
          </Card>

          <Card className="kprflow-card-hover cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="p-3 rounded-lg bg-kprflow-success/10 mb-3">
                <Building2 className="h-6 w-6 text-kprflow-success" />
              </div>
              <h3 className="font-semibold">Katalog Properti</h3>
              <p className="text-sm text-kprflow-muted-foreground mt-1">
                Jelajahi properti tersedia
              </p>
            </CardContent>
          </Card>

          <Card className="kprflow-card-hover cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="p-3 rounded-lg bg-kprflow-primary/10 mb-3">
                <Users className="h-6 w-6 text-kprflow-primary" />
              </div>
              <h3 className="font-semibold">Manajemen Nasabah</h3>
              <p className="text-sm text-kprflow-muted-foreground mt-1">
                Kelola data nasabah
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
