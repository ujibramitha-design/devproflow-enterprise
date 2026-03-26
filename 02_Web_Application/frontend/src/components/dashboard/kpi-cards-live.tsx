"use client"

import { useState, useEffect } from "react"
import { BackendAPI } from "@/lib/backend-api"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Building2,
  Users,
  DollarSign,
} from "lucide-react"

interface DashboardStats {
  totalUnits: number
  totalApplications: number
  totalCustomers: number
  unitsByStatus: {
    available: number
    sold: number
    akad: number
    cair: number
  }
  applicationsByStatus: {
    pending: number
    process: number
    approved: number
    completed: number
  }
  totalRevenue: number
}

export function KpiCardsLive() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function fetchStats() {
    try {
      const data = await BackendAPI.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="block overflow-hidden rounded-xl bg-devpro-charcoal p-6 border border-devpro-slate/30 shadow-xl">
            <div className="animate-pulse space-y-4">
              <div className="flex justify-between items-start">
                <div className="size-12 bg-devpro-navy rounded-xl border border-devpro-slate/50"></div>
                <div className="h-10 w-20 bg-devpro-navy rounded-lg"></div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-8 bg-devpro-navy rounded w-1/3"></div>
                <div className="h-4 bg-devpro-navy rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center text-devpro-muted-foreground p-8">
        Unable to load dashboard statistics
      </div>
    )
  }

  const metrics = [
    { 
      title: "Total Application", 
      value: stats.totalApplications.toString(), 
      change: "+12.5%", 
      trend: "up" as const, 
      period: "vs last month", 
      icon: FileText, 
      color: "text-devpro-neon",
      glowColor: "shadow-devpro-neon/20",
      borderColor: "border-devpro-neon/20",
      href: "/aplikasi"
    },
    { 
      title: "In Review", 
      value: stats.applicationsByStatus.process.toString(), 
      change: "5 pending", 
      trend: "up" as const, 
      period: "waiting action", 
      icon: Clock, 
      color: "text-amber-400",
      glowColor: "shadow-amber-400/20",
      borderColor: "border-amber-400/20",
      href: "/aplikasi?status=process"
    },
    { 
      title: "Approved", 
      value: stats.applicationsByStatus.approved.toString(), 
      change: "+8 today", 
      trend: "up" as const, 
      period: "bank verified", 
      icon: CheckCircle2, 
      color: "text-devpro-emerald",
      glowColor: "shadow-devpro-emerald/20",
      borderColor: "border-devpro-emerald/20",
      href: "/aplikasi?status=approved"
    },
    { 
      title: "Rejected", 
      value: "2", 
      change: "-1.2%", 
      trend: "down" as const, 
      period: "failed criteria", 
      icon: XCircle, 
      color: "text-rose-400",
      glowColor: "shadow-rose-400/20",
      borderColor: "border-rose-400/20",
      href: "/aplikasi?status=rejected"
    },
  ]

  function MiniSparkLine({ color }: { color: string }) {
    const bars = [35, 55, 45, 70, 60, 80, 65, 90, 75, 85]
    return (
      <div className="flex items-end gap-[2px] h-10" aria-hidden="true">
        {bars.map((h, i) => (
          <div 
            key={i} 
            className={cn("w-[2px] rounded-full transition-all duration-500", color)} 
            style={{ 
              height: `${h}%`, 
              opacity: 0.2 + (i / bars.length) * 0.8,
            }} 
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <Link 
          key={metric.title} 
          href={metric.href}
          className={cn(
            "group relative block overflow-hidden rounded-xl bg-devpro-charcoal p-6 transition-all duration-500 hover:-translate-y-1 border border-devpro-slate/30",
            "hover:border-devpro-neon/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className={cn(
                "flex size-12 items-center justify-center rounded-xl bg-devpro-navy border border-devpro-slate/50 transition-all duration-500 group-hover:border-devpro-neon/50 group-hover:shadow-[0_0_15px_rgba(0,255,204,0.3)]",
                metric.color
              )}>
                <metric.icon className="size-6" strokeWidth={2} />
              </div>
              <MiniSparkLine color={metric.color.replace('text-', 'bg-')} />
            </div>
            
            <div className="mt-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-devpro-text-primary">
                  {metric.value}
                </span>
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded bg-devpro-navy border border-devpro-slate/50",
                  metric.trend === "up" ? "text-devpro-neon" : "text-rose-400"
                )}>
                  {metric.change}
                </span>
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-devpro-text-secondary/70">
                {metric.title}
              </p>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <div className={cn(
                "size-1.5 rounded-full animate-pulse",
                metric.color.replace('text-', 'bg-')
              )} />
              <span className="text-[10px] font-medium text-devpro-text-secondary uppercase tracking-tighter">
                {metric.period}
              </span>
            </div>
          </div>
          
          <div className="absolute -right-4 -bottom-4 opacity-5 transition-all duration-500 group-hover:scale-110 group-hover:opacity-10">
            <metric.icon className={cn("size-24", metric.color)} />
          </div>
        </Link>
      ))}
    </div>
  )
}
