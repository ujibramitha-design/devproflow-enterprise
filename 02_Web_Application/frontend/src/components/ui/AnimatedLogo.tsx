"use client"

import { useState, useEffect } from "react"
import { Shield, Sparkles } from "lucide-react"

export function AnimatedLogo() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex items-center gap-3 group">
      {/* 3D Logo Container */}
      <div 
        className="relative w-12 h-12 flex items-center justify-center"
        onMouseEnter={() => setIsAnimating(true)}
        onMouseLeave={() => setIsAnimating(false)}
        style={{
          transform: `perspective(1000px) rotateY(${rotation}deg) rotateX(${isAnimating ? -10 : 0}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Main Shield */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg shadow-purple-500/30 flex items-center justify-center">
          <Shield className="w-7 h-7 text-white" />
        </div>
        
        {/* Sparkle Effects */}
        {isAnimating && (
          <>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
          </>
        )}

        {/* 3D Depth Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-700 rounded-xl opacity-50 blur-sm transform translate-z-[-20px]" />
      </div>

      {/* Company Name with Animation */}
      <div className="flex flex-col">
        <h1 className="text-xl font-black text-gray-900 dark:text-white transition-colors duration-300">
          DevPro
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-600 ml-1">
            Flow
          </span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
          Enterprise System
        </p>
      </div>

      {/* Floating Particles */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute top-0 right-0 w-4 h-4 text-purple-400 animate-spin" />
          <Sparkles className="absolute bottom-0 left-0 w-3 h-3 text-blue-400 animate-pulse" />
        </div>
      )}
    </div>
  )
}
