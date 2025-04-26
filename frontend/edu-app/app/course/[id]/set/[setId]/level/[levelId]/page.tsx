"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QuestionCard } from "@/components/question-card"
import { ChevronLeft, Keyboard, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { questionApi, Question, QuestionType } from "@/lib/api"
import { levelApi, Level } from "@/lib/api"

interface UserAnswer {
  questionId: number;
  answer: string;
  isCorrect: boolean;
}

export default function LevelPage({
  params,
}: {
  params: { id: string; setId: string; levelId: string }
}) {
  // Acceder a los parámetros directamente sin usar use()
  const courseId = params.id;
  const setId = params.setId;
  const levelId = params.levelId;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showTheory, setShowTheory] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [level, setLevel] = useState<Level | null>(null)
  const [theory, setTheory] = useState<string>("")
  const [hasTheory, setHasTheory] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false)
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
        
        // Verificar si el nivel tiene contenido teórico
        if (levelData.theoryContent) {
          setTheory(levelData.theoryContent)
          setHasTheory(true)
        } else {
          // Crear contenido de teoría genérico si no existe
          setTheory(`
## ${levelData.title}

Este nivel no contiene teoría detallada.
          `)
          setHasTheory(false)
        }
        
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

  useEffect(() => {
    // Verificar si todas las preguntas han sido respondidas
    if (userAnswers.length > 0 && userAnswers.length === questions.length) {
      setAllQuestionsAnswered(true)
    }
  }, [userAnswers, questions])

  const handleQuestionSubmit = (isCorrect: boolean, userAnswer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Guardar la respuesta del usuario
    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        answer: userAnswer,
        isCorrect: isCorrect
      }
    ])
    
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

  // Verificar si esta pregunta ya fue respondida
  const isAnswered = userAnswers.some(answer => answer.questionId === currentQuestion.id);

  // Calcular progreso de preguntas respondidas
  const progressPercentage = (userAnswers.length / questions.length) * 100;

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
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <QuestionCard 
            question={formattedQuestion} 
            onSubmit={(isCorrect, userAnswer) => handleQuestionSubmit(isCorrect, userAnswer)} 
            isAnswered={isAnswered}
          />

          {allQuestionsAnswered && (
            <div className="mt-6 text-center">
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                <CardContent className="p-4 flex flex-col items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <p className="font-medium">¡Has completado todas las preguntas de este nivel!</p>
                  <Button asChild>
                    <Link href={`/course/${courseId}`}>Volver al curso</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {hasTheory && (
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
        )}
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
