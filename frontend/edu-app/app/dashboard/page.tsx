"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/course-card"
import { StreakFlame } from "@/components/streak-flame"
import { CalendarDays, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { courseApi, Course } from "@/lib/api"
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

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(7)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  // Cargar cursos desde la API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const fetchedCourses = await courseApi.getAllCourses(true) // Solo cursos publicados
        
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

  // Verificar autenticación
  useEffect(() => {
    if (authLoading) return
    
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

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
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id.toString()} 
                  title={course.title}
                  description={course.description}
                  progress={0} // En una implementación real, esto vendría del progreso del usuario
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

          <Card>
            <CardHeader>
              <CardTitle>Consejos Semanales</CardTitle>
              <CardDescription>Consejos personalizados para mejorar tu aprendizaje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{weeklyTips[currentTipIndex].title}</h3>
                  <p className="text-muted-foreground">{weeklyTips[currentTipIndex].description}</p>
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="outline" size="sm" onClick={prevTip}>
                    Anterior
                  </Button>
                  <div className="flex gap-1">
                    {weeklyTips.map((_, index) => (
                      <div
                        key={index}
                        className={cn("w-2 h-2 rounded-full", index === currentTipIndex ? "bg-primary" : "bg-muted")}
                      />
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={nextTip}>
                    Siguiente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximo Examen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium">
                    {examDate.toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tiempo restante</p>
                  <p className="font-medium">{daysRemaining} días</p>
                </div>
              </div>

              <div className="mt-4">
                <Button className="w-full">Ver plan de estudio</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tu Racha</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <StreakFlame streak={streak} className="h-12 w-12" />
                <p className="text-center text-muted-foreground">
                  ¡Has estudiado durante {streak} días consecutivos! Mantén tu racha para ganar más puntos.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/estadisticas">Ver estadísticas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
