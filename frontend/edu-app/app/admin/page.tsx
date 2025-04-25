"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  FileQuestion,
  Users,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  BookOpenCheck,
  CheckCircle2,
} from "lucide-react"

// Datos de ejemplo para el dashboard
const statsData = {
  totalUsers: 1250,
  newUsersToday: 24,
  usersTrend: 8.2, // porcentaje de crecimiento
  totalCourses: 45,
  newCoursesToday: 2,
  coursesTrend: 4.5,
  totalCompletions: 3750,
  newCompletionsToday: 120,
  completionsTrend: 12.3,
  totalQuestions: 2800,
  questionsAnswered: 42500,
  questionsTrend: 5.7,
}

const userActivityData = [
  { date: "Lun", active: 450 },
  { date: "Mar", active: 520 },
  { date: "Mié", active: 480 },
  { date: "Jue", active: 560 },
  { date: "Vie", active: 620 },
  { date: "Sáb", active: 350 },
  { date: "Dom", active: 280 },
]

const courseCompletionData = [
  { month: "Ene", completions: 220 },
  { month: "Feb", completions: 240 },
  { month: "Mar", completions: 280 },
  { month: "Abr", completions: 250 },
  { month: "May", completions: 320 },
  { month: "Jun", completions: 380 },
  { month: "Jul", completions: 420 },
]

const recentUsers = [
  { id: 1, name: "Ana García", email: "ana@ejemplo.com", role: "student", joinDate: "2023-07-15T10:30:00Z" },
  { id: 2, name: "Carlos Rodríguez", email: "carlos@ejemplo.com", role: "student", joinDate: "2023-07-14T14:45:00Z" },
  { id: 3, name: "María López", email: "maria@ejemplo.com", role: "teacher", joinDate: "2023-07-14T09:15:00Z" },
  { id: 4, name: "Juan Martínez", email: "juan@ejemplo.com", role: "student", joinDate: "2023-07-13T16:20:00Z" },
  { id: 5, name: "Laura Sánchez", email: "laura@ejemplo.com", role: "admin", joinDate: "2023-07-13T11:10:00Z" },
]

const recentCourses = [
  {
    id: "math-101",
    title: "Matemáticas Básicas",
    author: "María López",
    students: 120,
    createdAt: "2023-07-10T10:00:00Z",
  },
  {
    id: "prog-101",
    title: "Introducción a JavaScript",
    author: "Carlos Rodríguez",
    students: 85,
    createdAt: "2023-07-08T14:30:00Z",
  },
  {
    id: "science-101",
    title: "Física Fundamental",
    author: "Juan Martínez",
    students: 95,
    createdAt: "2023-07-05T09:15:00Z",
  },
]

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <Badge variant="outline" className="text-sm">
          Administrador
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Usuarios Totales</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold">{statsData.totalUsers.toLocaleString()}</p>
                  <Badge
                    variant="outline"
                    className={statsData.usersTrend > 0 ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"}
                  >
                    {statsData.usersTrend > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(statsData.usersTrend)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">+{statsData.newUsersToday} hoy</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Cursos Totales</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold">{statsData.totalCourses.toLocaleString()}</p>
                  <Badge
                    variant="outline"
                    className={statsData.coursesTrend > 0 ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"}
                  >
                    {statsData.coursesTrend > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(statsData.coursesTrend)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">+{statsData.newCoursesToday} hoy</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Cursos Completados</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold">{statsData.totalCompletions.toLocaleString()}</p>
                  <Badge
                    variant="outline"
                    className={statsData.completionsTrend > 0 ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"}
                  >
                    {statsData.completionsTrend > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(statsData.completionsTrend)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">+{statsData.newCompletionsToday} hoy</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Preguntas Respondidas</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold">{statsData.questionsAnswered.toLocaleString()}</p>
                  <Badge
                    variant="outline"
                    className={statsData.questionsTrend > 0 ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"}
                  >
                    {statsData.questionsTrend > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(statsData.questionsTrend)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">De {statsData.totalQuestions} preguntas</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <FileQuestion className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Activos</CardTitle>
            <CardDescription>Usuarios activos por día en la última semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart
                data={userActivityData}
                categories={["active"]}
                index="date"
                colors={["#2065D1"]}
                valueFormatter={(value) => `${value} usuarios`}
                yAxisWidth={48}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos Completados</CardTitle>
            <CardDescription>Tendencia de completados por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart
                data={courseCompletionData}
                categories={["completions"]}
                index="month"
                colors={["#2065D1"]}
                valueFormatter={(value) => `${value} completados`}
                yAxisWidth={48}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Usuarios Recientes</CardTitle>
              <CardDescription>Últimos usuarios registrados en la plataforma</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        user.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : user.role === "teacher"
                            ? "bg-green-100 text-green-700"
                            : "bg-muted"
                      }
                    >
                      {user.role}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.joinDate).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Cursos Recientes</CardTitle>
              <CardDescription>Últimos cursos creados en la plataforma</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground">Por {course.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-muted">
                      {course.students} estudiantes
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(course.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
