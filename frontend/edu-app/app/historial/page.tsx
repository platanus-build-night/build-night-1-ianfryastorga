"use client"

import { useState, useEffect } from "react"
import { userAnswerApi, UserAnswer, questionApi, Question } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface UserAnswerWithQuestion extends UserAnswer {
  question?: Question;
}

export default function HistoryPage() {
  const [answers, setAnswers] = useState<UserAnswerWithQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setLoading(true)
        
        // Obtener el ID del usuario del localStorage
        const userJson = localStorage.getItem('user')
        if (!userJson) {
          setError("Debes iniciar sesión para ver tu historial")
          setLoading(false)
          return
        }
        
        const user = JSON.parse(userJson)
        
        // Obtener las respuestas del usuario
        const userAnswers = await userAnswerApi.getUserAnswers(user.id)
        
        // Para cada respuesta, obtener la pregunta correspondiente
        const answersWithQuestions = await Promise.all(
          userAnswers.map(async (answer) => {
            try {
              const question = await questionApi.getQuestion(answer.questionId)
              return { ...answer, question }
            } catch (error) {
              console.error(`Error al obtener la pregunta ${answer.questionId}:`, error)
              return answer
            }
          })
        )
        
        // Ordenar respuestas por fecha (más recientes primero)
        answersWithQuestions.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })
        
        setAnswers(answersWithQuestions)
        setError(null)
      } catch (error) {
        console.error("Error al obtener el historial:", error)
        setError("No se pudo cargar tu historial de respuestas.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnswers()
  }, [])
  
  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Historial de Respuestas</h1>
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
        <h1 className="text-2xl font-bold mb-6">Historial de Respuestas</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild>
              <a href="/login">Iniciar Sesión</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Historial de Respuestas</h1>
      
      {answers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Aún no has respondido ninguna pregunta.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Pregunta</TableHead>
                  <TableHead>Tu Respuesta</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Intento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {answers.map((answer) => (
                  <TableRow key={answer.id}>
                    <TableCell>
                      {answer.createdAt 
                        ? new Date(answer.createdAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{answer.question?.prompt || `Pregunta ${answer.questionId}`}</TableCell>
                    <TableCell>{answer.userAnswer}</TableCell>
                    <TableCell>
                      {answer.isCorrect 
                        ? <Badge className="bg-green-500"><Check className="h-4 w-4 mr-1" /> Correcta</Badge>
                        : <Badge variant="destructive"><X className="h-4 w-4 mr-1" /> Incorrecta</Badge>
                      }
                    </TableCell>
                    <TableCell>{answer.attemptNumber || 1}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 