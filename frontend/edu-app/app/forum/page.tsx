"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThreadCard } from "@/components/thread-card"
import { Plus, Search } from "lucide-react"

// Datos de ejemplo
const threadsData = [
  {
    id: "t1",
    title: "¿Cómo resolver ecuaciones cuadráticas?",
    content:
      "Estoy teniendo problemas para entender cómo resolver ecuaciones cuadráticas. He intentado usar la fórmula general, pero a veces me confundo con los signos. ¿Alguien podría explicarme paso a paso cómo resolver ecuaciones como x² + 5x + 6 = 0?",
    author: {
      name: "Carlos Rodríguez",
      avatar: "/placeholder.svg",
    },
    course: "Matemáticas Básicas",
    courseId: "math-101",
    tags: ["duda", "álgebra"],
    votes: 12,
    replies: 5,
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "t2",
    title: "Error en bucle for en JavaScript",
    content:
      "Estoy intentando crear un bucle for que recorra un array, pero me está dando un error que no entiendo. Mi código es: for (let i = 0; i <= myArray.length; i++) { console.log(myArray[i]); } ¿Alguien puede ayudarme a identificar el problema?",
    author: {
      name: "María López",
      avatar: "/placeholder.svg",
    },
    course: "Introducción a JavaScript",
    courseId: "prog-101",
    tags: ["error", "bucles"],
    votes: 8,
    replies: 3,
    createdAt: "2023-05-18T14:45:00Z",
  },
  {
    id: "t3",
    title: "Consejos para memorizar fórmulas de física",
    content:
      "Estoy estudiando para mi examen de física y tengo dificultades para memorizar todas las fórmulas. ¿Alguien tiene algún consejo o técnica que le haya funcionado? Especialmente para las fórmulas de movimiento y energía.",
    author: {
      name: "Juan Martínez",
      avatar: "/placeholder.svg",
    },
    course: "Física Fundamental",
    courseId: "science-101",
    tags: ["consejo", "examen"],
    votes: 15,
    replies: 7,
    createdAt: "2023-05-20T09:15:00Z",
  },
  {
    id: "t4",
    title: "Diferencia entre let, var y const en JavaScript",
    content:
      "Estoy aprendiendo JavaScript y no entiendo bien cuándo usar let, var o const para declarar variables. ¿Alguien podría explicarme las diferencias y cuándo es mejor usar cada uno?",
    author: {
      name: "Laura Sánchez",
      avatar: "/placeholder.svg",
    },
    course: "Introducción a JavaScript",
    courseId: "prog-101",
    tags: ["duda", "variables"],
    votes: 20,
    replies: 9,
    createdAt: "2023-05-22T16:30:00Z",
  },
  {
    id: "t5",
    title: "Recursos adicionales para geometría",
    content:
      "Estoy buscando recursos adicionales para estudiar geometría, especialmente sobre triángulos y círculos. ¿Alguien conoce buenos libros, videos o sitios web que puedan ayudarme a profundizar en estos temas?",
    author: {
      name: "Pedro Gómez",
      avatar: "/placeholder.svg",
    },
    course: "Matemáticas Básicas",
    courseId: "math-101",
    tags: ["recursos", "geometría"],
    votes: 10,
    replies: 4,
    createdAt: "2023-05-25T11:20:00Z",
  },
]

const allTags = Array.from(new Set(threadsData.flatMap((thread) => thread.tags)))
const allCourses = Array.from(new Set(threadsData.map((thread) => thread.courseId)))

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const toggleCourse = (course: string) => {
    setSelectedCourses((prev) => (prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]))
  }

  const filteredThreads = threadsData.filter((thread) => {
    // Filtrar por búsqueda
    const matchesSearch =
      searchQuery === "" ||
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtrar por etiquetas
    const matchesTags = selectedTags.length === 0 || thread.tags.some((tag) => selectedTags.includes(tag))

    // Filtrar por cursos
    const matchesCourses = selectedCourses.length === 0 || selectedCourses.includes(thread.courseId)

    return matchesSearch && matchesTags && matchesCourses
  })

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Foro de Discusión</h1>
        <Button asChild>
          <Link href="/forum/new">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Tema
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-3">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar temas..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Filtrar por curso</h3>
            <div className="flex flex-wrap gap-2">
              {allCourses.map((courseId) => {
                const course = threadsData.find((t) => t.courseId === courseId)
                return (
                  <Badge
                    key={courseId}
                    variant={selectedCourses.includes(courseId) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCourse(courseId)}
                  >
                    {course?.course}
                  </Badge>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Filtrar por etiqueta</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {(selectedTags.length > 0 || selectedCourses.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedTags([])
                setSelectedCourses([])
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredThreads.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No se encontraron temas</h2>
            <p className="text-muted-foreground mb-4">No hay temas que coincidan con tus criterios de búsqueda.</p>
            <Button asChild>
              <Link href="/forum/new">Crear un nuevo tema</Link>
            </Button>
          </div>
        ) : (
          filteredThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)
        )}
      </div>
    </div>
  )
}
