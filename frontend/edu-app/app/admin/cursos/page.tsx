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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { BookOpen, ChevronDown, Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { courseApi, Course } from "@/lib/api"
import { useRouter } from "next/navigation"

// Colores por defecto para los cursos sin color definido
const defaultColors = [
  "#2065D1", // Azul
  "#7928CA", // Morado
  "#FF4500", // Naranja
  "#00A86B", // Verde
  "#E02424", // Rojo
  "#8B5CF6", // Violeta
  "#0284C7", // Celeste
  "#DB2777", // Rosa
]

// Mapeo de niveles de dificultad para mostrar en español
const difficultyLabels: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado"
}

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, published, unpublished, beginner, intermediate, advanced
  const { toast } = useToast()
  const router = useRouter()
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Cargar cursos desde la API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        
        // Para el panel de administración, obtener TODOS los cursos sin filtro de published
        const fetchedCourses = await courseApi.getAllCourses()
        
        // Asignar colores por defecto a los cursos que no tienen
        const coursesWithColors = fetchedCourses.map((course, index) => ({
          ...course,
          color: course.color || defaultColors[index % defaultColors.length]
        }))
        
        setCourses(coursesWithColors)
      } catch (error) {
        console.error("Error al cargar cursos:", error)
        toast({
          title: "Error al cargar cursos",
          description: "No se pudieron cargar los cursos. Por favor, intenta de nuevo más tarde.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [toast])

  // Filtrar cursos según la búsqueda y el filtro seleccionado
  const filteredCourses = courses.filter(course => {
    // Filtro de búsqueda
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtro de estado
    if (filter === "published" && !course.is_published) return false;
    if (filter === "unpublished" && course.is_published) return false;
    
    // Filtro de dificultad
    if (["beginner", "intermediate", "advanced"].includes(filter) && 
        course.difficulty_level !== filter) return false;
    
    return matchesSearch;
  });

  // Manejar eliminación de curso
  const handleDeleteCourse = async (course: Course) => {
    setCourseToDelete(course);
  }

  // Confirmar eliminación de curso
  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      setIsDeleting(true);
      await courseApi.deleteCourse(courseToDelete.id);
      
      // Actualizar la lista de cursos
      setCourses(prevCourses => prevCourses.filter(c => c.id !== courseToDelete.id));
      
      toast({
        title: "Curso eliminado",
        description: `El curso "${courseToDelete.title}" ha sido eliminado correctamente.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error al eliminar curso:", error);
      toast({
        title: "Error al eliminar curso",
        description: "No se pudo eliminar el curso. Por favor, intenta de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setCourseToDelete(null);
    }
  };

  // Manejar publicación/despublicación de curso
  const handleTogglePublish = async (course: Course) => {
    try {
      const updatedCourse = await courseApi.updateCourse(course.id, {
        is_published: !course.is_published
      });
      
      // Actualizar el curso en el estado
      setCourses(prevCourses => 
        prevCourses.map(c => c.id === course.id ? {...c, is_published: !c.is_published} : c)
      );
      
      toast({
        title: course.is_published ? "Curso despublicado" : "Curso publicado",
        description: `El curso "${course.title}" ha sido ${course.is_published ? "despublicado" : "publicado"} correctamente.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error al cambiar estado del curso:", error);
      toast({
        title: "Error al actualizar curso",
        description: "No se pudo actualizar el estado del curso. Por favor, intenta de nuevo más tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Cursos</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => {
            const fetchCourses = async () => {
              try {
                setLoading(true)
                console.log("Cargando cursos...")
                const fetchedCourses = await courseApi.getAllCourses()
                console.log("Cursos obtenidos:", fetchedCourses)
                
                // Asignar colores por defecto a los cursos que no tienen
                const coursesWithColors = fetchedCourses.map((course, index) => ({
                  ...course,
                  color: course.color || defaultColors[index % defaultColors.length]
                }))
                
                setCourses(coursesWithColors)
              } catch (error) {
                console.error("Error al cargar cursos:", error)
                toast({
                  title: "Error al cargar cursos",
                  description: "No se pudieron cargar los cursos. Por favor, intenta de nuevo más tarde.",
                  variant: "destructive",
                })
              } finally {
                setLoading(false)
              }
            }
            fetchCourses()
          }} variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 mr-2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21h5v-5"></path></svg>
            Actualizar
          </Button>
          <Link href="/admin/cursos/crear">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Curso
            </Button>
          </Link>
        </div>
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
                <DropdownMenuItem onClick={() => setFilter("all")}>Todos los cursos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("published")}>Publicados</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("unpublished")}>No publicados</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilter("beginner")}>Principiante</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("intermediate")}>Intermedio</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("advanced")}>Avanzado</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>Cargando cursos...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron cursos{searchQuery ? " con tu búsqueda" : ""}.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Dificultad</TableHead>
                    <TableHead>Creado</TableHead>
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
                        <Badge variant="outline" className="text-xs">
                          {difficultyLabels[course.difficulty_level] || course.difficulty_level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {course.createdAt ? (
                          course.createdAt.includes(' ') && course.createdAt.includes('-') ? (
                            (() => {
                              // Extraer la parte de la fecha (sin hora) y convertir a DD/MM/YYYY
                              const datePart = course.createdAt.split(' ')[0]; // "2025-04-26"
                              const [year, month, day] = datePart.split('-');
                              return `${day}/${month}/${year}`;
                            })()
                          ) : (
                            course.createdAt // Si no tiene el formato esperado, mostrar tal cual
                          )
                        ) : (
                          'Sin fecha'
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={course.is_published ? "success" : "secondary"} className="text-xs">
                          {course.is_published ? "Publicado" : "Borrador"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/course/${course.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/cursos/editar/${course.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTogglePublish(course)}>
                              {course.is_published ? (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Despublicar
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Publicar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCourse(course)} 
                              className="text-red-500 hover:text-red-500 focus:text-red-500"
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
          )}
        </CardContent>
      </Card>

      {/* Diálogo de confirmación para eliminar curso */}
      <AlertDialog open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el curso 
              <span className="font-semibold">{` "${courseToDelete?.title}"`}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCourse}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
