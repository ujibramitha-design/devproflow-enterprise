"use client"

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
} from "lucide-react"

const metrics = [
  { 
    title: "Total Pengajuan", 
    value: "1.248", 
    change: "+12.5%", 
    trend: "up" as const, 
    period: "vs bulan lalu", 
    icon: FileText, 
    gradientFrom: "from-devpro-primary/15", 
    gradientTo: "to-devpro-primary/5", 
    iconColor: "text-devpro-primary", 
    sparkColor: "bg-devpro-primary/60",
    href: "/aplikasi"
  },
  { 
    title: "Dalam Review", 
    value: "342", 
    change: "+8.2%", 
    trend: "up" as const, 
    period: "vs bulan lalu", 
    icon: Clock, 
    gradientFrom: "from-amber-500/15", 
    gradientTo: "to-amber-500/5", 
    iconColor: "text-amber-600 dark:text-amber-400", 
    sparkColor: "bg-amber-500/60",
    href: "/customer"
  },
  { 
    title: "Disetujui", 
    value: "856", 
    change: "+18.3%", 
    trend: "up" as const, 
    period: "vs bulan lalu", 
    icon: CheckCircle2, 
    gradientFrom: "from-emerald-500/15", 
    gradientTo: "to-emerald-500/5", 
    iconColor: "text-emerald-600 dark:text-emerald-400", 
    sparkColor: "bg-emerald-500/60",
    href: "/aplikasi"
  },
  { 
    title: "Ditolak", 
    value: "50", 
    change: "-5.1%", 
    trend: "down" as const, 
    period: "vs bulan lalu", 
    icon: XCircle, 
    gradientFrom: "from-rose-500/15", 
    gradientTo: "to-rose-500/5", 
    iconColor: "text-rose-500 dark:text-rose-400", 
    sparkColor: "bg-rose-500/60",
    href: "/aplikasi"
  },
]

function MiniSpark({ color }: { color: string }) {
  const bars = [35, 55, 45, 70, 60, 80, 65, 90, 75, 85]
  return (
    <div className="flex items-end gap-[3px] h-8" aria-hidden="true">
      {bars.map((h, i) => (
        <div 
          key={i} 
          className={cn("w-[3px] rounded-full devpro-animate-scale-in", color)} 
          style={{ 
            height: `${h}%`, 
            opacity: 0.4 + (i / bars.length) * 0.6, 
            animationDelay: `${i * 60}ms` 
          }} 
        />
      ))}
    </div>
  )
}

export function KpiCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <Link 
          key={metric.title} 
          href={metric.href}
          className="group relative block overflow-hidden rounded-2xl bg-devpro-card p-5 shadow-sm ring-1 ring-devpro-border/30 transition-all duration-500 hover:shadow-xl hover:ring-devpro-primary/20 hover:-translate-y-1 devpro-animate-slide-in" 
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            metric.gradientFrom,
            metric.gradientTo
          )} />
          
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className={cn(
                "flex size-11 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-500 group-hover:scale-110",
                metric.gradientFrom,
                metric.gradientTo
              )}>
                <metric.icon className={cn("size-5", metric.iconColor)} strokeWidth={2} />
              </div>
              <MiniSpark color={metric.sparkColor} />
            </div>
            
            <div className="mt-4">
              <p className="text-[28px] font-extrabold tracking-tight text-devpro-foreground leading-none">
                {metric.value}
              </p>
              <p className="mt-1.5 text-[12px] font-semibold text-devpro-muted-foreground">
                {metric.title}
              </p>
            </div>
            
            <div className="mt-3 flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold", 
                metric.trend === "up" 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}>
                {metric.trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                <span>{metric.change}</span>
              </div>
              <span className="text-[11px] text-devpro-muted-foreground/70">{metric.period}</span>
            </div>
          </div>
          
          <div className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-lg bg-devpro-primary/0 text-devpro-primary/0 transition-all duration-300 group-hover:bg-devpro-primary/10 group-hover:text-devpro-primary">
            <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
          </div>
        </Link>
      ))}
    </div>
  )
}
