"use client"

import Link from "next/link"
import { Check, Lock } from "lucide-react"
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
  // Encontrar el primer nivel no completado
  const firstIncompleteIndex = levels.findIndex((level) => !level.completed)

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {levels.map((level, index) => {
          const isLocked = !level.completed && index > firstIncompleteIndex
          const isActive = index === firstIncompleteIndex

          return (
            <Link
              key={level.id}
              href={isLocked ? "#" : `/course/${courseId}/set/${setId}/level/${level.id}`}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200",
                level.completed ? "bg-pastel-green border-pastel-green text-white" : "",
                isActive ? "bg-primary border-primary text-white" : "",
                isLocked
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
                  : "card-hover",
                !level.completed && !isActive && !isLocked ? "border-gray-300 hover:border-primary" : "",
              )}
            >
              {level.completed ? (
                <Check className="h-5 w-5" />
              ) : isLocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <span className="font-bold">{level.id}</span>
              )}
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {levels.map((level, index) => {
          const isLocked = !level.completed && index > firstIncompleteIndex
          const isActive = index === firstIncompleteIndex

          return (
            <div
              key={level.id}
              className={cn(
                "text-xs px-3 py-2 rounded border",
                level.completed ? "border-pastel-green/30 bg-pastel-green/10" : "",
                isActive ? "border-primary/30 bg-primary/10" : "",
                isLocked ? "border-gray-200 bg-gray-100 text-gray-400 dark:bg-gray-800 dark:border-gray-700" : "",
                !level.completed && !isActive && !isLocked ? "border-gray-300" : "",
              )}
            >
              <span className="font-medium">Nivel {level.id}:</span> {level.title}
            </div>
          )
        })}
      </div>
    </div>
  )
}
