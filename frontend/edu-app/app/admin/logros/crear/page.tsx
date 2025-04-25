"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Award, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

export default function CreateAchievement() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "language",
    points: "100",
    iconType: "badge",
    isUnlocked: false,
    isVisible: true,
    requiredCompletions: "1"
  })

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // Manejar creación de logro
  const handleCreateAchievement = () => {
    // Validar campos obligatorios
    if (!formData.title || !formData.description || !formData.points) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    // Validar que los puntos sean un número válido
    if (isNaN(Number(formData.points)) || Number(formData.points) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Los puntos deben ser un número positivo",
        variant: "destructive",
      })
      return
    }

    // Aquí iría la lógica para crear el logro en la API

    toast({
      title: "Logro creado",
      description: `El logro "${formData.title}" ha sido creado correctamente.`,
      variant: "success",
    })

    // Redireccionar a la página de logros
    router.push("/admin/logros")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Crear Nuevo Logro</h1>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Nuevo Logro
          </CardTitle>
          <CardDescription>
            Crea un nuevo logro para motivar a los estudiantes en la plataforma UniLingo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Título del logro *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ej: Maestro de idiomas"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe cómo se obtiene este logro"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="category">Categoría *</Label>
                <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="language">Idiomas</SelectItem>
                    <SelectItem value="progress">Progreso</SelectItem>
                    <SelectItem value="streak">Constancia</SelectItem>
                    <SelectItem value="challenge">Desafíos</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="points">Puntos *</Label>
                <Input
                  id="points"
                  name="points"
                  type="number"
                  placeholder="100"
                  value={formData.points}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="iconType">Tipo de icono *</Label>
                <Select name="iconType" value={formData.iconType} onValueChange={(value) => handleSelectChange("iconType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="badge">Insignia</SelectItem>
                    <SelectItem value="medal">Medalla</SelectItem>
                    <SelectItem value="trophy">Trofeo</SelectItem>
                    <SelectItem value="star">Estrella</SelectItem>
                    <SelectItem value="crown">Corona</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="requiredCompletions">Completados requeridos *</Label>
                <Input
                  id="requiredCompletions"
                  name="requiredCompletions"
                  type="number"
                  placeholder="1"
                  value={formData.requiredCompletions}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => handleSwitchChange("isVisible", checked)}
                />
                <Label htmlFor="isVisible">Logro visible para usuarios</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isUnlocked"
                  checked={formData.isUnlocked}
                  onCheckedChange={(checked) => handleSwitchChange("isUnlocked", checked)}
                />
                <Label htmlFor="isUnlocked">Desbloqueado inicialmente</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleCreateAchievement}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Logro
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 