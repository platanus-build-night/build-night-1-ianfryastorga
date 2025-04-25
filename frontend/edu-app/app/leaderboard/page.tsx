"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Medal } from "lucide-react"

// Datos de ejemplo
const globalLeaderboardData = [
  { id: 1, name: "Ana García", avatar: "/placeholder.svg", xp: 12500, streak: 45, weeklyChange: 2 },
  { id: 2, name: "Carlos Rodríguez", avatar: "/placeholder.svg", xp: 10800, streak: 30, weeklyChange: -1 },
  { id: 3, name: "María López", avatar: "/placeholder.svg", xp: 9600, streak: 25, weeklyChange: 1 },
  { id: 4, name: "Juan Martínez", avatar: "/placeholder.svg", xp: 8200, streak: 15, weeklyChange: 0 },
  { id: 5, name: "Laura Sánchez", avatar: "/placeholder.svg", xp: 7500, streak: 20, weeklyChange: 3 },
  { id: 6, name: "Pedro Gómez", avatar: "/placeholder.svg", xp: 6800, streak: 12, weeklyChange: -2 },
  { id: 7, name: "Sofía Fernández", avatar: "/placeholder.svg", xp: 6200, streak: 18, weeklyChange: 1 },
  { id: 8, name: "Miguel Torres", avatar: "/placeholder.svg", xp: 5500, streak: 10, weeklyChange: 0 },
  { id: 9, name: "Carmen Ruiz", avatar: "/placeholder.svg", xp: 4800, streak: 8, weeklyChange: 2 },
  { id: 10, name: "David Moreno", avatar: "/placeholder.svg", xp: 4200, streak: 5, weeklyChange: -1 },
]

const courseLeaderboardData = {
  "math-101": [
    { id: 1, name: "Laura Sánchez", avatar: "/placeholder.svg", xp: 4200, streak: 20, weeklyChange: 1 },
    { id: 2, name: "Carlos Rodríguez", avatar: "/placeholder.svg", xp: 3800, streak: 30, weeklyChange: 0 },
    { id: 3, name: "Ana García", avatar: "/placeholder.svg", xp: 3500, streak: 45, weeklyChange: 2 },
    { id: 4, name: "Miguel Torres", avatar: "/placeholder.svg", xp: 3200, streak: 10, weeklyChange: 3 },
    { id: 5, name: "María López", avatar: "/placeholder.svg", xp: 2800, streak: 25, weeklyChange: -1 },
  ],
  "prog-101": [
    { id: 1, name: "Ana García", avatar: "/placeholder.svg", xp: 5600, streak: 45, weeklyChange: 0 },
    { id: 2, name: "Juan Martínez", avatar: "/placeholder.svg", xp: 4900, streak: 15, weeklyChange: 2 },
    { id: 3, name: "Sofía Fernández", avatar: "/placeholder.svg", xp: 4200, streak: 18, weeklyChange: 1 },
    { id: 4, name: "Carlos Rodríguez", avatar: "/placeholder.svg", xp: 3800, streak: 30, weeklyChange: -1 },
    { id: 5, name: "Pedro Gómez", avatar: "/placeholder.svg", xp: 3500, streak: 12, weeklyChange: 0 },
  ],
  "science-101": [
    { id: 1, name: "María López", avatar: "/placeholder.svg", xp: 4800, streak: 25, weeklyChange: 1 },
    { id: 2, name: "David Moreno", avatar: "/placeholder.svg", xp: 4100, streak: 5, weeklyChange: 3 },
    { id: 3, name: "Carmen Ruiz", avatar: "/placeholder.svg", xp: 3900, streak: 8, weeklyChange: 0 },
    { id: 4, name: "Laura Sánchez", avatar: "/placeholder.svg", xp: 3600, streak: 20, weeklyChange: -2 },
    { id: 5, name: "Miguel Torres", avatar: "/placeholder.svg", xp: 3200, streak: 10, weeklyChange: 1 },
  ],
}

const courses = [
  { id: "global", name: "Global" },
  { id: "math-101", name: "Matemáticas Básicas" },
  { id: "prog-101", name: "Introducción a JavaScript" },
  { id: "science-101", name: "Física Fundamental" },
]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("global")

  const getLeaderboardData = () => {
    if (activeTab === "global") {
      return globalLeaderboardData
    }
    return courseLeaderboardData[activeTab as keyof typeof courseLeaderboardData] || []
  }

  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900">
          <Medal className="h-5 w-5 text-yellow-500" />
        </div>
      )
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800">
          <Medal className="h-5 w-5 text-gray-400" />
        </div>
      )
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900">
          <Medal className="h-5 w-5 text-amber-600" />
        </div>
      )
    }
    return (
      <div className="flex items-center justify-center w-8 h-8">
        <span className="text-lg font-bold">{rank}</span>
      </div>
    )
  }

  const renderWeeklyChange = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-pastel-green">
          <ArrowUp className="h-4 w-4 mr-1" />
          <span>{change}</span>
        </div>
      )
    }
    if (change < 0) {
      return (
        <div className="flex items-center text-destructive">
          <ArrowDown className="h-4 w-4 mr-1" />
          <span>{Math.abs(change)}</span>
        </div>
      )
    }
    return (
      <div className="flex items-center text-muted-foreground">
        <span>-</span>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Tabla de Clasificación</h1>

      <Tabs defaultValue="global" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          {courses.map((course) => (
            <TabsTrigger key={course.id} value={course.id}>
              {course.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {courses.map((course) => (
          <TabsContent key={course.id} value={course.id}>
            <Card>
              <CardHeader>
                <CardTitle>Clasificación de {course.name === "Global" ? "Todos los Cursos" : course.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Posición</th>
                        <th className="text-left py-3 px-4 font-medium">Usuario</th>
                        <th className="text-right py-3 px-4 font-medium">XP</th>
                        <th className="text-right py-3 px-4 font-medium">Racha</th>
                        <th className="text-right py-3 px-4 font-medium">Cambio Semanal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getLeaderboardData().map((user, index) => (
                        <tr key={user.id} className="border-b last:border-0">
                          <td className="py-3 px-4">{renderRankBadge(index + 1)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-bold rounded-number">{user.xp.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="outline" className="bg-primary/10">
                              {user.streak} días
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">{renderWeeklyChange(user.weeklyChange)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
