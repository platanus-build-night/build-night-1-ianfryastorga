"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Edit, FileQuestion, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo para preguntas
const questionsData = [
  {
    id: "q1",
    prompt: "¿Qué es una variable en álgebra?",
    type: "multiple-choice",
    level: "Álgebra Básica - Nivel 1",
    course: "Matemáticas Básicas",
    difficulty: 1,
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "q2",
    prompt: "Si x = 5, ¿cuál es el valor de 2x + 3?",
    type: "text",
    level: "Álgebra Básica - Nivel 1",
    course: "Matemáticas Básicas",
    difficulty: 2,
    createdAt: "2023-05-15T11:15:00Z",
  },
  {
    id: "q3",
    prompt: "Resuelve la ecuación: 3x - 7 = 8",
    type: "text",
    level: "Álgebra Básica - Nivel 2",
    course: "Matemáticas Básicas",
    difficulty: 3,
    createdAt: "2023-05-16T09:45:00Z",
  },
  {
    id: "q4",
    prompt: "¿Cómo se declara una variable en JavaScript?",
    type: "multiple-choice",
    level: "Fundamentos - Nivel 1",
    course: "Introducción a JavaScript",
    difficulty: 1,
    createdAt: "2023-05-17T14:20:00Z",
  },
  {
    id: "q5",
    prompt: "Escribe un código que declare una constante llamada PI con valor 3.14",
    type: "code",
    level: "Fundamentos - Nivel 1",
    course: "Introducción a JavaScript",
    difficulty: 2,
    createdAt: "2023-05-17T15:10:00Z",
  },
  {
    id: "q6",
    prompt: "¿Cuál es el área de un círculo con radio 3?",
    type: "text",
    level: "Geometría - Nivel 3",
    course: "Matemáticas Básicas",
    difficulty: 3,
    createdAt: "2023-05-18T10:05:00Z",
  },
]

export default function AdminQuestions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    prompt: "",
    type: "text",
    answer: "",
    options: "",
    explanation: "",
    difficulty: "1",
    course: "",
    level: "",
  })
  const { toast } = useToast()

  // Filtrar preguntas según la búsqueda
  const filteredQuestions = questionsData.filter(
    (question) =>
      question.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.course.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio en select
  const handleSelectChange = (name: string, value: string) => {
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar creación de pregunta
  const handleCreateQuestion = () => {
    // Aquí iría la lógica para crear la pregunta
    toast({
      title: "Pregunta creada",
      description: "La pregunta ha sido creada correctamente.",
      variant: "success",
    })
    setIsCreateDialogOpen(false)
    setNewQuestion({
      prompt: "",
      type: "text",
      answer: "",
      options: "",
      explanation: "",
      difficulty: "1",
      course: "",
      level: "",
    })
  }

  // Manejar eliminación de pregunta
  const handleDeleteQuestion = (questionId: string) => {
    // Aquí iría la lógica para eliminar la pregunta
    toast({
      title: "Pregunta eliminada",
      description: "La pregunta ha sido eliminada correctamente.",
      variant: "success",
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Preguntas</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Pregunta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Pregunta</DialogTitle>
              <DialogDescription>Completa los detalles para crear una nueva pregunta.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="prompt">Enunciado de la pregunta</Label>
                <Textarea
                  id="prompt"
                  name="prompt"
                  value={newQuestion.prompt}
                  onChange={handleInputChange}
                  placeholder="Ej: ¿Qué es una variable en álgebra?"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo de pregunta</Label>
                  <Select value={newQuestion.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="multiple-choice">Opción múltiple</SelectItem>
                      <SelectItem value="code">Código</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Dificultad</Label>
                  <Select
                    value={newQuestion.difficulty}
                    onValueChange={(value) => handleSelectChange("difficulty", value)}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Selecciona dificultad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Muy fácil</SelectItem>
                      <SelectItem value="2">2 - Fácil</SelectItem>
                      <SelectItem value="3">3 - Medio</SelectItem>
                      <SelectItem value="4">4 - Difícil</SelectItem>
                      <SelectItem value="5">5 - Muy difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="answer">Respuesta correcta</Label>
                <Input
                  id="answer"
                  name="answer"
                  value={newQuestion.answer}
                  onChange={handleInputChange}
                  placeholder="Respuesta correcta"
                />
              </div>
              {newQuestion.type === "multiple-choice" && (
                <div className="grid gap-2">
                  <Label htmlFor="options">Opciones (una por línea)</Label>
                  <Textarea
                    id="options"
                    name="options"
                    value={newQuestion.options}
                    onChange={handleInputChange}
                    placeholder="Opción 1&#10;Opción 2&#10;Opción 3&#10;Opción 4"
                    rows={4}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="explanation">Explicación</Label>
                <Textarea
                  id="explanation"
                  name="explanation"
                  value={newQuestion.explanation}
                  onChange={handleInputChange}
                  placeholder="Explicación de la respuesta correcta"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="course">Curso</Label>
                  <Select value={newQuestion.course} onValueChange={(value) => handleSelectChange("course", value)}>
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Selecciona curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math-101">Matemáticas Básicas</SelectItem>
                      <SelectItem value="prog-101">Introducción a JavaScript</SelectItem>
                      <SelectItem value="science-101">Física Fundamental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="level">Nivel</Label>
                  <Select value={newQuestion.level} onValueChange={(value) => handleSelectChange("level", value)}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Selecciona nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="algebra-1">Álgebra Básica - Nivel 1</SelectItem>
                      <SelectItem value="algebra-2">Álgebra Básica - Nivel 2</SelectItem>
                      <SelectItem value="geometry-1">Geometría - Nivel 1</SelectItem>
                      <SelectItem value="js-basics-1">Fundamentos JS - Nivel 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateQuestion}>Crear Pregunta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Preguntas</CardTitle>
          <CardDescription>Gestiona las preguntas de los cursos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar preguntas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Filtrar
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Todas las preguntas</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Tipo: Texto</DropdownMenuItem>
                <DropdownMenuItem>Tipo: Opción múltiple</DropdownMenuItem>
                <DropdownMenuItem>Tipo: Código</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dificultad: Fácil (1-2)</DropdownMenuItem>
                <DropdownMenuItem>Dificultad: Media (3)</DropdownMenuItem>
                <DropdownMenuItem>Dificultad: Difícil (4-5)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pregunta</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead className="text-center">Dificultad</TableHead>
                  <TableHead>Creada</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileQuestion className="h-5 w-5 text-primary" />
                        <div className="font-medium line-clamp-1">{question.prompt}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {question.type === "text"
                          ? "Texto"
                          : question.type === "multiple-choice"
                            ? "Opción múltiple"
                            : "Código"}
                      </Badge>
                    </TableCell>
                    <TableCell>{question.level}</TableCell>
                    <TableCell>{question.course}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full mx-0.5 ${
                              i < question.difficulty ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(question.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Acciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileQuestion className="h-4 w-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
