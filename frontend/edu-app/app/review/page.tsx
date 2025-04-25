"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

// Datos de ejemplo
const mistakesData = [
  {
    id: "m1",
    courseId: "math-101",
    courseName: "Matemáticas Básicas",
    setId: "algebra",
    setName: "Álgebra Básica",
    question: "Resuelve la ecuación: 2x + 5 = 13",
    userAnswer: "6",
    correctAnswer: "4",
    explanation:
      "Para resolver 2x + 5 = 13, primero restamos 5 de ambos lados: 2x = 8. Luego dividimos ambos lados por 2: x = 4.",
  },
  {
    id: "m2",
    courseId: "prog-101",
    courseName: "Introducción a JavaScript",
    setId: "basics",
    setName: "Fundamentos",
    question: "¿Cuál es el resultado de '5' + 2 en JavaScript?",
    userAnswer: "7",
    correctAnswer: "52",
    explanation:
      "En JavaScript, cuando se usa el operador + con un string y un número, el número se convierte a string y se concatenan. Por lo tanto, '5' + 2 resulta en '52'.",
  },
  {
    id: "m3",
    courseId: "math-101",
    courseName: "Matemáticas Básicas",
    setId: "geometry",
    setName: "Geometría",
    question: "¿Cuál es el área de un círculo con radio 3?",
    userAnswer: "9π",
    correctAnswer: "9π",
    explanation: "El área de un círculo se calcula con la fórmula A = πr². Con r = 3, tenemos A = π(3)² = 9π.",
  },
]

export default function ReviewPage() {
  const [mistakes, setMistakes] = useState(mistakesData)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const courses = Array.from(new Set(mistakes.map((m) => m.courseId)))
  const sets = Array.from(new Set(mistakes.map((m) => m.setId)))

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const filteredMistakes = mistakes.filter(
    (mistake) =>
      activeFilters.length === 0 || activeFilters.includes(mistake.courseId) || activeFilters.includes(mistake.setId),
  )

  const handleRemoveMistake = (id: string) => {
    setMistakes((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Revisar Errores</h1>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Filtrar por:</h2>
        <div className="flex flex-wrap gap-2">
          {courses.map((courseId) => {
            const course = mistakes.find((m) => m.courseId === courseId)
            return (
              <Badge
                key={courseId}
                variant={activeFilters.includes(courseId) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFilter(courseId)}
              >
                {course?.courseName}
              </Badge>
            )
          })}

          {sets.map((setId) => {
            const set = mistakes.find((m) => m.setId === setId)
            return (
              <Badge
                key={setId}
                variant={activeFilters.includes(setId) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFilter(setId)}
              >
                {set?.setName}
              </Badge>
            )
          })}

          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setActiveFilters([])} className="text-xs h-6">
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {filteredMistakes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No hay errores para revisar</h2>
          <p className="text-muted-foreground">
            {mistakes.length > 0
              ? "Ajusta los filtros para ver tus errores"
              : "¡Buen trabajo! No tienes errores para revisar"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((mistake) => (
            <Card key={mistake.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{mistake.question}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{mistake.courseName}</Badge>
                    <Badge variant="outline">{mistake.setName}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5 text-destructive" />
                      <span className="font-medium">Tu respuesta:</span>
                    </div>
                    <div className="p-3 bg-destructive/10 rounded-md border border-destructive/20">
                      {mistake.userAnswer}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-pastel-green" />
                      <span className="font-medium">Respuesta correcta:</span>
                    </div>
                    <div className="p-3 bg-pastel-green/10 rounded-md border border-pastel-green/20">
                      {mistake.correctAnswer}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-1">Explicación:</h3>
                  <p className="text-muted-foreground">{mistake.explanation}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="ml-auto" onClick={() => handleRemoveMistake(mistake.id)}>
                  Lo entiendo
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
