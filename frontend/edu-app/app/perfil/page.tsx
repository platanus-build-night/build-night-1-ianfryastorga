"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Upload } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
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

// Estructura simplificada para los datos del usuario
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// Datos iniciales por defecto
const defaultUserData: UserProfile = {
  id: "",
  name: "",
  email: "",
  avatar: "/placeholder.svg",
}

export default function PerfilPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user: authUser, isAuthenticated, loading, logout } = useAuth()
  const [user, setUser] = useState<UserProfile>(defaultUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<UserProfile>(defaultUserData)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Cargar datos del usuario cuando se autentique
  useEffect(() => {
    if (loading) return

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Si el usuario está autenticado, obtenemos sus datos básicos
    if (authUser) {
      const profileData: UserProfile = {
        id: authUser.id,
        name: authUser.name || "Usuario",
        email: authUser.email,
        avatar: "/placeholder.svg",
      }
      
      setUser(profileData)
      setEditedUser(profileData)
    }
  }, [authUser, isAuthenticated, loading, router])

  // Manejar cambios en los campos de edición
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedUser({
      ...editedUser,
      [name]: value,
    })
  }

  // Manejar cambios en los campos de contraseña
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
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

  // Actualizar contraseña
  const handleUpdatePassword = () => {
    // Validar que la nueva contraseña y la confirmación coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }

    // En una implementación real, aquí se enviaría la petición al servidor
    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido actualizada correctamente.",
      variant: "success",
    })

    // Limpiar los campos
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  // Eliminar cuenta
  const handleDeleteAccount = () => {
    // En una implementación real, aquí se enviaría la petición al servidor
    toast({
      title: "Cuenta eliminada",
      description: "Tu cuenta ha sido eliminada permanentemente.",
      variant: "destructive",
    })
    
    // Cerrar sesión y redirigir al inicio
    logout()
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

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Gestiona tu información básica</CardDescription>
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
            </div>

            <div className="flex-1 space-y-4">
              {isEditing ? (
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
                      readOnly
                    />
                  </div>
                </div>
              ) : (
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
                </div>
              )}
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
          <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Contraseña actual</Label>
              <Input 
                id="current-password" 
                name="currentPassword"
                type="password" 
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva contraseña</Label>
              <Input 
                id="new-password" 
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
              <Input 
                id="confirm-password" 
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <Button onClick={handleUpdatePassword}>Actualizar contraseña</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Eliminar cuenta</CardTitle>
          <CardDescription>Elimina permanentemente tu cuenta y toda tu información</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Eliminar mi cuenta</Button>
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
        </CardContent>
      </Card>
    </div>
  )
}
