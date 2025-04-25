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
import { ChevronDown, Edit, Layers, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo para conjuntos
const setsData = [
  {
    id: "algebra",
    courseId: "math-101",
    courseName: "Matemáticas Básicas",
    name: "Álgebra Básica",
    description: "Operaciones con variables y ecuaciones",
    levels: 5,
    students: 110,
    createdAt: "2023-01-20T10:30:00Z",
  },
  {
    id: "geometry",
    courseId: "math-101",
    courseName: "Matemáticas Básicas",
    name: "Geometría",
    description: "Figuras planas y espaciales",
    levels: 5,
    students: 95,
    createdAt: "2023-01-25T14:15:00Z",
  },
  {
    id: "arithmetic",
    courseId: "math-101",
    courseName: "Matemáticas Básicas",
    name: "Aritmética",
    description: "Operaciones con números",
    levels: 5,
    students: 105,
    createdAt: "2023-01-30T09:45:00Z",
  },
  {
    id: "basics",
    courseId: "prog-101",
    courseName: "Introducción a JavaScript",
    name: "Fundamentos",
    description: "Sintaxis básica y tipos de datos",
    levels: 5,
    students: 80,
    createdAt: "2023-02-15T11:30:00Z",
  },
  {
    id: "dom",
    courseId: "prog-101",
    courseName: "Introducción a JavaScript",
    name: "Manipulación del DOM",
    description: "Interactuar con elementos HTML",
    levels: 5,
    students: 75,
    createdAt: "2023-02-20T15:45:00Z",
  },
  {
    id: "mechanics",
    courseId: "science-101",
    courseName: "Física Fundamental",
    name: "Mecánica",
    description: "Leyes del movimiento y fuerzas",
    levels: 4,
    students: 90,
    createdAt: "2023-03-10T10:15:00Z",
  },
]

export default function AdminSets() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newSet, setNewSet] = useState({
    name: "",
    description: "",
    courseId: "",
  })
  const { toast } = useToast()

  // Filtrar conjuntos según la búsqueda
  const filteredSets = setsData.filter(
    (set) =>
      set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.courseName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewSet((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio en select
  const handleSelectChange = (name: string, value: string) => {
    setNewSet((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar creación de conjunto
  const handleCreateSet = () => {
    // Aquí iría la lógica para crear el conjunto
    toast({
      title: "Conjunto creado",
      description: `El conjunto "${newSet.name}" ha sido creado correctamente.`,
      variant: "success",
    })
    setIsCreateDialogOpen(false)
    setNewSet({
      name: "",
      description: "",
      courseId: "",
    })
  }

  // Manejar eliminación de conjunto
  const handleDeleteSet = (setId: string, setName: string) => {
    // Aquí iría la lógica para eliminar el conjunto
    toast({
      title: "Conjunto eliminado",
      description: `El conjunto "${setName}" ha sido eliminado correctamente.`,
      variant: "success",
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Conjuntos</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Conjunto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Conjunto</DialogTitle>
              <DialogDescription>Completa los detalles para crear un nuevo conjunto de niveles.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del conjunto</Label>
                <Input
                  id="name"
                  name="name"
                  value={newSet.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Álgebra Básica"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newSet.description}
                  onChange={handleInputChange}
                  placeholder="Breve descripción del conjunto..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="courseId">Curso</Label>
                <Select value={newSet.courseId} onValueChange={(value) => handleSelectChange("courseId", value)}>
                  <SelectTrigger id="courseId">
                    <SelectValue placeholder="Selecciona curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math-101">Matemáticas Básicas</SelectItem>
                    <SelectItem value="prog-101">Introducción a JavaScript</SelectItem>
                    <SelectItem value="science-101">Física Fundamental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateSet}>Crear Conjunto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Conjuntos</CardTitle>
          <CardDescription>Gestiona los conjuntos de niveles para cada curso.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conjuntos..."
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
                <DropdownMenuItem>Todos los conjuntos</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Matemáticas Básicas</DropdownMenuItem>
                <DropdownMenuItem>Introducción a JavaScript</DropdownMenuItem>
                <DropdownMenuItem>Física Fundamental</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conjunto</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead className="text-center">Niveles</TableHead>
                  <TableHead className="text-center">Estudiantes</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSets.map((set) => (
                  <TableRow key={set.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Layers className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">{set.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{set.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{set.courseName}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{set.levels}</TableCell>
                    <TableCell className="text-center">{set.students}</TableCell>
                    <TableCell>
                      {new Date(set.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
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
                            <Layers className="h-4 w-4 mr-2" />
                            Ver niveles
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteSet(set.id, set.name)}
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
