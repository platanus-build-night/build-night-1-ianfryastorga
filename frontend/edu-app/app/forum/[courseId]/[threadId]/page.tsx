"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react"

// Datos de ejemplo
const threadsData = {
  t1: {
    id: "t1",
    title: "¿Cómo resolver ecuaciones cuadráticas?",
    content:
      "Estoy teniendo problemas para entender cómo resolver ecuaciones cuadráticas. He intentado usar la fórmula general, pero a veces me confundo con los signos. ¿Alguien podría explicarme paso a paso cómo resolver ecuaciones como x² + 5x + 6 = 0?",
    author: {
      name: "Carlos Rodríguez",
      avatar: "/placeholder.svg",
    },
    course: "Matemáticas Básicas",
    courseId: "math-101",
    tags: ["duda", "álgebra"],
    votes: 12,
    createdAt: "2023-05-15T10:30:00Z",
    replies: [
      {
        id: "r1",
        content:
          "Para resolver ecuaciones cuadráticas como x² + 5x + 6 = 0, puedes usar la fórmula general: x = (-b ± √(b² - 4ac)) / 2a, donde a, b y c son los coeficientes de la ecuación ax² + bx + c = 0.\n\nEn tu ejemplo, a = 1, b = 5, c = 6.\n\nSustituyendo en la fórmula:\nx = (-5 ± √(5² - 4×1×6)) / 2×1\nx = (-5 ± √(25 - 24)) / 2\nx = (-5 ± √1) / 2\nx = (-5 ± 1) / 2\n\nEsto nos da dos soluciones:\nx₁ = (-5 + 1) / 2 = -2\nx₂ = (-5 - 1) / 2 = -3\n\nPuedes comprobar que estas soluciones son correctas sustituyéndolas en la ecuación original.",
        author: {
          name: "María López",
          avatar: "/placeholder.svg",
        },
        votes: 8,
        createdAt: "2023-05-15T11:45:00Z",
      },
      {
        id: "r2",
        content:
          "Otra forma de resolver esta ecuación es por factorización. Si puedes expresar el polinomio como un producto de factores, es más fácil encontrar las raíces.\n\nPara x² + 5x + 6 = 0, buscamos dos números que multiplicados den 6 y sumados den 5. Estos números son 2 y 3.\n\nEntonces, x² + 5x + 6 = (x + 2)(x + 3) = 0\n\nPara que un producto sea cero, al menos uno de los factores debe ser cero:\nx + 2 = 0 → x = -2\nx + 3 = 0 → x = -3\n\nEstas son las mismas soluciones que encontramos con la fórmula general.",
        author: {
          name: "Juan Martínez",
          avatar: "/placeholder.svg",
        },
        votes: 5,
        createdAt: "2023-05-15T14:20:00Z",
      },
    ],
  },
  t2: {
    id: "t2",
    title: "Error en bucle for en JavaScript",
    content:
      "Estoy intentando crear un bucle for que recorra un array, pero me está dando un error que no entiendo. Mi código es: for (let i = 0; i <= myArray.length; i++) { console.log(myArray[i]); } ¿Alguien puede ayudarme a identificar el problema?",
    author: {
      name: "María López",
      avatar: "/placeholder.svg",
    },
    course: "Introducción a JavaScript",
    courseId: "prog-101",
    tags: ["error", "bucles"],
    votes: 8,
    createdAt: "2023-05-18T14:45:00Z",
    replies: [
      {
        id: "r1",
        content:
          "El problema está en la condición del bucle. Estás usando `i <= myArray.length`, pero los índices de los arrays en JavaScript comienzan en 0 y terminan en length - 1.\n\nCuando i llega a ser igual a myArray.length, estás intentando acceder a un elemento que no existe (fuera de los límites del array), lo que causa un error.\n\nDeberías cambiar la condición a `i < myArray.length` en lugar de `i <= myArray.length`:\n\n```javascript\nfor (let i = 0; i < myArray.length; i++) {\n  console.log(myArray[i]);\n}\n```\n\nEsto asegurará que solo accedas a elementos válidos del array.",
        author: {
          name: "Pedro Gómez",
          avatar: "/placeholder.svg",
        },
        votes: 12,
        createdAt: "2023-05-18T15:30:00Z",
      },
    ],
  },
}

export default function ThreadPage({
  params,
}: {
  params: { courseId: string; threadId: string }
}) {
  const { courseId, threadId } = params
  const [newReply, setNewReply] = useState("")

  const thread = threadsData[threadId as keyof typeof threadsData]

  if (!thread) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Tema no encontrado</h1>
        <Button asChild>
          <Link href="/forum">Volver al Foro</Link>
        </Button>
      </div>
    )
  }

  const handleSubmitReply = () => {
    // En una aplicación real, aquí enviaríamos la respuesta al servidor
    alert("Respuesta enviada: " + newReply)
    setNewReply("")
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/forum">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al Foro
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{thread.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/10">
                  {thread.course}
                </Badge>
                {thread.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>{thread.votes}</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={thread.author.avatar || "/placeholder.svg"} alt={thread.author.name} />
              <AvatarFallback>{thread.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{thread.author.name}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(thread.createdAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p>{thread.content}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-xl font-bold">Respuestas ({thread.replies.length})</h2>
      </div>

      <div className="space-y-4 mb-8">
        {thread.replies.map((reply) => (
          <Card key={reply.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                  <AvatarFallback>{reply.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{reply.author.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(reply.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-line">{reply.content}</p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{reply.votes}</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-bold">Tu Respuesta</h3>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Escribe tu respuesta aquí..."
            className="min-h-32"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmitReply} disabled={!newReply.trim()}>
            Enviar Respuesta
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
