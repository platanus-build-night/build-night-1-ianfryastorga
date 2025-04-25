"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"
import confetti from "canvas-confetti"

interface QuestionCardProps {
  question: {
    id: string
    prompt: string
    type: "text" | "multiple-choice" | "code"
    options?: string[]
    answer: string
  }
  onSubmit: (isCorrect: boolean) => void
  className?: string
}

export function QuestionCard({ question, onSubmit, className }: QuestionCardProps) {
  const [userAnswer, setUserAnswer] = useState("")
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)

  const handleSubmit = () => {
    const answer = question.type === "multiple-choice" ? selectedOption : userAnswer
    const isCorrect = answer?.toLowerCase() === question.answer.toLowerCase()

    setFeedback(isCorrect ? "correct" : "incorrect")

    if (isCorrect) {
      // Lanzar confeti cuando la respuesta es correcta
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    onSubmit(isCorrect)
  }

  const renderInput = () => {
    switch (question.type) {
      case "text":
        return (
          <Input
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Tu respuesta..."
            className="w-full"
            disabled={feedback !== null}
          />
        )
      case "multiple-choice":
        return (
          <div className="grid gap-2">
            {question.options?.map((option) => (
              <Button
                key={option}
                type="button"
                variant={selectedOption === option ? "default" : "outline"}
                className={cn(
                  "justify-start text-left",
                  feedback === "correct" && option === question.answer ? "bg-pastel-green text-white" : "",
                  feedback === "incorrect" && option === selectedOption ? "bg-destructive text-white" : "",
                  feedback === "incorrect" && option === question.answer ? "border-pastel-green text-pastel-green" : "",
                )}
                onClick={() => feedback === null && setSelectedOption(option)}
                disabled={feedback !== null}
              >
                {option}
              </Button>
            ))}
          </div>
        )
      case "code":
        return (
          <Textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Escribe tu código aquí..."
            className="font-mono h-32"
            disabled={feedback !== null}
          />
        )
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl">{question.prompt}</CardTitle>
      </CardHeader>
      <CardContent>{renderInput()}</CardContent>
      <CardFooter className="flex justify-between">
        {feedback && (
          <div
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              feedback === "correct" ? "text-pastel-green" : "text-destructive",
            )}
          >
            {feedback === "correct" ? (
              <>
                <Check className="h-4 w-4" />
                <span>¡Correcto!</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4" />
                <span>Incorrecto. La respuesta correcta es: {question.answer}</span>
              </>
            )}
          </div>
        )}
        <Button
          onClick={handleSubmit}
          disabled={feedback !== null || (!userAnswer && !selectedOption)}
          className={cn(
            feedback === "correct" ? "bg-pastel-green hover:bg-pastel-green/90" : "",
            feedback === "incorrect" ? "bg-destructive hover:bg-destructive/90" : "",
          )}
        >
          Comprobar
        </Button>
      </CardFooter>
    </Card>
  )
}
