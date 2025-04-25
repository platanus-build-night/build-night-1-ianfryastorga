"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SetCard } from "@/components/set-card"
import { ChevronLeft, BookOpen } from "lucide-react"
import React from "react"

// Datos de ejemplo
const coursesData = {
  "math-101": {
    id: "math-101",
    title: "Matemáticas Básicas",
    description: "Fundamentos de álgebra, geometría y aritmética",
    progress: 65,
    color: "#2065D1",
    sets: [
      {
        id: "algebra",
        title: "Álgebra Básica",
        description: "Operaciones con variables y ecuaciones",
        levels: [
          { id: 1, title: "Variables y constantes", completed: true },
          { id: 2, title: "Ecuaciones lineales", completed: true },
          { id: 3, title: "Sistemas de ecuaciones", completed: false },
          { id: 4, title: "Ecuaciones cuadráticas", completed: false },
          { id: 5, title: "Funciones", completed: false },
        ],
      },
      {
        id: "geometry",
        title: "Geometría",
        description: "Figuras planas y espaciales",
        levels: [
          { id: 1, title: "Puntos y líneas", completed: true },
          { id: 2, title: "Ángulos", completed: true },
          { id: 3, title: "Triángulos", completed: true },
          { id: 4, title: "Cuadriláteros", completed: false },
          { id: 5, title: "Círculos", completed: false },
        ],
      },
      {
        id: "arithmetic",
        title: "Aritmética",
        description: "Operaciones con números",
        levels: [
          { id: 1, title: "Números naturales", completed: true },
          { id: 2, title: "Números enteros", completed: true },
          { id: 3, title: "Fracciones", completed: true },
          { id: 4, title: "Decimales", completed: true },
          { id: 5, title: "Porcentajes", completed: false },
        ],
      },
    ],
  },
  "prog-101": {
    id: "prog-101",
    title: "Introducción a JavaScript",
    description: "Aprende los fundamentos de la programación con JavaScript",
    progress: 32,
    color: "#7928CA",
    sets: [
      {
        id: "basics",
        title: "Fundamentos",
        description: "Sintaxis básica y tipos de datos",
        levels: [
          { id: 1, title: "Variables y tipos", completed: true },
          { id: 2, title: "Operadores", completed: true },
          { id: 3, title: "Condicionales", completed: false },
          { id: 4, title: "Bucles", completed: false },
          { id: 5, title: "Funciones", completed: false },
        ],
      },
      {
        id: "dom",
        title: "Manipulación del DOM",
        description: "Interactuar con elementos HTML",
        levels: [
          { id: 1, title: "Selección de elementos", completed: true },
          { id: 2, title: "Modificación de contenido", completed: false },
          { id: 3, title: "Eventos", completed: false },
          { id: 4, title: "Formularios", completed: false },
          { id: 5, title: "Animaciones", completed: false },
        ],
      },
    ],
  },
}

export default function CoursePage({ params }: { params: { id: string } }) {
  // Usando React.use() para desenvolver los params (solución al warning)
  const unwrappedParams = React.use(params);
  const courseId = unwrappedParams.id;
  const course = coursesData[courseId as keyof typeof coursesData]

  if (!course) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Curso no encontrado</h1>
        <Button asChild>
          <Link href="/dashboard">Volver al Dashboard</Link>
        </Button>
      </div>
    )
  }

  // Calcular el progreso total
  const totalLevels = course.sets.reduce((acc, set) => acc + set.levels.length, 0)
  const completedLevels = course.sets.reduce(
    (acc, set) => acc + set.levels.filter((level) => level.completed).length,
    0,
  )
  const progress = Math.round((completedLevels / totalLevels) * 100)

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
        </Button>
      </div>

      <div className="rounded-lg p-6 mb-8 text-white" style={{ backgroundColor: course.color }}>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-white/80 mb-4">{course.description}</p>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>
                {course.sets.length} conjuntos • {totalLevels} niveles
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="bg-white/20 rounded-full p-1">
              <div className="bg-white rounded-full p-4">
                <span className="text-2xl font-bold rounded-number" style={{ color: course.color }}>
                  {progress}%
                </span>
              </div>
            </div>
            <Button className="mt-4 bg-white hover:bg-white/90 text-black" disabled={completedLevels === 0}>
              Revisar errores
            </Button>
          </div>
        </div>

        <div className="w-full bg-white/20 h-2 rounded-full mt-6">
          <div className="bg-white h-2 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        {course.sets.map((set) => (
          <SetCard
            key={set.id}
            id={set.id}
            courseId={course.id}
            title={set.title}
            description={set.description}
            levels={set.levels}
          />
        ))}
      </div>
    </div>
  )
}
