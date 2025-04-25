import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BookOpenIcon,
  BrainIcon,
  FlameIcon,
  TrophyIcon,
  UsersIcon,
  HeartIcon,
  ShieldIcon,
  GlobeIcon,
  MailIcon,
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para el equipo
const equipo = [
  {
    nombre: "Ana Rodríguez",
    cargo: "Fundadora & CEO",
    foto: "/placeholder.svg?height=100&width=100",
    bio: "Doctora en Ciencias de la Educación con más de 10 años de experiencia en tecnología educativa.",
    redes: {
      email: "ana@eduapp.com",
      linkedin: "https://linkedin.com/in/anarodriguez",
      twitter: "https://twitter.com/anarodriguez",
    },
  },
  {
    nombre: "Carlos Méndez",
    cargo: "CTO",
    foto: "/placeholder.svg?height=100&width=100",
    bio: "Ingeniero de Software especializado en IA aplicada a la educación personalizada.",
    redes: {
      email: "carlos@eduapp.com",
      github: "https://github.com/carlosmendez",
      linkedin: "https://linkedin.com/in/carlosmendez",
    },
  },
  {
    nombre: "Laura Gómez",
    cargo: "Directora de Contenido",
    foto: "/placeholder.svg?height=100&width=100",
    bio: "Especialista en diseño curricular con enfoque en metodologías de aprendizaje activo.",
    redes: {
      email: "laura@eduapp.com",
      linkedin: "https://linkedin.com/in/lauragomez",
      twitter: "https://twitter.com/lauragomez",
    },
  },
  {
    nombre: "Miguel Torres",
    cargo: "Diseñador UX/UI",
    foto: "/placeholder.svg?height=100&width=100",
    bio: "Diseñador con experiencia en interfaces educativas centradas en el usuario.",
    redes: {
      email: "miguel@eduapp.com",
      github: "https://github.com/migueltorres",
      linkedin: "https://linkedin.com/in/migueltorres",
    },
  },
]

// Datos de ejemplo para testimonios
const testimonios = [
  {
    nombre: "Sofía Martínez",
    rol: "Estudiante de Ingeniería",
    texto:
      "EduApp ha transformado mi forma de estudiar. La gamificación y el seguimiento de progreso me mantienen motivada todos los días.",
    foto: "/placeholder.svg?height=60&width=60",
  },
  {
    nombre: "Javier López",
    rol: "Profesor universitario",
    texto:
      "Como educador, valoro enormemente las herramientas analíticas que ofrece EduApp. Me permite entender mejor cómo aprenden mis estudiantes.",
    foto: "/placeholder.svg?height=60&width=60",
  },
  {
    nombre: "Elena Ramírez",
    rol: "Estudiante de Medicina",
    texto:
      "La función de repaso espaciado me ha ayudado a retener información compleja de manera mucho más efectiva. ¡Mi rendimiento en exámenes ha mejorado notablemente!",
    foto: "/placeholder.svg?height=60&width=60",
  },
]

