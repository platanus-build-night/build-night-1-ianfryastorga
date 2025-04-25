import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, BookOpen, Trophy, Users, ArrowRight, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge className="inline-flex mb-2">¡Nuevo! Cursos de IA y Machine Learning</Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Aprende a tu ritmo, alcanza tus metas
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  EduApp combina la ciencia del aprendizaje con tecnología avanzada para ofrecerte una experiencia
                  educativa personalizada y efectiva.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button asChild size="lg" className="font-medium">
                  <Link href="/onboarding">Comenzar Ahora</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">Conocer Más</Link>
                </Button>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden bg-muted">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-background/60 z-10"></div>
                <img
                  src="/placeholder.svg?height=500&width=800"
                  alt="Estudiantes usando EduApp"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Características Principales</h2>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Diseñadas para maximizar tu aprendizaje y mantener tu motivación
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-primary/20 transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Aprendizaje Adaptativo</h3>
                <p className="text-muted-foreground">
                  Contenido que se ajusta a tu nivel, estilo de aprendizaje y ritmo de progreso.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Gamificación Efectiva</h3>
                <p className="text-muted-foreground">
                  Sistema de rachas, recompensas y logros que mantienen tu motivación al máximo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Contenido de Calidad</h3>
                <p className="text-muted-foreground">
                  Material educativo creado por expertos y actualizado constantemente.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Aprendizaje Social</h3>
                <p className="text-muted-foreground">
                  Foros, grupos de estudio y competencias amistosas para aprender en comunidad.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Lo que dicen nuestros estudiantes</h2>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Miles de personas han mejorado su aprendizaje con EduApp
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 italic">
                  "EduApp ha transformado completamente mi forma de estudiar. La gamificación me mantiene motivado y el
                  sistema de repaso espaciado ha mejorado mi retención a largo plazo."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Foto de perfil"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Carlos Méndez</p>
                    <p className="text-sm text-muted-foreground">Estudiante de Ingeniería</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 italic">
                  "Como profesora, valoro enormemente las herramientas analíticas que ofrece EduApp. Me permite entender
                  mejor cómo aprenden mis estudiantes y adaptar mi enseñanza."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Foto de perfil"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Laura Gómez</p>
                    <p className="text-sm text-muted-foreground">Profesora de Matemáticas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 italic">
                  "Preparar mi examen de certificación parecía imposible hasta que descubrí EduApp. El plan de estudio
                  personalizado y los ejercicios prácticos fueron clave para aprobar con excelentes calificaciones."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Foto de perfil"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Miguel Torres</p>
                    <p className="text-sm text-muted-foreground">Desarrollador Web</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Comienza tu viaje de aprendizaje hoy
            </h2>
            <p className="text-muted-foreground md:text-xl max-w-[700px]">
              Únete a miles de estudiantes que están transformando su educación con EduApp. Tu primer curso es
              completamente gratis.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
              <Button asChild size="lg" className="font-medium">
                <Link href="/login">
                  Comenzar Gratis <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Ver Planes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-medium mb-4">EduApp</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Equipo
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Carreras
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Guías de Estudio
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Webinars
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Tutoriales
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Preguntas Frecuentes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Términos de Servicio
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Soporte
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Ventas
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Prensa
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>© 2023 EduApp. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
