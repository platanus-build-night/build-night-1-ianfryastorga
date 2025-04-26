"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface LevelStepperProps {
  courseId: string
  setId: string
  levels: {
    id: number
    title: string
    completed: boolean
    progress: number
  }[]
  className?: string
}

export function LevelStepper({ courseId, setId, levels, className }: LevelStepperProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {levels.map((level, index) => (
        <div key={level.id} className="space-y-1">
          <Link
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
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{level.progress}%</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
          <div className="pl-10 pr-3">
            <Progress value={level.progress} className="h-1" />
          </div>
        </div>
      ))}
    </div>
  )
}
