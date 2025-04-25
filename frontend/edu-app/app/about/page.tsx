import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GlobeIcon, BookOpenIcon, BrainIcon, HeartIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function About() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Sobre UniLingo</h1>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          Transformando el aprendizaje universitario a través de la tecnología
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Nuestra Misión</CardTitle>
            <CardDescription>
              Democratizar el acceso a educación universitaria de calidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              En UniLingo, creemos que el aprendizaje debe ser accesible, efectivo y adaptado a las necesidades
              individuales de cada estudiante. Nuestra misión es crear una plataforma educativa que combine lo mejor
              de la pedagogía moderna con tecnologías avanzadas para ofrecer experiencias de aprendizaje
              personalizadas y atractivas para estudiantes universitarios.
            </p>
            <p>
              Nos inspiramos en los principios de la ciencia cognitiva y las metodologías de aprendizaje activo para
              diseñar una plataforma que no solo transmita conocimiento, sino que fomente la comprensión profunda,
              el pensamiento crítico y el amor por el aprendizaje continuo en el ámbito académico.
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
                    Trabajamos para eliminar barreras en el aprendizaje universitario
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
                  <h3 className="font-medium">Comunidad Universitaria</h3>
                  <p className="text-sm text-muted-foreground">
                    Creamos espacios para el aprendizaje colaborativo entre estudiantes
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button asChild size="lg">
                <Link href="/onboarding">Comenzar ahora</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">© 2023 UniLingo. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
