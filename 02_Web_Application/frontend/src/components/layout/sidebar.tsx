"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, FileText, Building2, Users, Settings,
  ChevronLeft, ChevronRight, LogOut, PieChart, Wallet,
  Gavel, Zap, HardHat, ShieldCheck, Scan, Mail,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRBACStore, ROLE_CONFIG, type UserRole } from "@/lib/rbac-store"

const ICON_MAP: Record<string, any> = {
  LayoutDashboard, PieChart, Zap, Building2, Users, Gavel,
  FileText, Wallet, HardHat, Scan, Mail, ShieldCheck, Settings,
}

export function DevProSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const pathname = usePathname()
  const { currentUser, setRole, getVisibleMenuItems } = useRBACStore()
  const visibleItems = getVisibleMenuItems()
  const roleInfo = ROLE_CONFIG[currentUser.role]

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-[var(--border)] transition-all duration-500 ease-in-out z-30 shadow-2xl bg-[var(--sidebar)]",
        collapsed ? "w-[76px]" : "w-[280px]"
      )}
    >
      <div className={cn("flex items-center gap-3 px-5 pt-7 pb-6", collapsed && "justify-center px-0")}>
        <div className={cn(
          "flex items-center gap-2",
          collapsed && "justify-center"
        )}>
          <div className="flex size-8 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-lg shadow-lg">
            D
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[var(--foreground)] tracking-tight">DevPro <span className="text-[var(--primary)]">Flow</span> Enterprise</span>
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--muted-foreground)] leading-none">
                Enterprise v2.0
              </span>
            </div>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="px-6 pb-2">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--muted-foreground)]/50 leading-none">
            Core Modules
          </p>
        </div>
      )}

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--sidebar-accent)]/40 border border-[var(--sidebar-border)]">
            <span className="text-sm">{roleInfo.icon}</span>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", roleInfo.color)}>{roleInfo.label}</span>
          </div>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1 px-3 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href
          const IconComp = ICON_MAP[item.icon] || LayoutDashboard
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-300",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)] shadow-lg border border-[var(--sidebar-primary)]/20"
                  : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]/50 hover:text-[var(--foreground)]"
              )}
            >
              <div className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
                isActive ? "text-[var(--sidebar-primary)]" : "group-hover:text-[var(--sidebar-primary)]"
              )}>
                <IconComp className="size-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {!collapsed && <span className="truncate">{item.label}</span>}
              {isActive && !collapsed && (
                <div className="absolute right-3 size-1.5 rounded-full bg-[var(--sidebar-primary)] shadow-lg" />
              )}
            </Link>
          )
        })}
      </nav>

      <Button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute -right-3.5 top-[72px] z-40 flex size-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--sidebar)] text-[var(--muted-foreground)] shadow-lg transition-all duration-300 hover:scale-110 hover:border-[var(--sidebar-primary)] hover:text-[var(--sidebar-primary)]",
          "p-0 h-7 w-7"
        )}
        variant="outline"
        size="icon"
      >
        {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
      </Button>

      {/* Role Switcher */}
      <div className={cn("px-3 pb-2 mt-auto", collapsed && "px-2")}>
        {!collapsed && (
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]/50 transition-all border border-[var(--sidebar-border)]"
            >
              <span>{roleInfo.icon}</span>
              <span className="flex-1 text-left truncate">{currentUser.name}</span>
              <ChevronDown className={cn("size-3.5 transition-transform", roleMenuOpen && "rotate-180")} />
            </button>
            {roleMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden z-50">
                <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] border-b border-[var(--border)]">Switch Role</p>
                {(Object.keys(ROLE_CONFIG) as UserRole[]).map(role => (
                  <button
                    key={role}
                    onClick={() => { setRole(role); setRoleMenuOpen(false) }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--muted)]/50 transition-colors",
                      currentUser.role === role && "bg-[var(--primary)]/10 font-bold"
                    )}
                  >
                    <span>{ROLE_CONFIG[role].icon}</span>
                    <span className={cn("text-[var(--foreground)]", currentUser.role === role && ROLE_CONFIG[role].color)}>
                      {ROLE_CONFIG[role].label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={cn("px-3 pb-6", collapsed && "px-2")}>
        <Button
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[var(--muted-foreground)] transition-all duration-300 hover:bg-red-500/10 hover:text-red-400",
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
