"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

const courses = [
  { id: "math", name: "Matemáticas", description: "Álgebra, cálculo y estadísticas" },
  { id: "programming", name: "Programación", description: "JavaScript, Python y React" },
  { id: "science", name: "Ciencias", description: "Física, química y biología" },
  { id: "language", name: "Idiomas", description: "Inglés, francés y alemán" },
  { id: "history", name: "Historia", description: "Historia mundial y local" },
  { id: "art", name: "Arte", description: "Dibujo, pintura y diseño" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    selectedCourses: [] as string[],
    examDate: undefined as Date | undefined,
    whatsappReminders: false,
  })

  const handleCourseToggle = (courseId: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedCourses.includes(courseId)
      return {
        ...prev,
        selectedCourses: isSelected
          ? prev.selectedCourses.filter((id) => id !== courseId)
          : [...prev.selectedCourses, courseId],
      }
    })
  }

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      // Finalizar onboarding y redirigir al dashboard
      router.push("/dashboard")
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="h-40 w-40 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-20 w-20 text-primary"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">¡Bienvenido a EduApp!</h1>
            <p className="text-muted-foreground max-w-md">
              Estamos emocionados de tenerte aquí. Vamos a configurar tu cuenta para que puedas comenzar a aprender.
            </p>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center">Crea tu cuenta</h2>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Button variant="outline" onClick={() => setFormData({ ...formData, email: "google@example.com" })}>
                Continuar con Google
              </Button>
              <Button variant="outline" onClick={() => setFormData({ ...formData, email: "apple@example.com" })}>
                Continuar con Apple
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-center">Elige tus cursos</h2>
            <p className="text-center text-muted-foreground">
              Selecciona los cursos que te interesan. Puedes cambiar esto más tarde.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={cn(
                    "relative flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-all duration-200",
                    formData.selectedCourses.includes(course.id)
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50",
                  )}
                  onClick={() => handleCourseToggle(course.id)}
                >
                  <Checkbox
                    checked={formData.selectedCourses.includes(course.id)}
                    onCheckedChange={() => handleCourseToggle(course.id)}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <h3 className="text-base font-medium">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  </div>
                  {formData.selectedCourses.includes(course.id) && (
                    <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center">¿Tienes un examen próximo?</h2>
            <p className="text-center text-muted-foreground">
              Podemos ayudarte a prepararte para tu examen con un plan de estudio personalizado.
            </p>
            <div className="space-y-2">
              <Label>Fecha del examen</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.examDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.examDate ? format(formData.examDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.examDate}
                    onSelect={(date) => setFormData({ ...formData, examDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Switch
                id="whatsapp"
                checked={formData.whatsappReminders}
                onCheckedChange={(checked) => setFormData({ ...formData, whatsappReminders: checked })}
              />
              <Label htmlFor="whatsapp">Recibir recordatorios por WhatsApp</Label>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="h-40 w-40 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-20 w-20 text-primary"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">¡Todo listo!</h1>
            <p className="text-muted-foreground max-w-md">
              Tu cuenta ha sido configurada correctamente. Estás listo para comenzar tu viaje de aprendizaje.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center">Paso {step} de 5</CardTitle>
          <CardDescription className="text-center">
            <div className="w-full bg-muted h-2 rounded-full mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-200"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">{renderStep()}</CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1}>
            Atrás
          </Button>
          <Button onClick={handleNext}>{step < 5 ? "Siguiente" : "¡Comenzar!"}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
