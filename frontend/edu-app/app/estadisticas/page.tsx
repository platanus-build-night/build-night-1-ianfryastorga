"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StreakFlame } from "@/components/streak-flame"
import { BarChart, LineChart } from "@/components/ui/chart"
import { ArrowDown, ArrowUp, Calendar, Clock, Medal, Target, Trophy, Users } from "lucide-react"
import { cn } from "@/lib/utils"

// Datos de ejemplo
const userData = {
  name: "Carlos Rodríguez",
  avatar: "/placeholder.svg",
  streak: {
    current: 7,
    max: 15,
    total: 45,
  },
  xp: {
    total: 10800,
    weekly: 1250,
    monthly: 4500,
  },
  courses: [
    { id: "math-101", name: "Matemáticas Básicas", progress: 65, color: "#2065D1" },
    { id: "prog-101", name: "Introducción a JavaScript", progress: 32, color: "#7928CA" },
    { id: "science-101", name: "Física Fundamental", progress: 78, color: "#FF4500" },
  ],
  activity: [
    { date: "Lunes", sessions: 3, xp: 320 },
    { date: "Martes", sessions: 2, xp: 180 },
    { date: "Miércoles", sessions: 4, xp: 420 },
    { date: "Jueves", sessions: 1, xp: 100 },
    { date: "Viernes", sessions: 3, xp: 280 },
    { date: "Sábado", sessions: 5, xp: 500 },
    { date: "Domingo", sessions: 2, xp: 220 },
  ],
  monthlyProgress: [
    { month: "Ene", xp: 2200 },
    { month: "Feb", xp: 2800 },
    { month: "Mar", xp: 3100 },
    { month: "Abr", xp: 2600 },
    { month: "May", xp: 3400 },
    { month: "Jun", xp: 4200 },
  ],
  achievements: [
    { id: 1, name: "Primera Lección", description: "Completaste tu primera lección", date: "15/03/2023", icon: "🎓" },
    { id: 2, name: "Racha de 7 días", description: "Mantuviste una racha de 7 días", date: "22/03/2023", icon: "🔥" },
    {
      id: 3,
      name: "Maestro de Matemáticas",
      description: "Completaste el curso de Matemáticas Básicas",
      date: "10/04/2023",
      icon: "🧮",
    },
    { id: 4, name: "1000 XP", description: "Acumulaste 1000 puntos de experiencia", date: "15/04/2023", icon: "⭐" },
  ],
}

// Datos de clasificación
const leaderboardData = [
  { id: 1, name: "Ana García", avatar: "/placeholder.svg", xp: 12500, streak: 45, weeklyChange: 2 },
  { id: 2, name: "Carlos Rodríguez", avatar: "/placeholder.svg", xp: 10800, streak: 30, weeklyChange: -1 },
  { id: 3, name: "María López", avatar: "/placeholder.svg", xp: 9600, streak: 25, weeklyChange: 1 },
  { id: 4, name: "Juan Martínez", avatar: "/placeholder.svg", xp: 8200, streak: 15, weeklyChange: 0 },
  { id: 5, name: "Laura Sánchez", avatar: "/placeholder.svg", xp: 7500, streak: 20, weeklyChange: 3 },
]

