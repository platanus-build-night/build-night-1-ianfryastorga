"use client"

import { useState, useEffect } from "react"
import { userAnswerApi } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressRing } from "@/components/progress-ring"
import { AlertCircle, Book, BookCheck, Check, CheckCircle, Target } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

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
  progressByLevel: Array<{
    levelId: number;
    levelTitle: string;
    totalQuestions: number;
    answeredCorrectly: number;
    progress: number;
    questionIds: number[];
  }>;
}

export default function ProgresoPage() {
  const [progress, setProgress] = useState<UserProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true)
        
        // Obtener el ID del usuario del localStorage
        const userJson = localStorage.getItem('user')
        if (!userJson) {
          setError("Debes iniciar sesión para ver tu progreso")
          setLoading(false)
          return
        }
        
        const user = JSON.parse(userJson)
        
        // Obtener el progreso del usuario
        const userProgress = await userAnswerApi.getUserProgress(user.id)
        setProgress(userProgress)
        setError(null)
      } catch (error) {
        console.error("Error al obtener el progreso:", error)
        setError("No se pudo cargar tu progreso. Por favor, inténtalo de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchProgress()
  }, [])
  
  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Tu Progreso</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Tu Progreso</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (!progress) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Tu Progreso</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No hay datos de progreso disponibles.</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Calcular el progreso general basado en todos los niveles
  const totalAnsweredCorrectly = progress.progressByLevel.reduce((sum, level) => sum + level.answeredCorrectly, 0);
  const totalQuestions = progress.progressByLevel.reduce((sum, level) => sum + level.totalQuestions, 0);
  const overallProgress = totalQuestions > 0 ? Math.round((totalAnsweredCorrectly / totalQuestions) * 100) : 0;
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Tu Progreso de Aprendizaje</h1>
      
      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="niveles">Progreso por Nivel</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resumen" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progreso General</CardTitle>
              <CardDescription>Tu avance en todos los cursos y niveles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <ProgressRing 
                  progress={overallProgress} 
                  size={120} 
                  strokeWidth={8} 
                  color="#2065D1" 
                />
                <p className="text-center text-muted-foreground">
                  Has completado <span className="font-bold text-primary">{totalAnsweredCorrectly}</span> de <span className="font-bold">{totalQuestions}</span> preguntas
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Check className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{progress.overall.uniqueQuestionsAnswered}</h3>
                      <p className="text-sm text-muted-foreground">Preguntas únicas respondidas</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{progress.overall.accuracy}%</h3>
                      <p className="text-sm text-muted-foreground">Precisión de respuestas</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Niveles en Progreso</CardTitle>
              <CardDescription>Niveles que has comenzado pero aún no completado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.progressByLevel
                  .filter(level => level.progress > 0 && level.progress < 100)
                  .sort((a, b) => b.progress - a.progress)
                  .map(level => (
                    <div key={level.levelId} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{level.levelTitle}</span>
                        <span className="text-muted-foreground">{level.progress}%</span>
                      </div>
                      <Progress value={level.progress} />
                      <p className="text-xs text-muted-foreground">
                        {level.answeredCorrectly} de {level.totalQuestions} preguntas completadas
                      </p>
                    </div>
                  ))}
                  
                {progress.progressByLevel.filter(level => level.progress > 0 && level.progress < 100).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No tienes niveles en progreso actualmente.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Niveles Completados</CardTitle>
              <CardDescription>Niveles que has completado al 100%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.progressByLevel
                  .filter(level => level.progress === 100)
                  .map(level => (
                    <div key={level.levelId} className="flex items-center gap-4">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{level.levelTitle}</span>
                      <Badge className="ml-auto bg-green-500">100%</Badge>
                    </div>
                  ))}
                
                {progress.progressByLevel.filter(level => level.progress === 100).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No has completado ningún nivel al 100% todavía.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="niveles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Todos los Niveles</CardTitle>
              <CardDescription>Detalle de tu progreso en cada nivel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {progress.progressByLevel
                  .sort((a, b) => a.levelId - b.levelId)
                  .map(level => (
                    <div key={level.levelId} className="space-y-2 border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{level.levelTitle}</h3>
                        <Badge variant={level.progress === 100 ? "default" : "outline"}>
                          {level.progress}%
                        </Badge>
                      </div>
                      <Progress value={level.progress} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{level.answeredCorrectly} de {level.totalQuestions} preguntas</span>
                        <span>
                          {level.progress === 100 ? (
                            <span className="text-green-500 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" /> Completado
                            </span>
                          ) : level.progress > 0 ? (
                            <span className="text-amber-500">En progreso</span>
                          ) : (
                            <span>No iniciado</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                
                {progress.progressByLevel.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No hay datos de progreso por nivel disponibles.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="estadisticas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas Generales</CardTitle>
                <CardDescription>Resumen de tu actividad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total de respuestas:</span>
                    <span className="font-semibold">{progress.overall.totalQuestionsAnswered}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Preguntas únicas respondidas:</span>
                    <span className="font-semibold">{progress.overall.uniqueQuestionsAnswered}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Respuestas correctas:</span>
                    <span className="font-semibold">{progress.overall.totalCorrectAnswers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Precisión:</span>
                    <span className="font-semibold">{progress.overall.accuracy}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Progreso por Nivel</CardTitle>
                <CardDescription>Porcentaje de completitud</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {progress.progressByLevel
                    .sort((a, b) => b.progress - a.progress)
                    .slice(0, 4)
                    .map(level => (
                      <div key={level.levelId} className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <ProgressRing progress={level.progress} size={60} strokeWidth={4} animate={false} />
                        <span className="text-sm mt-2 text-center">{level.levelTitle}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones</CardTitle>
              <CardDescription>Basadas en tu progreso actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.progressByLevel
                  .filter(level => level.progress > 0 && level.progress < 100)
                  .sort((a, b) => a.progress - b.progress)
                  .slice(0, 3)
                  .map(level => (
                    <div key={level.levelId} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Book className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Continúa con {level.levelTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          Te faltan {level.totalQuestions - level.answeredCorrectly} preguntas para completar este nivel.
                        </p>
                      </div>
                    </div>
                  ))}
                
                {progress.progressByLevel.filter(level => level.progress === 0).length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BookCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Explora nuevos niveles</p>
                      <p className="text-sm text-muted-foreground">
                        Tienes {progress.progressByLevel.filter(level => level.progress === 0).length} niveles sin comenzar.
                      </p>
                    </div>
                  </div>
                )}
                
                {progress.overall.accuracy < 80 && (
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Mejora tu precisión</p>
                      <p className="text-sm text-muted-foreground">
                        Tu tasa de aciertos es del {progress.overall.accuracy}%. Repasa los conceptos para mejorarla.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 