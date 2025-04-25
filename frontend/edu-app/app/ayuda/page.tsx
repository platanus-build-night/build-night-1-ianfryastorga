"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  HelpCircle,
  LifeBuoy,
  MessageSquare,
  Search,
  Settings,
  User,
  Video,
} from "lucide-react"

// Datos de ejemplo para preguntas frecuentes
const faqCategories = [
  {
    id: "general",
    name: "General",
    icon: <HelpCircle className="h-5 w-5" />,
    questions: [
      {
        id: "what-is",
        question: "¿Qué es EduApp?",
        answer:
          "EduApp es una plataforma educativa que combina la ciencia del aprendizaje con tecnología avanzada para ofrecer una experiencia de aprendizaje personalizada y efectiva. Utilizamos técnicas como la gamificación, el aprendizaje adaptativo y la repetición espaciada para ayudarte a aprender de manera más eficiente.",
      },
      {
        id: "how-works",
        question: "¿Cómo funciona EduApp?",
        answer:
          "EduApp analiza tu estilo de aprendizaje, tus fortalezas y áreas de mejora para crear un plan de estudio personalizado. A medida que avanzas, el sistema se adapta a tu progreso, ofreciéndote contenido y ejercicios que maximizan tu aprendizaje. Además, utilizamos técnicas de gamificación como rachas, logros y tablas de clasificación para mantener tu motivación.",
      },
      {
        id: "free-trial",
        question: "¿Puedo probar EduApp gratis?",
        answer:
          "¡Sí! Ofrecemos un período de prueba gratuito de 14 días con acceso a todas las funciones premium. No necesitas introducir información de pago para comenzar tu prueba gratuita.",
      },
    ],
  },
  {
    id: "account",
    name: "Cuenta",
    icon: <User className="h-5 w-5" />,
    questions: [
      {
        id: "create-account",
        question: "¿Cómo creo una cuenta?",
        answer:
          "Puedes crear una cuenta haciendo clic en el botón 'Registrarse' en la página principal. Necesitarás proporcionar tu nombre, correo electrónico y crear una contraseña. También puedes registrarte utilizando tu cuenta de Google o GitHub.",
      },
      {
        id: "forgot-password",
        question: "Olvidé mi contraseña, ¿cómo la recupero?",
        answer:
          "En la página de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?'. Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña. El enlace es válido durante 24 horas.",
      },
      {
        id: "delete-account",
        question: "¿Cómo puedo eliminar mi cuenta?",
        answer:
          "Puedes eliminar tu cuenta desde la página de Configuración > Cuenta > Desactivar cuenta. Ten en cuenta que esta acción es irreversible y perderás todo tu progreso y datos asociados a tu cuenta.",
      },
    ],
  },
  {
    id: "courses",
    name: "Cursos",
    icon: <BookOpen className="h-5 w-5" />,
    questions: [
      {
        id: "available-courses",
        question: "¿Qué cursos están disponibles?",
        answer:
          "Ofrecemos una amplia variedad de cursos en categorías como programación, matemáticas, ciencias, idiomas, negocios y más. Puedes explorar todos nuestros cursos en la sección 'Explorar' de la plataforma.",
      },
      {
        id: "course-completion",
        question: "¿Recibo algún certificado al completar un curso?",
        answer:
          "Sí, al completar un curso recibirás un certificado digital que puedes compartir en tus redes sociales o incluir en tu currículum. Nuestros certificados incluyen un código QR verificable para que cualquier persona pueda confirmar su autenticidad.",
      },
      {
        id: "course-difficulty",
        question: "¿Cómo se determina la dificultad de un curso?",
        answer:
          "Cada curso tiene un nivel de dificultad asignado (principiante, intermedio o avanzado) basado en los conocimientos previos requeridos. Además, nuestro sistema adaptativo ajusta el contenido según tu nivel de habilidad, haciendo que la experiencia sea desafiante pero no abrumadora.",
      },
    ],
  },
  {
    id: "technical",
    name: "Técnico",
    icon: <Settings className="h-5 w-5" />,
    questions: [
      {
        id: "supported-devices",
        question: "¿En qué dispositivos puedo usar EduApp?",
        answer:
          "EduApp es compatible con la mayoría de navegadores web modernos en ordenadores, tablets y smartphones. También ofrecemos aplicaciones nativas para iOS y Android que puedes descargar desde las respectivas tiendas de aplicaciones.",
      },
      {
        id: "offline-access",
        question: "¿Puedo acceder a los cursos sin conexión a internet?",
        answer:
          "Sí, nuestra aplicación móvil permite descargar lecciones para estudiar sin conexión. Tu progreso se sincronizará automáticamente cuando vuelvas a conectarte a internet.",
      },
      {
        id: "data-privacy",
        question: "¿Cómo protegen mis datos personales?",
        answer:
          "La privacidad y seguridad de tus datos son nuestra prioridad. Utilizamos encriptación de extremo a extremo y seguimos las mejores prácticas de la industria para proteger tu información. Puedes consultar nuestra Política de Privacidad para más detalles sobre cómo recopilamos, utilizamos y protegemos tus datos.",
      },
    ],
  },
]

