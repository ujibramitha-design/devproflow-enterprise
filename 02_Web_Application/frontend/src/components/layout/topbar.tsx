"use client"

import { useState, useEffect } from "react"
import { Bell, Search, User, Moon, Sun, Menu, X, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

export function DevProTopbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const notifications = [
    { id: 1, title: "New Application", description: "3 new KPR applications received", time: "5m ago", unread: true },
    { id: 2, title: "Document Uploaded", description: "Customer uploaded income statement", time: "1h ago", unread: true },
    { id: 3, title: "Bank Approval", description: "2 applications approved by Bank Mandiri", time: "2h ago", unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col">
            <span className="text-devpro-neon font-mono text-lg font-bold tracking-wider">
              {mounted ? formatTime(currentTime) : "00:00:00"}
            </span>
            <span className="text-[10px] text-devpro-text-secondary font-medium uppercase tracking-tighter">
              {mounted ? formatDate(currentTime) : "---, --- --, ----"}
            </span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-devpro-text-secondary" />
            <Input
              placeholder="Search applications, units, or customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-80 bg-devpro-charcoal/50 border-devpro-charcoal text-devpro-text-primary placeholder:text-devpro-text-secondary/50 focus:border-devpro-neon/50 focus:ring-devpro-neon/20 rounded-xl"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title={mounted ? (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode') : 'Toggle Theme'}
          >
            {mounted && theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-blue-500" />
            )}
          </Button>

          {/* Sync Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--muted)]/50 border border-emerald-500/20">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Systems Synced</span>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-devpro-charcoal text-devpro-text-secondary hover:text-devpro-neon">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-devpro-neon opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-devpro-neon"></span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-devpro-charcoal border-devpro-navy text-devpro-text-primary rounded-xl shadow-2xl">
              <DropdownMenuLabel className="font-bold border-b border-devpro-navy/50 pb-2">
                Notifications
              </DropdownMenuLabel>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4 focus:bg-devpro-navy/50 cursor-pointer border-b border-devpro-navy/20 last:border-0">
                  <div className="flex w-full justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-sm text-devpro-text-primary">{notification.title}</p>
                      <p className="text-xs text-devpro-text-secondary mt-1">
                        {notification.description}
                      </p>
                      <p className="text-[10px] text-devpro-neon/60 mt-2 font-medium">
                        {notification.time}
                      </p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 rounded-full bg-devpro-neon mt-1 shadow-[0_0_8px_rgba(0,255,204,0.6)]"></div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem className="text-center justify-center text-devpro-neon font-bold text-xs py-3 focus:bg-devpro-navy/50">
                VIEW ALL ALERTS
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-xl p-0 hover:bg-transparent">
                <div className="h-10 w-10 rounded-xl bg-devpro-charcoal border border-devpro-charcoal/50 flex items-center justify-center text-devpro-neon font-bold shadow-lg transition-transform hover:scale-105 active:scale-95">
                  JD
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-devpro-charcoal border-devpro-navy text-devpro-text-primary rounded-xl shadow-2xl">
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold text-devpro-text-primary">John Doe</p>
                  <p className="text-xs text-devpro-text-secondary">
                    Enterprise Administrator
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-devpro-navy/50" />
              <DropdownMenuItem className="focus:bg-devpro-navy/50 p-3">
                <User className="mr-3 h-4 w-4 text-devpro-neon" />
                <span className="text-sm font-medium">Account Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-devpro-navy/50 p-3">
                <Settings className="mr-3 h-4 w-4 text-devpro-neon" />
                <span className="text-sm font-medium">System Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-devpro-navy/50" />
              <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 p-3">
                <LogOut className="mr-3 h-4 w-4" />
                <span className="text-sm font-bold">Terminate Session</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
