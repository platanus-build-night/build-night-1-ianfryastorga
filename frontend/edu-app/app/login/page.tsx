"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Github, Mail, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  // Estados para formulario de login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Manejar envío de formulario de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await login({
        email: loginData.email,
        password: loginData.password,
      })
      // La redirección se maneja en el contexto de autenticación
    } catch (error) {
      // Los errores se manejan en el contexto de autenticación
      console.error("Error en formulario:", error)
    }
  }

  // Manejar login con proveedores externos
  const handleProviderLogin = (provider: string) => {
    // Esta funcionalidad requeriría implementación adicional para OAuth
    console.log(`Iniciando sesión con ${provider}`)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Inicia sesión en tu cuenta para continuar tu aprendizaje</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/recuperar-password" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={loginData.rememberMe}
                onCheckedChange={(checked) => setLoginData({ ...loginData, rememberMe: checked as boolean })}
              />
              <Label htmlFor="remember" className="text-sm">
                Recordarme
              </Label>
            </div>
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" type="button" onClick={() => handleProviderLogin("Google")} disabled={loading}>
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" type="button" onClick={() => handleProviderLogin("GitHub")} disabled={loading}>
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center w-full">
            <p className="text-sm text-muted-foreground mb-3">
              ¿No tienes una cuenta?
            </p>
            <Button asChild className="w-full">
              <Link href="/onboarding">
                Crear cuenta <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
