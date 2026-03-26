"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

export function LiveClock() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!time) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-devpro-secondary/40 px-3 py-1.5 min-w-[140px]">
        <Clock className="size-3.5 text-devpro-muted-foreground/50" />
        <div className="h-4 w-20 rounded bg-devpro-muted/50 animate-pulse" />
      </div>
    )
  }

  const hours = time.getHours().toString().padStart(2, "0")
  const minutes = time.getMinutes().toString().padStart(2, "0")
  const seconds = time.getSeconds().toString().padStart(2, "0")
  
  const dayName = time.toLocaleDateString("id-ID", { weekday: "short" })
  const dateStr = time.toLocaleDateString("id-ID", { day: "numeric", month: "short" })

  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-devpro-secondary/40 px-3 py-1.5 transition-colors duration-300 hover:bg-devpro-secondary/60">
      <div className="relative">
        <Clock className="size-3.5 text-devpro-primary/70" strokeWidth={2} />
        <div className="absolute inset-0 rounded-full bg-devpro-primary/20 devpro-animate-pulse" />
      </div>
      <div className="flex items-baseline gap-0.5 font-mono text-[13px] font-bold text-devpro-foreground">
        <span>{hours}</span>
        <span className="text-devpro-primary/60">:</span>
        <span>{minutes}</span>
        <span className="text-devpro-primary/60">:</span>
        <span key={seconds} className="devpro-animate-fade-in">{seconds}</span>
      </div>
      <div className="h-3.5 w-px bg-devpro-border/50" />
      <span className="text-[11px] font-semibold text-devpro-muted-foreground whitespace-nowrap uppercase">
        {dayName}, {dateStr}
      </span>
    </div>
  )
}
