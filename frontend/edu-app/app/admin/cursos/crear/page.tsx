"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, BookOpen, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

export default function CreateCourse() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "english",
    level: "beginner",
    duration: "8",
    isPublished: false,
    hasCertificate: true,
    tags: "",
    thumbnail: "",
    instructorId: "" // Este valor vendría de la base de datos
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

  // Manejar creación de curso
  const handleCreateCourse = () => {
    // Validar campos obligatorios
    if (!formData.title || !formData.description || !formData.language || !formData.level) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    // Validar que la duración sea un número válido
    if (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      toast({
        title: "Valor inválido",
        description: "La duración debe ser un número positivo",
        variant: "destructive",
      })
      return
    }

    // Aquí iría la lógica para crear el curso en la API

    toast({
      title: "Curso creado",
      description: `El curso "${formData.title}" ha sido creado correctamente.`,
      variant: "success",
    })

    // Redireccionar a la página de cursos
    router.push("/admin/cursos")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Crear Nuevo Curso</h1>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Nuevo Curso
          </CardTitle>
          <CardDescription>
            Crea un nuevo curso para la plataforma UniLingo. Completa los campos a continuación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Título del curso *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ej: Inglés para principiantes"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe el contenido y objetivos del curso"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="language">Idioma *</Label>
                <Select name="language" value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">Inglés</SelectItem>
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="french">Francés</SelectItem>
                    <SelectItem value="german">Alemán</SelectItem>
                    <SelectItem value="portuguese">Portugués</SelectItem>
                    <SelectItem value="italian">Italiano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="level">Nivel *</Label>
                <Select name="level" value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Principiante</SelectItem>
                    <SelectItem value="intermediate">Intermedio</SelectItem>
                    <SelectItem value="advanced">Avanzado</SelectItem>
                    <SelectItem value="expert">Experto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="duration">Duración (semanas) *</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  placeholder="8"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="Ej: universidad, idiomas, principiantes"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="thumbnail">URL de la imagen del curso</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.thumbnail}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleSwitchChange("isPublished", checked)}
                />
                <Label htmlFor="isPublished">Publicar curso inmediatamente</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="hasCertificate"
                  checked={formData.hasCertificate}
                  onCheckedChange={(checked) => handleSwitchChange("hasCertificate", checked)}
                />
                <Label htmlFor="hasCertificate">Incluye certificado de finalización</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleCreateCourse}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Curso
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 