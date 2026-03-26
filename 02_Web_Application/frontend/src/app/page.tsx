"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCardsLive } from "@/components/dashboard/kpi-cards-live"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { RealTimeUnits } from "@/components/dashboard/real-time-units"
import { FirebaseStats } from "@/components/dashboard/firebase-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedCard, AnimatedCardHeader, AnimatedCardContent } from "@/components/ui/AnimatedCard"
import DarkModeToggle from "@/components/ui/DarkModeToggle"
import { ShieldCheck, Activity, Bell, Zap, Cloud, BarChart3, ArrowRight, Database, Phone, FileText, Building2, Users, Settings, Sparkles, Cpu, Globe, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 min-h-screen transition-all duration-500">
      <DashboardHeader />

      <KpiCardsLive />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <RecentApplications />
          
          <div className="grid gap-6 sm:grid-cols-2">
            <AnimatedCard delay={100}>
              <AnimatedCardHeader 
                title="System Integration" 
                badge="Active"
                icon={<Database className="size-5 text-purple-600 dark:text-purple-400" />}
              />
              <AnimatedCardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-2">
                      <Cloud className="size-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-tight">Cloud Sync Engine</p>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium">Real-time synchronization active across Mobile, Web, and Desktop platforms.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="size-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-tight">API Gateway Status</p>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium">Enterprise API Gateway processing requests with 99.9% uptime stability.</p>
                  </div>
                </div>
              </AnimatedCardContent>
            </AnimatedCard>

            <AnimatedCard delay={200}>
              <AnimatedCardHeader 
                title="Node Performance" 
                badge="Optimal"
                icon={<Activity className="size-5 text-purple-600 dark:text-purple-400" />}
              />
              <AnimatedCardContent>
                <div className="space-y-5">
                  {[
                    { label: "Core API Latency", load: "14ms", color: "bg-gradient-to-r from-purple-500 to-blue-500", textColor: "text-purple-600 dark:text-purple-400" },
                    { label: "DB Read/Write Ops", load: "28ms", color: "bg-gradient-to-r from-green-500 to-emerald-500", textColor: "text-green-600 dark:text-green-400" },
                    { label: "Sync Buffer Load", load: "12%", color: "bg-gradient-to-r from-purple-500 to-blue-500", textColor: "text-purple-600 dark:text-purple-400" },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight">{item.label}</span>
                        <span className={cn("text-[10px] font-mono font-bold", item.textColor)}>{item.load}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000 shadow-lg", item.color)} 
                          style={{ width: item.load.includes('%') ? item.load : '85%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedCardContent>
            </AnimatedCard>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <AnimatedCard delay={300}>
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50" />
              <AnimatedCardHeader 
                title="Control Panel" 
                icon={<BarChart3 className="size-5 text-purple-600 dark:text-purple-400" />}
              />
              <CardContent className="px-6 pb-8 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">Enterprise module quick-access gateway</p>
                <div className="grid gap-2.5">
                  {[
                    { label: "KPR Applications", href: "/aplikasi", icon: FileText },
                    { label: "Unit Management", href: "/unit", icon: Building2 },
                    { label: "Customer CRM", href: "/customer", icon: Users },
                    { label: "BOD Analytics", href: "/dashboard/bod", icon: BarChart3 },
                    { label: "System Settings", href: "/settings", icon: Settings },
                  ].map((btn) => (
                    <Link key={btn.label} href={btn.href} className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-500/20">
                      <div className="flex items-center gap-3">
                        <btn.icon className="size-4 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" />
                        <span className="font-bold text-[11px] text-gray-900 dark:text-white uppercase tracking-wide group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">{btn.label}</span>
                      </div>
                      <ArrowRight className="size-3.5 text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-all group-hover:text-purple-600 dark:group-hover:text-purple-400 duration-300" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={400}>
            <AnimatedCardHeader 
              title="Security Status" 
              icon={<ShieldCheck className="size-5 text-purple-600 dark:text-purple-400" />}
            />
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase">Encryption</span>
                </div>
                <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">AES-256 Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase">Firewall</span>
                </div>
                <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">Optimal</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/50 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase">Monitoring</span>
                </div>
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">24/7 Active</span>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>
      </div>
    </div>
  )
}
