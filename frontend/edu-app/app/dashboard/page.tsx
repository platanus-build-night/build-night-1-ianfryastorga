"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/course-card"
import { StreakFlame } from "@/components/streak-flame"
import { CalendarDays, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { courseApi, Course, userAnswerApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo para los consejos
const weeklyTips = [
  {
    id: "tip-1",
    title: "Técnica Pomodoro",
    description: "Estudia durante 25 minutos y descansa 5 minutos para maximizar tu concentración.",
  },
  {
    id: "tip-2",
    title: "Repaso Espaciado",
    description: "Repasa el material a intervalos crecientes para mejorar la retención a largo plazo.",
  },
  {
    id: "tip-3",
    title: "Aprendizaje Activo",
    description: "Practica explicando conceptos en tus propias palabras para mejorar la comprensión.",
  },
]

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

interface CourseWithProgress extends Course {
  progress: number;
}

interface LevelProgress {
  levelId: number;
  levelTitle: string;
  totalQuestions: number;
  answeredCorrectly: number;
  progress: number;
  questionIds: number[];
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [courses, setCourses] = useState<CourseWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(7)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  // Verificar autenticación
  useEffect(() => {
    if (authLoading) return
    
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const fetchCourses = async () => {
      if (authLoading || !user) return

      try {
        setLoading(true)
        
        // Obtener todos los cursos
        const allCourses = await courseApi.getAllCourses(true)
        
        // Obtener el progreso del usuario
        const userProgress = await userAnswerApi.getUserProgress(user.id)
        
        // Mapear los cursos con su progreso
        const coursesWithProgress: CourseWithProgress[] = allCourses.map(course => {
          // Calcular el progreso para este curso
          let courseProgress = 0
          
          if (userProgress && userProgress.progressByLevel && userProgress.progressByLevel.length > 0) {
            // Filtrar niveles que pertenecen a este curso a través de los sets
            const courseLevels = userProgress.progressByLevel.filter((level: LevelProgress) => {
              // Aquí necesitaríamos la relación entre niveles y cursos
              // Por simplicidad, asumimos que la relación está disponible a través de alguna propiedad
              // En una implementación real, esto requeriría datos adicionales o una consulta separada
              return true // Por ahora, incluimos todos los niveles
            })
            
            if (courseLevels.length > 0) {
              // Calcular promedio de progreso de los niveles del curso
              const totalProgress = courseLevels.reduce((sum: number, level: LevelProgress) => sum + level.progress, 0)
              courseProgress = Math.round(totalProgress / courseLevels.length)
            }
          }
          
          return {
            ...course,
            progress: courseProgress
          }
        })
        
        setCourses(coursesWithProgress)
      } catch (error) {
        console.error("Error fetching courses:", error)
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
  }, [authLoading, user, toast])

  // Calcular días restantes para el examen (ejemplo)
  const examDate = new Date()
  examDate.setDate(examDate.getDate() + 15)
  const daysRemaining = Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % weeklyTips.length)
  }

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + weeklyTips.length) % weeklyTips.length)
  }

  // Mostrar pantalla de carga mientras se verifica la autenticación o se cargan los cursos
  if (authLoading || loading) {
    return (
      <div className="container py-8 flex justify-center items-center h-[50vh]">
        <div className="text-center">
          <p className="text-lg">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">
        {user ? `¡Hola, ${user.name || 'Estudiante'}!` : 'Tu Dashboard'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Tus Cursos</h2>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id.toString()} 
                  title={course.title}
                  description={course.description}
                  progress={course.progress}
                  color={course.color || "#2065D1"}
                />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No hay cursos disponibles en este momento.</p>
              <Button asChild size="sm">
                <Link href="/explore">Explorar cursos</Link>
              </Button>
            </Card>
          )}
          
          <h2 className="text-xl font-semibold pt-6">Continúa Aprendiendo</h2>
          <div className="grid grid-cols-1 gap-4">
            {courses.filter(course => course.progress > 0 && course.progress < 100)
              .sort((a, b) => b.progress - a.progress)
              .slice(0, 3)
              .map((course) => (
                <Card key={course.id} className="p-4 flex items-center gap-4">
                  <div 
                    className="h-10 w-10 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: course.color || "#2065D1" }}
                  >
                    <span className="text-white font-bold">{course.title.substring(0, 1)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{course.title}</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-muted rounded-full w-full max-w-32 overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${course.progress}%`,
                            backgroundColor: course.color || "#2065D1"
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{course.progress}%</span>
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/course/${course.id}`}>Continuar</Link>
                  </Button>
                </Card>
              ))}
              
            {courses.filter(course => course.progress > 0 && course.progress < 100).length === 0 && (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No tienes cursos en progreso actualmente.</p>
              </Card>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Tu Progreso</h2>
          <Card className="p-6">
            <Button className="w-full mb-4" asChild>
              <Link href="/progreso">Ver Progreso Detallado</Link>
            </Button>
            
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Cursos Completados</h3>
              <div className="text-3xl font-bold">
                {courses.filter(course => course.progress === 100).length} <span className="text-muted-foreground text-sm font-normal">/ {courses.length}</span>
              </div>
            </div>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Tu Racha</CardTitle>
                  <CardDescription>Mantén tu racha de aprendizaje</CardDescription>
                </div>
                <StreakFlame streak={streak} className="h-12 w-12" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{streak} días consecutivos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">40 min diarios</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
