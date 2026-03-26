"use client"

import Link from "next/link"
import { Wallet, TrendingUp, Percent, Clock3, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const summaryItems = [
  {
    label: "Total Approved Limit",
    value: "Rp 128.4 B",
    sub: "March 2026",
    icon: Wallet,
    color: "text-devpro-neon",
    bg: "bg-devpro-neon/10",
    border: "border-devpro-neon/20",
    href: "/dashboard/finance",
  },
  {
    label: "Avg. Approval Rate",
    value: "68.6%",
    sub: "+4.2% vs last month",
    icon: Percent,
    color: "text-devpro-emerald",
    bg: "bg-devpro-emerald/10",
    border: "border-devpro-emerald/20",
    href: "/dashboard/bod",
  },
  {
    label: "Avg. Processing Time",
    value: "3.2 Days",
    sub: "-0.5 days vs last month",
    icon: Clock3,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    href: "/dashboard/legal",
  },
  {
    label: "Quarterly Target",
    value: "82%",
    sub: "1,024 of 1,248 target",
    icon: TrendingUp,
    color: "text-devpro-neon",
    bg: "bg-devpro-neon/10",
    border: "border-devpro-neon/20",
    href: "/unit",
  },
]

export function QuickStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map((item, index) => (
        <Link
          key={item.label}
          href={item.href}
          className="group relative flex items-center gap-4 rounded-xl bg-devpro-charcoal p-4 border border-devpro-slate/30 transition-all duration-500 hover:-translate-y-1 hover:border-devpro-neon/30 shadow-lg overflow-hidden"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl bg-devpro-navy border border-devpro-slate/50 transition-all duration-500 group-hover:border-devpro-neon/50",
            item.color
          )}>
            <item.icon className="size-5" strokeWidth={2.5} />
          </div>
          
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-devpro-text-secondary uppercase tracking-widest truncate">
              {item.label}
            </p>
            <p className="mt-0.5 text-lg font-black text-devpro-text-primary leading-tight">
              {item.value}
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-devpro-text-secondary/60 uppercase">
              {item.sub}
            </p>
          </div>

          <div className="absolute right-2 top-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
            <ArrowUpRight className="size-3 text-devpro-neon" />
          </div>
        </Link>
      ))}
    </div>
  )
}
