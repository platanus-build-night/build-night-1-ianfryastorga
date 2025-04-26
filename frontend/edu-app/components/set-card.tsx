"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LevelStepper } from "@/components/level-stepper"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface SetCardProps {
  id: string
  courseId: string
  title: string
  description: string
  levels: {
    id: number
    title: string
    completed: boolean
    progress: number
  }[]
  className?: string
}

export function SetCard({ id, courseId, title, description, levels, className }: SetCardProps) {
  const totalProgress = levels.reduce((sum, level) => sum + level.progress, 0);
  const progress = levels.length === 0 ? 0 : Math.round(totalProgress / levels.length);

  return (
    <Accordion type="single" collapsible className={cn("w-full", className)}>
      <AccordionItem value={id} className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium">{title}</span>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                {progress}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2">
          {levels.length === 0 ? (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">Este conjunto aún no tiene niveles disponibles.</p>
            </div>
          ) : (
            <LevelStepper courseId={courseId} setId={id} levels={levels} />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
