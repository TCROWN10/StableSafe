"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface ProgressCircleProps {
  progress: number // 0-100
  size?: "sm" | "md" | "lg"
  className?: string
  children?: React.ReactNode
}

export function ProgressCircle({ progress, size = "md", className, children }: ProgressCircleProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  const strokeWidth = size === "sm" ? 3 : size === "md" ? 4 : 6
  const radius = size === "sm" ? 18 : size === "md" ? 24 : 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-accent transition-all duration-300 ease-in-out"
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  )
}
