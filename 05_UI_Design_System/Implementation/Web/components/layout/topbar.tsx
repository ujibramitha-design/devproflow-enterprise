"use client"

import { useState } from "react"
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

  const notifications = [
    { id: 1, title: "Pengajuan Baru", description: "Ada 3 pengajuan KPR baru", time: "5 menit lalu", unread: true },
    { id: 2, title: "Dokumen Terupload", description: "Customer mengupload dokumen", time: "1 jam lalu", unread: true },
    { id: 3, title: "Persetujuan Bank", description: "2 aplikasi disetujui bank", time: "2 jam lalu", unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="border-b border-devpro-border/40 bg-devpro-card/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-devpro-muted-foreground" />
            <Input
              placeholder="Cari pengajuan, customer, atau properti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-80 bg-devpro-background border-devpro-border/50 focus:border-devpro-primary"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="hidden md:flex"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-kprflow-error text-white text-xs flex items-center justify-center p-0">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold">
                Notifikasi
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount} baru
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4 cursor-pointer">
                  <div className="flex w-full justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-kprflow-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-kprflow-muted-foreground/60 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 rounded-full bg-kprflow-primary mt-1"></div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-kprflow-primary cursor-pointer">
                Lihat semua notifikasi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <div className="h-8 w-8 rounded-full kprflow-gradient flex items-center justify-center text-white font-semibold">
                  A
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-kprflow-muted-foreground">
                    admin@kprflow.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil Saya</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-kprflow-error">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
