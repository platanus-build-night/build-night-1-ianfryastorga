import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 py-8">
            <Badge className="mb-2">¡Bienvenido a UniLingo!</Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Tu aliado para los ramos universitarios
            </h1>
            <p className="text-muted-foreground max-w-[700px] md:text-xl">
              La mejor plataforma para aprender ramos universitarios de forma efectiva con tecnología adaptativa
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
              <Button asChild size="lg" className="font-medium">
                <Link href="/login">
                  Iniciar Sesión <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/onboarding">Registrarse</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Card className="w-full max-w-[800px]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-2xl">Comienza hoy mismo</h2>
                    <p className="text-muted-foreground">Aprende un nuevo idioma de forma divertida y efectiva</p>
                  </div>
                </div>
                <p className="mb-4">
                  UniLingo combina la inteligencia artificial con métodos probados de aprendizaje para ofrecerte una experiencia
                  personalizada que se adapta a tu nivel y estilo de aprendizaje.
                </p>
                <Button asChild className="w-full">
                  <Link href="/onboarding">
                    Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="border-t mt-auto py-6">
        <div className="container px-4 text-center">
          <p className="text-sm text-muted-foreground">© 2023 UniLingo. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
