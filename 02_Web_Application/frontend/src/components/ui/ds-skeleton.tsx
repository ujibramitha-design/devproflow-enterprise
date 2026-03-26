"use client"

import { cn } from "@/lib/utils"

export function DsSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-[var(--muted)]/60",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "before:animate-[shimmer_1.5s_infinite]",
        className
      )}
      {...props}
    />
  )
}

export function DsSkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <DsSkeleton className="h-4 w-24" />
        <DsSkeleton className="h-4 w-4 rounded" />
      </div>
      <DsSkeleton className="h-8 w-32" />
      <DsSkeleton className="h-3 w-40" />
    </div>
  )
}

export function DsSkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      <div className="p-4 border-b border-[var(--border)]">
        <DsSkeleton className="h-5 w-40" />
      </div>
      <div className="divide-y divide-[var(--border)]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <DsSkeleton className="h-4 w-4 rounded" />
            <DsSkeleton className="h-4 flex-1" />
            <DsSkeleton className="h-4 w-20" />
            <DsSkeleton className="h-4 w-16" />
            <DsSkeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function DsSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <DsSkeleton className="h-36 w-full rounded-none" />
          <div className="p-6 space-y-3">
            <DsSkeleton className="h-4 w-3/4" />
            <DsSkeleton className="h-3 w-1/2" />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <DsSkeleton className="h-10 rounded-lg" />
              <DsSkeleton className="h-10 rounded-lg" />
            </div>
            <DsSkeleton className="h-8 w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}
