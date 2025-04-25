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
import { BookOpen, ChevronDown, Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo para cursos
const coursesData = [
  {
    id: "math-101",
    title: "Matemáticas Básicas",
    description: "Fundamentos de álgebra, geometría y aritmética",
    difficulty: "beginner",
    author: "María López",
    students: 120,
    sets: 3,
    isPublished: true,
    createdAt: "2023-01-15T10:00:00Z",
    color: "#2065D1",
  },
  {
    id: "prog-101",
    title: "Introducción a JavaScript",
    description: "Aprende los fundamentos de la programación con JavaScript",
    difficulty: "intermediate",
    author: "Carlos Rodríguez",
    students: 85,
    sets: 2,
    isPublished: true,
    createdAt: "2023-02-10T14:30:00Z",
    color: "#7928CA",
  },
  {
    id: "science-101",
    title: "Física Fundamental",
    description: "Conceptos básicos de física y mecánica",
    difficulty: "intermediate",
    author: "Juan Martínez",
    students: 95,
    sets: 3,
    isPublished: true,
    createdAt: "2023-03-05T09:15:00Z",
    color: "#FF4500",
  },
  {
    id: "lang-101",
    title: "Inglés Intermedio",
    description: "Mejora tu nivel de inglés con ejercicios prácticos",
    difficulty: "intermediate",
    author: "Laura Sánchez",
    students: 75,
    sets: 4,
    isPublished: false,
    createdAt: "2023-04-20T11:45:00Z",
    color: "#00A86B",
  },
  {
    id: "design-101",
    title: "Diseño UI/UX Básico",
    description: "Fundamentos de diseño de interfaces y experiencia de usuario",
    difficulty: "beginner",
    author: "Pedro Gómez",
    students: 60,
    sets: 2,
    isPublished: false,
    createdAt: "2023-05-12T13:20:00Z",
    color: "#FF6B6B",
  },
]

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    color: "#2065D1",
  })
  const { toast } = useToast()

  // Filtrar cursos según la búsqueda
  const filteredCourses = coursesData.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio en select
  const handleSelectChange = (name: string, value: string) => {
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar creación de curso
  const handleCreateCourse = () => {
    // Aquí iría la lógica para crear el curso
    toast({
      title: "Curso creado",
      description: `El curso "${newCourse.title}" ha sido creado correctamente.`,
      variant: "success",
    })
    setIsCreateDialogOpen(false)
    setNewCourse({
      title: "",
      description: "",
      difficulty: "beginner",
      color: "#2065D1",
    })
  }

  // Manejar eliminación de curso
  const handleDeleteCourse = (courseId: string, courseTitle: string) => {
    // Aquí iría la lógica para eliminar el curso
    toast({
      title: "Curso eliminado",
      description: `El curso "${courseTitle}" ha sido eliminado correctamente.`,
      variant: "success",
    })
  }

  // Manejar publicación/despublicación de curso
  const handleTogglePublish = (courseId: string, isPublished: boolean, courseTitle: string) => {
    // Aquí iría la lógica para publicar/despublicar el curso
    toast({
      title: isPublished ? "Curso despublicado" : "Curso publicado",
      description: `El curso "${courseTitle}" ha sido ${isPublished ? "despublicado" : "publicado"} correctamente.`,
      variant: "success",
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Cursos</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Curso</DialogTitle>
              <DialogDescription>Completa los detalles para crear un nuevo curso.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título del curso</Label>
                <Input
                  id="title"
                  name="title"
                  value={newCourse.title}
                  onChange={handleInputChange}
                  placeholder="Ej: Matemáticas Básicas"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  placeholder="Breve descripción del curso..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Nivel de dificultad</Label>
                  <Select
                    value={newCourse.difficulty}
                    onValueChange={(value) => handleSelectChange("difficulty", value)}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Selecciona dificultad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Principiante</SelectItem>
                      <SelectItem value="intermediate">Intermedio</SelectItem>
                      <SelectItem value="advanced">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Color del curso</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      name="color"
                      type="color"
                      value={newCourse.color}
                      onChange={handleInputChange}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={newCourse.color}
                      onChange={handleInputChange}
                      name="color"
                      className="flex-1"
                      placeholder="#2065D1"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCourse}>Crear Curso</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cursos</CardTitle>
          <CardDescription>Gestiona los cursos disponibles en la plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
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
                <DropdownMenuItem>Todos los cursos</DropdownMenuItem>
                <DropdownMenuItem>Publicados</DropdownMenuItem>
                <DropdownMenuItem>No publicados</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Principiante</DropdownMenuItem>
                <DropdownMenuItem>Intermedio</DropdownMenuItem>
                <DropdownMenuItem>Avanzado</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Dificultad</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead className="text-center">Estudiantes</TableHead>
                  <TableHead className="text-center">Conjuntos</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-md flex items-center justify-center"
                          style={{ backgroundColor: course.color }}
                        >
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{course.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          course.difficulty === "beginner"
                            ? "bg-green-100 text-green-700"
                            : course.difficulty === "intermediate"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                        }
                      >
                        {course.difficulty === "beginner"
                          ? "Principiante"
                          : course.difficulty === "intermediate"
                            ? "Intermedio"
                            : "Avanzado"}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.author}</TableCell>
                    <TableCell className="text-center">{course.students}</TableCell>
                    <TableCell className="text-center">{course.sets}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={course.isPublished ? "default" : "outline"}>
                        {course.isPublished ? "Publicado" : "Borrador"}
                      </Badge>
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
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleTogglePublish(course.id, course.isPublished, course.title)}
                          >
                            {course.isPublished ? (
                              <>
                                <Eye className="h-4 w-4 mr-2 text-amber-500" />
                                Despublicar
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2 text-green-500" />
                                Publicar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteCourse(course.id, course.title)}
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