export default function EstadisticasPage() {
  const [activeTab, setActiveTab] = useState("resumen")

  const renderWeeklyChange = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-green-500">
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
      <h1 className="text-3xl font-bold mb-6">Mis Estadísticas</h1>

      <Tabs defaultValue="resumen" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="progreso">Progreso</TabsTrigger>
          <TabsTrigger value="logros">Logros</TabsTrigger>
          <TabsTrigger value="clasificacion">Clasificación</TabsTrigger>
        </TabsList>

        {/* Pestaña de Resumen */}
        <TabsContent value="resumen" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta de perfil */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback>{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{userData.name}</h3>
                    <p className="text-muted-foreground">Estudiante Avanzado</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      Nivel 8
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      {userData.xp.total.toLocaleString()} XP
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tarjeta de racha */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Racha</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <StreakFlame streak={userData.streak.current} className="h-16 w-16" />
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">{userData.streak.current} días</h3>
                    <p className="text-muted-foreground">Racha actual</p>
                  </div>
                  <div className="grid grid-cols-2 w-full gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold">{userData.streak.max}</p>
                      <p className="text-xs text-muted-foreground">Racha máxima</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{userData.streak.total}</p>
                      <p className="text-xs text-muted-foreground">Días totales</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tarjeta de XP */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Experiencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">XP Total</p>
                      <p className="text-2xl font-bold">{userData.xp.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-muted-foreground">Esta semana</p>
                      <p className="text-xl font-bold">{userData.xp.weekly.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-muted-foreground">Este mes</p>
                      <p className="text-xl font-bold">{userData.xp.monthly.toLocaleString()}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de actividad semanal */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Semanal</CardTitle>
              <CardDescription>Tu actividad durante los últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart
                  data={userData.activity}
                  categories={["xp"]}
                  index="date"
                  colors={["#2065D1"]}
                  valueFormatter={(value) => `${value} XP`}
                  yAxisWidth={48}
                />
              </div>
            </CardContent>
          </Card>

          {/* Cursos en progreso */}
          <Card>
            <CardHeader>
              <CardTitle>Cursos en Progreso</CardTitle>
              <CardDescription>Tu avance en los cursos actuales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.courses.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{course.name}</span>
                      <span className="text-muted-foreground">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${course.progress}%`, backgroundColor: course.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Progreso */}
        <TabsContent value="progreso" className="space-y-6">
          {/* Gráfico de progreso mensual */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso Mensual</CardTitle>
              <CardDescription>Tu progreso durante los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart
                  data={userData.monthlyProgress}
                  categories={["xp"]}
                  index="month"
                  colors={["#2065D1"]}
                  valueFormatter={(value) => `${value} XP`}
                  yAxisWidth={48}
                />
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas detalladas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">85%</h3>
                  <p className="text-sm text-muted-foreground">Precisión promedio</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">45 min</h3>
                  <p className="text-sm text-muted-foreground">Tiempo diario promedio</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">120</h3>
                  <p className="text-sm text-muted-foreground">Lecciones completadas</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">15</h3>
                  <p className="text-sm text-muted-foreground">Logros desbloqueados</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribución de estudio */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Estudio</CardTitle>
              <CardDescription>Tiempo dedicado a cada curso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.courses.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{course.name}</span>
                      <span className="text-muted-foreground">{Math.round((course.progress / 100) * 24)} horas</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${course.progress}%`, backgroundColor: course.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Logros */}
        <TabsContent value="logros" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mis Logros</CardTitle>
              <CardDescription>Logros desbloqueados durante tu aprendizaje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.achievements.map((achievement) => (
                  <Card key={achievement.id} className="border border-muted">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="flex-shrink-0 text-4xl">{achievement.icon}</div>
                      <div>
                        <h3 className="font-bold">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">Desbloqueado: {achievement.date}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Logros por desbloquear */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Logros</CardTitle>
              <CardDescription>Logros que puedes desbloquear pronto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-muted bg-muted/50">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex-shrink-0 text-4xl opacity-50">🏆</div>
                    <div>
                      <h3 className="font-bold">Racha de 10 días</h3>
                      <p className="text-sm text-muted-foreground">Mantén una racha de 10 días consecutivos</p>
                      <p className="text-xs text-primary mt-2">Progreso: 7/10 días</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-muted bg-muted/50">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex-shrink-0 text-4xl opacity-50">💻</div>
                    <div>
                      <h3 className="font-bold">Programador Junior</h3>
                      <p className="text-sm text-muted-foreground">Completa el curso de Introducción a JavaScript</p>
                      <p className="text-xs text-primary mt-2">Progreso: 32%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Clasificación */}
        <TabsContent value="clasificacion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tabla de Clasificación</CardTitle>
              <CardDescription>Tu posición entre los mejores estudiantes</CardDescription>
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
                    {leaderboardData.map((user, index) => (
                      <tr
                        key={user.id}
                        className={cn("border-b last:border-0", user.name === userData.name ? "bg-primary/5" : "")}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center w-8 h-8">
                            {index === 0 ? (
                              <Medal className="h-5 w-5 text-yellow-500" />
                            ) : index === 1 ? (
                              <Medal className="h-5 w-5 text-gray-400" />
                            ) : index === 2 ? (
                              <Medal className="h-5 w-5 text-amber-600" />
                            ) : (
                              <span className="text-lg font-bold">{index + 1}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className={cn("font-medium", user.name === userData.name ? "font-bold" : "")}>
                              {user.name}
                              {user.name === userData.name && " (Tú)"}
                            </span>
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
              <div className="mt-4 flex justify-center">
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Ver clasificación completa
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mis Medallas */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Medallas</CardTitle>
              <CardDescription>Medallas obtenidas en competiciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border border-muted">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="text-4xl">🥇</div>
                    <h3 className="font-bold">Oro</h3>
                    <p className="text-sm text-muted-foreground">Competición de Matemáticas - Marzo 2023</p>
                  </CardContent>
                </Card>
                <Card className="border border-muted">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="text-4xl">🥈</div>
                    <h3 className="font-bold">Plata</h3>
                    <p className="text-sm text-muted-foreground">Desafío de Programación - Abril 2023</p>
                  </CardContent>
                </Card>
                <Card className="border border-muted">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="text-4xl">🥉</div>
                    <h3 className="font-bold">Bronce</h3>
                    <p className="text-sm text-muted-foreground">Maratón de Física - Mayo 2023</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