export default function About() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Sobre EduApp</h1>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          Transformando la educación a través de la tecnología y la ciencia del aprendizaje
        </p>

        <Tabs defaultValue="mision" className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mision">Misión</TabsTrigger>
            <TabsTrigger value="caracteristicas">Características</TabsTrigger>
            <TabsTrigger value="equipo">Equipo</TabsTrigger>
            <TabsTrigger value="testimonios">Testimonios</TabsTrigger>
          </TabsList>

          <TabsContent value="mision" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Nuestra Misión</CardTitle>
                <CardDescription>
                  Democratizar el acceso a educación de calidad a través de la tecnología
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  En EduApp, creemos que el aprendizaje debe ser accesible, efectivo y adaptado a las necesidades
                  individuales de cada estudiante. Nuestra misión es crear una plataforma educativa que combine lo mejor
                  de la pedagogía moderna con tecnologías avanzadas para ofrecer experiencias de aprendizaje
                  personalizadas y atractivas.
                </p>
                <p>
                  Nos inspiramos en los principios de la ciencia cognitiva y las metodologías de aprendizaje activo para
                  diseñar una plataforma que no solo transmita conocimiento, sino que fomente la comprensión profunda,
                  el pensamiento crítico y el amor por el aprendizaje continuo.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="bg-primary/10 p-4 rounded-lg flex items-start">
                    <BrainIcon className="h-6 w-6 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Aprendizaje Personalizado</h3>
                      <p className="text-sm text-muted-foreground">
                        Adaptamos el contenido y el ritmo a las necesidades de cada estudiante
                      </p>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg flex items-start">
                    <GlobeIcon className="h-6 w-6 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Accesibilidad Global</h3>
                      <p className="text-sm text-muted-foreground">
                        Trabajamos para eliminar barreras geográficas y económicas
                      </p>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg flex items-start">
                    <HeartIcon className="h-6 w-6 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Pasión por Aprender</h3>
                      <p className="text-sm text-muted-foreground">
                        Fomentamos la curiosidad y el amor por el conocimiento
                      </p>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg flex items-start">
                    <UsersIcon className="h-6 w-6 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Comunidad Colaborativa</h3>
                      <p className="text-sm text-muted-foreground">
                        Creamos espacios para el aprendizaje social y colaborativo
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nuestra Historia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    EduApp nació en 2020 como respuesta a los desafíos educativos planteados por la pandemia global. Un
                    equipo de educadores, desarrolladores y diseñadores se unió con la visión de crear una plataforma
                    que no solo replicara la experiencia del aula en un entorno digital, sino que aprovechara la
                    tecnología para mejorarla.
                  </p>
                  <p>
                    Desde entonces, hemos crecido hasta servir a más de 500,000 estudiantes en 30 países, manteniendo
                    siempre nuestro compromiso con la calidad educativa y la innovación pedagógica.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold text-primary">2020</span>
                      <span className="text-sm text-muted-foreground text-center">Fundación</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold text-primary">500K+</span>
                      <span className="text-sm text-muted-foreground text-center">Estudiantes</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold text-primary">30+</span>
                      <span className="text-sm text-muted-foreground text-center">Países</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold text-primary">100+</span>
                      <span className="text-sm text-muted-foreground text-center">Cursos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="caracteristicas" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="bg-blue-100 text-blue-700">
                  <BookOpenIcon className="h-6 w-6 mb-2" />
                  <CardTitle>Aprendizaje Adaptativo</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="mb-4">
                    Nuestro sistema de IA analiza tu progreso y adapta el contenido a tu ritmo y estilo de aprendizaje,
                    ofreciendo una experiencia personalizada.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      <span>Evaluación continua de conocimientos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      <span>Ajuste dinámico de dificultad</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      <span>Recomendaciones personalizadas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-green-100 text-green-700">
                  <FlameIcon className="h-6 w-6 mb-2" />
                  <CardTitle>Gamificación Efectiva</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="mb-4">
                    Elementos de juego cuidadosamente diseñados para mantener la motivación y hacer del aprendizaje una
                    experiencia divertida y adictiva.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>Sistema de rachas y recompensas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>Desafíos diarios y semanales</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>Insignias y logros desbloqueables</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-purple-100 text-purple-700">
                  <TrophyIcon className="h-6 w-6 mb-2" />
                  <CardTitle>Aprendizaje Social</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="mb-4">
                    Funciones colaborativas que te permiten aprender junto a otros, compartir conocimientos y motivarte
                    mutuamente.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                      <span>Foros de discusión por temas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                      <span>Grupos de estudio virtuales</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                      <span>Competencias amistosas y tablas de clasificación</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-orange-100 text-orange-700">
                  <ShieldIcon className="h-6 w-6 mb-2" />
                  <CardTitle>Contenido de Calidad</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="mb-4">
                    Material educativo desarrollado por expertos en cada materia, actualizado constantemente y validado
                    pedagógicamente.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                      <span>Creado por educadores profesionales</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                      <span>Revisado por expertos en cada campo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                      <span>Actualizado con las últimas investigaciones</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tecnología Educativa Avanzada</CardTitle>
                <CardDescription>Herramientas innovadoras que potencian tu aprendizaje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-2">Repetición Espaciada</h3>
                    <p className="text-sm text-muted-foreground">
                      Algoritmos que determinan el momento óptimo para repasar cada concepto, maximizando la retención a
                      largo plazo.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-2">Análisis de Aprendizaje</h3>
                    <p className="text-sm text-muted-foreground">
                      Estadísticas detalladas sobre tu progreso, fortalezas y áreas de mejora para optimizar tu estudio.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-2">Asistente IA</h3>
                    <p className="text-sm text-muted-foreground">
                      Tutor virtual disponible 24/7 para resolver dudas y ofrecer explicaciones personalizadas.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-2">Microaprendizaje</h3>
                    <p className="text-sm text-muted-foreground">
                      Lecciones breves y enfocadas que se adaptan a tu disponibilidad de tiempo y capacidad de atención.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-2">Sincronización Multiplataforma</h3>
                    <p className="text-sm text-muted-foreground">
                      Accede a tu contenido desde cualquier dispositivo, continuando exactamente donde lo dejaste.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-2">Modo Sin Conexión</h3>
                    <p className="text-sm text-muted-foreground">
                      Descarga lecciones para estudiar sin internet y sincroniza automáticamente al reconectarte.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipo" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nuestro Equipo</CardTitle>
                <CardDescription>Profesionales apasionados por la educación y la tecnología</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {equipo.map((miembro) => (
                    <Card key={miembro.nombre} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-16 w-16 rounded-full overflow-hidden">
                            <img
                              src={miembro.foto || "/placeholder.svg"}
                              alt={miembro.nombre}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">{miembro.nombre}</h3>
                            <p className="text-sm text-muted-foreground">{miembro.cargo}</p>
                          </div>
                        </div>

                        <p className="text-sm mb-4">{miembro.bio}</p>

                        <div className="flex gap-2">
                          {miembro.redes.email && (
                            <Button variant="outline" size="icon" asChild className="h-8 w-8">
                              <Link href={`mailto:${miembro.redes.email}`}>
                                <MailIcon className="h-4 w-4" />
                                <span className="sr-only">Email</span>
                              </Link>
                            </Button>
                          )}
                          {miembro.redes.github && (
                            <Button variant="outline" size="icon" asChild className="h-8 w-8">
                              <Link href={miembro.redes.github} target="_blank" rel="noopener noreferrer">
                                <GithubIcon className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                              </Link>
                            </Button>
                          )}
                          {miembro.redes.linkedin && (
                            <Button variant="outline" size="icon" asChild className="h-8 w-8">
                              <Link href={miembro.redes.linkedin} target="_blank" rel="noopener noreferrer">
                                <LinkedinIcon className="h-4 w-4" />
                                <span className="sr-only">LinkedIn</span>
                              </Link>
                            </Button>
                          )}
                          {miembro.redes.twitter && (
                            <Button variant="outline" size="icon" asChild className="h-8 w-8">
                              <Link href={miembro.redes.twitter} target="_blank" rel="noopener noreferrer">
                                <TwitterIcon className="h-4 w-4" />
                                <span className="sr-only">Twitter</span>
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Únete a Nuestro Equipo</CardTitle>
                <CardDescription>Estamos en constante crecimiento y buscamos talento apasionado</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  En EduApp valoramos la diversidad, la creatividad y el compromiso con nuestra misión de transformar la
                  educación. Ofrecemos un ambiente de trabajo dinámico, oportunidades de crecimiento profesional y la
                  satisfacción de crear un impacto positivo en la vida de millones de estudiantes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Áreas de Oportunidad</h3>
                    <ul className="space-y-1 text-sm">
                      <li>Desarrollo de Software</li>
                      <li>Diseño UX/UI</li>
                      <li>Ciencia de Datos e IA</li>
                      <li>Diseño Instruccional</li>
                      <li>Marketing Digital</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Beneficios</h3>
                    <ul className="space-y-1 text-sm">
                      <li>Trabajo remoto flexible</li>
                      <li>Desarrollo profesional continuo</li>
                      <li>Seguro médico completo</li>
                      <li>Participación en acciones</li>
                      <li>Eventos de equipo globales</li>
                    </ul>
                  </div>
                </div>

                <Button className="w-full">Ver Posiciones Abiertas</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonios" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lo Que Dicen Nuestros Usuarios</CardTitle>
                <CardDescription>
                  Experiencias reales de estudiantes que han transformado su aprendizaje con EduApp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {testimonios.map((testimonio) => (
                    <div key={testimonio.nombre} className="border rounded-lg p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img
                            src={testimonio.foto || "/placeholder.svg"}
                            alt={testimonio.nombre}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{testimonio.nombre}</h3>
                          <p className="text-sm text-muted-foreground">{testimonio.rol}</p>
                        </div>
                      </div>

                      <p className="italic text-muted-foreground">"{testimonio.texto}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reconocimientos</CardTitle>
                <CardDescription>Premios y menciones que hemos recibido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                    <TrophyIcon className="h-8 w-8 text-yellow-500 mb-2" />
                    <h3 className="font-medium">Mejor App Educativa 2022</h3>
                    <p className="text-sm text-muted-foreground">EdTech Awards</p>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                    <TrophyIcon className="h-8 w-8 text-blue-500 mb-2" />
                    <h3 className="font-medium">Innovación en Aprendizaje</h3>
                    <p className="text-sm text-muted-foreground">Global Learning Initiative</p>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                    <TrophyIcon className="h-8 w-8 text-green-500 mb-2" />
                    <h3 className="font-medium">Top 10 Startups Educativas</h3>
                    <p className="text-sm text-muted-foreground">Forbes Educación 2023</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Menciones en Prensa</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-background p-2 rounded flex items-center justify-center h-12">
                      <span className="font-semibold">TechCrunch</span>
                    </div>
                    <div className="bg-background p-2 rounded flex items-center justify-center h-12">
                      <span className="font-semibold">El País</span>
                    </div>
                    <div className="bg-background p-2 rounded flex items-center justify-center h-12">
                      <span className="font-semibold">Wired</span>
                    </div>
                    <div className="bg-background p-2 rounded flex items-center justify-center h-12">
                      <span className="font-semibold">BBC Mundo</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparte Tu Historia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Nos encantaría saber cómo EduApp ha impactado tu experiencia de aprendizaje. Comparte tu testimonio y
                  podrías aparecer en nuestra página.
                </p>
                <Button className="w-full">Enviar Mi Testimonio</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
            <CardDescription>¿Tienes preguntas o comentarios? Estamos aquí para ayudarte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Información de Contacto</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <MailIcon className="h-5 w-5 text-muted-foreground" />
                    <span>info@eduapp.com</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <GlobeIcon className="h-5 w-5 text-muted-foreground" />
                    <span>www.eduapp.com</span>
                  </li>
                </ul>

                <h3 className="font-medium mt-6 mb-2">Síguenos</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <TwitterIcon className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <LinkedinIcon className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <GithubIcon className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Envíanos un Mensaje</h3>
                <div className="space-y-4">
                  <Button className="w-full">Contactar Soporte</Button>
                  <Button variant="outline" className="w-full">
                    Solicitar Demo
                  </Button>
                  <Button variant="outline" className="w-full">
                    Programa de Afiliados
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">© 2023 EduApp. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
