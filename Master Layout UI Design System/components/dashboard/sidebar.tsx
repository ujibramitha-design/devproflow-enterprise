"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Building2,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  PieChart,
  Wallet,
  Gavel,
  Zap,
  HardHat,
  ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo3D } from "@/components/dashboard/logo-3d"

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: PieChart, label: "Executive (BOD)", href: "/dashboard/bod" },
  { icon: Wallet, label: "Finance Hub", href: "/dashboard/finance" },
  { icon: Gavel, label: "Legal Workflow", href: "/dashboard/legal" },
  { icon: Zap, label: "Marketing Panel", href: "/dashboard/marketing" },
  { icon: HardHat, label: "Engineering", href: "/dashboard/engineering" },
  { icon: FileText, label: "Aplikasi KPR", href: "/aplikasi" },
  { icon: Building2, label: "Data Unit", href: "/unit" },
  { icon: Users, label: "Customer DB", href: "/customer" },
  { icon: ShieldCheck, label: "Audit Security", href: "/audit" },
  { icon: Settings, label: "Pengaturan", href: "/settings" },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-border/40 transition-all duration-500 ease-in-out z-30 shadow-2xl shadow-primary/5",
        "bg-gradient-to-b from-card via-card to-secondary/20 dark:from-[oklch(0.15_0.018_260)] dark:via-[oklch(0.15_0.018_260)] dark:to-[oklch(0.13_0.02_260)]",
        collapsed ? "w-[76px]" : "w-[280px]"
      )}
    >
      <div className={cn("flex items-center gap-3 px-5 pt-7 pb-6", collapsed && "justify-center px-0")}>
        <Logo3D collapsed={collapsed} />
      </div>

      {!collapsed && (
        <div className="px-6 pb-2">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/40 leading-none">Enterprise 2026</p>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1 px-3 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-[13px] font-bold transition-all duration-300 animate-slide-in-right",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30"
                  : "text-muted-foreground/80 hover:bg-secondary/80 hover:text-foreground"
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                isActive ? "bg-white/20" : "group-hover:bg-secondary"
              )}>
                <item.icon className="size-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {!collapsed && <span className="truncate">{item.label}</span>}
              {isActive && !collapsed && (
                <div className="absolute right-3 size-1.5 rounded-full bg-primary-foreground animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-[72px] z-40 flex size-7 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white"
      >
        {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
      </button>

      <div className={cn("px-3 pb-6 mt-auto", collapsed && "px-2")}>
        <button className={cn(
          "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[13px] font-bold text-muted-foreground transition-all duration-300 hover:bg-destructive/10 hover:text-destructive",
          collapsed && "justify-center px-0"
        )}>
          <div className="flex size-8 shrink-0 items-center justify-center">
            <LogOut className="size-[18px]" strokeWidth={2} />
          </div>
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  )
}
