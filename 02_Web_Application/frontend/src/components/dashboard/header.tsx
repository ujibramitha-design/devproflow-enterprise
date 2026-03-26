"use client"

import { Eye } from "lucide-react"
import Link from "next/link"
import DarkModeToggle from "@/components/ui/DarkModeToggle"
import { AnimatedLogo } from "@/components/ui/AnimatedLogo"
import { LiveClock } from "@/components/ui/LiveClock"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between devpro-animate-fade-in">
      <div className="flex flex-col gap-4">
        {/* Animated Logo */}
        <AnimatedLogo />
        
        {/* Status Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-700/50 text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            Enterprise v2.0
          </div>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700/50 text-[10px] font-bold text-green-700 dark:text-green-300 uppercase tracking-widest shadow-lg hover:shadow-green-500/20 transition-all duration-300">
            Live Sync
          </div>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-700/50 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
            Active
          </div>
        </div>
        
        {/* Description */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-tight mb-2">
            DevPro <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">Flow</span> Enterprise Dashboard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            Integrated enterprise control system for KPR applications, unit inventory, and cross-platform synchronization with real-time analytics.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-end">
        {/* Live Clock */}
        <LiveClock />
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <Link 
            href="/dashboard/bod"
            className="flex h-12 items-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 text-[13px] font-black text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
          >
            <Eye className="size-5" strokeWidth={2.5} />
            <span className="hidden sm:inline uppercase tracking-wider">System Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
