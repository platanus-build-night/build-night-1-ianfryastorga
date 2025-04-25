"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Github, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)

  // Estados para formulario de login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Estados para formulario de registro
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  // Manejar envío de formulario de login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Aquí iría la lógica de autenticación real
    // Por ahora, simulamos un login exitoso

    toast({
      title: "Inicio de sesión exitoso",
      description: "Bienvenido de nuevo a EduApp",
      variant: "success",
    })

    // Redirigir al dashboard
    router.push("/dashboard")
  }

  // Manejar envío de formulario de registro
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que las contraseñas coincidan
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Error de registro",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    // Aquí iría la lógica de registro real
    // Por ahora, simulamos un registro exitoso

    toast({
      title: "Registro exitoso",
      description: "Tu cuenta ha sido creada correctamente",
      variant: "success",
    })

    // Redirigir al onboarding
    router.push("/onboarding")
  }

  // Manejar login con proveedores externos
  const handleProviderLogin = (provider: string) => {
    // Aquí iría la lógica de autenticación con proveedores
    toast({
      title: `Iniciando sesión con ${provider}`,
      description: "Redirigiendo al proveedor de autenticación",
    })
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          {/* Pestaña de Login */}
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle>Bienvenido de nuevo</CardTitle>
                <CardDescription>Inicia sesión en tu cuenta para continuar tu aprendizaje</CardDescription>
              </CardHeader>
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
                  <Button type="submit" className="w-full">
                    Iniciar Sesión
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
                  <Button variant="outline" type="button" onClick={() => handleProviderLogin("Google")}>
                    <Mail className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" type="button" onClick={() => handleProviderLogin("GitHub")}>
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </CardContent>
            </form>
          </TabsContent>

          {/* Pestaña de Registro */}
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle>Crear una cuenta</CardTitle>
                <CardDescription>Regístrate para comenzar tu viaje de aprendizaje</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    placeholder="Juan Pérez"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Correo electrónico</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
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
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={registerData.acceptTerms}
                    onCheckedChange={(checked) => setRegisterData({ ...registerData, acceptTerms: checked as boolean })}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Acepto los{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      términos y condiciones
                    </Link>
                  </Label>
                </div>
                <Button type="submit" className="w-full">
                  Crear Cuenta
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">O regístrate con</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" type="button" onClick={() => handleProviderLogin("Google")}>
                    <Mail className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" type="button" onClick={() => handleProviderLogin("GitHub")}>
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </CardContent>
            </form>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {activeTab === "login" ? (
              <>
                ¿No tienes una cuenta?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("register")}>
                  Regístrate
                </Button>
              </>
            ) : (
              <>
                ¿Ya tienes una cuenta?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("login")}>
                  Inicia sesión
                </Button>
              </>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
