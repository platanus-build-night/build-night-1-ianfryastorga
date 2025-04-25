"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LevelStepper } from "@/components/level-stepper"
import { cn } from "@/lib/utils"

interface SetCardProps {
  id: string
  courseId: string
  title: string
  description: string
  levels: {
    id: number
    title: string
    completed: boolean
  }[]
  className?: string
}

export function SetCard({ id, courseId, title, description, levels, className }: SetCardProps) {
  const completedLevels = levels.filter((level) => level.completed).length
  const progress = Math.round((completedLevels / levels.length) * 100)

  return (
    <Accordion type="single" collapsible className={cn("w-full", className)}>
      <AccordionItem value={id} className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium">{title}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{progress}%</span>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2">
          <LevelStepper courseId={courseId} setId={id} levels={levels} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
