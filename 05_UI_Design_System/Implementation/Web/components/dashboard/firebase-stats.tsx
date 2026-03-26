"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FirebaseService } from "@/lib/firebase"
import { TrendingUp, TrendingDown, Building2, Users, DollarSign, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardStats {
  total: number
  available: number
  sold: number
  akad: number
  cair: number
  totalOmset: number
}

export function FirebaseStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    loadStats()
    const interval = setInterval(loadStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function loadStats() {
    try {
      const data = await FirebaseService.getDashboardStats()
      setStats(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Unable to load statistics
          </div>
        </CardContent>
      </Card>
    )
  }

  const statCards = [
    {
      title: "Total Unit Database",
      value: stats.total.toLocaleString(),
      icon: Building2,
      color: "text-devpro-primary",
      bgColor: "bg-devpro-primary/10",
      trend: null
    },
    {
      title: "Unit Tersedia",
      value: stats.available.toLocaleString(),
      icon: Users,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      trend: stats.available > 0 ? "up" : null
    },
    {
      title: "Unit Terjual",
      value: stats.sold.toLocaleString(),
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      trend: stats.sold > 0 ? "up" : null
    },
    {
      title: "Estimasi Omset",
      value: formatCurrency(stats.totalOmset),
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      trend: stats.totalOmset > 0 ? "up" : null
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Real-Time Statistics</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          Last updated: {formatTime(lastUpdated)}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", card.bgColor)}>
                  <card.icon className={cn("size-5", card.color)} />
                </div>
                {card.trend && (
                  <div className={cn(
                    "flex items-center text-xs font-medium",
                    card.trend === "up" ? "text-emerald-600" : "text-red-600"
                  )}>
                    {card.trend === "up" ? (
                      <TrendingUp className="size-3 mr-1" />
                    ) : (
                      <TrendingDown className="size-3 mr-1" />
                    )}
                    Active
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-2xl font-bold text-devpro-foreground mb-1">
                  {card.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {card.title}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Available</span>
                <span className="font-semibold text-amber-600">{stats.available}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sold</span>
                <span className="font-semibold text-blue-600">{stats.sold}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Akad</span>
                <span className="font-semibold text-emerald-600">{stats.akad}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cair</span>
                <span className="font-semibold text-green-600">{stats.cair}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sold Rate</span>
                <span className="font-semibold">
                  {stats.total > 0 ? Math.round((stats.sold / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="font-semibold">
                  {stats.total > 0 ? Math.round((stats.cair / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Unit Value</span>
                <span className="font-semibold">
                  {stats.cair > 0 ? formatCurrency(stats.totalOmset / stats.cair) : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
