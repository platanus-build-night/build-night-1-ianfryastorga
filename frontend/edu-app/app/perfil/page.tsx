"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Clock, Shield, Bell, Upload } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Estructura para los datos extendidos del usuario
interface ExtendedUserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  joinDate: string;
  interests: string[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  certificates: {
    name: string;
    issuer: string;
    date: string;
  }[];
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    studyReminders: boolean;
  };
}

// Datos iniciales por defecto
const defaultUserData: ExtendedUserData = {
  id: "",
  name: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  avatar: "/placeholder.svg",
  joinDate: "Reciente",
  interests: [],
  education: [],
  certificates: [],
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    studyReminders: true,
  },
}

export default function PerfilPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user: authUser, isAuthenticated, loading } = useAuth()
  const [user, setUser] = useState<ExtendedUserData>(defaultUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<ExtendedUserData>(defaultUserData)

  // Cargar datos del usuario cuando se autentique
  useEffect(() => {
    if (loading) return

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Si el usuario está autenticado, obtenemos sus datos
    // En una implementación real, aquí se haría una llamada a la API para obtener el perfil completo
    if (authUser) {
      // Simulación: Completamos con datos del perfil extendido
      // En un caso real, estos datos vendrían de una llamada a la API
      const extendedUserData: ExtendedUserData = {
        id: authUser.id,
        name: authUser.name || "Usuario",
        email: authUser.email,
        phone: "+34 612 345 678",
        location: "Madrid, España",
        bio: "Estudiante universitario apasionado por el aprendizaje constante.",
        avatar: "/placeholder.svg",
        joinDate: "Enero 2023", // Simularemos una fecha
        interests: ["Programación", "Matemáticas", "Idiomas"],
        education: [
          {
            institution: "Universidad Politécnica de Madrid",
            degree: "Grado en Ingeniería Informática",
            year: "2020 - Presente",
          }
        ],
        certificates: [
          {
            name: "Fundamentos de Idiomas",
            issuer: "UniLingo",
            date: "Marzo 2023",
          }
        ],
        preferences: {
          emailNotifications: true,
          pushNotifications: false,
          weeklyReports: true,
          studyReminders: true,
        }
      }
      
      setUser(extendedUserData)
      setEditedUser(extendedUserData)
    }
  }, [authUser, isAuthenticated, loading, router])

  // Manejar cambios en los campos de edición
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedUser({
      ...editedUser,
      [name]: value,
    })
  }

  // Manejar cambios en las preferencias
  const handlePreferenceChange = (key: keyof typeof user.preferences, value: boolean) => {
    setEditedUser({
      ...editedUser,
      preferences: {
        ...editedUser.preferences,
        [key]: value,
      },
    })
  }

  // Guardar cambios del perfil
  const handleSaveProfile = () => {
    // En una implementación real, aquí se enviarían los datos al servidor
    setUser(editedUser)
    setIsEditing(false)
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios han sido guardados correctamente.",
      variant: "success",
    })
  }

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center h-[50vh]">
        <div className="text-center">
          <p className="text-lg">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <Tabs defaultValue="informacion" className="space-y-6">
        <TabsList>
          <TabsTrigger value="informacion">Información Personal</TabsTrigger>
          <TabsTrigger value="educacion">Educación y Certificados</TabsTrigger>
          <TabsTrigger value="preferencias">Preferencias</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
        </TabsList>

        {/* Pestaña de Información Personal */}
        <TabsContent value="informacion">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Gestiona tu información personal y de contacto</CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProfile}>Guardar</Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="flex gap-2">
                      <Upload className="h-4 w-4" />
                      Cambiar foto
                    </Button>
                  )}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Miembro desde {user.joinDate}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre completo</Label>
                          <Input id="name" name="name" value={editedUser.name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={editedUser.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input id="phone" name="phone" value={editedUser.phone} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Ubicación</Label>
                          <Input
                            id="location"
                            name="location"
                            value={editedUser.location}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografía</Label>
                        <Textarea id="bio" name="bio" value={editedUser.bio} onChange={handleInputChange} rows={4} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Nombre</p>
                            <p className="font-medium">{user.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Teléfono</p>
                            <p className="font-medium">{user.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Ubicación</p>
                            <p className="font-medium">{user.location}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Biografía</p>
                        <p>{user.bio}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Intereses</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm" className="h-6 rounded-full">
                      + Añadir
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Educación y Certificados */}
        <TabsContent value="educacion">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Educación</CardTitle>
                <CardDescription>Tu historial académico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.education.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium">{edu.institution}</h3>
                        <p className="text-sm">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.year}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Añadir Educación
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificados</CardTitle>
                <CardDescription>Certificados y logros obtenidos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.certificates.map((cert, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium">{cert.name}</h3>
                        <p className="text-sm">{cert.issuer}</p>
                        <p className="text-sm text-muted-foreground">{cert.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Añadir Certificado
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña de Preferencias */}
        <TabsContent value="preferencias">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias</CardTitle>
              <CardDescription>Gestiona tus preferencias de notificaciones y configuración</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Notificaciones</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Notificaciones por email</p>
                        <p className="text-sm text-muted-foreground">
                          Recibe actualizaciones y recordatorios por correo electrónico
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={
                        isEditing ? editedUser.preferences.emailNotifications : user.preferences.emailNotifications
                      }
                      onCheckedChange={(checked) => isEditing && handlePreferenceChange("emailNotifications", checked)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Notificaciones push</p>
                        <p className="text-sm text-muted-foreground">
                          Recibe notificaciones en tiempo real en tu dispositivo
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={
                        isEditing ? editedUser.preferences.pushNotifications : user.preferences.pushNotifications
                      }
                      onCheckedChange={(checked) => isEditing && handlePreferenceChange("pushNotifications", checked)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Informes semanales</p>
                        <p className="text-sm text-muted-foreground">Recibe un resumen semanal de tu progreso</p>
                      </div>
                    </div>
                    <Switch
                      checked={isEditing ? editedUser.preferences.weeklyReports : user.preferences.weeklyReports}
                      onCheckedChange={(checked) => isEditing && handlePreferenceChange("weeklyReports", checked)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Recordatorios de estudio</p>
                        <p className="text-sm text-muted-foreground">
                          Recibe recordatorios para mantener tu racha de estudio
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isEditing ? editedUser.preferences.studyReminders : user.preferences.studyReminders}
                      onCheckedChange={(checked) => isEditing && handlePreferenceChange("studyReminders", checked)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Configuración de la cuenta</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Exportar mis datos
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto text-destructive hover:text-destructive">
                    Desactivar cuenta
                  </Button>
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter>
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProfile}>Guardar Cambios</Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* Pestaña de Seguridad */}
        <TabsContent value="seguridad">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Cambiar contraseña</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Contraseña actual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva contraseña</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Actualizar contraseña</Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Autenticación de dos factores</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Autenticación de dos factores</p>
                      <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad a tu cuenta</p>
                    </div>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Sesiones activas</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Este dispositivo</p>
                        <p className="text-sm text-muted-foreground">
                          Madrid, España • Última actividad: Hace 2 minutos
                        </p>
                      </div>
                      <Badge>Actual</Badge>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">iPhone 13</p>
                        <p className="text-sm text-muted-foreground">Barcelona, España • Última actividad: Ayer</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Cerrar sesión
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Cerrar todas las sesiones
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
