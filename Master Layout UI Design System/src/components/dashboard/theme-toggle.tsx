
"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="size-9 rounded-xl bg-secondary/50" />

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex size-9 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-foreground"
      aria-label="Toggle theme"
    >
      {isDark ? <Moon className="size-[15px]" strokeWidth={1.8} /> : <Sun className="size-[15px]" strokeWidth={1.8} />}
    </button>
  )
}
