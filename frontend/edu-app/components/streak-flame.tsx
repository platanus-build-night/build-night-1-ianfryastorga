"use client"

import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface StreakFlameProps {
  streak: number
  className?: string
}

export function StreakFlame({ streak, className }: StreakFlameProps) {
  const [wiggle, setWiggle] = useState(false)

  useEffect(() => {
    // Hacer que la llama se mueva cada 10 segundos
    const interval = setInterval(() => {
      setWiggle(true)
      setTimeout(() => setWiggle(false), 1000)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Determinar el color de la llama basado en el streak
  const getFlameColor = () => {
    if (streak === 0) return "text-gray-400"
    if (streak < 3) return "text-pastel-yellow"
    if (streak < 7) return "text-orange-400"
    return "text-red-500"
  }

  return (
    <div className="flex items-center gap-1">
      <Flame
        className={cn(
          "h-5 w-5 transition-all duration-200",
          getFlameColor(),
          wiggle ? "animate-wiggle" : "",
          className,
        )}
      />
      <span className="rounded-number text-lg">{streak}</span>
    </div>
  )
}
