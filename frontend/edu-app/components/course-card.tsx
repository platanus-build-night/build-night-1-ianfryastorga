"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressRing } from "@/components/progress-ring"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface CourseCardProps {
  id: string
  title: string
  description: string
  progress: number
  color?: string
  className?: string
}

export function CourseCard({ id, title, description, progress, color = "#2065D1", className }: CourseCardProps) {
  return (
    <Card className={cn("card-hover overflow-hidden", className)}>
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }} />
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <ProgressRing progress={progress} size={50} color={color} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" style={{ backgroundColor: color }}>
          <Link href={`/course/${id}`} className="flex items-center justify-between">
            <span>Continuar</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
