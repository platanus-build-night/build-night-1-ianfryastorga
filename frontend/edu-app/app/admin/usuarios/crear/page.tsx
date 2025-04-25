"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

export default function CreateUser() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    language: "spanish",
    isActive: true,
    sendWelcomeEmail: true
  })

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio en select
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio en switch
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Validar que el correo electrónico tenga un formato válido
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Manejar creación de usuario
  const handleCreateUser = () => {
    // Validar campos obligatorios
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    // Validar formato de correo electrónico
    if (!isValidEmail(formData.email)) {
      toast({
        title: "Formato inválido",
        description: "Por favor ingresa un correo electrónico válido",
        variant: "destructive",
      })
      return
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Por favor verifica que las contraseñas sean iguales",
        variant: "destructive",
      })
      return
    }

    // Validar longitud mínima de contraseña
    if (formData.password.length < 8) {
      toast({
        title: "Contraseña insegura",
        description: "La contraseña debe tener al menos 8 caracteres",
        variant: "destructive",
      })
      return
    }

    // Aquí iría la lógica para crear el usuario en la API

    toast({
      title: "Usuario creado",
      description: `El usuario ${formData.firstName} ${formData.lastName} ha sido creado correctamente.`,
      variant: "success",
    })

    // Redireccionar a la página de usuarios
    router.push("/admin/usuarios")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Crear Nuevo Usuario</h1>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Nuevo Usuario
          </CardTitle>
          <CardDescription>
            Crea un nuevo usuario para la plataforma UniLingo. Completa los campos a continuación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="role">Rol *</Label>
                <Select name="role" value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Estudiante</SelectItem>
                    <SelectItem value="teacher">Profesor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="language">Idioma preferido</Label>
                <Select name="language" value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="english">Inglés</SelectItem>
                    <SelectItem value="french">Francés</SelectItem>
                    <SelectItem value="portuguese">Portugués</SelectItem>
                    <SelectItem value="german">Alemán</SelectItem>
                    <SelectItem value="italian">Italiano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                />
                <Label htmlFor="isActive">Activar cuenta inmediatamente</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="sendWelcomeEmail"
                  checked={formData.sendWelcomeEmail}
                  onCheckedChange={(checked) => handleSwitchChange("sendWelcomeEmail", checked)}
                />
                <Label htmlFor="sendWelcomeEmail">Enviar correo de bienvenida</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleCreateUser}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Usuario
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 