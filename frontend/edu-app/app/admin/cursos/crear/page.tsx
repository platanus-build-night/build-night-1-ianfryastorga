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
import { courseApi, CreateCourseDto } from "@/lib/api"

export default function CreateCourse() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateCourseDto>({
    title: "",
    description: "",
    difficulty_level: "beginner",
    estimated_duration: 8,
    is_published: false,
    thumbnail_url: "",
    color: "#2065D1"
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
  const handleCreateCourse = async () => {
    // Validar campos obligatorios
    if (!formData.title || !formData.description) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    // Validar que la duración sea un número válido
    if (typeof formData.estimated_duration === 'string') {
      const duration = Number(formData.estimated_duration);
      if (isNaN(duration) || duration <= 0) {
        toast({
          title: "Valor inválido",
          description: "La duración debe ser un número positivo",
          variant: "destructive",
        })
        return
      }
      
      // Convertir la duración a número
      formData.estimated_duration = duration;
    }

    try {
      setIsLoading(true)
      
      // Enviar petición a la API para crear el curso
      await courseApi.createCourse(formData)
      
      toast({
        title: "Curso creado",
        description: `El curso "${formData.title}" ha sido creado correctamente.`,
        variant: "success",
      })

      // Redireccionar a la página de cursos
      router.push("/admin/cursos")
    } catch (error) {
      console.error("Error al crear curso:", error)
      toast({
        title: "Error al crear el curso",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al crear el curso",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
                <Label htmlFor="difficulty_level">Nivel de dificultad *</Label>
                <Select 
                  name="difficulty_level" 
                  value={formData.difficulty_level || "beginner"} 
                  onValueChange={(value) => handleSelectChange("difficulty_level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Principiante</SelectItem>
                    <SelectItem value="intermediate">Intermedio</SelectItem>
                    <SelectItem value="advanced">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="estimated_duration">Duración estimada (semanas) *</Label>
                <Input
                  id="estimated_duration"
                  name="estimated_duration"
                  type="number"
                  placeholder="8"
                  value={formData.estimated_duration?.toString() || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="thumbnail_url">URL de la imagen del curso</Label>
              <Input
                id="thumbnail_url"
                name="thumbnail_url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.thumbnail_url || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="color">Color (código hexadecimal)</Label>
              <div className="flex gap-3 items-center">
                <Input
                  id="color"
                  name="color"
                  placeholder="#2065D1"
                  value={formData.color || ""}
                  onChange={handleInputChange}
                />
                {formData.color && (
                  <div 
                    className="w-10 h-10 rounded border" 
                    style={{ backgroundColor: formData.color }}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={formData.is_published || false}
                onCheckedChange={(checked) => handleSwitchChange("is_published", checked)}
              />
              <Label htmlFor="is_published">Publicar curso inmediatamente</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleCreateCourse} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Guardando..." : "Guardar Curso"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 