import { CalendarIcon, BookOpenIcon, ClockIcon, CheckCircleIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Datos de ejemplo
const cursos = [
  {
    id: "matematicas",
    nombre: "Matemáticas Avanzadas",
    progreso: 65,
    modulos: 12,
    modulosCompletados: 8,
    proximaClase: "Ecuaciones Diferenciales",
    fechaProximaClase: "2023-05-15",
    color: "bg-blue-100 text-blue-700",
    iconColor: "text-blue-500",
  },
  {
    id: "programacion",
    nombre: "Programación en Python",
    progreso: 42,
    modulos: 10,
    modulosCompletados: 4,
    proximaClase: "Estructuras de Datos",
    fechaProximaClase: "2023-05-12",
    color: "bg-green-100 text-green-700",
    iconColor: "text-green-500",
  },
  {
    id: "fisica",
    nombre: "Física Cuántica",
    progreso: 28,
    modulos: 15,
    modulosCompletados: 4,
    proximaClase: "Principio de Incertidumbre",
    fechaProximaClase: "2023-05-18",
    color: "bg-purple-100 text-purple-700",
    iconColor: "text-purple-500",
  },
  {
    id: "ingles",
    nombre: "Inglés Avanzado",
    progreso: 85,
    modulos: 8,
    modulosCompletados: 7,
    proximaClase: "Expresiones Idiomáticas",
    fechaProximaClase: "2023-05-14",
    color: "bg-orange-100 text-orange-700",
    iconColor: "text-orange-500",
  },
]

const eventos = [
  {
    id: 1,
    titulo: "Clase de Matemáticas",
    fecha: "Lunes, 15 de Mayo",
    hora: "10:00 - 11:30",
    tipo: "clase",
  },
  {
    id: 2,
    titulo: "Examen de Programación",
    fecha: "Miércoles, 17 de Mayo",
    hora: "15:00 - 16:30",
    tipo: "examen",
  },
  {
    id: 3,
    titulo: "Taller de Física",
    fecha: "Jueves, 18 de Mayo",
    hora: "09:00 - 12:00",
    tipo: "taller",
  },
  {
    id: 4,
    titulo: "Práctica de Inglés",
    fecha: "Viernes, 19 de Mayo",
    hora: "14:00 - 15:00",
    tipo: "practica",
  },
]

const recomendaciones = [
  {
    id: 1,
    titulo: "Estadística para Ciencia de Datos",
    descripcion: "Complementa tus conocimientos de matemáticas y programación",
    nivel: "Intermedio",
    duracion: "8 semanas",
  },
  {
    id: 2,
    titulo: "Desarrollo Web con React",
    descripcion: "Aplica tus conocimientos de programación en proyectos web",
    nivel: "Intermedio-Avanzado",
    duracion: "10 semanas",
  },
  {
    id: 3,
    titulo: "Inglés para Presentaciones Técnicas",
    descripcion: "Mejora tus habilidades de comunicación en inglés",
    nivel: "Avanzado",
    duracion: "6 semanas",
  },
]

export default function PlanEstudio() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Tu Plan de Estudio</h1>

      <Tabs defaultValue="cursos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="cursos">Cursos Actuales</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
          <TabsTrigger value="recomendaciones">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="cursos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cursos.map((curso) => (
              <Card key={curso.id} className="overflow-hidden transition-all duration-200 hover:shadow-lg">
                <CardHeader className={`${curso.color} flex flex-row items-center justify-between`}>
                  <CardTitle className="text-xl">{curso.nombre}</CardTitle>
                  <Badge variant="outline" className="bg-white">
                    {curso.modulosCompletados}/{curso.modulos} módulos
                  </Badge>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Progreso</span>
                        <span>{curso.progreso}%</span>
                      </div>
                      <Progress value={curso.progreso} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2">
                      <BookOpenIcon className={`h-5 w-5 ${curso.iconColor}`} />
                      <span>Próxima clase: {curso.proximaClase}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarIcon className={`h-5 w-5 ${curso.iconColor}`} />
                      <span>
                        Fecha:{" "}
                        {new Date(curso.fechaProximaClase).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <Button asChild className="w-full mt-2">
                      <Link href={`/course/${curso.id}`}>Continuar Curso</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumen de Progreso</CardTitle>
              <CardDescription>Tu avance general en todos los cursos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Progreso General</span>
                    <span>55%</span>
                  </div>
                  <Progress value={55} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-2xl font-bold text-blue-600">4</span>
                    <span className="text-sm text-muted-foreground">Cursos Activos</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-2xl font-bold text-green-600">23</span>
                    <span className="text-sm text-muted-foreground">Módulos Completados</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-2xl font-bold text-purple-600">45</span>
                    <span className="text-sm text-muted-foreground">Módulos Totales</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-2xl font-bold text-orange-600">12</span>
                    <span className="text-sm text-muted-foreground">Días de Racha</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendario" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Tu calendario de clases y actividades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventos.map((evento) => (
                  <div
                    key={evento.id}
                    className="flex items-start p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="mr-4">
                      {evento.tipo === "clase" && <BookOpenIcon className="h-6 w-6 text-blue-500" />}
                      {evento.tipo === "examen" && <ClockIcon className="h-6 w-6 text-red-500" />}
                      {evento.tipo === "taller" && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                      {evento.tipo === "practica" && <CalendarIcon className="h-6 w-6 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{evento.titulo}</h3>
                      <p className="text-sm text-muted-foreground">{evento.fecha}</p>
                      <p className="text-sm text-muted-foreground">{evento.hora}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        evento.tipo === "clase"
                          ? "bg-blue-100 text-blue-700"
                          : evento.tipo === "examen"
                            ? "bg-red-100 text-red-700"
                            : evento.tipo === "taller"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                      }
                    >
                      {evento.tipo === "clase"
                        ? "Clase"
                        : evento.tipo === "examen"
                          ? "Examen"
                          : evento.tipo === "taller"
                            ? "Taller"
                            : "Práctica"}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6">
                Ver Calendario Completo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tiempo de Estudio Recomendado</CardTitle>
              <CardDescription>Distribución semanal sugerida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {["L", "M", "X", "J", "V", "S", "D"].map((dia, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-sm font-medium mb-2">{dia}</div>
                      <div
                        className={`h-24 w-full rounded-md ${
                          index < 5 ? "bg-primary/20" : "bg-muted"
                        } flex items-center justify-center text-xs font-medium`}
                      >
                        {index < 5 ? "2h" : "1h"}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Distribución por Curso</h4>
                  <div className="space-y-2">
                    {cursos.map((curso) => (
                      <div key={curso.id} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${curso.iconColor.replace("text", "bg")} mr-2`}></div>
                        <span className="text-sm flex-1">{curso.nombre}</span>
                        <span className="text-sm font-medium">
                          {curso.id === "matematicas"
                            ? "4h/semana"
                            : curso.id === "programacion"
                              ? "3h/semana"
                              : curso.id === "fisica"
                                ? "3h/semana"
                                : "2h/semana"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recomendaciones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cursos Recomendados</CardTitle>
              <CardDescription>Basados en tu perfil y progreso actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recomendaciones.map((recomendacion) => (
                  <Card key={recomendacion.id} className="overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{recomendacion.titulo}</h3>
                      <p className="text-muted-foreground mb-4">{recomendacion.descripcion}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary">Nivel: {recomendacion.nivel}</Badge>
                        <Badge variant="secondary">Duración: {recomendacion.duracion}</Badge>
                      </div>

                      <Button variant="outline" className="w-full">
                        Ver Detalles
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>¿Por qué te recomendamos estos cursos?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Nuestro sistema de recomendación analiza tu progreso, intereses y objetivos para sugerirte los cursos
                  que mejor complementan tu plan de estudios actual.
                </p>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Factores considerados:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Tus cursos actuales y progreso</li>
                    <li>Tus intereses declarados</li>
                    <li>Patrones de estudio y fortalezas</li>
                    <li>Objetivos académicos y profesionales</li>
                    <li>Cursos populares entre estudiantes con perfil similar</li>
                  </ul>
                </div>

                <Button className="w-full">Actualizar Preferencias</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
