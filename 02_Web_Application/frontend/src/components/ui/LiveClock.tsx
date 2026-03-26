"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar } from "lucide-react"

export function LiveClock() {
  const [time, setTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-500">Loading...</span>
      </div>
    )
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="flex items-center gap-3">
      {/* Clock Display */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-purple-200 dark:border-purple-500/30 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group">
        <div className="relative">
          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900 dark:text-white font-mono">
            {formatTime(time)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Time Zone Indicator */}
      <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </span>
      </div>
    </div>
  )
}
