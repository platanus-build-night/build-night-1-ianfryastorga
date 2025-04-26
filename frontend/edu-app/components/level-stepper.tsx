"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface LevelStepperProps {
  courseId: string
  setId: string
  levels: {
    id: number
    title: string
    completed: boolean
  }[]
  className?: string
}

export function LevelStepper({ courseId, setId, levels, className }: LevelStepperProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {levels.map((level, index) => (
        <Link
          key={level.id}
          href={`/course/${courseId}/set/${setId}/level/${level.id}`}
          className={cn(
            "flex items-center gap-3 py-2 px-3 rounded-md transition-colors cursor-pointer",
            level.completed
              ? "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400"
              : "hover:bg-muted"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium",
              level.completed
                ? "bg-green-600 dark:bg-green-400/20 text-white dark:text-green-400"
                : "bg-muted-foreground/20 text-muted-foreground"
            )}
          >
            {index + 1}
          </div>
          <span>{level.title}</span>
          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
        </Link>
      ))}
    </div>
  )
}
