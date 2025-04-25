"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QuestionCard } from "@/components/question-card"
import { ChevronLeft, Keyboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo
const questionsData = {
  "math-101": {
    algebra: {
      1: [
        {
          id: "q1",
          prompt: "¿Qué es una variable en álgebra?",
          type: "multiple-choice" as const,
          options: [
            "Un número específico que nunca cambia",
            "Un símbolo que representa un valor desconocido",
            "Una operación matemática",
            "Un tipo de ecuación",
          ],
          answer: "Un símbolo que representa un valor desconocido",
        },
        {
          id: "q2",
          prompt: "Si x = 5, ¿cuál es el valor de 2x + 3?",
          type: "text" as const,
          answer: "13",
        },
      ],
      2: [
        {
          id: "q1",
          prompt: "Resuelve la ecuación: 3x - 7 = 8",
          type: "text" as const,
          answer: "5",
        },
      ],
    },
  },
  "prog-101": {
    basics: {
      1: [
        {
          id: "q1",
          prompt: "¿Cómo se declara una variable en JavaScript?",
          type: "multiple-choice" as const,
          options: ["var nombre = valor;", "variable nombre = valor;", "v nombre = valor;", "let nombre: valor;"],
          answer: "var nombre = valor;",
        },
        {
          id: "q2",
          prompt: "Escribe un código que declare una constante llamada PI con valor 3.14",
          type: "code" as const,
          answer: "const PI = 3.14;",
        },
      ],
    },
  },
}

// Datos de teoría
const theoryData = {
  "math-101": {
    algebra: {
      1: `
## Variables en Álgebra

Una **variable** es un símbolo (generalmente una letra) que representa un valor desconocido o que puede cambiar.

### Ejemplos:
- En la expresión $x + 5 = 10$, la variable es $x$.
- El valor de $x$ en este caso es $5$, porque $5 + 5 = 10$.

### Propiedades:
1. Las variables pueden tomar diferentes valores.
2. En una ecuación, buscamos el valor específico que hace que la ecuación sea verdadera.
3. Las variables se pueden usar para representar patrones y generalizar relaciones.
      `,
      2: `
## Ecuaciones Lineales

Una **ecuación lineal** es una ecuación donde la variable tiene exponente 1.

### Forma general:
$ax + b = c$, donde $a$, $b$ y $c$ son constantes y $a ≠ 0$.

### Pasos para resolver:
1. Agrupar términos con la variable en un lado.
2. Agrupar términos constantes en el otro lado.
3. Dividir ambos lados por el coeficiente de la variable.

### Ejemplo:
Para resolver $3x - 7 = 8$:
1. Sumar 7 a ambos lados: $3x = 15$
2. Dividir ambos lados por 3: $x = 5$
      `,
    },
  },
  "prog-101": {
    basics: {
      1: `
## Variables en JavaScript

En JavaScript, las variables son contenedores para almacenar datos.

### Formas de declarar variables:
\`\`\`javascript
// Usando var (tradicional)
var nombre = "Juan";

// Usando let (ES6, recomendado)
let edad = 25;

// Usando const (para valores que no cambiarán)
const PI = 3.14;
\`\`\`

### Tipos de datos:
- String: \`"Hola mundo"\`
- Number: \`42\` o \`3.14\`
- Boolean: \`true\` o \`false\`
- Object: \`{nombre: "Juan", edad: 25}\`
- Array: \`[1, 2, 3, 4]\`
- Null: \`null\`
- Undefined: \`undefined\`
      `,
    },
  },
}

export default function LevelPage({
  params,
}: {
  params: { id: string; setId: string; levelId: string }
}) {
  const { id: courseId, setId, levelId } = params
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showTheory, setShowTheory] = useState(true)
  const { toast } = useToast()

  // Obtener preguntas para este nivel
  const questions =
    questionsData[courseId as keyof typeof questionsData]?.[setId as any]?.[Number.parseInt(levelId) as any] || []

  // Obtener teoría para este nivel
  const theory =
    theoryData[courseId as keyof typeof theoryData]?.[setId as any]?.[Number.parseInt(levelId) as any] || ""

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

  if (!questions.length) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Nivel no encontrado</h1>
        <Button asChild>
          <Link href={`/course/${courseId}`}>Volver al curso</Link>
        </Button>
      </div>
    )
  }

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
          <QuestionCard question={questions[currentQuestionIndex]} onSubmit={handleQuestionSubmit} />
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
