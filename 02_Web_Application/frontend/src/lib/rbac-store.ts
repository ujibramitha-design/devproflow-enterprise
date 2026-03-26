"use client"

import { create } from "zustand"

// ── 6 Role Utama KPRFlow Enterprise ──────────────────────────────────────────
export type UserRole = "executive" | "marketing" | "legal" | "finance" | "estate" | "admin"

export interface RBACUser {
  name: string
  role: UserRole
  avatar: string
}

export const ROLE_CONFIG: Record<UserRole, { label: string; color: string; icon: string }> = {
  executive:  { label: "Executive / BOD",        color: "text-amber-400",   icon: "👑" },
  marketing:  { label: "Marketing & Sales",      color: "text-emerald-400", icon: "📢" },
  legal:      { label: "Legal & Pemberkasan",    color: "text-violet-400",  icon: "⚖️" },
  finance:    { label: "Finance",                color: "text-blue-400",    icon: "💰" },
  estate:     { label: "Estate & Engineering",   color: "text-orange-400",  icon: "🏗️" },
  admin:      { label: "Admin & System",         color: "text-cyan-400",    icon: "⚙️" },
}

// ── Menu items per role ──────────────────────────────────────────────────────
export interface MenuItem {
  icon: string       // lucide icon name
  label: string
  href: string
  roles: UserRole[]  // which roles see this item
  section?: string   // group header
}

export const MENU_ITEMS: MenuItem[] = [
  // Universal
  { icon: "LayoutDashboard", label: "Dashboard",         href: "/",                    roles: ["executive","marketing","legal","finance","estate","admin"] },

  // Executive
  { icon: "PieChart",        label: "Executive (BOD)",   href: "/dashboard/bod",       roles: ["executive","admin"], section: "Executive" },

  // Marketing
  { icon: "Zap",             label: "Marketing Panel",   href: "/dashboard/marketing", roles: ["marketing","executive","admin"], section: "Marketing" },
  { icon: "Building2",       label: "Data Unit",         href: "/unit",                roles: ["marketing","executive","estate","admin"] },
  { icon: "Users",           label: "Customer DB",       href: "/customer",            roles: ["marketing","executive","admin"] },

  // Legal
  { icon: "Gavel",           label: "Legal Workflow",    href: "/dashboard/legal",     roles: ["legal","executive","admin"], section: "Legal" },
  { icon: "FileText",        label: "Aplikasi KPR",      href: "/aplikasi",            roles: ["legal","marketing","finance","admin"] },

  // Finance
  { icon: "Wallet",          label: "Finance Hub",       href: "/dashboard/finance",   roles: ["finance","executive","admin"], section: "Finance" },

  // Estate & Engineering
  { icon: "HardHat",         label: "Estate & Eng.",     href: "/dashboard/engineering", roles: ["estate","executive","admin"], section: "Estate" },

  // Admin & System
  { icon: "Scan",            label: "AI Scanner",        href: "/scanner",             roles: ["admin","legal","marketing"], section: "System" },
  { icon: "Mail",            label: "Email Scanner",     href: "/email-scanner",       roles: ["admin"] },
  { icon: "ShieldCheck",     label: "Audit Security",    href: "/audit",               roles: ["admin","executive"] },
  { icon: "Settings",        label: "Pengaturan",        href: "/settings",            roles: ["admin"] },
]

// ── Zustand Store ────────────────────────────────────────────────────────────
interface RBACStore {
  currentUser: RBACUser
  setRole: (role: UserRole) => void
  getVisibleMenuItems: () => MenuItem[]
}

export const useRBACStore = create<RBACStore>((set, get) => ({
  currentUser: {
    name: "Admin Enterprise",
    role: "admin",
    avatar: "AE",
  },

  setRole: (role) => set({
    currentUser: {
      ...get().currentUser,
      role,
      name: ROLE_CONFIG[role].label,
      avatar: ROLE_CONFIG[role].label.substring(0, 2).toUpperCase(),
    },
  }),

  getVisibleMenuItems: () => {
    const role = get().currentUser.role
    // Admin sees everything
    if (role === "admin") return MENU_ITEMS
    return MENU_ITEMS.filter(item => item.roles.includes(role))
  },
}))
