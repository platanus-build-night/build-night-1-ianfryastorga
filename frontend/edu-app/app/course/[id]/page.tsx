"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { CircleCheck, CircleX, School } from "lucide-react"
import { courseApi, Course } from "@/lib/api"
import { setApi, Set } from "@/lib/api"
import { levelApi, Level } from "@/lib/api"
import { userAnswerApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { SetCard } from "@/components/set-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface LevelProgress {
  levelId: number;
  levelTitle: string;
  totalQuestions: number;
  answeredCorrectly: number;
  progress: number;
  questionIds: number[];
}

interface UserProgressData {
  user: {
    id: string;
    name: string;
    email: string;
  };
  overall: {
    totalQuestionsAnswered: number;
    uniqueQuestionsAnswered: number;
    totalCorrectAnswers: number;
    accuracy: number;
  };
  progressByLevel: LevelProgress[];
}

export default function CoursePage() {
  // Acceder a los parámetros directamente sin usar use()
  const params = useParams();
  const id = params.id;
  const courseId = Array.isArray(id) ? id[0] : id;
  const { toast } = useToast()

  const [course, setCourse] = useState<Course | null>(null)
  const [sets, setSets] = useState<Set[]>([])
  const [levelsMap, setLevelsMap] = useState<Record<number, Level[]>>({})
  const [levelProgressMap, setLevelProgressMap] = useState<Record<number, number>>({})
  const [userProgress, setUserProgress] = useState<UserProgressData | null>(null)
  const [courseProgress, setCourseProgress] = useState(0)
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
        
        // Obtener el progreso del usuario
        try {
          const userJson = localStorage.getItem('user')
          if (userJson) {
            const user = JSON.parse(userJson)
            const progress = await userAnswerApi.getUserProgress(user.id)
            setUserProgress(progress)
            
            // Crear mapa de progreso por nivel
            const levelProgress: Record<number, number> = {}
            if (progress && progress.progressByLevel) {
              progress.progressByLevel.forEach(level => {
                levelProgress[level.levelId] = level.progress
              })
            }
            setLevelProgressMap(levelProgress)
            
            // Calcular progreso general del curso
            // Filtramos solo los niveles de este curso
            const courseLevelIds = Object.values(levelsData).flat().map(level => level.id)
            const courseLevelProgress = progress.progressByLevel.filter(level => 
              courseLevelIds.includes(level.levelId)
            )
            
            if (courseLevelProgress.length > 0) {
              const totalProgress = courseLevelProgress.reduce((sum, level) => sum + level.progress, 0)
              const avgProgress = Math.round(totalProgress / courseLevelProgress.length)
              setCourseProgress(avgProgress)
            }
          }
        } catch (err) {
          console.error("Error fetching user progress:", err)
          // No establecemos error aquí para no bloquear la carga del curso
        }
        
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
            <div className="space-y-4">
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Progreso del curso</span>
                    <span className="text-sm font-medium">{courseProgress}%</span>
                  </div>
                  <Progress value={courseProgress} className="h-2" />
                </div>
              </div>
              
              {course.estimated_duration && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CircleCheck className="h-4 w-4 text-primary" />
                  <span>Duración estimada: {course.estimated_duration} horas</span>
                </div>
              )}
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
                    completed: levelProgressMap[level.id] === 100, // Nivel completado si el progreso es 100%
                    progress: levelProgressMap[level.id] || 0 // Progreso del nivel según las respuestas
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
