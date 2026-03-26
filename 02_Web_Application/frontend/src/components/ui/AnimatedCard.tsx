"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  delay?: number
}

export function AnimatedCard({ 
  children, 
  className, 
  hover = true,
  glow = true,
  delay = 0 
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-500 transform-gpu",
        hover && "hover:scale-[1.02] hover:-translate-y-1",
        glow && "hover:shadow-2xl",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/10 before:to-blue-500/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Border */}
      <div className={cn(
        "absolute inset-0 rounded-lg border-2 border-transparent transition-all duration-500",
        isHovered && "border-purple-500/50 shadow-lg shadow-purple-500/20"
      )} />

      {/* Floating Particles */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-2 w-1 h-1 bg-purple-400 rounded-full animate-ping" />
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping animation-delay-200" />
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-ping animation-delay-400" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  )
}

interface AnimatedCardHeaderProps {
  title: string
  badge?: string
  icon?: React.ReactNode
  className?: string
}

export function AnimatedCardHeader({ 
  title, 
  badge, 
  icon, 
  className 
}: AnimatedCardHeaderProps) {
  return (
    <CardHeader className={cn("pb-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-700/50">
              {icon}
            </div>
          )}
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </CardTitle>
        </div>
        {badge && (
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-700/50 text-purple-700 dark:text-purple-300 hover:scale-105 transition-transform duration-200"
          >
            {badge}
          </Badge>
        )}
      </div>
    </CardHeader>
  )
}

interface AnimatedCardContentProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedCardContent({ children, className }: AnimatedCardContentProps) {
  return (
    <CardContent className={cn("pt-0", className)}>
      <div className="space-y-4">
        {children}
      </div>
    </CardContent>
  )
}
