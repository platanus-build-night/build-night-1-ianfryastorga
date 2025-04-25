"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo
const userData = {
  name: "Carlos Rodríguez",
  email: "carlos@ejemplo.com",
  avatar: "/placeholder.svg",
  whatsapp: "+34612345678",
  whatsappReminders: true,
  darkMode: false,
  courses: [
    { id: "math-101", name: "Matemáticas Básicas", enrolled: true },
    { id: "prog-101", name: "Introducción a JavaScript", enrolled: true },
    { id: "science-101", name: "Física Fundamental", enrolled: false },
    { id: "lang-101", name: "Inglés Intermedio", enrolled: false },
  ],
}

export default function SettingsPage() {
  const [user, setUser] = useState(userData)
  const { toast } = useToast()

  const handleSaveProfile = () => {
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios han sido guardados correctamente.",
      variant: "success",
    })
  }

  const handleCourseToggle = (courseId: string) => {
    setUser((prev) => ({
      ...prev,
      courses: prev.courses.map((course) =>
        course.id === courseId ? { ...course, enrolled: !course.enrolled } : course,
      ),
    }))
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Cuenta eliminada",
      description: "Tu cuenta ha sido eliminada permanentemente.",
      variant: "destructive",
    })
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="account">Cuenta</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Gestiona tu información personal y de contacto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Cambiar foto</Button>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="whatsapp">Número de WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={user.whatsapp}
                    onChange={(e) => setUser({ ...user, whatsapp: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Guardar cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cursos</CardTitle>
              <CardDescription>Gestiona los cursos en los que estás inscrito.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.courses.map((course) => (
                <div key={course.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={course.id}
                    checked={course.enrolled}
                    onCheckedChange={() => handleCourseToggle(course.id)}
                  />
                  <Label htmlFor={course.id}>{course.name}</Label>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Guardar cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Configura cómo quieres recibir notificaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="whatsapp-reminders"
                  checked={user.whatsappReminders}
                  onCheckedChange={(checked) => setUser({ ...user, whatsappReminders: checked })}
                />
                <Label htmlFor="whatsapp-reminders">Recordatorios por WhatsApp</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="email-notifications" />
                <Label htmlFor="email-notifications">Notificaciones por correo electrónico</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="push-notifications" />
                <Label htmlFor="push-notifications">Notificaciones push</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Guardar cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cuenta</CardTitle>
              <CardDescription>Gestiona la configuración de tu cuenta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="dark-mode"
                  checked={user.darkMode}
                  onCheckedChange={(checked) => setUser({ ...user, darkMode: checked })}
                />
                <Label htmlFor="dark-mode">Modo oscuro</Label>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Cambiar contraseña</Label>
                <Input id="password" type="password" placeholder="Nueva contraseña" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                <Input id="confirm-password" type="password" placeholder="Confirmar contraseña" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleSaveProfile}>Guardar cambios</Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Eliminar cuenta</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos tus datos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
