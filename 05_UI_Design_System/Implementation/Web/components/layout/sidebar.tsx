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
  ShieldCheck,
  Home,
  Calculator,
  Upload,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
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

export function DevProSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-devpro-border/40 transition-all duration-500 ease-in-out z-30 shadow-2xl shadow-devpro-primary/5",
        "bg-gradient-to-b from-devpro-card via-devpro-card to-devpro-secondary/20 dark:from-devpro-card dark:via-devpro-card dark:to-devpro-secondary/20",
        collapsed ? "w-[76px]" : "w-[280px]"
      )}
    >
      <div className={cn("flex items-center gap-3 px-5 pt-7 pb-6", collapsed && "justify-center px-0")}>
        <div className={cn(
          "flex items-center gap-2",
          collapsed && "justify-center"
        )}>
          <div className="flex size-8 items-center justify-center rounded-xl devpro-gradient text-white font-bold text-lg">
            K
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg devpro-gradient-text">DevPro</span>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-kprflow-muted-foreground/40 leading-none">
                Enterprise 2026
              </span>
            </div>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="px-6 pb-2">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-devpro-muted-foreground/40 leading-none">
            Enterprise 2026
          </p>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1 px-3 overflow-y-auto overflow-x-hidden py-2 devpro-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-[13px] font-bold transition-all duration-300 devpro-animate-slide-in-right",
                collapsed && "justify-center px-0",
                isActive
                  ? "devpro-gradient text-white shadow-xl shadow-devpro-primary/30"
                  : "text-devpro-muted-foreground/80 hover:bg-devpro-accent/10 hover:text-devpro-foreground"
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                isActive ? "bg-white/20" : "group-hover:bg-devpro-accent/20"
              )}>
                <item.icon className="size-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {!collapsed && <span className="truncate">{item.label}</span>}
              {isActive && !collapsed && (
                <div className="absolute right-3 size-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      <Button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute -right-3.5 top-[72px] z-40 flex size-7 items-center justify-center rounded-full border border-devpro-border/60 bg-devpro-card text-devpro-muted-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:bg-devpro-primary hover:text-white",
          "p-0 h-7 w-7"
        )}
        variant="outline"
        size="icon"
      >
        {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
      </Button>

      <div className={cn("px-3 pb-6 mt-auto", collapsed && "px-2")}>
        <Button
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[13px] font-bold text-devpro-muted-foreground transition-all duration-300 hover:bg-devpro-error/10 hover:text-devpro-error",
            collapsed && "justify-center px-0"
          )}
          variant="ghost"
        >
          <div className="flex size-8 shrink-0 items-center justify-center">
            <LogOut className="size-[18px]" strokeWidth={2} />
          </div>
          {!collapsed && <span>Log Out</span>}
        </Button>
      </div>
    </aside>
  )
}
