"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, BookOpen, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  id: string
  title: string
  description: string
  progress: number
  color?: string
  className?: string
}

export function CourseCard({ id, title, description, progress, color = "#2065D1", className }: CourseCardProps) {
  // Limitar descripción a 100 caracteres
  const shortDescription = description.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;
  
  // Colores de fondo para la tarjeta basados en el color principal
  const bgColorClass = `bg-${color.replace('#', '')}-50`;
  const defaultBgClass = "bg-blue-50 dark:bg-blue-900/20";
  
  return (
    <Link href={`/course/${id}`}>
      <Card 
        className={cn(
          "group transition-all hover:shadow-md h-full overflow-hidden border-t-4",
          className
        )}
        style={{ borderTopColor: color }}
      >
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{title}</h3>
              <div 
                className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                <BookOpen className="h-4 w-4" style={{ color }} />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-3">{shortDescription}</p>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {progress === 100 && (
              <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Completado</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
