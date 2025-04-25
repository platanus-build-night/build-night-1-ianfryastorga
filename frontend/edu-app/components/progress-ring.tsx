"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  color?: string
  animate?: boolean
}

export function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  className,
  color = "#2065D1",
  animate = true,
}: ProgressRingProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  // Calcular el radio y la circunferencia
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  // Calcular el valor del trazo
  const strokeDashoffset = circumference - (displayProgress / 100) * circumference

  useEffect(() => {
    if (animate) {
      // Animación del progreso
      const timer = setTimeout(() => {
        if (displayProgress < progress) {
          setDisplayProgress((prev) => Math.min(prev + 1, progress))
        }
      }, 20)

      return () => clearTimeout(timer)
    } else {
      setDisplayProgress(progress)
    }
  }, [displayProgress, progress, animate])

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Círculo de fondo */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E6E6E6" strokeWidth={strokeWidth} />

        {/* Círculo de progreso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-200"
        />
      </svg>

      {/* Texto de porcentaje */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold rounded-number">{displayProgress}%</span>
      </div>
    </div>
  )
}