// Datos de ejemplo para tutoriales
const tutorials = [
  {
    id: "getting-started",
    title: "Primeros pasos con EduApp",
    description: "Aprende a configurar tu cuenta y comenzar tu viaje de aprendizaje",
    thumbnail: "/placeholder.svg?height=100&width=200",
    duration: "5 min",
    category: "Básico",
  },
  {
    id: "study-plan",
    title: "Cómo crear un plan de estudio efectivo",
    description: "Maximiza tu aprendizaje con un plan personalizado",
    thumbnail: "/placeholder.svg?height=100&width=200",
    duration: "8 min",
    category: "Intermedio",
  },
  {
    id: "track-progress",
    title: "Seguimiento de tu progreso",
    description: "Utiliza las estadísticas para mejorar tu rendimiento",
    thumbnail: "/placeholder.svg?height=100&width=200",
    duration: "6 min",
    category: "Básico",
  },
  {
    id: "forum-usage",
    title: "Cómo usar el foro de discusión",
    description: "Conecta con otros estudiantes y resuelve dudas",
    thumbnail: "/placeholder.svg?height=100&width=200",
    duration: "4 min",
    category: "Básico",
  },
  {
    id: "advanced-features",
    title: "Funciones avanzadas de EduApp",
    description: "Descubre herramientas y características para usuarios experimentados",
    thumbnail: "/placeholder.svg?height=100&width=200",
    duration: "12 min",
    category: "Avanzado",
  },
]

// Datos de ejemplo para el equipo de soporte
const supportTeam = [
  {
    name: "Ana García",
    role: "Soporte Técnico",
    avatar: "/placeholder.svg?height=60&width=60",
    availability: "Lun-Vie, 9:00-17:00",
  },
  {
    name: "Carlos Rodríguez",
    role: "Especialista en Contenido",
    avatar: "/placeholder.svg?height=60&width=60",
    availability: "Lun-Vie, 10:00-18:00",
  },
  {
    name: "Laura Martínez",
    role: "Atención al Cliente",
    avatar: "/placeholder.svg?height=60&width=60",
    availability: "Lun-Dom, 8:00-20:00",
  },
]

