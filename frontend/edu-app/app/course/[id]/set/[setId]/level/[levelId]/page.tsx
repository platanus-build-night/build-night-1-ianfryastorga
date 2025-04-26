"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QuestionCard } from "@/components/question-card"
import { ChevronLeft, Keyboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { questionApi, Question, QuestionType } from "@/lib/api"
import { levelApi, Level } from "@/lib/api"

export default function LevelPage({
  params,
}: {
  params: { id: string; setId: string; levelId: string }
}) {
  const { id: courseId, setId, levelId } = params
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showTheory, setShowTheory] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [level, setLevel] = useState<Level | null>(null)
  const [theory, setTheory] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Obtener datos del nivel
        const levelData = await levelApi.getLevel(parseInt(levelId))
        setLevel(levelData)
        
        // Obtener preguntas para este nivel
        const questionsData = await questionApi.getQuestionsByLevel(parseInt(levelId))
        setQuestions(questionsData)
        
        // TODO: Cuando exista la API para obtener teoría, implementar aquí
        // Por ahora usamos una teoría de prueba basada en el título del nivel
        setTheory(`
## ${levelData.title}

Este es el contenido teórico para este nivel. El contenido real se implementará cuando la API de teoría esté disponible.

### Puntos clave:
1. Estudia el contenido detenidamente.
2. Intenta resolver los ejercicios por tu cuenta.
3. Revisa la teoría si tienes dudas al responder las preguntas.
        `)
        
        setError(null)
      } catch (err) {
        console.error("Error fetching level data:", err)
        setError("No se pudo cargar el nivel. Por favor, inténtalo de nuevo más tarde.")
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del nivel",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [levelId, toast])

  const handleQuestionSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      // Mostrar toast de éxito
      toast({
        title: "¡Respuesta correcta!",
        description: "Muy bien hecho. Sigue así.",
        variant: "success",
      })

      // Avanzar a la siguiente pregunta después de un breve retraso
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
      }, 1500)
    } else {
      // Mostrar toast de error
      toast({
        title: "Respuesta incorrecta",
        description: "Revisa la teoría e inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Cargando nivel...</p>
      </div>
    )
  }

  if (error || !level) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Nivel no encontrado</h1>
        <p className="mb-4 text-muted-foreground">{error || "No se encontró el nivel solicitado"}</p>
        <Button asChild>
          <Link href={`/course/${courseId}`}>Volver al curso</Link>
        </Button>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{level.title}</h1>
        <p className="mb-4 text-muted-foreground">Este nivel aún no tiene preguntas disponibles.</p>
        <Button asChild>
          <Link href={`/course/${courseId}`}>Volver al curso</Link>
        </Button>
      </div>
    )
  }

  // Adaptar la pregunta actual al formato esperado por QuestionCard
  const currentQuestion = questions[currentQuestionIndex];
  const formattedQuestion = {
    id: currentQuestion.id.toString(),
    prompt: currentQuestion.prompt,
    type: currentQuestion.type as "text" | "multiple-choice" | "code",
    options: currentQuestion.type === QuestionType.MULTIPLE_CHOICE ? 
      JSON.parse(currentQuestion.options || '[]') : 
      undefined,
    answer: currentQuestion.answer
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/course/${courseId}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al curso
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </span>
          <div className="w-32 bg-muted h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-200"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <QuestionCard question={formattedQuestion} onSubmit={handleQuestionSubmit} />
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 z-10"
            onClick={() => setShowTheory(!showTheory)}
          >
            {showTheory ? "Ocultar teoría" : "Mostrar teoría"}
          </Button>

          <Card
            className={cn(
              "sticky top-20 transition-all duration-200 overflow-hidden",
              showTheory ? "max-h-[calc(100vh-10rem)]" : "max-h-12",
            )}
          >
            <CardContent
              className={cn(
                "p-6 prose dark:prose-invert max-w-none overflow-auto",
                showTheory ? "max-h-[calc(100vh-12rem)]" : "max-h-0 p-0",
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: theory }} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
        <Keyboard className="h-4 w-4" />
        <span>
          Atajos: Presiona <kbd className="px-1 py-0.5 bg-muted rounded border">Enter</kbd> para enviar,{" "}
          <kbd className="px-1 py-0.5 bg-muted rounded border">Tab</kbd> +{" "}
          <kbd className="px-1 py-0.5 bg-muted rounded border">Enter</kbd> para la siguiente pregunta
        </span>
      </div>
    </div>
  )
}
