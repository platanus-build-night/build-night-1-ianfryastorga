"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, BookOpen, Calendar, CheckCircle, MessageSquare, Trophy, User } from "lucide-react"

// Datos de ejemplo para notificaciones
const notificationsData = {
  unread: [
    {
      id: "1",
      type: "achievement",
      title: "¡Nuevo logro desbloqueado!",
      description: "Has completado tu racha de 7 días consecutivos.",
      time: "Hace 2 horas",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      action: "Ver logros",
    },
    {
      id: "2",
      type: "course",
      title: "Nuevo contenido disponible",
      description: "Se ha añadido una nueva lección en el curso de JavaScript.",
      time: "Hace 5 horas",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      action: "Ver curso",
    },
    {
      id: "3",
      type: "reminder",
      title: "Recordatorio de estudio",
      description: "No olvides completar tu lección diaria para mantener tu racha.",
      time: "Hace 1 día",
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      action: "Estudiar ahora",
    },
  ],
  read: [
    {
      id: "4",
      type: "social",
      title: "Nuevo comentario",
      description: "María ha respondido a tu pregunta en el foro de Matemáticas.",
      time: "Hace 2 días",
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
      action: "Ver comentario",
    },
    {
      id: "5",
      type: "achievement",
      title: "¡Nuevo logro desbloqueado!",
      description: "Has completado el 50% del curso de Python.",
      time: "Hace 3 días",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      action: "Ver logros",
    },
    {
      id: "6",
      type: "social",
      title: "Nuevo seguidor",
      description: "Carlos ha comenzado a seguirte.",
      time: "Hace 5 días",
      icon: <User className="h-5 w-5 text-blue-500" />,
      action: "Ver perfil",
    },
    {
      id: "7",
      type: "course",
      title: "Curso completado",
      description: "¡Felicidades! Has completado el curso de HTML y CSS.",
      time: "Hace 1 semana",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      action: "Ver certificado",
    },
  ],
}

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState(notificationsData)
  const [activeTab, setActiveTab] = useState<"todas" | "no-leidas">("todas")

  // Marcar todas como leídas
  const handleMarkAllAsRead = () => {
    setNotifications({
      read: [...notifications.read, ...notifications.unread],
      unread: [],
    })
    setActiveTab("todas")
  }

  // Marcar una notificación como leída
  const handleMarkAsRead = (id: string) => {
    const notification = notifications.unread.find((n) => n.id === id)
    if (notification) {
      setNotifications({
        unread: notifications.unread.filter((n) => n.id !== id),
        read: [notification, ...notifications.read],
      })
    }
  }

  // Eliminar todas las notificaciones
  const handleClearAll = () => {
    setNotifications({
      unread: [],
      read: [],
    })
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Notificaciones</h1>
          {notifications.unread.length > 0 && <Badge className="ml-2">{notifications.unread.length} nuevas</Badge>}
        </div>
        <div className="flex gap-2">
          {notifications.unread.length > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
          {(notifications.unread.length > 0 || notifications.read.length > 0) && (
            <Button variant="outline" onClick={handleClearAll}>
              Borrar todo
            </Button>
          )}
        </div>
      </div>

      <Tabs
        defaultValue="todas"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "todas" | "no-leidas")}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="no-leidas" disabled={notifications.unread.length === 0}>
            No leídas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todas">
          <Card>
            <CardHeader>
              <CardTitle>Todas las notificaciones</CardTitle>
              <CardDescription>Historial completo de tus notificaciones</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.unread.length === 0 && notifications.read.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes notificaciones</h3>
                  <p className="text-muted-foreground">
                    Las notificaciones aparecerán aquí cuando haya actualizaciones importantes.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.unread.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border-l-4 border-primary"
                    >
                      <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Marcar como leída
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {notifications.read.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-muted-foreground">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="flex-shrink-0">
                            {notification.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="no-leidas">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones no leídas</CardTitle>
              <CardDescription>Notificaciones que aún no has visto</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.unread.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes notificaciones sin leer</h3>
                  <p className="text-muted-foreground">Has leído todas tus notificaciones. ¡Buen trabajo!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.unread.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border-l-4 border-primary"
                    >
                      <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Marcar como leída
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preferencias de notificaciones</CardTitle>
          <CardDescription>Configura qué tipo de notificaciones quieres recibir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Logros y recompensas</p>
                    <p className="text-sm text-muted-foreground">Notificaciones sobre nuevos logros desbloqueados</p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Cursos y lecciones</p>
                    <p className="text-sm text-muted-foreground">Actualizaciones sobre tus cursos y nuevo contenido</p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <Calendar className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Recordatorios</p>
                    <p className="text-sm text-muted-foreground">Recordatorios de estudio y fechas importantes</p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <MessageSquare className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Social</p>
                    <p className="text-sm text-muted-foreground">Comentarios, seguidores y mensajes</p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button className="mt-6 w-full sm:w-auto">Guardar preferencias</Button>
        </CardContent>
      </Card>
    </div>
  )
}