export default function AyudaPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  // Filtrar preguntas frecuentes según la búsqueda
  const filteredFaqs = searchQuery
    ? faqCategories
        .map((category) => ({
          ...category,
          questions: category.questions.filter(
            (q) =>
              q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((category) => category.questions.length > 0)
    : faqCategories

  // Filtrar tutoriales según la búsqueda
  const filteredTutorials = searchQuery
    ? tutorials.filter(
        (tutorial) =>
          tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : tutorials

  // Manejar envío del formulario de contacto
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Aquí iría la lógica para enviar el formulario
    toast({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo lo antes posible.",
      variant: "success",
    })

    // Resetear formulario
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Centro de Ayuda</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar en el centro de ayuda..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">Preguntas Frecuentes</TabsTrigger>
          <TabsTrigger value="tutorials">Tutoriales</TabsTrigger>
          <TabsTrigger value="contact">Contacto</TabsTrigger>
          <TabsTrigger value="community">Comunidad</TabsTrigger>
        </TabsList>

        {/* Pestaña de Preguntas Frecuentes */}
        <TabsContent value="faq">
          {filteredFaqs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
                <p className="text-muted-foreground">
                  No hemos encontrado preguntas que coincidan con tu búsqueda. Intenta con otros términos o contacta con
                  soporte.
                </p>
                <Button className="mt-4" variant="outline">
                  Contactar Soporte
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {faqCategories.map((category) => (
                      <Button key={category.id} variant="ghost" className="w-full justify-start">
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span>{category.name}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Preguntas Frecuentes</CardTitle>
                  <CardDescription>Encuentra respuestas a las preguntas más comunes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredFaqs.map((category) => (
                      <div key={category.id}>
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                          {category.icon}
                          {category.name}
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                          {category.questions.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                              <AccordionContent>
                                <p className="text-muted-foreground">{faq.answer}</p>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Pestaña de Tutoriales */}
        <TabsContent value="tutorials">
          <Card>
            <CardHeader>
              <CardTitle>Tutoriales y Guías</CardTitle>
              <CardDescription>Aprende a sacar el máximo provecho de EduApp con nuestros tutoriales</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTutorials.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No se encontraron tutoriales</h3>
                  <p className="text-muted-foreground">
                    No hemos encontrado tutoriales que coincidan con tu búsqueda. Intenta con otros términos.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTutorials.map((tutorial) => (
                    <Card key={tutorial.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={tutorial.thumbnail || "/placeholder.svg"}
                          alt={tutorial.title}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute bottom-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded text-xs">
                          {tutorial.duration}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <Badge className="mb-2">{tutorial.category}</Badge>
                        <h3 className="font-medium mb-1">{tutorial.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{tutorial.description}</p>
                        <Button variant="outline" size="sm" className="w-full">
                          Ver Tutorial
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Contacto */}
        <TabsContent value="contact">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Contacta con Nosotros</CardTitle>
                <CardDescription>Envíanos un mensaje y te responderemos lo antes posible</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Nombre completo
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Tu nombre"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Correo electrónico
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@ejemplo.com"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Asunto
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="¿En qué podemos ayudarte?"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Mensaje
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Describe tu consulta en detalle..."
                      rows={6}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">soporte@eduapp.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <LifeBuoy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Soporte en vivo</p>
                      <p className="font-medium">Lun-Vie, 9:00-18:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Equipo de Soporte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportTeam.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <p className="text-xs text-muted-foreground">{member.availability}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Pestaña de Comunidad */}
        <TabsContent value="community">
          <Card>
            <CardHeader>
              <CardTitle>Comunidad de EduApp</CardTitle>
              <CardDescription>Conecta con otros estudiantes y encuentra ayuda en nuestra comunidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Foro de Discusión</h3>
                        <p className="text-sm text-muted-foreground">
                          Haz preguntas y comparte conocimientos con otros estudiantes
                        </p>
                      </div>
                    </div>
                    <Button className="w-full">Visitar Foro</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Preguntas Respondidas</h3>
                        <p className="text-sm text-muted-foreground">
                          Explora preguntas ya respondidas por la comunidad
                        </p>
                      </div>
                    </div>
                    <Button className="w-full">Ver Respuestas</Button>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-4">Preguntas Populares</h3>
                    <div className="space-y-4">
                      {faqCategories
                        .flatMap((category) => category.questions)
                        .slice(0, 3)
                        .map((faq) => (
                          <div key={faq.id} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">{faq.question}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                            <Button variant="link" className="px-0 h-auto mt-2">
                              Leer más
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 text-center">
                <h3 className="font-medium text-lg mb-2">¿No encuentras lo que buscas?</h3>
                <p className="text-muted-foreground mb-4">
                  Nuestro equipo de soporte está listo para ayudarte con cualquier duda o problema.
                </p>
                <Button>Contactar Soporte</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
