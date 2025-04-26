"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { ArrowRight, Edit, Layers, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Course, CreateSetDto, Set, UpdateSetDto, courseApi, setApi } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function AdminSets() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentSet, setCurrentSet] = useState<Set | null>(null)
  const [newSet, setNewSet] = useState({
    title: "",
    description: "",
    courseId: ""
  })
  const [editSet, setEditSet] = useState({
    id: 0,
    title: "",
    description: "",
    courseId: ""
  })
  const [sets, setSets] = useState<Set[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  
  const router = useRouter()
  const { toast } = useToast()

  // Cargar cursos al iniciar
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await courseApi.getAllCourses()
        setCourses(coursesData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching courses:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los cursos. Intente de nuevo más tarde.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }
    
    fetchCourses()
  }, [])

  // Cargar conjuntos cuando se selecciona un curso
  useEffect(() => {
    if (!selectedCourse) {
      setSets([])
      return
    }
    
    const fetchSets = async () => {
      try {
        const setsData = await setApi.getSetsByCourse(parseInt(selectedCourse))
        setSets(setsData)
      } catch (error) {
        console.error('Error fetching sets:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los conjuntos. Intente de nuevo más tarde.",
          variant: "destructive",
        })
      }
    }
    
    fetchSets()
  }, [selectedCourse])

  // Filtrar conjuntos según la búsqueda
  const filteredSets = sets.filter(
    (set) =>
      set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (set.description && set.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Manejar cambios en el formulario de creación
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewSet((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambios en el formulario de edición
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditSet((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio en select de curso para creación
  const handleCourseChange = (value: string) => {
    setNewSet(prev => ({
      ...prev,
      courseId: value
    }))
  }

  // Manejar cambio en select de curso para edición
  const handleEditCourseChange = (value: string) => {
    setEditSet(prev => ({
      ...prev,
      courseId: value
    }))
  }

  // Encontrar nombre del curso
  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId)
    return course ? course.title : 'Curso desconocido'
  }

  // Abrir modal de edición con datos del conjunto
  const handleOpenEditDialog = (set: Set) => {
    setEditSet({
      id: set.id,
      title: set.title,
      description: set.description || "",
      courseId: set.courseId.toString()
    })
    setIsEditDialogOpen(true)
  }

  // Manejar redirección a niveles
  const handleViewLevels = (setId: number) => {
    router.push(`/admin/niveles?set=${setId}`)
  }

  // Manejar creación de conjunto
  const handleCreateSet = async () => {
    if (!newSet.title || !newSet.courseId) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }
    
    try {
      // Crear objeto DTO para la API
      const createSetDto: CreateSetDto = {
        course_id: parseInt(newSet.courseId),
        title: newSet.title,
        description: newSet.description
      }
      
      // Llamar a la API para crear el conjunto
      await setApi.createSet(createSetDto)
      
      // Actualizar la lista de conjuntos si hay un curso seleccionado
      if (selectedCourse) {
        const updatedSets = await setApi.getSetsByCourse(parseInt(selectedCourse))
        setSets(updatedSets)
      }
      
      // Mostrar mensaje de éxito
      toast({
        title: "Conjunto creado",
        description: "El conjunto ha sido creado correctamente.",
        variant: "success",
      })
      
      // Cerrar diálogo y limpiar formulario
      setIsCreateDialogOpen(false)
      setNewSet({
        title: "",
        description: "",
        courseId: ""
      })
    } catch (error) {
      console.error('Error creating set:', error)
      toast({
        title: "Error",
        description: "No se pudo crear el conjunto. Intente de nuevo más tarde.",
        variant: "destructive",
      })
    }
  }

  // Manejar actualización de conjunto
  const handleUpdateSet = async () => {
    if (!editSet.title) {
      toast({
        title: "Error",
        description: "El título del conjunto es requerido.",
        variant: "destructive",
      })
      return
    }
    
    try {
      // Crear objeto DTO para la API
      const updateSetDto: UpdateSetDto = {
        title: editSet.title,
        description: editSet.description
      }
      
      // Llamar a la API para actualizar el conjunto
      await setApi.updateSet(editSet.id, updateSetDto)
      
      // Actualizar la lista de conjuntos
      if (selectedCourse) {
        const updatedSets = await setApi.getSetsByCourse(parseInt(selectedCourse))
        setSets(updatedSets)
      }
      
      // Mostrar mensaje de éxito
      toast({
        title: "Conjunto actualizado",
        description: "El conjunto ha sido actualizado correctamente.",
        variant: "success",
      })
      
      // Cerrar diálogo
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating set:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el conjunto. Intente de nuevo más tarde.",
        variant: "destructive",
      })
    }
  }

  // Manejar eliminación de conjunto
  const handleDeleteSet = async (setId: number) => {
    try {
      // Llamar a la API para eliminar el conjunto
      await setApi.deleteSet(setId)
      
      // Actualizar la lista de conjuntos
      setSets(prevSets => prevSets.filter(s => s.id !== setId))
      
      // Mostrar mensaje de éxito
      toast({
        title: "Conjunto eliminado",
        description: "El conjunto ha sido eliminado correctamente.",
        variant: "success",
      })
    } catch (error) {
      console.error('Error deleting set:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el conjunto. Intente de nuevo más tarde.",
        variant: "destructive",
      })
    }
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
              <DialogDescription>Completa los detalles para crear un nuevo conjunto.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="courseId">Curso</Label>
                <Select value={newSet.courseId} onValueChange={handleCourseChange}>
                  <SelectTrigger id="courseId">
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Título del conjunto</Label>
                <Input
                  id="title"
                  name="title"
                  value={newSet.title}
                  onChange={handleInputChange}
                  placeholder="Ej: Fundamentos de Álgebra"
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateSet}>Crear Conjunto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de edición de conjunto */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Editar Conjunto</DialogTitle>
              <DialogDescription>Modifica los detalles del conjunto.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editTitle">Título del conjunto</Label>
                <Input
                  id="editTitle"
                  name="title"
                  value={editSet.title}
                  onChange={handleEditInputChange}
                  placeholder="Ej: Fundamentos de Álgebra"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editDescription">Descripción</Label>
                <Textarea
                  id="editDescription"
                  name="description"
                  value={editSet.description}
                  onChange={handleEditInputChange}
                  placeholder="Breve descripción del conjunto..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateSet}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conjuntos</CardTitle>
          <CardDescription>Gestiona los conjuntos para tus cursos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="courseSelect" className="mb-2 block">Curso</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger id="courseSelect">
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Selecciona un curso</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedCourse && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conjuntos..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {selectedCourse ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conjunto</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">Cargando datos...</TableCell>
                    </TableRow>
                  ) : filteredSets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        {searchQuery 
                          ? "No se encontraron resultados para su búsqueda" 
                          : "No hay conjuntos disponibles para este curso"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSets.map((set) => (
                      <TableRow key={set.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Layers className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">{set.title}</div>
                              {set.description && (
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {set.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getCourseName(set.courseId)}</Badge>
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
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleOpenEditDialog(set)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewLevels(set.id)}>
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Ver niveles
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteSet(set.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              Selecciona un curso para ver los conjuntos disponibles.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
