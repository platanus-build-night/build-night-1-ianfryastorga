"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { CircleCheck, CircleX, School } from "lucide-react"
import { courseApi, Course } from "@/lib/api"
import { setApi, Set } from "@/lib/api"
import { levelApi, Level } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { SetCard } from "@/components/set-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CoursePage() {
  const { id } = useParams()
  const courseId = Array.isArray(id) ? id[0] : id
  const { toast } = useToast()

  const [course, setCourse] = useState<Course | null>(null)
  const [sets, setSets] = useState<Set[]>([])
  const [levelsMap, setLevelsMap] = useState<Record<number, Level[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const courseData = await courseApi.getCourseById(courseId)
        setCourse(courseData)
        
        const setsData = await setApi.getSetsByCourse(courseId)
        setSets(setsData)
        
        // Cargar los niveles para cada conjunto
        const levelsData: Record<number, Level[]> = {}
        
        for (const set of setsData) {
          try {
            const setLevels = await levelApi.getLevelsBySet(set.id.toString())
            levelsData[set.id] = setLevels
          } catch (err) {
            console.error(`Error fetching levels for set ${set.id}:`, err)
            levelsData[set.id] = []
          }
        }
        
        setLevelsMap(levelsData)
        setError(null)
      } catch (err) {
        console.error("Error fetching course data:", err)
        setError("No se pudo cargar el curso. Por favor, inténtalo de nuevo más tarde.")
        toast({
          title: "Error",
          description: "No se pudo cargar los datos del curso",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId, toast])

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Cargando curso...</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="container py-8">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleX className="h-5 w-5 text-destructive" />
              Error al cargar el curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "No se encontró el curso solicitado"}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.history.back()}>
              Volver atrás
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Calcular el progreso general del curso
  const allLevels = Object.values(levelsMap).flat()
  const totalLevels = allLevels.length
  // Por ahora, suponemos que ningún nivel está completado
  // Esto debe actualizarse con la lógica real de progreso cuando esté disponible
  const completedLevels = 0
  const progress = totalLevels === 0 ? 0 : Math.round((completedLevels / totalLevels) * 100)

  return (
    <div className="container py-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5 text-primary" />
              {course.title}
            </CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-2">
                <CircleCheck className="h-5 w-5 text-primary" />
                <span>Progreso: {progress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Conjuntos</h2>
          
          {sets.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Este curso aún no tiene conjuntos disponibles.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sets.map((set) => (
                <SetCard
                  key={set.id}
                  id={set.id.toString()}
                  courseId={courseId}
                  title={set.title}
                  description={set.description}
                  levels={(levelsMap[set.id] || []).map(level => ({
                    id: level.id,
                    title: level.title,
                    completed: false // Esto se debe actualizar con el estado real de completado
                  }))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
