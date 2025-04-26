"use client"

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
import { BookOpen, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Course, CreateLevelDto, Level, Set, courseApi, levelApi, setApi } from "@/lib/api"

export default function AdminLevels() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newLevel, setNewLevel] = useState({
    title: "",
    description: "",
    setId: ""
  })
  const [levels, setLevels] = useState<Level[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [sets, setSets] = useState<Set[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedSet, setSelectedSet] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [formLoading, setFormLoading] = useState<boolean>(false)

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
    if (!selectedCourse || selectedCourse === "0") {
      setSets([])
      setSelectedSet("")
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

  // Cargar niveles cuando se selecciona un conjunto
  useEffect(() => {
    if (!selectedSet || selectedSet === "0") {
      setLevels([])
      return
    }
    
    const fetchLevels = async () => {
      try {
        const levelsData = await levelApi.getLevelsBySet(parseInt(selectedSet))
        setLevels(levelsData)
      } catch (error) {
        console.error('Error fetching levels:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los niveles. Intente de nuevo más tarde.",
          variant: "destructive",
        })
      }
    }
    
    fetchLevels()
  }, [selectedSet])

  // Filtrar niveles según la búsqueda
  const filteredLevels = levels.filter(
    (level) =>
      level.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (level.description && level.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewLevel((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio en select de conjunto
  const handleSetChange = (value: string) => {
    setNewLevel(prev => ({
      ...prev,
      setId: value
    }))
  }

  // Encontrar nombre del conjunto
  const getSetName = (setId: number) => {
    const set = sets.find(s => s.id === setId)
    return set ? set.title : 'Conjunto desconocido'
  }

  // Resetear formulario al abrir el diálogo
  const handleOpenDialog = (open: boolean) => {
    if (open) {
      if (selectedSet && selectedSet !== "0") {
        setNewLevel(prev => ({
          ...prev,
          setId: selectedSet
        }))
      } else {
        setNewLevel({
          title: "",
          description: "",
          setId: ""
        })
      }
    }
    setIsCreateDialogOpen(open)
  }

  // Manejar creación de nivel
  const handleCreateLevel = async () => {
    if (!newLevel.title || !newLevel.setId) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }
    
    try {
      // Crear objeto DTO para la API
      const createLevelDto: CreateLevelDto = {
        set_id: parseInt(newLevel.setId),
        title: newLevel.title,
        description: newLevel.description
      }
      
      // Llamar a la API para crear el nivel
      await levelApi.createLevel(createLevelDto)
      
      // Actualizar la lista de niveles si hay un conjunto seleccionado
      if (selectedSet) {
        const updatedLevels = await levelApi.getLevelsBySet(parseInt(selectedSet))
        setLevels(updatedLevels)
      }
      
      // Mostrar mensaje de éxito
      toast({
        title: "Nivel creado",
        description: "El nivel ha sido creado correctamente.",
        variant: "success",
      })
      
      // Cerrar diálogo y limpiar formulario
      setIsCreateDialogOpen(false)
      setNewLevel({
        title: "",
        description: "",
        setId: ""
      })
    } catch (error) {
      console.error('Error creating level:', error)
      toast({
        title: "Error",
        description: "No se pudo crear el nivel. Intente de nuevo más tarde.",
        variant: "destructive",
      })
    }
  }

  // Manejar eliminación de nivel
  const handleDeleteLevel = async (levelId: number) => {
    try {
      // Llamar a la API para eliminar el nivel
      await levelApi.deleteLevel(levelId)
      
      // Actualizar la lista de niveles
      setLevels(prevLevels => prevLevels.filter(l => l.id !== levelId))
      
      // Mostrar mensaje de éxito
      toast({
        title: "Nivel eliminado",
        description: "El nivel ha sido eliminado correctamente.",
        variant: "success",
      })
    } catch (error) {
      console.error('Error deleting level:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el nivel. Intente de nuevo más tarde.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Niveles</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={handleOpenDialog}>
          <DialogTrigger asChild>
            <Button disabled={!selectedSet || selectedSet === "0"}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Nivel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Nivel</DialogTitle>
              <DialogDescription>Completa los detalles para crear un nuevo nivel.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="setId">Conjunto</Label>
                <Select value={newLevel.setId} onValueChange={handleSetChange}>
                  <SelectTrigger id="setId">
                    <SelectValue placeholder="Selecciona un conjunto" />
                  </SelectTrigger>
                  <SelectContent>
                    {sets.length > 0 ? (
                      sets.map(set => (
                        <SelectItem key={set.id} value={set.id.toString()}>
                          {set.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>
                        No hay conjuntos disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Título del nivel</Label>
                <Input
                  id="title"
                  name="title"
                  value={newLevel.title}
                  onChange={handleInputChange}
                  placeholder="Ej: Nivel 1 - Principiante"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newLevel.description}
                  onChange={handleInputChange}
                  placeholder="Ej: Conceptos básicos para principiantes"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateLevel} disabled={!newLevel.title || !newLevel.setId}>
                Crear Nivel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Niveles</CardTitle>
          <CardDescription>Gestiona los niveles para tus conjuntos. Selecciona un curso y un conjunto para ver sus niveles.</CardDescription>
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
              
              <div>
                <Label htmlFor="setSelect" className="mb-2 block">Conjunto</Label>
                <Select value={selectedSet} onValueChange={setSelectedSet} disabled={!selectedCourse || selectedCourse === "0"}>
                  <SelectTrigger id="setSelect">
                    <SelectValue placeholder="Selecciona un conjunto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Selecciona un conjunto</SelectItem>
                    {sets.length > 0 ? (
                      sets.map(set => (
                        <SelectItem key={set.id} value={set.id.toString()}>
                          {set.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>
                        No hay conjuntos disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedSet && selectedSet !== "0" && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar niveles..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          {selectedSet && selectedSet !== "0" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Conjunto</TableHead>
                    <TableHead>Orden</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">Cargando datos...</TableCell>
                    </TableRow>
                  ) : filteredLevels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        {searchQuery 
                          ? "No se encontraron resultados para su búsqueda" 
                          : "No hay niveles disponibles para este conjunto. Crea tu primer nivel."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLevels.map((level) => (
                      <TableRow key={level.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="font-medium">{level.title}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{level.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getSetName(level.setId)}</Badge>
                        </TableCell>
                        <TableCell>{level.orderIndex}</TableCell>
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
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteLevel(level.id)}
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
              Selecciona un curso y un conjunto para ver los niveles disponibles.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 